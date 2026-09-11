import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { CHAVES_DIVISAO } from './lib/rota'

/**
 * Testes de composição: o que só existe quando as peças estão juntas — rota,
 * índice, painéis por `custom`, sheet por deep link e a busca ⌘K.
 *
 * `toBeInTheDocument` em vez de `toBeVisible`: o conteúdo entra com
 * `initial={{ opacity: 0 }}`, e no jsdom isso deixa todos os descendentes
 * "invisíveis" para o jest-dom.
 */

beforeEach(() => {
  window.location.hash = ''
  localStorage.clear()
})

const tituloDaDivisao = (padrao: RegExp) => screen.getByRole('heading', { level: 2, name: padrao })

describe('App', () => {
  it('abre no aquecimento quando não há rota', () => {
    render(<App />)
    expect(tituloDaDivisao(/^Aquecimento/)).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Divisões do plano' })).toBeInTheDocument()
  })

  it('mostra o colofão com o total de clipes e a economia de tempo', () => {
    render(<App />)
    expect(screen.getByText('40 clipes')).toBeInTheDocument()
    expect(screen.getByText('12:50 úteis de 137:39 brutos')).toBeInTheDocument()
  })

  it('troca de divisão pelo índice e escreve a rota', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    // O número e o rótulo são elementos irmãos sem espaço entre eles: o nome
    // acessível sai colado ("02Empurrar A").
    await usuario.click(screen.getByRole('button', { name: /^02\s*Empurrar A$/ }))
    expect(window.location.hash).toBe('#/empurrarA')
    expect(tituloDaDivisao(/^Empurrar A —/)).toBeInTheDocument()
  })

  it('renderiza o painel editorial nas divisões custom, sem lista de exercícios', () => {
    window.location.hash = '#/corrida'
    render(<App />)
    expect(tituloDaDivisao(/^Corrida$/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Se você ainda está retomando' })).toBeInTheDocument()
  })

  it('mostra o aviso final do circuito com marca de risco', () => {
    window.location.hash = '#/circuito'
    render(<App />)
    expect(screen.getByText('Saltos e pliometria')).toBeInTheDocument()
  })

  /**
   * Escopo da tabela da semana, rota por rota. Ela carrega o ciclo dos quatro
   * treinos de força e três notas que só valem dentro deles — a carga da
   * primeira sessão, a janela de 48 h, a panturrilha nos dias de empurrar.
   * O circuito a recebia por herança do legado ("tudo que não é aquecimento") e
   * ficava com a regra de carga e a nota da panturrilha impressas sob um lede
   * que diz, na mesma tela, que aquilo não é sessão de força — numa divisão sem
   * panturrilha nenhuma.
   *
   * Corrida e Guia continuam com a tabela, de propósito: é justo antes de
   * correr que se precisa saber se ontem teve perna. A varredura é sobre
   * `CHAVES_DIVISAO` inteira para que uma divisão nova precise ser classificada
   * aqui, em vez de herdar o escopo por descuido.
   */
  it('imprime a tabela da semana só onde ela vale', () => {
    const COM_TABELA = new Set(['empurrarA', 'puxarA', 'empurrarB', 'puxarB', 'corrida', 'guia'])

    for (const chave of CHAVES_DIVISAO) {
      window.location.hash = `#/${chave}`
      const { unmount } = render(<App />)
      const tabela = screen.queryByRole('region', { name: 'Ciclo de quatro semanas' })
      expect(tabela != null, chave).toBe(COM_TABELA.has(chave))
      unmount()
    }
  })

  it('abre o exercício ao tocar na linha e fecha voltando para a divisão', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await usuario.click(screen.getByRole('button', { name: /Mobilidade de tornozelo/ }))

    expect(window.location.hash).toBe('#/aquecer/mob-tornozelo')
    const sheet = await screen.findByRole('dialog')
    expect(within(sheet).getByText('Mobilidade de tornozelo (joelho à parede)')).toBeInTheDocument()

    await usuario.click(within(sheet).getByRole('button', { name: 'Fechar' }))
    expect(window.location.hash).toBe('#/aquecer')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('abre o exercício direto pelo deep link', async () => {
    window.location.hash = '#/empurrarA/ea-agacha'
    render(<App />)
    const sheet = await screen.findByRole('dialog')
    expect(within(sheet).getByText('Agachamento (barra, goblet ou hack)')).toBeInTheDocument()
  })

  it('abre a busca com ⌘K e navega para a divisão do exercício escolhido', async () => {
    const usuario = userEvent.setup()
    render(<App />)

    await usuario.keyboard('{Meta>}k{/Meta}')
    const campo = await screen.findByRole('combobox')
    // A cadeira flexora aparece nos dois dias de puxar, e a rosca de bíceps
    // também: o termo precisa ser de um exercício que só existe uma vez.
    await usuario.type(campo, 'stiff')

    const resultados = screen.getAllByRole('option')
    expect(resultados).toHaveLength(1)
    await usuario.click(resultados[0])

    expect(window.location.hash).toBe('#/puxarA/pa-stiff')
    const sheet = await screen.findByRole('dialog')
    expect(within(sheet).getByText('Levantamento terra / stiff unilateral')).toBeInTheDocument()
    // O sheet é modal: o Base UI esconde o resto da página da árvore de
    // acessibilidade, então o título da divisão só aparece com `hidden: true`.
    expect(
      screen.getByRole('heading', { level: 2, name: /^Puxar A —/, hidden: true }),
    ).toBeInTheDocument()
  })

  /**
   * O sheet é bottom sheet no Android, e ali o gesto de voltar é o jeito natural
   * de sair. Se fechar EMPILHASSE uma entrada nova, o Voltar reabriria o
   * exercício que o usuário acabou de fechar.
   */
  it('o Voltar do navegador não reabre o sheet que o usuário acabou de fechar', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await usuario.click(screen.getByRole('button', { name: /Mobilidade de tornozelo/ }))
    await screen.findByRole('dialog')

    await usuario.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Fechar' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    await act(async () => {
      window.history.back()
      await new Promise((r) => setTimeout(r, 60))
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  /**
   * Trocar de divisão substitui o <main> inteiro sem recarregar a página: o foco
   * fica no chip e o aria-current sozinho não diz que o documento mudou.
   */
  it('publica a divisão nova numa região viva ao trocar de divisão', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    const viva = screen.getByRole('status')
    expect(viva).toHaveTextContent(/^Aquecimento/)

    await usuario.click(screen.getByRole('button', { name: /^03\s*Puxar A$/ }))
    expect(viva).toHaveTextContent(/^Puxar A —/)
  })

  /**
   * O cabeçalho sr-only do diálogo da busca ficava renderizado no <main> mesmo
   * com a paleta fechada: em todas as oito rotas a lista de cabeçalhos terminava
   * com um h2 órfão descrevendo um diálogo que não existe na tela.
   */
  it('não deixa o cabeçalho da busca no documento enquanto ela está fechada', () => {
    render(<App />)
    expect(screen.queryByRole('heading', { name: 'Buscar exercício' })).not.toBeInTheDocument()
    expect(
      screen.queryByText('Busque por nome, músculo ou equipamento e abra o exercício.'),
    ).not.toBeInTheDocument()
  })

  it('cicla o tema e marca a classe escuro no documento', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    const botao = () => screen.getByRole('button', { name: /^Tema/ })

    await usuario.click(botao()) // auto → claro
    expect(document.documentElement).not.toHaveClass('escuro')

    await usuario.click(botao()) // claro → escuro
    expect(document.documentElement).toHaveClass('escuro')
    expect(localStorage.getItem('treino.tema')).toBe('escuro')
  })
})

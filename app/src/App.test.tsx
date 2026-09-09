import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

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
    expect(screen.getByText('37 clipes')).toBeInTheDocument()
    expect(screen.getByText('11:51 úteis de 139:45 brutos')).toBeInTheDocument()
  })

  it('troca de divisão pelo índice e escreve a rota', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    // O número e o rótulo são elementos irmãos sem espaço entre eles: o nome
    // acessível sai colado ("02Força A").
    await usuario.click(screen.getByRole('button', { name: /^02\s*Força A$/ }))
    expect(window.location.hash).toBe('#/forcaA')
    expect(tituloDaDivisao(/^Força A —/)).toBeInTheDocument()
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
    window.location.hash = '#/forcaA/a-agacha'
    render(<App />)
    const sheet = await screen.findByRole('dialog')
    expect(within(sheet).getByText('Agachamento (barra, goblet ou hack)')).toBeInTheDocument()
  })

  it('abre a busca com ⌘K e navega para a divisão do exercício escolhido', async () => {
    const usuario = userEvent.setup()
    render(<App />)

    await usuario.keyboard('{Meta>}k{/Meta}')
    const campo = await screen.findByRole('combobox')
    await usuario.type(campo, 'cadeira flexora')

    const resultados = screen.getAllByRole('option')
    expect(resultados).toHaveLength(1)
    await usuario.click(resultados[0])

    expect(window.location.hash).toBe('#/forcaB/b-flexora')
    const sheet = await screen.findByRole('dialog')
    expect(within(sheet).getByText('Cadeira flexora')).toBeInTheDocument()
    // O sheet é modal: o Base UI esconde o resto da página da árvore de
    // acessibilidade, então o título da divisão só aparece com `hidden: true`.
    expect(
      screen.getByRole('heading', { level: 2, name: /^Força B —/, hidden: true }),
    ).toBeInTheDocument()
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

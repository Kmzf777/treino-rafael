import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { buscarExercicio } from '@/data'
import { Busca } from './Busca'

// Os stubs de `scrollIntoView` e `ResizeObserver` que o cmdk exige vivem em
// src/test/setup.ts — são os mesmos de que o teste do App precisa.

const campo = () => screen.getByRole('combobox')

describe('Busca', () => {
  it('filtra por nome do exercício', async () => {
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
    await usuario.type(campo(), 'agacha')
    expect(screen.getByText(/Agachamento \(barra, goblet ou hack\)/)).toBeInTheDocument()
  })

  it('filtra por músculo', async () => {
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
    await usuario.type(campo(), 'sóleo')
    expect(screen.getByText(/Panturrilha sentada/)).toBeInTheDocument()
  })

  it('acha resultado acentuado quando o usuário digita sem acento', async () => {
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
    // "Caminhada lateral com miniband" não tem "glúteo" no nome: só casa pelo
    // músculo primário "Glúteo médio", e só se a busca ignorar o acento.
    await usuario.type(campo(), 'gluteo')
    expect(screen.getByText(/Caminhada lateral com miniband/)).toBeInTheDocument()
  })

  it('filtra por equipamento, também sem acento', async () => {
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
    // "Panturrilha sentada" só casa "maquina" pelo equipamento "Máquina".
    await usuario.type(campo(), 'maquina')
    expect(screen.getByText(/Panturrilha sentada/)).toBeInTheDocument()
  })

  it('mostra o número de protocolo e o músculo primário no resultado', async () => {
    const alvo = buscarExercicio('eb-pant-sent')
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
    await usuario.type(campo(), 'panturrilha sentada')
    const linhas = screen.getAllByRole('option')
    expect(linhas).toHaveLength(1)
    expect(linhas[0]).toHaveTextContent(alvo!.numero)
    expect(linhas[0]).toHaveTextContent(alvo!.meta.musculoPrimario)
  })

  it('mostra estado vazio quando nada casa', async () => {
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
    await usuario.type(campo(), 'zzzzzz')
    expect(screen.getByText(/nenhum exercício/i)).toBeInTheDocument()
  })

  /**
   * O rodapé promete "↑↓ NAVEGAR". Sem aria-activedescendant o leitor de tela
   * não anuncia qual dos 47 resultados está destacado enquanto se navega.
   */
  describe('opção ativa anunciada', () => {
    const ativa = () => document.querySelector('[role=option][aria-selected="true"]')

    it('aponta para a opção destacada assim que a paleta abre', () => {
      render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
      expect(ativa()).not.toBeNull()
      expect(campo()).toHaveAttribute('aria-activedescendant', ativa()!.id)
    })

    it('continua apontando depois de filtrar', async () => {
      const usuario = userEvent.setup()
      render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
      await usuario.type(campo(), 'agach')
      expect(ativa()).not.toBeNull()
      expect(campo()).toHaveAttribute('aria-activedescendant', ativa()!.id)
    })

    it('acompanha a navegação por seta', async () => {
      const usuario = userEvent.setup()
      render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
      const primeira = ativa()!.id
      await usuario.keyboard('{ArrowDown}')
      expect(ativa()!.id).not.toBe(primeira)
      expect(campo()).toHaveAttribute('aria-activedescendant', ativa()!.id)
    })

    it('esquece a opção ativa quando nada casa', async () => {
      const usuario = userEvent.setup()
      render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
      await usuario.type(campo(), 'zzzzzz')
      expect(ativa()).toBeNull()
      expect(campo()).not.toHaveAttribute('aria-activedescendant')
    })
  })

  /**
   * Filtrar acontece em silêncio: o contador é o único retorno de quantos
   * resultados sobraram e de quando a lista zerou.
   */
  it('publica a contagem de resultados numa região viva', async () => {
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
    const viva = screen.getByRole('status')
    expect(viva).toHaveTextContent('53 de 53 exercícios')

    await usuario.type(campo(), 'zzzzzz')
    expect(viva).toHaveTextContent('0 de 53 exercícios')
  })

  it('devolve o exercício escolhido', async () => {
    const onEscolher = vi.fn()
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={onEscolher} />)
    await usuario.type(campo(), 'agacha')
    await usuario.click(screen.getByText(/Agachamento \(barra, goblet ou hack\)/))
    expect(onEscolher).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'ea-agacha', divisao: 'empurrarA' }),
    )
  })
})

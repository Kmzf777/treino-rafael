import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { buscarExercicio } from '@/data'
import { Busca } from './Busca'

// Dois buracos do jsdom que o cmdk usa de verdade:
// 1. scrollIntoView() é chamado no item selecionado a cada tecla digitada;
// 2. o CommandList observa a própria altura com ResizeObserver.
// Sem os dois stubs a montagem estoura antes de qualquer asserção.
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

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
    const alvo = buscarExercicio('b-pant-sent')
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

  it('devolve o exercício escolhido', async () => {
    const onEscolher = vi.fn()
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={onEscolher} />)
    await usuario.type(campo(), 'agacha')
    await usuario.click(screen.getByText(/Agachamento \(barra, goblet ou hack\)/))
    expect(onEscolher).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'a-agacha', divisao: 'forcaA' }),
    )
  })
})

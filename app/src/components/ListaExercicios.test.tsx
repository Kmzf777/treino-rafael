import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { buscarDivisao } from '@/data'
import { ListaExercicios } from './ListaExercicios'

const forcaA = buscarDivisao('forcaA')!
const exerciciosDeForcaA = forcaA.blocos.flatMap((b) => b.exercicios)

describe('ListaExercicios', () => {
  it('mostra os cabeçalhos de bloco', () => {
    render(<ListaExercicios divisao={forcaA} onAbrir={() => {}} />)
    for (const bloco of forcaA.blocos) {
      expect(screen.getByText(bloco.nome)).toBeInTheDocument()
    }
  })

  it('mostra os 13 exercícios com número e prescrição', () => {
    render(<ListaExercicios divisao={forcaA} onAbrir={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(13)
    expect(screen.getByText('2.1')).toBeInTheDocument()
    expect(screen.getByText('4x6-10')).toBeInTheDocument()
  })

  it('avisa quando o exercício não tem clipe', () => {
    render(<ListaExercicios divisao={forcaA} onAbrir={() => {}} />)
    expect(screen.getAllByText('sem clipe').length).toBe(
      exerciciosDeForcaA.filter((e) => !e.recorte).length,
    )
  })

  it('marca os exercícios unilaterais', () => {
    render(<ListaExercicios divisao={forcaA} onAbrir={() => {}} />)
    expect(screen.getAllByText('unilateral').length).toBe(
      exerciciosDeForcaA.filter((e) => e.unilateral).length,
    )
  })

  it('chama onAbrir com o id ao clicar', async () => {
    const onAbrir = vi.fn()
    const usuario = userEvent.setup()
    render(<ListaExercicios divisao={forcaA} onAbrir={onAbrir} />)
    await usuario.click(screen.getAllByRole('button')[0])
    expect(onAbrir).toHaveBeenCalledWith('a-agacha')
  })

  it('não renderiza nada para uma divisão sem blocos', () => {
    const corrida = buscarDivisao('corrida')!
    render(<ListaExercicios divisao={corrida} onAbrir={() => {}} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})

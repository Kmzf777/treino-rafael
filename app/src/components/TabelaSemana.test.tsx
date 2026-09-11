import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TabelaSemana } from './TabelaSemana'

describe('TabelaSemana', () => {
  it('mostra as quatro semanas do ciclo', () => {
    render(<TabelaSemana />)
    for (const n of [1, 2, 3, 4]) {
      expect(screen.getByText(`Semana ${n}`)).toBeInTheDocument()
    }
  })

  it('mostra os três dias de força como cabeçalho', () => {
    render(<TabelaSemana />)
    expect(screen.getByText(/Segunda/)).toBeInTheDocument()
    expect(screen.getByText(/Quarta/)).toBeInTheDocument()
    expect(screen.getByText(/Sexta/)).toBeInTheDocument()
  })

  it('mostra o rótulo de cada treino nas células', () => {
    render(<TabelaSemana />)
    expect(screen.getAllByText('Empurrar A')).toHaveLength(3)
    expect(screen.getAllByText('Puxar B')).toHaveLength(3)
  })

  it('mostra os dias fixos da semana', () => {
    render(<TabelaSemana />)
    expect(screen.getByText(/Descanso ativo/)).toBeInTheDocument()
    expect(screen.getByText(/Descanso total/)).toBeInTheDocument()
  })

  it('mostra a regra de ouro e a regra de carga', () => {
    render(<TabelaSemana />)
    expect(screen.getByText('Regra de ouro')).toBeInTheDocument()
    expect(screen.getByText('A carga')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { REGRA_DO_FREIO } from '@/data/semana'
import { TabelaSemana } from './TabelaSemana'

describe('TabelaSemana', () => {
  it('mostra as quatro semanas do ciclo', () => {
    render(<TabelaSemana />)
    for (const n of [1, 2, 3, 4]) {
      expect(screen.getByText(`Semana ${n}`)).toBeInTheDocument()
    }
  })

  it('mostra os três dias de força com a carga de cada posição', () => {
    render(<TabelaSemana />)
    for (const [dia, carga] of [
      ['Segunda', 'pesada'],
      ['Quarta', 'moderada'],
      ['Sexta', 'leve'],
    ]) {
      expect(
        screen.getByRole('columnheader', { name: new RegExp(`^${dia}\\s*\\(${carga}\\)$`) }),
      ).toBeInTheDocument()
    }
  })

  it('deixa a região rolável da tabela alcançável por teclado', () => {
    render(<TabelaSemana />)
    const regiao = screen.getByRole('region', { name: 'Ciclo de quatro semanas' })
    expect(regiao).toHaveClass('overflow-x-auto')
    expect(regiao).toHaveAttribute('tabindex', '0')
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

  /**
   * A spec pede o freio-mestre nas divisões de força. `TabelaSemana` é o que
   * toda divisão de força renderiza (o `App` a monta para tudo que não é
   * aquecimento nem painel editorial), então é aqui que a cobertura mora: uma
   * nota só, quatro divisões. Se esta nota sair daqui, o aviso some das quatro
   * de uma vez.
   */
  it('leva o freio-mestre para dentro de toda divisão de força', () => {
    render(<TabelaSemana />)
    const rotulo = screen.getByText('O freio')

    expect(rotulo).toHaveClass('text-tijolo')
    expect(rotulo.closest('aside')).toHaveClass('border-tijolo')
    expect(screen.getByText(REGRA_DO_FREIO)).toBeInTheDocument()
  })
})

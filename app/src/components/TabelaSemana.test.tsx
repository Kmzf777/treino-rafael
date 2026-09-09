import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { TabelaSemana } from './TabelaSemana'

// A preferência persiste em localStorage e o jsdom é o mesmo para o arquivo
// inteiro: sem limpar, o teste do modo "3 dias" contaminaria os seguintes.
beforeEach(() => {
  localStorage.clear()
})

describe('TabelaSemana', () => {
  it('mostra os 7 dias', () => {
    render(<TabelaSemana />)
    expect(screen.getAllByRole('row')).toHaveLength(8) // cabeçalho + 7
  })

  it('troca de 4 para 3 dias', async () => {
    const usuario = userEvent.setup()
    render(<TabelaSemana />)
    expect(screen.getByText(/Força A \+ corrida leve/)).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: '3 dias' }))
    expect(screen.queryByText(/Força A \+ corrida leve/)).not.toBeInTheDocument()
    expect(screen.getAllByText('Força A').length).toBe(2)
  })

  it('mostra a regra de ouro', () => {
    render(<TabelaSemana />)
    expect(screen.getByText(/nunca coloque corrida intervalada forte/i)).toBeInTheDocument()
  })

  it('guarda o modo escolhido em localStorage e volta nele', async () => {
    const usuario = userEvent.setup()
    const { unmount } = render(<TabelaSemana />)
    await usuario.click(screen.getByRole('button', { name: '3 dias' }))
    expect(localStorage.getItem('treino.modo')).toBe('3')

    unmount()
    render(<TabelaSemana />)
    expect(screen.getByRole('button', { name: '3 dias' })).toHaveAttribute('aria-pressed', 'true')
  })
})

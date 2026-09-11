import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DIVISOES } from '@/data'
import { IndiceDivisoes } from './IndiceDivisoes'

describe('IndiceDivisoes', () => {
  it('lista as oito divisões numeradas de 01 a 08', () => {
    render(<IndiceDivisoes atual="aquecer" onIr={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(8)
    for (const divisao of DIVISOES) {
      expect(screen.getByText(divisao.numero)).toBeInTheDocument()
      expect(screen.getByText(divisao.rotulo)).toBeInTheDocument()
    }
  })

  it('marca apenas a divisão atual com aria-current', () => {
    render(<IndiceDivisoes atual="puxarA" onIr={() => {}} />)
    const marcados = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-current') === 'page')
    expect(marcados).toHaveLength(1)
    expect(marcados[0]).toHaveTextContent('Puxar A')
  })

  it('chama onIr com a chave da divisão escolhida', async () => {
    const onIr = vi.fn()
    const usuario = userEvent.setup()
    render(<IndiceDivisoes atual="aquecer" onIr={onIr} />)
    await usuario.click(screen.getByText('Circuito'))
    expect(onIr).toHaveBeenCalledWith('circuito')
  })

  it('expõe a faixa como navegação rotulada em português', () => {
    render(<IndiceDivisoes atual="aquecer" onIr={() => {}} />)
    expect(screen.getByRole('navigation', { name: 'Divisões do plano' })).toBeInTheDocument()
  })
})

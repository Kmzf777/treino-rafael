import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { buscarExercicio } from '@/data'
import { SheetExercicio } from './SheetExercicio'

const exercicio = buscarExercicio('a-agacha')!

describe('SheetExercicio', () => {
  it('mostra nome, número e prescrição', () => {
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={() => {}} />)
    expect(screen.getByText(exercicio.nome)).toBeInTheDocument()
    expect(screen.getByText(exercicio.numero)).toBeInTheDocument()
    expect(screen.getByText(exercicio.prescricao)).toBeInTheDocument()
  })

  it('lista todos os cues, numerados', () => {
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={() => {}} />)
    for (const cue of exercicio.cues) expect(screen.getByText(cue)).toBeInTheDocument()
    expect(screen.getByText(`${exercicio.numero}.1`)).toBeInTheDocument()
  })

  it('mostra o motivo do exercício estar no plano', () => {
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={() => {}} />)
    expect(screen.getByText(exercicio.meta.porQue)).toBeInTheDocument()
  })

  it('oferece os vídeos alternativos', () => {
    const comAlt = buscarExercicio('a-agacha')!
    render(<SheetExercicio exercicio={comAlt} aberto onFechar={() => {}} />)
    for (const alt of comAlt.alternativos) {
      expect(screen.getByRole('link', { name: alt.nome })).toBeInTheDocument()
    }
  })

  it('fecha com Escape', async () => {
    const onFechar = vi.fn()
    const usuario = userEvent.setup()
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={onFechar} />)
    await usuario.keyboard('{Escape}')
    expect(onFechar).toHaveBeenCalled()
  })

  it('não renderiza nada quando fechado', () => {
    render(<SheetExercicio exercicio={exercicio} aberto={false} onFechar={() => {}} />)
    expect(screen.queryByText(exercicio.nome)).not.toBeInTheDocument()
  })

  it('fecha pelo botão Fechar', async () => {
    const onFechar = vi.fn()
    const usuario = userEvent.setup()
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={onFechar} />)
    await usuario.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onFechar).toHaveBeenCalled()
  })

  it('mostra o link permanente do vídeo no segundo exato do recorte', () => {
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={() => {}} />)
    expect(screen.getByRole('link', { name: /abrir no youtube/i })).toHaveAttribute(
      'href',
      `https://www.youtube.com/watch?v=${exercicio.video}&t=${exercicio.recorte!.inicio}s`,
    )
  })

  it('marca o cue de risco para leitor de tela, sem depender só da cor', () => {
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={() => {}} />)
    const avisos = screen.getAllByText('Atenção:')
    expect(avisos).toHaveLength(1)
    expect(avisos[0].parentElement).toHaveTextContent('sem dor')
  })
})

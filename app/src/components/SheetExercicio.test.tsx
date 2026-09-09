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

  /**
   * A cor de risco (--tijolo) é o único vermelho do app e tem que continuar
   * cara: um cue só é aviso quando ABRE dizendo o que não fazer, ou o que fazer
   * se doer. Instrução principal que por acaso menciona dor não é aviso.
   */
  describe('cue de risco', () => {
    it('não pinta de vermelho a instrução principal do agachamento', () => {
      render(<SheetExercicio exercicio={exercicio} aberto onFechar={() => {}} />)
      const principal = screen.getByText(
        'Desça abaixo da linha do quadril, dentro do que o joelho aceita sem dor.',
      )
      expect(principal).toBeInTheDocument()
      expect(principal.className).not.toContain('text-tijolo')
      expect(screen.queryByText('Atenção:')).not.toBeInTheDocument()
    })

    it('marca o cue que abre proibindo, para leitor de tela e não só pela cor', () => {
      const lateral = buscarExercicio('at-lateral')!
      render(<SheetExercicio exercicio={lateral} aberto onFechar={() => {}} />)

      const aviso = screen.getByText('Não deixe o joelho cair para dentro em nenhum passo.')
      expect(aviso.className).toContain('text-tijolo')
      expect(screen.getAllByText('Atenção:')).toHaveLength(1)

      // "sem juntar os pés" no meio da frase é instrução, não alerta.
      const neutro = screen.getByText(
        'Joelhos semiflexionados, passos curtos e controlados, sem juntar os pés.',
      )
      expect(neutro.className).not.toContain('text-tijolo')
    })

    it('marca o cue condicional de dor', () => {
      const finalizador = buscarExercicio('b-fin-2')!
      render(<SheetExercicio exercicio={finalizador} aberto onFechar={() => {}} />)
      expect(
        screen.getByText('Se incomodar o joelho operado, reduza a altura do apoio de trás.')
          .className,
      ).toContain('text-tijolo')
    })
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { buscarExercicio } from '@/data'
import { SheetExercicio } from './SheetExercicio'

const exercicio = buscarExercicio('ea-agacha')!

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
    const comAlt = buscarExercicio('ea-agacha')!
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
   * O Base UI já marca o #root com aria-hidden enquanto o sheet está aberto, mas
   * o atributo que o padrão de diálogo modal pede continuava ausente.
   */
  it('se declara modal', () => {
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={() => {}} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  /**
   * A área dos cues é o único contêiner rolável do sheet e só tem três focáveis
   * dentro. Sem uma parada de tabulação nele, quem usa teclado não alcança as
   * setas/PageDown para ler o resto. É o que a WCAG 2.1.1 cobre.
   */
  it('deixa a área rolável dos cues alcançável pelo teclado', () => {
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={() => {}} />)
    const area = screen.getByRole('group', { name: 'Conteúdo do exercício' })
    expect(area).toHaveAttribute('tabindex', '0')
    expect(area.className).toContain('overflow-y-auto')
  })

  it('avisa que "Outros vídeos" abre em nova aba', () => {
    const comBusca = buscarExercicio('mob-tornozelo')!
    render(<SheetExercicio exercicio={comBusca} aberto onFechar={() => {}} />)
    expect(screen.getByRole('link', { name: /outros vídeos/i })).toHaveAccessibleName(
      /abre em nova aba/,
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
      const bulgaro = buscarExercicio('pa-bulgaro')!
      render(<SheetExercicio exercicio={bulgaro} aberto onFechar={() => {}} />)
      expect(
        screen.getByText('Se incomodar o joelho operado, reduza a altura do apoio de trás.')
          .className,
      ).toContain('text-tijolo')
    })
  })
  it('remonta a prancha ao trocar de exercício com o sheet aberto', async () => {
    const usuario = userEvent.setup()
    const outro = buscarExercicio('at-ponte')!
    const { rerender } = render(
      <SheetExercicio exercicio={exercicio} aberto onFechar={() => {}} />,
    )

    // Pede o vídeo do primeiro exercício: o botão do pôster some.
    await usuario.click(screen.getByRole('button', { name: /ver execução/i }))
    expect(screen.queryByRole('button', { name: /ver execução/i })).not.toBeInTheDocument()

    // Deep link direto de um id para outro, sem fechar o sheet.
    rerender(<SheetExercicio exercicio={outro} aberto onFechar={() => {}} />)

    // O novo exercício tem que começar do zero, não herdar o "já pedi".
    expect(screen.getByRole('button', { name: /ver execução/i })).toBeInTheDocument()
    expect(screen.getByText(outro.nome)).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BarraTrecho } from './BarraTrecho'

describe('BarraTrecho', () => {
  it('posiciona a janela proporcionalmente à duração total', () => {
    render(<BarraTrecho duracao={100} inicio={20} fim={40} />)
    const janela = screen.getByTestId('janela')
    expect(janela).toHaveStyle({ left: '20%', width: '20%' })
  })

  it('descreve a economia para leitores de tela', () => {
    render(<BarraTrecho duracao={100} inicio={20} fim={40} />)
    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Trecho de 0:20 a 0:40 dentro de um vídeo de 1:40',
    )
  })

  it('não quebra quando a duração é zero', () => {
    render(<BarraTrecho duracao={0} inicio={0} fim={0} />)
    expect(screen.getByTestId('janela')).toHaveStyle({ width: '0%' })
  })

  it('põe o playhead dentro da janela, proporcional ao progresso', () => {
    render(<BarraTrecho duracao={100} inicio={20} fim={40} progresso={0.5} />)
    expect(screen.getByTestId('playhead')).toHaveStyle({ left: '30%' })
  })

  it('não mostra playhead quando não há progresso', () => {
    render(<BarraTrecho duracao={100} inicio={20} fim={40} />)
    expect(screen.queryByTestId('playhead')).not.toBeInTheDocument()
  })
})

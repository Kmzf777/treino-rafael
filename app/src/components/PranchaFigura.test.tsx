import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { EstadoClipe, OpcoesClipe } from '@/hooks/useYouTubeClip'
import { PranchaFigura } from './PranchaFigura'

/**
 * O player entra dublado.
 *
 * O hook de verdade tem os testes dele em useYouTubeClip.test.tsx. Aqui o que
 * precisa ser provado é a fachada (nada do YouTube antes do toque) e a cascata
 * de fallback inteira, que só é observável se o estado do player for dirigível.
 * Usar o hook real neste arquivo custaria um <script> pendurado e um timeout de
 * 3s por teste — e, pior, o loader é singleton de módulo: o primeiro teste
 * cacheia a promessa e contamina todos os seguintes.
 */
const dublagem = vi.hoisted(() => ({
  estado: 'ocioso' as EstadoClipe,
  codigoErro: null as number | null,
  progresso: null as number | null,
  opcoes: null as OpcoesClipe | null,
  tocar: vi.fn(),
}))

vi.mock('@/hooks/useYouTubeClip', async () => {
  const { useRef } = await import('react')
  return {
    useYouTubeClip: (opcoes: OpcoesClipe) => {
      dublagem.opcoes = opcoes
      const ref = useRef<HTMLDivElement | null>(null)
      return {
        ref,
        estado: dublagem.estado,
        codigoErro: dublagem.codigoErro,
        progresso: dublagem.progresso,
        tocar: dublagem.tocar,
      }
    },
  }
})

const base = {
  numero: '2.3',
  nome: 'Ponte de glúteo com miniband',
  video: 'q5U-p6vA3uo',
  duracao: 300,
  inicio: 33,
  fim: 68,
}

beforeEach(() => {
  dublagem.estado = 'ocioso'
  dublagem.codigoErro = null
  dublagem.progresso = null
  dublagem.opcoes = null
  dublagem.tocar.mockClear()
})

describe('PranchaFigura', () => {
  it('mostra o pôster antes de qualquer player (facade)', () => {
    render(<PranchaFigura {...base} />)
    expect(screen.getByRole('button', { name: /ver execução/i })).toBeInTheDocument()
    expect(document.querySelector('iframe')).toBeNull()
    expect(dublagem.opcoes?.ativo).toBe(false)
  })

  it('escreve a legenda com número, timecode e loop', () => {
    render(<PranchaFigura {...base} />)
    expect(screen.getByText(/Fig\. 2\.3/)).toBeInTheDocument()
    expect(screen.getByText(/0:33–1:08/)).toBeInTheDocument()
    expect(screen.getByText(/em loop/)).toBeInTheDocument()
  })

  it('omite "em loop" quando não há recorte', () => {
    render(<PranchaFigura {...base} inicio={undefined} fim={undefined} />)
    expect(screen.queryByText(/em loop/)).not.toBeInTheDocument()
  })

  it('sempre oferece o link permanente no segundo exato', () => {
    render(<PranchaFigura {...base} />)
    expect(screen.getByRole('link', { name: /abrir no youtube/i })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=q5U-p6vA3uo&t=33s',
    )
  })

  it('ativa o player ao tocar no pôster', async () => {
    const usuario = userEvent.setup()
    render(<PranchaFigura {...base} />)
    await usuario.click(screen.getByRole('button', { name: /ver execução/i }))
    expect(screen.queryByRole('button', { name: /ver execução/i })).not.toBeInTheDocument()
    expect(dublagem.opcoes?.ativo).toBe(true)
  })

  it('mantém o pôster até o primeiro frame e só então o apaga', async () => {
    const usuario = userEvent.setup()
    const { rerender } = render(<PranchaFigura {...base} />)
    await usuario.click(screen.getByRole('button', { name: /ver execução/i }))
    expect(screen.getByTestId('poster')).toHaveAttribute('data-estado', 'visivel')

    dublagem.estado = 'tocando'
    rerender(<PranchaFigura {...base} />)
    expect(screen.getByTestId('poster')).toHaveAttribute('data-estado', 'oculto')
  })

  it('não ativa o player enquanto a prancha estiver desabilitada', async () => {
    const usuario = userEvent.setup()
    render(<PranchaFigura {...base} habilitado={false} />)
    await usuario.click(screen.getByRole('button', { name: /ver execução/i }))
    expect(dublagem.opcoes?.ativo).toBe(false)
  })

  it('oferece "Toque para tocar" quando o autoplay é bloqueado', async () => {
    const usuario = userEvent.setup()
    dublagem.estado = 'bloqueado'
    render(<PranchaFigura {...base} />)
    await usuario.click(screen.getByRole('button', { name: /toque para tocar/i }))
    expect(dublagem.tocar).toHaveBeenCalled()
  })

  /**
   * O overlay de destrave cobre o iframe inteiro (inset-0). Se ele sobrevivesse
   * ao PLAYING, comeria todo clique nos controles do próprio YouTube — barra de
   * progresso, volume, tela cheia. Ele só pode existir enquanto 'bloqueado'.
   */
  it('some com o "Toque para tocar" assim que o vídeo começa, liberando os controles', () => {
    dublagem.estado = 'bloqueado'
    const { rerender } = render(<PranchaFigura {...base} />)
    expect(screen.getByRole('button', { name: /toque para tocar/i })).toBeInTheDocument()

    dublagem.estado = 'tocando'
    rerender(<PranchaFigura {...base} />)
    expect(screen.queryByRole('button', { name: /toque para tocar/i })).not.toBeInTheDocument()
  })

  it('explica que o dono não permite incorporar (erro 150)', () => {
    dublagem.estado = 'erro'
    dublagem.codigoErro = 150
    render(<PranchaFigura {...base} />)
    expect(
      screen.getByText('O dono deste vídeo não permite que ele seja incorporado.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /abrir no youtube/i })).toBeInTheDocument()
  })

  it('explica que o vídeo saiu do ar (erro 100)', () => {
    dublagem.estado = 'erro'
    dublagem.codigoErro = 100
    render(<PranchaFigura {...base} />)
    expect(screen.getByText('Este vídeo foi removido ou está privado.')).toBeInTheDocument()
  })

  it('cai numa mensagem genérica quando o player nem chega a existir', () => {
    dublagem.estado = 'indisponivel'
    render(<PranchaFigura {...base} />)
    expect(screen.getAllByText('Não foi possível carregar o vídeo aqui.')[0]).toBeInTheDocument()
  })

  it('avisa que o link permanente abre em nova aba', () => {
    render(<PranchaFigura {...base} />)
    expect(screen.getByRole('link', { name: /abrir no youtube/i })).toHaveAccessibleName(
      /abre em nova aba/,
    )
  })

  /**
   * Acionar "Ver execução" tira o botão do DOM e a caixa passa por
   * "carregando…" e "Toque para tocar" — sem região viva, tudo isso acontece em
   * silêncio absoluto para quem usa leitor de tela.
   */
  describe('região viva do player', () => {
    const viva = () => screen.getByRole('status')

    it('existe antes de qualquer troca de estado, e calada', () => {
      render(<PranchaFigura {...base} />)
      expect(viva()).toBeInTheDocument()
      expect(viva()).toHaveTextContent('')
    })

    it('anuncia carregando, pronto e tocando', async () => {
      const usuario = userEvent.setup()
      const { rerender } = render(<PranchaFigura {...base} />)
      dublagem.estado = 'carregando'
      await usuario.click(screen.getByRole('button', { name: /ver execução/i }))
      expect(viva()).toHaveTextContent('Carregando o clipe.')

      dublagem.estado = 'bloqueado'
      rerender(<PranchaFigura {...base} />)
      expect(viva()).toHaveTextContent('Clipe pronto. Toque para tocar.')

      dublagem.estado = 'tocando'
      rerender(<PranchaFigura {...base} />)
      expect(viva()).toHaveTextContent('Clipe tocando em loop.')
    })

    it('anuncia a falha', async () => {
      const usuario = userEvent.setup()
      render(<PranchaFigura {...base} />)
      dublagem.estado = 'erro'
      await usuario.click(screen.getByRole('button', { name: /ver execução/i }))
      expect(viva()).toHaveTextContent('Não foi possível carregar o vídeo aqui.')
    })
  })

  /**
   * A barra do trecho é a assinatura do app, e ela tem duas metades: a janela
   * acesa mostra a economia, o playhead mostra o loop. Sem o segundo, a barra
   * conta metade da história.
   */
  describe('playhead da barra do trecho', () => {
    it('percorre a janela enquanto o clipe toca', () => {
      dublagem.estado = 'tocando'
      dublagem.progresso = 0.5
      render(<PranchaFigura {...base} />)
      // Janela 33–68 de um vídeo de 300s: 11% a 22,67% da régua, metade = 16,83%.
      const playhead = screen.getByTestId('playhead')
      expect(Number.parseFloat(playhead.style.left)).toBeCloseTo(16.833, 3)
    })

    it('não existe quando o clipe não está tocando', () => {
      dublagem.estado = 'bloqueado'
      dublagem.progresso = 0.5
      render(<PranchaFigura {...base} />)
      expect(screen.queryByTestId('playhead')).not.toBeInTheDocument()
    })
  })
})

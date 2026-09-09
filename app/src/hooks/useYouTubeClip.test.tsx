import { act, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useYouTubeClip } from './useYouTubeClip'

let tempoAtual = 0
let aoPronto: (() => void) | null = null
let aoMudarEstado: ((codigo: number) => void) | null = null
const seekTo = vi.fn()
const playVideo = vi.fn()
const destroy = vi.fn()

type EventosFalsos = {
  onReady: (e: unknown) => void
  onStateChange: (e: unknown) => void
}

class PlayerFalso {
  constructor(_host: HTMLElement, opcoes: { events: EventosFalsos }) {
    aoPronto = () => opcoes.events.onReady({ target: this })
    aoMudarEstado = (codigo) => opcoes.events.onStateChange({ target: this, data: codigo })
  }
  getCurrentTime() {
    return tempoAtual
  }
  getDuration() {
    return 300
  }
  seekTo(...args: unknown[]) {
    seekTo(...args)
  }
  playVideo() {
    playVideo()
  }
  mute() {}
  destroy() {
    destroy()
  }
}

beforeEach(() => {
  tempoAtual = 0
  aoPronto = null
  aoMudarEstado = null
  seekTo.mockClear()
  playVideo.mockClear()
  destroy.mockClear()
  vi.stubGlobal('YT', { Player: PlayerFalso, PlayerState: { PLAYING: 1, ENDED: 0 } })
})

afterEach(() => {
  vi.useRealTimers()
})

function Sonda({ ativo = true }: { ativo?: boolean }) {
  const { ref } = useYouTubeClip({ video: 'abc', inicio: 30, fim: 40, ativo })
  return <div ref={ref} data-testid="host" />
}

/** Igual à Sonda, mas publica o estado do hook no DOM para as asserções. */
function SondaComEstado({ ativo = true }: { ativo?: boolean }) {
  const { ref, estado } = useYouTubeClip({ video: 'abc', inicio: 30, fim: 40, ativo })
  return (
    <div>
      <div ref={ref} data-testid="host" />
      <span data-testid="estado">{estado}</span>
    </div>
  )
}

/** Roda frames de verdade até passar `ms` de relógio real. */
async function avancarFrames(ms: number) {
  const t0 = performance.now()
  while (performance.now() - t0 < ms) {
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => r(null)))
    })
  }
}

describe('useYouTubeClip', () => {
  it('cria o player e chama onReady', async () => {
    render(<Sonda />)
    await waitFor(() => expect(aoPronto).not.toBeNull())
    act(() => {
      aoPronto?.()
    })
    expect(playVideo).toHaveBeenCalled()
  })

  it('volta ao início quando passa do fim', async () => {
    render(<Sonda />)
    await waitFor(() => expect(aoPronto).not.toBeNull())
    act(() => {
      aoPronto?.()
    })
    tempoAtual = 39.95
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => r(null)))
    })
    expect(seekTo).toHaveBeenCalledWith(30, true)
  })

  it('não dispara seek em rajada dentro do guard', async () => {
    render(<Sonda />)
    await waitFor(() => expect(aoPronto).not.toBeNull())
    act(() => {
      aoPronto?.()
    })
    tempoAtual = 39.95
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await new Promise((r) => requestAnimationFrame(() => r(null)))
      })
    }
    expect(seekTo).toHaveBeenCalledTimes(1)
  })

  it('não insiste enquanto o seek não se reflete, mesmo depois do guard', async () => {
    render(<Sonda />)
    await waitFor(() => expect(aoPronto).not.toBeNull())
    act(() => {
      aoPronto?.()
    })
    tempoAtual = 39.95
    // Mais que os 400ms do guard de relógio, com getCurrentTime() ainda preso no
    // valor antigo: o seek está em trânsito, insistir é o que trava o player.
    await avancarFrames(600)
    expect(seekTo).toHaveBeenCalledTimes(1)
  })

  it('insiste quando o seek se perdeu e o vídeo continuou andando', async () => {
    render(<Sonda />)
    await waitFor(() => expect(aoPronto).not.toBeNull())
    act(() => {
      aoPronto?.()
    })
    tempoAtual = 39.95
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => r(null)))
    })
    expect(seekTo).toHaveBeenCalledTimes(1)
    // O relógio do player andou: o seek não pegou de verdade.
    tempoAtual = 41.5
    await avancarFrames(600)
    expect(seekTo).toHaveBeenCalledTimes(2)
  })

  it('destrói o player no unmount', async () => {
    const { unmount } = render(<Sonda />)
    await waitFor(() => expect(aoPronto).not.toBeNull())
    act(() => {
      aoPronto?.()
    })
    unmount()
    expect(destroy).toHaveBeenCalled()
  })

  describe('prazo de segurança do autoplay', () => {
    /**
     * Só setTimeout/clearTimeout são falsos: o cão-de-guarda do loop roda em
     * requestAnimationFrame e o guard anti-seek-storm lê performance.now(), e
     * congelar os dois travaria o resto do hook dentro deste teste.
     */
    async function prepararPlayerPronto() {
      const utils = render(<SondaComEstado />)
      await waitFor(() => expect(aoPronto).not.toBeNull())
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
      act(() => {
        aoPronto?.()
      })
      return utils
    }

    it('cai em bloqueado quando o player nunca reporta PLAYING', async () => {
      const { getByTestId } = await prepararPlayerPronto()
      expect(playVideo).toHaveBeenCalled()
      expect(getByTestId('estado')).toHaveTextContent('carregando')

      // 4,9s: ainda dentro do prazo, o overlay de carregamento continua de pé.
      act(() => {
        vi.advanceTimersByTime(4900)
      })
      expect(getByTestId('estado')).toHaveTextContent('carregando')

      // Nem PLAYING nem onAutoplayBlocked chegaram: em vez de morrer em
      // "carregando…" para sempre, o hook oferece o "Toque para tocar".
      act(() => {
        vi.advanceTimersByTime(200)
      })
      expect(getByTestId('estado')).toHaveTextContent('bloqueado')
    })

    it('não bloqueia quando o vídeo começou a tocar dentro do prazo', async () => {
      const { getByTestId } = await prepararPlayerPronto()
      act(() => {
        aoMudarEstado?.(1)
      })
      expect(getByTestId('estado')).toHaveTextContent('tocando')

      act(() => {
        vi.advanceTimersByTime(10_000)
      })
      expect(getByTestId('estado')).toHaveTextContent('tocando')
    })

    it('não dispara depois do componente ser descartado', async () => {
      const { unmount } = await prepararPlayerPronto()
      unmount()
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(10_000)
        })
      }).not.toThrow()
      expect(vi.getTimerCount()).toBe(0)
    })
  })
})

import { act, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useYouTubeClip } from './useYouTubeClip'

let tempoAtual = 0
let aoPronto: (() => void) | null = null
let aoMudarEstado: ((codigo: number) => void) | null = null
let aoErrar: ((codigo: number) => void) | null = null
const seekTo = vi.fn()
const playVideo = vi.fn()
const destroy = vi.fn()

type EventosFalsos = {
  onReady: (e: unknown) => void
  onStateChange: (e: unknown) => void
  onError: (e: unknown) => void
}

class PlayerFalso {
  constructor(_host: HTMLElement, opcoes: { events: EventosFalsos }) {
    aoPronto = () => opcoes.events.onReady({ target: this })
    aoMudarEstado = (codigo) => opcoes.events.onStateChange({ target: this, data: codigo })
    aoErrar = (codigo) => opcoes.events.onError({ target: this, data: codigo })
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
  aoErrar = null
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

/** Igual à Sonda, mas publica todo o retorno do hook no DOM para as asserções. */
function SondaComEstado({ ativo = true, video = 'abc' }: { ativo?: boolean; video?: string }) {
  const { ref, estado, codigoErro, progresso } = useYouTubeClip({
    video,
    inicio: 30,
    fim: 40,
    ativo,
  })
  return (
    <div>
      <div ref={ref} data-testid="host" />
      <span data-testid="estado">{estado}</span>
      <span data-testid="codigo">{String(codigoErro)}</span>
      <span data-testid="progresso">{String(progresso)}</span>
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

    /**
     * O beco sem saída uma camada acima: o YT.Player é construído, mas o iframe
     * do youtube-nocookie.com nunca abre (o domínio está em praticamente toda
     * blocklist de DNS enquanto o iframe_api costuma passar). Não chega onReady,
     * nem onError, nem onAutoplayBlocked. Sem prazo armado na CRIAÇÃO do player
     * o estado fica em 'carregando' para sempre — por isso o relógio falso vale
     * desde antes do render.
     */
    it('não fica em "carregando" para sempre quando o iframe nunca abre', async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
      const { getByTestId } = render(<SondaComEstado />)
      await act(async () => {}) // deixa o .then do loader rodar
      expect(getByTestId('estado')).toHaveTextContent('carregando')

      act(() => {
        vi.advanceTimersByTime(60_000)
      })
      // 'indisponivel' e não 'bloqueado': sem onReady não há player para
      // destravar, e "Toque para tocar" ali seria um botão morto.
      expect(getByTestId('estado')).toHaveTextContent('indisponivel')
    })
  })

  describe('recomeço limpo', () => {
    it('esquece o código de erro quando o vídeo troca', async () => {
      const { getByTestId, rerender } = render(<SondaComEstado video="abc" />)
      await waitFor(() => expect(aoErrar).not.toBeNull())
      act(() => {
        aoErrar?.(101)
      })
      expect(getByTestId('estado')).toHaveTextContent('erro')
      expect(getByTestId('codigo')).toHaveTextContent('101')

      // Sem a varredura, a tarja do vídeo novo exibiria "O dono deste vídeo não
      // permite que ele seja incorporado" para um vídeo que nem foi pedido.
      rerender(<SondaComEstado video="xyz" />)
      expect(getByTestId('estado')).toHaveTextContent('carregando')
      expect(getByTestId('codigo')).toHaveTextContent('null')
    })

    it('volta a ocioso quando o clipe é desativado', async () => {
      const { getByTestId, rerender } = render(<SondaComEstado />)
      await waitFor(() => expect(aoErrar).not.toBeNull())
      act(() => {
        aoErrar?.(150)
      })
      expect(getByTestId('estado')).toHaveTextContent('erro')

      // Com o player destruído o hook não pode continuar afirmando um estado de
      // player: é isso que deixava um overlay com botão morto por cima da
      // prancha durante os 280ms da animação de saída do sheet.
      rerender(<SondaComEstado ativo={false} />)
      expect(getByTestId('estado')).toHaveTextContent('ocioso')
      expect(getByTestId('codigo')).toHaveTextContent('null')
      expect(getByTestId('progresso')).toHaveTextContent('null')
    })
  })

  describe('playhead', () => {
    it('publica o progresso dentro da janela curada enquanto o clipe roda', async () => {
      const { getByTestId } = render(<SondaComEstado />)
      await waitFor(() => expect(aoPronto).not.toBeNull())
      act(() => {
        aoPronto?.()
      })

      // Metade exata do recorte 30–40.
      tempoAtual = 35
      await avancarFrames(150)
      expect(getByTestId('progresso')).toHaveTextContent('0.5')
    })

    it('não deixa o progresso escapar da janela', async () => {
      const { getByTestId } = render(<SondaComEstado />)
      await waitFor(() => expect(aoPronto).not.toBeNull())
      act(() => {
        aoPronto?.()
      })

      // O player pode reportar um instante antes do início (start é arredondado
      // para baixo nos playerVars): o playhead nunca sai da janela.
      tempoAtual = 29
      await avancarFrames(150)
      expect(getByTestId('progresso')).toHaveTextContent('0')
    })
  })
})

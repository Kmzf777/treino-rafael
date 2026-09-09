import { act, render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useYouTubeClip } from './useYouTubeClip'

let tempoAtual = 0
let aoPronto: (() => void) | null = null
const seekTo = vi.fn()
const playVideo = vi.fn()
const destroy = vi.fn()

class PlayerFalso {
  constructor(_host: HTMLElement, opcoes: { events: { onReady: (e: unknown) => void } }) {
    aoPronto = () => opcoes.events.onReady({ target: this })
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
  seekTo.mockClear()
  playVideo.mockClear()
  destroy.mockClear()
  vi.stubGlobal('YT', { Player: PlayerFalso, PlayerState: { PLAYING: 1, ENDED: 0 } })
})

function Sonda({ ativo = true }: { ativo?: boolean }) {
  const { ref } = useYouTubeClip({ video: 'abc', inicio: 30, fim: 40, ativo })
  return <div ref={ref} data-testid="host" />
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
})

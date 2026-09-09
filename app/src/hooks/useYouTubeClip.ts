import { useCallback, useEffect, useRef, useState } from 'react'
import { carregarApiYouTube, ehFileProtocol } from '@/lib/youtube'

/**
 * Loop de um trecho [inicio, fim] de um vídeo do YouTube.
 *
 * A documentação da IFrame API é explícita: "If you specify an endSeconds value
 * and then call seekTo(), the endSeconds value will no longer be in effect."
 * Ou seja, o `end` dos playerVars vale só para a PRIMEIRA passada — no instante
 * em que voltamos ao início o ponto final é desarmado. Quem faz o loop de
 * verdade, da segunda volta em diante, é o cão-de-guarda em requestAnimationFrame
 * abaixo. O `end` fica como rede de segurança para o caso do JS ser congelado
 * em segundo plano.
 */

const EPSILON = 0.08
const GUARD_MS = 400

/**
 * Rede de segurança do autoplay. `onAutoplayBlocked` é o aviso oficial, mas nem
 * todo navegador o emite: iOS em modo de baixo consumo, economia de dados no
 * Android e Chrome automatizado simplesmente engolem o `playVideo()` calados —
 * nunca chega PLAYING e nunca chega o aviso. Sem este prazo o usuário fica
 * olhando "carregando…" para sempre. Ao vencer, caímos em 'bloqueado', que já
 * tem o overlay "Toque para tocar" — e um toque de verdade destrava o autoplay.
 */
const ESPERA_AUTOPLAY_MS = 5000

export type EstadoClipe =
  | 'ocioso'
  | 'carregando'
  | 'tocando'
  | 'bloqueado'
  | 'erro'
  | 'indisponivel'

export type OpcoesClipe = {
  video: string
  inicio?: number
  fim?: number
  ativo: boolean
}

/**
 * Publicação do playhead. A régua tem 3 pixels de altura: a 60 fps ninguém vê a
 * diferença, e re-renderizar o sheet inteiro sessenta vezes por segundo por
 * causa dela seria caro à toa. 10 Hz é o suficiente para o traço parecer contínuo.
 */
const PASSO_PROGRESSO_MS = 100

export function useYouTubeClip({ video, inicio, fim, ativo }: OpcoesClipe) {
  const ref = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const [estado, setEstado] = useState<EstadoClipe>('ocioso')
  const [codigoErro, setCodigoErro] = useState<number | null>(null)
  /** 0..1 dentro da janela curada. Null enquanto não há player tocando. */
  const [progresso, setProgresso] = useState<number | null>(null)

  const tocar = useCallback(() => {
    try {
      playerRef.current?.playVideo()
    } catch {
      /* player ainda não pronto */
    }
  }, [])

  useEffect(() => {
    if (!ativo) return
    if (ehFileProtocol()) {
      setEstado('indisponivel')
      return
    }

    const container = ref.current
    if (!container) return

    let descartado = false
    let raf = 0
    let guardAte = 0
    let tempoDoUltimoSeek: number | null = null
    let prazoAutoplay: ReturnType<typeof setTimeout> | null = null
    let prontoChegou = false
    let progressoPublicadoEm = 0

    const cancelarPrazoAutoplay = () => {
      if (prazoAutoplay != null) clearTimeout(prazoAutoplay)
      prazoAutoplay = null
    }

    /**
     * O prazo nasce junto com o Player, não só no onReady.
     *
     * Se o iframe do youtube-nocookie.com nunca abrir — o domínio está em
     * praticamente toda blocklist de DNS enquanto o iframe_api costuma passar —
     * não chega onReady, nem onError, nem onAutoplayBlocked, e sem este prazo o
     * estado ficaria em 'carregando' para sempre. Por isso o vencimento
     * distingue os dois silêncios: com onReady o player existe e um toque
     * destrava ('bloqueado'); sem onReady o iframe nunca abriu e "Toque para
     * tocar" ali seria um botão morto ('indisponivel').
     */
    const armarPrazo = () => {
      cancelarPrazoAutoplay()
      prazoAutoplay = setTimeout(() => {
        prazoAutoplay = null
        if (descartado) return
        // Só o silêncio vira alguma coisa: se já tocou, ou já deu erro, o prazo
        // não tem nada a dizer.
        setEstado((atual) =>
          atual !== 'carregando' ? atual : prontoChegou ? 'bloqueado' : 'indisponivel',
        )
      }, ESPERA_AUTOPLAY_MS)
    }

    setEstado('carregando')

    // YT.Player SUBSTITUI o nó que recebe por um <iframe>. Nunca passe um nó do
    // React: no unmount o React tenta remover um filho que não existe mais e
    // estoura NotFoundError: removeChild.
    const host = document.createElement('div')
    container.replaceChildren(host)

    // Trechos muito curtos não podem esperar 400ms para reiniciar.
    const guardProporcional =
      inicio != null && fim != null ? Math.min(GUARD_MS, (fim - inicio) * 1000 * 0.4) : GUARD_MS

    const lerTempo = (player: YT.Player) => {
      try {
        return player.getCurrentTime()
      } catch {
        return Number.NaN // leitura antes do infoDelivery
      }
    }

    const voltarAoInicio = (player: YT.Player) => {
      if (inicio == null) return
      const agora = performance.now()
      // Guard anti-seek-storm, trava 1 (relógio): getCurrentTime() só reflete o
      // seek alguns frames depois. Sem isto o rAF dispara 5-10 seeks seguidos e
      // o player engasga ou trava em BUFFERING.
      if (agora < guardAte) return
      // Trava 2 (confirmação), independente de relógio: em rede ruim o seek
      // demora bem mais que 400ms para se refletir, e aí a trava 1 sozinha
      // deixaria a rajada voltar. Enquanto o relógio do player não tiver andado
      // além do instante em que pedimos o seek, o pedido ainda está em trânsito.
      // Se ele andou, o seek se perdeu de verdade e insistir é o certo.
      if (tempoDoUltimoSeek != null && lerTempo(player) <= tempoDoUltimoSeek + 0.05) return
      guardAte = agora + guardProporcional
      tempoDoUltimoSeek = lerTempo(player)
      try {
        player.seekTo(inicio, true)
        player.playVideo()
      } catch {
        /* ignorado */
      }
    }

    /**
     * A outra metade da assinatura: a barra já mostra a economia (a proporção
     * da janela curada dentro do vídeo inteiro); o playhead mostra o loop.
     */
    const publicarProgresso = (tempo: number) => {
      if (inicio == null || fim == null || fim <= inicio) return
      if (!Number.isFinite(tempo)) return
      const agora = performance.now()
      if (agora - progressoPublicadoEm < PASSO_PROGRESSO_MS) return
      progressoPublicadoEm = agora
      const bruto = (tempo - inicio) / (fim - inicio)
      setProgresso(Math.min(1, Math.max(0, bruto)))
    }

    const vigiar = (player: YT.Player) => {
      raf = requestAnimationFrame(() => {
        if (descartado) return
        if (fim != null) {
          const tempo = lerTempo(player)
          publicarProgresso(tempo)
          if (tempo < fim - EPSILON) {
            // Voltamos para dentro do trecho: o seek chegou, rearma a trava 2.
            tempoDoUltimoSeek = null
          } else if (tempo >= fim - EPSILON) {
            voltarAoInicio(player)
          }
        }
        vigiar(player)
      })
    }

    carregarApiYouTube()
      .then((api) => {
        if (descartado) return
        const player = new api.Player(host, {
          videoId: video,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            rel: 0,
            playsinline: 1,
            mute: 1,
            autoplay: 1,
            controls: 1,
            ...(inicio != null ? { start: Math.floor(inicio) } : {}),
            ...(fim != null ? { end: Math.ceil(fim) } : {}),
          },
          events: {
            onReady: (evento) => {
              if (descartado) return
              playerRef.current = evento.target
              try {
                evento.target.mute()
                evento.target.playVideo()
              } catch {
                /* ignorado */
              }
              if (fim != null) vigiar(evento.target)
              // O player existe: daqui em diante o vencimento do prazo é
              // autoplay bloqueado, não iframe morto.
              prontoChegou = true
              armarPrazo()
            },
            onStateChange: (evento) => {
              if (descartado) return
              if (evento.data === 1) {
                cancelarPrazoAutoplay()
                setEstado('tocando')
              }
              if (evento.data === 0) voltarAoInicio(evento.target)
            },
            onError: (evento) => {
              if (descartado) return
              cancelarPrazoAutoplay()
              setCodigoErro(evento.data)
              setEstado('erro')
            },
            // Autoplay bloqueado não é erro, é estado de UI: o iOS em modo de
            // baixo consumo bloqueia até vídeo mudo.
            onAutoplayBlocked: () => {
              if (descartado) return
              cancelarPrazoAutoplay()
              setEstado('bloqueado')
            },
          },
        } as YT.PlayerOptions)
        playerRef.current = player
        armarPrazo()
      })
      .catch(() => {
        if (!descartado) setEstado('indisponivel')
      })

    return () => {
      descartado = true
      cancelAnimationFrame(raf)
      cancelarPrazoAutoplay()
      try {
        playerRef.current?.destroy()
      } catch {
        /* destroy antes do onReady */
      }
      playerRef.current = null
      container.replaceChildren()
      // Sem player não há estado de player. Sem esta varredura o hook continua
      // dizendo 'tocando'/'bloqueado'/'erro' com o iframe já destruído — e o
      // overlay de destrave sobrevive como um botão morto por cima da prancha
      // durante a animação de saída do sheet. É também aqui que o código de
      // erro do vídeo ANTERIOR morre: o cleanup roda antes do efeito novo, e
      // sem isso a tarja do vídeo novo exibiria o diagnóstico do vídeo velho.
      setEstado('ocioso')
      setCodigoErro(null)
      setProgresso(null)
      // Sem player não há estado de player. Sem esta varredura o hook continua
      // dizendo 'tocando'/'bloqueado'/'erro' com o iframe já destruído — e o
      // overlay de destrave sobrevive como um botão morto por cima da prancha
      // durante a animação de saída do sheet. É também aqui que o código de
      // erro do vídeo ANTERIOR morre: o cleanup roda antes do efeito novo, e
      // sem isso a tarja do vídeo novo exibiria o diagnóstico do vídeo velho.
    }
  }, [video, inicio, fim, ativo])

  return { ref, estado, codigoErro, progresso, tocar }
}

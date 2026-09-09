import { useState } from 'react'
import { motion } from 'motion/react'
import { type EstadoClipe, useYouTubeClip } from '@/hooks/useYouTubeClip'
import { cn } from '@/lib/utils'
import { mmss, urlYouTube } from '@/lib/formato'
import { BarraTrecho } from './BarraTrecho'

/**
 * A prancha de figura: moldura de filete único sobre --plate, barra do trecho e
 * legenda numerada. A figura de um protocolo impresso que por acaso se move.
 *
 * Facade: nada do YouTube é carregado até o primeiro toque — pôster próprio
 * primeiro, iframe depois. O `aspect-video` reserva a caixa no primeiro paint,
 * antes do script e antes do iframe, então o CLS é zero mesmo dentro do sheet.
 */

type Props = {
  numero: string
  nome: string
  video: string
  duracao: number
  inicio?: number
  fim?: number
  /**
   * Quando falso, o player é destruído mesmo que o usuário já tenha tocado.
   * É assim que o sheet mata o iframe ANTES da animação de saída, em vez de
   * esperar o desmonte: `habilitado={aberto}`.
   */
  habilitado?: boolean
}

const MENSAGENS: Record<number, string> = {
  100: 'Este vídeo foi removido ou está privado.',
  101: 'O dono deste vídeo não permite que ele seja incorporado.',
  150: 'O dono deste vídeo não permite que ele seja incorporado.',
  153: 'Este vídeo não pode ser incorporado a partir de um arquivo local.',
}

/**
 * Quem aciona "Ver execução" com leitor de tela perde o botão do DOM e depois
 * disso a caixa muda de estado em silêncio absoluto. Estes são os avisos que a
 * região viva abaixo publica — curtos, porque são interrupções.
 */
const AVISOS: Partial<Record<EstadoClipe, string>> = {
  carregando: 'Carregando o clipe.',
  bloqueado: 'Clipe pronto. Toque para tocar.',
  tocando: 'Clipe tocando em loop.',
  erro: 'Não foi possível carregar o vídeo aqui.',
  indisponivel: 'Não foi possível carregar o vídeo aqui.',
}

export function PranchaFigura({
  numero,
  nome,
  video,
  duracao,
  inicio,
  fim,
  habilitado = true,
}: Props) {
  const [pedido, setPedido] = useState(false)
  const ativo = pedido && habilitado
  const { ref, estado, codigoErro, progresso, tocar } = useYouTubeClip({
    video,
    inicio,
    fim,
    ativo,
  })

  const temRecorte = inicio != null && fim != null
  const falhou = estado === 'erro' || estado === 'indisponivel'
  // O pôster só sai no PLAYING, nunca no onReady: o onReady dispara antes do
  // primeiro frame e a troca mostraria um retângulo preto no meio.
  const posterVisivel = !ativo || estado !== 'tocando'
  const carregando = ativo && (estado === 'ocioso' || estado === 'carregando')

  return (
    <figure className="m-0">
      {/* A região viva existe desde o primeiro render, antes de qualquer troca
          de estado: live region criada junto com o texto novo não anuncia. */}
      <span role="status" aria-live="polite" className="sr-only">
        {ativo ? (AVISOS[estado] ?? '') : ''}
      </span>

      <div className="relative aspect-video w-full overflow-hidden border border-fio bg-plate">
        {/* Container exclusivo do player: o hook faz replaceChildren aqui, então
            este nó não pode ter nenhum filho do React. */}
        <div
          ref={ref}
          className="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0"
        />

        <div
          data-testid="poster"
          data-estado={posterVisivel ? 'visivel' : 'oculto'}
          aria-hidden={!posterVisivel}
          className={cn(
            'absolute inset-0 bg-papel-2 bg-cover bg-center transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
            posterVisivel ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          style={{ backgroundImage: `url(https://i.ytimg.com/vi/${video}/hqdefault.jpg)` }}
        >
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/45 to-transparent" />

          {!ativo && (
            <motion.button
              type="button"
              onClick={() => setPedido(true)}
              whileTap="pressionado"
              className="absolute inset-0 grid place-items-center"
            >
              <motion.span
                variants={{ pressionado: { scale: 0.97 } }}
                transition={{ type: 'spring', visualDuration: 0.25, bounce: 0 }}
                className="inline-flex items-center gap-2.5 bg-tinta px-4 py-2.5 font-mono text-[13px] font-medium tracking-[0.02em] text-papel"
              >
                <svg width="9" height="11" viewBox="0 0 9 11" aria-hidden="true">
                  <path d="M0 0 L9 5.5 L0 11 Z" fill="currentColor" />
                </svg>
                Ver execução
              </motion.span>
            </motion.button>
          )}

          {carregando && (
            <span className="absolute inset-x-0 bottom-3 text-center font-mono text-[12px] text-papel/90">
              carregando…
            </span>
          )}
        </div>

        {estado === 'bloqueado' && (
          <button
            type="button"
            onClick={tocar}
            className="absolute inset-0 grid place-items-center bg-black/50"
          >
            <span className="bg-papel px-4 py-2.5 font-mono text-[13px] font-medium tracking-[0.02em] text-tinta">
              Toque para tocar
            </span>
          </button>
        )}

        {falhou && (
          <div className="absolute inset-0 grid place-items-center bg-papel-2 px-6 text-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-tinta-2">
                Vídeo indisponível aqui
              </p>
              <p className="mx-auto mt-2 max-w-[36ch] text-[15px] leading-[1.4] text-tinta">
                {(codigoErro != null && MENSAGENS[codigoErro]) ||
                  'Não foi possível carregar o vídeo aqui.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {temRecorte && (
        <BarraTrecho
          duracao={duracao}
          inicio={inicio}
          fim={fim}
          // Só existe playhead enquanto há vídeo andando: parado na régua ele
          // viraria uma marca a mais, e a barra deixaria de dizer "em loop".
          progresso={estado === 'tocando' ? (progresso ?? undefined) : undefined}
        />
      )}

      <figcaption className="mt-2 font-mono text-[13px] leading-[1.35] tracking-[-0.003em] tabular-nums text-tinta-2">
        Fig. {numero} — {nome}
        {temRecorte && (
          <>
            {' · '}
            {mmss(inicio)}–{mmss(fim)}
            {' · em loop'}
          </>
        )}
        {' · '}
        {/* inline-block + py: dentro da frase o link media 17px de altura de
            alvo, metade do mínimo de 24px da WCAG 2.5.8. */}
        <a
          className="inline-block py-1 text-carimbo underline underline-offset-2"
          href={urlYouTube(video, inicio)}
          target="_blank"
          rel="noopener"
        >
          Abrir no YouTube
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </figcaption>
    </figure>
  )
}

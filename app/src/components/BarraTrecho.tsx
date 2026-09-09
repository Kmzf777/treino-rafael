import { mmss } from '@/lib/formato'

/**
 * A assinatura visual do app.
 *
 * Uma régua fina que representa a duração INTEIRA do vídeo original, com a
 * janela curada acesa em --carimbo. Em uma linha, sem texto, ela mostra o
 * produto: 139 minutos de vídeo bruto reduzidos a 11 minutos úteis.
 *
 * Renderiza instantaneamente — a duração real dos 47 vídeos já está em
 * src/data/duracoes.ts, então nada aqui depende de getDuration() nem espera
 * player algum.
 */

type Props = {
  duracao: number
  inicio: number
  fim: number
  /** 0..1 dentro da janela. Só existe quando há player tocando. */
  progresso?: number
  className?: string
}

export function BarraTrecho({ duracao, inicio, fim, progresso, className }: Props) {
  const pct = (v: number) => (duracao > 0 ? (v / duracao) * 100 : 0)
  const esquerda = pct(inicio)
  const largura = Math.max(0, pct(fim) - esquerda)

  return (
    <div
      role="img"
      aria-label={`Trecho de ${mmss(inicio)} a ${mmss(fim)} dentro de um vídeo de ${mmss(duracao)}`}
      className={`relative mt-2 h-[3px] w-full bg-fio ${className ?? ''}`}
    >
      <div
        data-testid="janela"
        className="absolute inset-y-0 bg-carimbo"
        // minWidth: em vídeos longos a janela vale ~1% da régua. Sem o piso de
        // 3px a assinatura sumiria justamente nos casos em que ela diz mais.
        style={{
          left: `${esquerda}%`,
          width: `${largura}%`,
          minWidth: largura > 0 ? '3px' : undefined,
        }}
      />

      {/* Marcas de calibre: prolongam a janela 4px para cima e para baixo, como
          a cota de um desenho técnico. É o que torna legível um trecho de 1%. */}
      {largura > 0 && (
        <>
          <span
            aria-hidden="true"
            className="absolute -top-1 -bottom-1 w-px bg-carimbo"
            style={{ left: `${esquerda}%` }}
          />
          <span
            aria-hidden="true"
            className="absolute -top-1 -bottom-1 w-px bg-carimbo"
            style={{ left: `${Math.min(esquerda + largura, 100)}%` }}
          />
        </>
      )}

      {progresso != null && largura > 0 && (
        <div
          data-testid="playhead"
          className="absolute -top-0.5 -bottom-0.5 w-[2px] bg-tinta"
          style={{ left: `${esquerda + largura * progresso}%` }}
        />
      )}
    </div>
  )
}

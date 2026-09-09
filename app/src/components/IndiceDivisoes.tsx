import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { DIVISOES } from '@/data'

type Props = { atual: string; onIr: (chave: string) => void }

/**
 * Faixa numerada sticky: `01 AQUECER · 02 FORÇA A · …`. Rola na horizontal no
 * mobile, vira coluna à esquerda no desktop.
 *
 * A divisão ativa é marcada por um filete de 2px em `--carimbo` sob o número —
 * nunca por pílula preenchida, que é o visual de app genérico. O filete desliza
 * de um item para o outro com `layoutId`.
 */
export function IndiceDivisoes({ atual, onIr }: Props) {
  const reduzir = useReducedMotion()
  const navRef = useRef<HTMLElement | null>(null)
  const ativaRef = useRef<HTMLButtonElement | null>(null)

  // Ao chegar por deep link ou pela busca ⌘K, a divisão ativa pode estar fora
  // da faixa rolada. Só mexemos no scroll quando a faixa de fato transborda.
  useEffect(() => {
    const nav = navRef.current
    const botao = ativaRef.current
    if (!nav || !botao) return
    if (nav.scrollWidth <= nav.clientWidth) return
    if (typeof botao.scrollIntoView !== 'function') return
    botao.scrollIntoView({
      behavior: reduzir ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [atual, reduzir])

  return (
    <nav
      ref={navRef}
      aria-label="Divisões do plano"
      className="sticky top-0 z-30 -mx-4 flex gap-5 overflow-x-auto border-b border-fio bg-papel px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-col sm:items-start sm:gap-2 sm:overflow-visible sm:border-r sm:border-b-0 sm:px-0 sm:py-2 sm:pr-5"
    >
      {DIVISOES.map((divisao) => {
        const ativa = divisao.chave === atual
        return (
          <button
            key={divisao.chave}
            ref={ativa ? ativaRef : undefined}
            type="button"
            onClick={() => onIr(divisao.chave)}
            aria-current={ativa ? 'page' : undefined}
            className="relative flex min-h-[44px] flex-none items-center gap-1.5 whitespace-nowrap text-left"
          >
            <span
              className={`font-mono text-[12px] font-medium tabular-nums transition-colors duration-150 ${
                ativa ? 'text-carimbo' : 'text-tinta-2'
              }`}
            >
              {divisao.numero}
            </span>
            <span
              className={`font-mono text-[12px] font-medium uppercase tracking-[0.04em] transition-colors duration-150 ${
                ativa ? 'text-tinta' : 'text-tinta-2'
              }`}
            >
              {divisao.rotulo}
            </span>

            {ativa && (
              <motion.span
                layoutId="indice-ativo"
                transition={
                  reduzir ? { duration: 0 } : { type: 'spring', visualDuration: 0.35, bounce: 0.1 }
                }
                className="absolute inset-x-0 bottom-0 h-[2px] bg-carimbo"
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}

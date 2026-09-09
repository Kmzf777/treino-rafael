import { motion, useReducedMotion } from 'motion/react'
import type { ExercicioResolvido } from '@/data'
import { mmss } from '@/lib/formato'

type Props = { exercicio: ExercicioResolvido; onAbrir: (id: string) => void }

/**
 * Uma linha do protocolo. Sem chevron, sem checkbox, sem ícone: a linha inteira
 * é o alvo de toque. O número vive num gutter fixo de 44px, o nome domina o
 * meio e a prescrição fica à direita, em mono, para o olho descer pela coluna.
 */
export function LinhaExercicio({ exercicio, onAbrir }: Props) {
  const reduzir = useReducedMotion()
  const recorte = exercicio.recorte

  return (
    <motion.button
      type="button"
      whileTap={reduzir ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', visualDuration: 0.25, bounce: 0 }}
      onClick={() => onAbrir(exercicio.id)}
      className="grid min-h-[44px] w-full grid-cols-[44px_minmax(0,1fr)_auto] items-baseline border-b border-fio py-3 text-left transition-colors duration-150 hover:bg-papel-2/60"
    >
      <span className="font-mono text-[13px] font-medium leading-none tabular-nums text-carimbo">
        {exercicio.numero}
      </span>

      <span className="text-[17px] font-semibold leading-[1.294] tracking-[-0.013em] text-tinta">
        {exercicio.nome}
      </span>

      {/* 20ch = 20 caracteres de mono. O afastamento é `ml-4`, não `pl-4`:
          com o box-border do preflight, padding entra no max-width e roubaria
          dois caracteres, quebrando "3x20-40s cada lado" sem necessidade.
          Assim as três prescrições longas do plano caem em duas linhas limpas
          e todas as outras cabem em uma. */}
      <span className="ml-4 max-w-[20ch] text-right font-mono text-[15px] font-medium leading-[1.333] tracking-[-0.009em] text-balance tabular-nums text-tinta-2">
        {exercicio.prescricao}
      </span>

      {/* Segunda faixa da linha, sob o nome E sob a prescrição: assim os
          metadados nunca são espremidos pela largura da prescrição.
          Cada dado em seu próprio elemento e o separador é o filete de 1px —
          não um "·" de texto, que vazaria para o leitor de tela. */}
      <span className="col-span-2 col-start-2 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[13px] leading-[1.385] tracking-[-0.003em] tabular-nums text-tinta-2">
        <span>{recorte ? `${mmss(recorte.fim - recorte.inicio)} de clipe` : 'sem clipe'}</span>
        {exercicio.unilateral && (
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-[10px] w-px flex-none bg-fio" />
            <span>unilateral</span>
          </span>
        )}
      </span>
    </motion.button>
  )
}

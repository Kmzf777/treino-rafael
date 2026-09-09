import type { ReactNode } from 'react'
import { ESTATISTICAS } from '@/data'
import { type Tema, useTema } from '@/hooks/usePreferencias'
import { mmss } from '@/lib/formato'

/**
 * A moldura do documento: cabeçalho (masthead), conteúdo e colofão.
 *
 * O cabeçalho NÃO é sticky de propósito — quem gruda no topo é a faixa de
 * divisões (IndiceDivisoes). Dois elementos disputando `top: 0` fariam a faixa
 * cobrir o título ou sobrar um degrau de 1px entre os dois filetes.
 */

type Props = { children: ReactNode; onAbrirBusca: () => void }

/** Ciclo completo: com um toque nenhum dos três estados fica inalcançável. */
const PROXIMO: Record<Tema, Tema> = { auto: 'claro', claro: 'escuro', escuro: 'auto' }
const NOME: Record<Tema, string> = { auto: 'automático', claro: 'claro', escuro: 'escuro' }

const UTILITARIO =
  'flex min-h-11 items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-2 transition-colors duration-150 hover:text-tinta'

/**
 * ⌘K no Mac, Ctrl K no resto. Só aparece a partir de 640px — abaixo disso não
 * há teclado e a dica seria ruído. Lido uma vez, no carregamento do módulo.
 */
const ATALHO =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
    ? '⌘K'
    : 'Ctrl K'

/** Separador do colofão: o filete de 1px, nunca um "·" que vaza para o leitor. */
function Fio() {
  return <span aria-hidden="true" className="h-[10px] w-px flex-none bg-fio" />
}

export function AppShell({ children, onAbrirBusca }: Props) {
  const [tema, setTema] = useTema()

  return (
    <div className="mx-auto min-h-dvh max-w-[672px] px-4 pt-[env(safe-area-inset-top)] min-[430px]:px-5 sm:max-w-[972px]">
      <header className="pt-2 pb-5">
        <div className="flex items-center justify-end gap-5">
          <button
            type="button"
            onClick={onAbrirBusca}
            aria-label="Buscar exercício"
            className={UTILITARIO}
          >
            Buscar
            <span aria-hidden="true" className="hidden opacity-60 sm:inline">
              {ATALHO}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTema(PROXIMO[tema])}
            aria-label={`Tema ${NOME[tema]} — trocar para ${NOME[PROXIMO[tema]]}`}
            className={UTILITARIO}
          >
            Tema
            <span className="text-tinta">{tema}</span>
          </button>
        </div>

        {/* Filete que corre do fim do título até a margem: o único ornamento do
            cabeçalho, e o mesmo dispositivo de 1px do resto do app. */}
        <div className="mt-1 flex items-center gap-4">
          <h1 className="font-display text-[26px] leading-[1.2] font-medium tracking-[-0.021em] text-tinta sm:text-[28px]">
            Protocolo de treino
          </h1>
          <span aria-hidden="true" className="h-px min-w-6 flex-1 bg-fio" />
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-14 border-t border-fio pt-5 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[13px] leading-[1.385] tabular-nums text-tinta-2">
          <span>{ESTATISTICAS.totalExercicios} exercícios</span>
          <Fio />
          <span>{ESTATISTICAS.totalClipes} clipes</span>
          <Fio />
          <span>
            {mmss(ESTATISTICAS.totalUtil)} úteis de {mmss(ESTATISTICAS.totalBruto)} brutos
          </span>
        </p>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.47] text-tinta-2">
          Orientação geral de treino. Não substitui avaliação de fisioterapeuta ou médico.
        </p>
      </footer>
    </div>
  )
}

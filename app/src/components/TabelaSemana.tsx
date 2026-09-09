import { motion } from 'motion/react'
import { REGRA_DE_OURO, SEMANA_3, SEMANA_4 } from '@/data/semana'
import { usePreferencia } from '@/hooks/usePreferencias'
import { NotaLateral } from './SecaoEditorial'

const MODOS = ['4', '3'] as const
type Modo = (typeof MODOS)[number]

const PRESS = { type: 'spring', visualDuration: 0.25, bounce: 0 } as const
const ABA = { type: 'spring', visualDuration: 0.35, bounce: 0.1 } as const

const CABECALHO =
  'border-b border-fio pb-2 text-left font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-tinta-2'

export function TabelaSemana() {
  const [modo, setModo] = usePreferencia<Modo>('treino.modo', '4', MODOS)
  const linhas = modo === '4' ? SEMANA_4 : SEMANA_3

  return (
    <section className="border-t border-fio pt-5">
      <div className="flex flex-wrap items-center justify-between gap-x-4">
        <h3 className="font-display text-[20px] font-medium leading-[1.25] tracking-[-0.017em] text-tinta">
          A semana
        </h3>

        <div role="group" aria-label="Dias de academia por semana" className="flex items-center">
          {MODOS.map((opcao) => {
            const ativo = modo === opcao
            return (
              <motion.button
                key={opcao}
                type="button"
                onClick={() => setModo(opcao)}
                aria-pressed={ativo}
                whileTap={{ scale: 0.97 }}
                transition={PRESS}
                className={`relative flex min-h-11 items-center px-2 font-mono text-[12px] font-medium uppercase tracking-[0.04em] ${
                  ativo ? 'text-tinta' : 'text-tinta-2'
                }`}
              >
                {opcao} dias
                {ativo && (
                  <motion.span
                    layoutId="modo-semana-ativo"
                    transition={ABA}
                    className="absolute inset-x-2 bottom-[9px] h-[2px] bg-carimbo"
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      <table className="mt-3 w-full border-collapse">
        <caption className="sr-only">Semana de treino em {modo} dias de academia</caption>
        <thead>
          <tr>
            <th scope="col" className={`w-[92px] pr-3 ${CABECALHO}`}>
              Dia
            </th>
            <th scope="col" className={CABECALHO}>
              Sessão
            </th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr key={linha.dia}>
              <td className="border-b border-fio py-3 pr-3 align-baseline font-mono text-[13px] text-tinta-2">
                {linha.dia}
              </td>
              <td
                className={`border-b border-fio py-3 align-baseline text-[17px] leading-[1.47] ${
                  linha.descanso ? 'text-tinta-2' : 'text-tinta'
                }`}
              >
                {linha.sessao}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <NotaLateral rotulo="Regra de ouro" texto={REGRA_DE_OURO} />
    </section>
  )
}

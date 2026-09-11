import { DIVISOES } from '@/data'
import {
  CICLO,
  DIAS_DE_FORCA,
  DIAS_FIXOS,
  REGRA_DE_CARGA,
  REGRA_DE_OURO,
  REGRA_DE_PANTURRILHA,
} from '@/data/semana'
import { NotaLateral } from './SecaoEditorial'

const CABECALHO =
  'border-b border-fio pb-2 text-left font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-tinta-2'

const DIA = 'border-b border-fio py-3 pr-3 text-left align-baseline font-mono text-[13px] font-normal text-tinta-2'

const ROTULOS = new Map(DIVISOES.map((d) => [d.chave, d.rotulo]))

// A carga de cada posição vem do próprio ciclo, não de uma lista paralela que
// poderia sair de sincronia com `semana.ts`.
const CARGAS = CICLO[0].sessoes.map((s) => s.carga)

export function TabelaSemana() {
  return (
    <section className="border-t border-fio pt-5">
      <h3 className="font-display text-[20px] font-medium leading-[1.25] tracking-[-0.017em] text-tinta">
        O ciclo
      </h3>

      <p className="mt-2 max-w-[60ch] text-[17px] leading-[1.47] text-tinta-2">
        Quatro treinos numa fila que não reinicia no domingo. O treino de segunda é o
        próximo da fila, não “o treino de segunda”. A fila fecha em quatro semanas.
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse">
          <caption className="sr-only">Ciclo de quatro semanas de treino de força</caption>
          <thead>
            <tr>
              <th scope="col" className={`w-[92px] pr-3 ${CABECALHO}`}>
                <span className="sr-only">Semana</span>
              </th>
              {DIAS_DE_FORCA.map((dia, i) => (
                <th key={dia} scope="col" className={`pr-3 ${CABECALHO}`}>
                  {dia}
                  <span className="ml-1 normal-case">({CARGAS[i]})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CICLO.map((semana) => (
              <tr key={semana.numero}>
                <th scope="row" className={DIA}>
                  Semana {semana.numero}
                </th>
                {semana.sessoes.map((sessao) => (
                  <td
                    key={sessao.divisao}
                    className="border-b border-fio py-3 pr-3 align-baseline text-[17px] leading-[1.47] text-tinta"
                  >
                    {ROTULOS.get(sessao.divisao)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <table className="mt-5 w-full border-collapse">
        <caption className="sr-only">Os dias que não mudam de semana para semana</caption>
        <tbody>
          {DIAS_FIXOS.map((linha) => (
            <tr key={linha.dia}>
              <th scope="row" className={`w-[92px] ${DIA}`}>
                {linha.dia}
              </th>
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
      <NotaLateral rotulo="A carga" texto={REGRA_DE_CARGA} />
      <NotaLateral rotulo="Panturrilha" texto={REGRA_DE_PANTURRILHA} />
    </section>
  )
}

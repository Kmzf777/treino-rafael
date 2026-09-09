import { CORRIDA } from '@/data/editorial'
import { urlBusca } from '@/lib/formato'
import { ListaDefinicoes, SecaoEditorial } from './SecaoEditorial'
import { TabelaSemana } from './TabelaSemana'

const LEITURAS = [
  ...CORRIDA.links,
  { rotulo: 'Vídeos de técnica de corrida', url: urlBusca(CORRIDA.buscaTecnica) },
]

const dominio = (url: string) => new URL(url).host.replace(/^www\./, '')

export function PainelCorrida() {
  return (
    <div>
      <TabelaSemana />

      <SecaoEditorial titulo={CORRIDA.retomando.titulo} lede={CORRIDA.retomando.lede}>
        <table className="mt-4 w-full border-collapse">
          <thead>
            <tr>
              <th
                scope="col"
                className="w-[92px] border-b border-fio pb-2 pr-3 text-left font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-tinta-2"
              >
                Semana
              </th>
              <th
                scope="col"
                className="border-b border-fio pb-2 text-left font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-tinta-2"
              >
                Sessão
              </th>
            </tr>
          </thead>
          <tbody>
            {CORRIDA.retomando.semanas.map((semana) => (
              // A semana de descarga recebe a lavagem recessada em vez de cor:
              // é a mesma ideia de "menos" que o texto dela já diz.
              <tr key={semana.semana} className={semana.leve ? 'bg-papel-2' : undefined}>
                <td className="border-b border-fio py-3 pr-3 align-baseline font-mono text-[13px] text-tinta-2">
                  {String(semana.semana).padStart(2, '0')}
                </td>
                <td className="border-b border-fio py-3 align-baseline text-[17px] leading-[1.47] text-tinta">
                  {semana.sessao}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SecaoEditorial>

      <SecaoEditorial titulo={CORRIDA.jaCorre.titulo} lede={CORRIDA.jaCorre.lede}>
        <ListaDefinicoes cards={CORRIDA.jaCorre.cards} />
      </SecaoEditorial>

      <SecaoEditorial titulo={CORRIDA.cuidados.titulo}>
        <ListaDefinicoes cards={CORRIDA.cuidados.cards} />
      </SecaoEditorial>

      <SecaoEditorial titulo="Para ir além">
        <ul className="mt-4">
          {LEITURAS.map((leitura) => (
            <li key={leitura.url}>
              <a
                href={leitura.url}
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-2 flex min-h-11 items-baseline justify-between gap-4 border-b border-fio px-2 py-3.5 text-[17px] leading-[1.47] text-tinta hover:bg-papel-2"
              >
                <span>{leitura.rotulo}</span>
                <span className="flex-none font-mono text-[13px] text-tinta-2">
                  {dominio(leitura.url)} ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </SecaoEditorial>
    </div>
  )
}

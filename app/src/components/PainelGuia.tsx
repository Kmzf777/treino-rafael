import { GUIA } from '@/data/editorial'
import { ListaDefinicoes, NotaLateral, SecaoEditorial } from './SecaoEditorial'
import { TabelaSemana } from './TabelaSemana'

export function PainelGuia() {
  return (
    <div>
      <TabelaSemana />

      {GUIA.map((secao, indice) => {
        const chave = `${secao.tipo}-${indice}`

        switch (secao.tipo) {
          case 'alerta':
            return <NotaLateral key={chave} rotulo={secao.titulo} texto={secao.texto} aviso />

          case 'nota':
            return <NotaLateral key={chave} rotulo="Nota" texto={secao.texto} />

          case 'cards':
            return (
              <SecaoEditorial key={chave} titulo={secao.titulo}>
                <ListaDefinicoes cards={secao.cards} />
              </SecaoEditorial>
            )

          case 'texto':
            return (
              <SecaoEditorial key={chave} titulo={secao.titulo}>
                <p className="mt-2 max-w-[60ch] text-[17px] leading-[1.47] text-tinta">
                  {secao.texto}
                </p>
              </SecaoEditorial>
            )
        }
      })}
    </div>
  )
}

import type { DivisaoResolvida } from '@/data'
import { LinhaExercicio } from './LinhaExercicio'

type Props = { divisao: DivisaoResolvida; onAbrir: (id: string) => void }

/**
 * Folha corrida, sem cards. Cada bloco é uma seção com faixa em `--papel-2` e
 * régua de 2px; abaixo dela, as linhas separadas apenas pelo filete de 1px.
 *
 * Divisões com `custom` ('corrida', 'guia') chegam aqui com `blocos: []` e
 * simplesmente não renderizam nada — quem escolhe o painel certo é o App.
 */
export function ListaExercicios({ divisao, onAbrir }: Props) {
  return (
    <div>
      {divisao.blocos.map((bloco, indice) => {
        const idTitulo = `bloco-${divisao.chave}-${indice}`
        return (
          <section key={idTitulo} aria-labelledby={idTitulo} className="mt-8 first:mt-0">
            {/* Sem padding horizontal de propósito: o rótulo do bloco cai na
                mesma régua de x=0 dos números de protocolo das linhas. */}
            <div className="border-b-2 border-carimbo bg-papel-2 py-2">
              <h3
                id={idTitulo}
                className="font-mono text-[12px] font-medium uppercase leading-[1.333] tracking-[0.04em] text-tinta"
              >
                {bloco.nome}
              </h3>
              <p className="font-mono text-[12px] leading-[1.333] text-tinta-2">{bloco.sub}</p>
            </div>

            {/* role="list" porque o preflight do Tailwind zera list-style, e sem
                ele o VoiceOver deixa de anunciar "lista, N itens". */}
            <ul role="list">
              {bloco.exercicios.map((exercicio) => (
                <li key={exercicio.id}>
                  <LinhaExercicio exercicio={exercicio} onAbrir={onAbrir} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

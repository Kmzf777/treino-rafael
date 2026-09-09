import type { ReactNode } from 'react'
import type { Card } from '@/data/editorial'

/**
 * Peças de composição das divisões editoriais (Corrida e Guia).
 * Direção "Protocolo": sem cards, sem sombra, sem caixa. Uma seção começa com
 * um filete de régua e um título; listas são listas de definição separadas por
 * filete; avisos são um filete vertical com rótulo em mono.
 */

export function SecaoEditorial({
  titulo,
  lede,
  children,
}: {
  titulo: string
  lede?: string
  children?: ReactNode
}) {
  return (
    <section className="mt-8 border-t border-fio pt-5">
      <h3 className="font-display text-[20px] font-medium leading-[1.25] tracking-[-0.017em] text-tinta">
        {titulo}
      </h3>
      {lede && (
        <p className="mt-2 max-w-[60ch] text-[17px] leading-[1.47] text-tinta-2">{lede}</p>
      )}
      {children}
    </section>
  )
}

export function ListaDefinicoes({ cards }: { cards: readonly Card[] }) {
  return (
    <dl className="mt-4">
      {cards.map((card) => (
        <div key={card.titulo} className="border-b border-fio py-3.5">
          <dt className="text-[17px] font-semibold leading-[1.294] tracking-[-0.013em] text-tinta">
            {card.titulo}
          </dt>
          <dd className="mt-1 max-w-[60ch] text-[17px] leading-[1.47] text-tinta-2">
            {card.texto}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Nota de margem. `aviso` reserva o --tijolo para o que é risco articular de
 * verdade; o resto do app usa --fio.
 */
export function NotaLateral({
  rotulo,
  texto,
  aviso = false,
}: {
  rotulo: string
  texto: string
  aviso?: boolean
}) {
  return (
    <aside className={`mt-10 max-w-[60ch] border-l-2 pl-4 ${aviso ? 'border-tijolo' : 'border-fio'}`}>
      <p
        className={`font-mono text-[12px] font-medium uppercase tracking-[0.04em] ${
          aviso ? 'text-tijolo' : 'text-tinta-2'
        }`}
      >
        {rotulo}
      </p>
      <p
        className={`mt-1.5 leading-[1.47] ${aviso ? 'text-[17px] text-tinta' : 'text-[15px] text-tinta-2'}`}
      >
        {texto}
      </p>
    </aside>
  )
}

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { Busca } from './components/Busca'
import { IndiceDivisoes } from './components/IndiceDivisoes'
import { ListaExercicios } from './components/ListaExercicios'
import { PainelCorrida } from './components/PainelCorrida'
import { PainelGuia } from './components/PainelGuia'
import { NotaLateral } from './components/SecaoEditorial'
import { SheetExercicio } from './components/SheetExercicio'
import { TabelaSemana } from './components/TabelaSemana'
import { buscarDivisao, buscarExercicio, DIVISOES } from './data'
import { mmss } from './lib/formato'
import { irPara, useRota } from './lib/rota'

/** Bezier na opacidade, nunca spring: mola em opacidade pulsa o brilho. */
const TROCA = { duration: 0.15, ease: 'easeOut' } as const

export default function App() {
  // `useRota` devolve um objeto novo a cada render — só as strings servem de
  // dependência.
  const { divisao: chave, exercicio: idExercicio } = useRota()
  const [buscaAberta, setBuscaAberta] = useState(false)
  const reduzir = useReducedMotion()

  // `lerRota` já garante uma chave válida; o fallback existe para o dia em que
  // alguém renomear uma divisão e esquecer do CHAVES_DIVISAO do rota.ts.
  const divisao = buscarDivisao(chave) ?? DIVISOES[0]
  const exercicio = idExercicio ? buscarExercicio(idExercicio) : undefined

  // O sheet continua montado com o último exercício depois que a rota o
  // esquece: sem isso o conteúdo some no primeiro quadro e a animação de saída
  // de 280ms roda numa caixa vazia.
  const [ultimo, setUltimo] = useState(exercicio)
  if (exercicio && exercicio !== ultimo) setUltimo(exercicio)

  useEffect(() => {
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'k' && (evento.metaKey || evento.ctrlKey)) {
        // Sem o preventDefault o Chrome rouba o atalho para a busca dele.
        evento.preventDefault()
        setBuscaAberta((v) => !v)
      }
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [])

  // Trocar de divisão volta ao topo: a faixa é sticky, então sem isso você cai
  // no meio da divisão nova, na altura em que estava lendo a anterior.
  // O `scrollY > 0` evita chamar o que o jsdom não implementa.
  useEffect(() => {
    if (window.scrollY > 0) window.scrollTo({ top: 0 })
  }, [chave])

  return (
    <AppShell onAbrirBusca={() => setBuscaAberta(true)}>
      {/* `items-start` não é enfeite: sem ele o grid estica a coluna do índice
          até a altura do conteúdo, e um item esticado não gruda — o `sticky
          top-0` do IndiceDivisoes só volta a valer com o alinhamento no topo. */}
      <div className="sm:grid sm:grid-cols-[180px_1fr] sm:items-start sm:gap-8">
        <IndiceDivisoes atual={divisao.chave} onIr={(destino) => irPara(destino)} />

        {/* A `key` remonta o conteúdo a cada divisão, e o fade de 150ms cobre a
            troca. Sem animação de saída de propósito: esperar o fade da divisão
            velha atrasaria a nova em 150ms de nada. */}
        <motion.div
          key={divisao.chave}
          initial={reduzir ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={TROCA}
          className="pt-6 sm:pt-2"
        >
          <p className="font-mono text-[13px] font-medium tracking-[0.08em] tabular-nums text-carimbo">
            {divisao.numero}
          </p>
          <h2 className="mt-1.5 font-display text-[28px] leading-[1.2] font-medium tracking-[-0.021em] text-tinta sm:text-[30px]">
            {divisao.titulo}
          </h2>

          {divisao.lede && (
            <p className="mt-2.5 max-w-[60ch] text-[17px] leading-[1.47] text-tinta-2">
              {divisao.lede}
            </p>
          )}

          {divisao.totalExercicios > 0 && (
            <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[13px] tabular-nums text-tinta-2">
              <span>{divisao.totalExercicios} exercícios</span>
              <span aria-hidden="true" className="h-[10px] w-px flex-none bg-fio" />
              <span>{divisao.totalClipes} clipes</span>
              <span aria-hidden="true" className="h-[10px] w-px flex-none bg-fio" />
              <span>
                {mmss(divisao.utilSegundos)} de {mmss(divisao.brutoSegundos)}
              </span>
            </p>
          )}

          <div className="mt-8">
            {divisao.custom === 'corrida' ? (
              <PainelCorrida />
            ) : divisao.custom === 'guia' ? (
              <PainelGuia />
            ) : (
              <>
                {/* Mesma regra do legado: a semana acompanha toda divisão de
                    treino, menos o aquecimento. */}
                {divisao.chave !== 'aquecer' && (
                  <div className="mb-10">
                    <TabelaSemana />
                  </div>
                )}
                <ListaExercicios divisao={divisao} onAbrir={(id) => irPara(divisao.chave, id)} />
              </>
            )}
          </div>

          {divisao.avisoFinal && (
            <NotaLateral
              rotulo={divisao.avisoFinal.titulo}
              texto={divisao.avisoFinal.texto}
              aviso
            />
          )}
        </motion.div>
      </div>

      {ultimo && (
        <SheetExercicio
          exercicio={ultimo}
          aberto={exercicio != null}
          onFechar={() => irPara(chave)}
        />
      )}

      <Busca
        aberta={buscaAberta}
        onFechar={() => setBuscaAberta(false)}
        onEscolher={(escolhido) => {
          setBuscaAberta(false)
          irPara(escolhido.divisao, escolhido.id)
        }}
      />
    </AppShell>
  )
}

import { DURACOES } from './duracoes'
import { METADADOS } from './metadados'
import { PLANO } from './plano'
import type { Bloco, Divisao, Exercicio, Metadados } from './tipos'

export type ExercicioResolvido = Exercicio & {
  numero: string
  divisao: string
  meta: Metadados
  duracaoVideo: number
}

export type BlocoResolvido = Omit<Bloco, 'exercicios'> & { exercicios: ExercicioResolvido[] }

export type DivisaoResolvida = Omit<Divisao, 'blocos'> & {
  numero: string
  blocos: BlocoResolvido[]
  totalExercicios: number
  totalClipes: number
  utilSegundos: number
  brutoSegundos: number
}

export const DIVISOES: DivisaoResolvida[] = PLANO.map((divisao, indice) => {
  let posicao = 0
  const blocos = divisao.blocos.map((bloco) => ({
    ...bloco,
    exercicios: bloco.exercicios.map((exercicio) => {
      posicao += 1
      return {
        ...exercicio,
        numero: `${indice + 1}.${posicao}`,
        divisao: divisao.chave,
        meta: METADADOS[exercicio.id],
        duracaoVideo: DURACOES[exercicio.video] ?? 0,
      }
    }),
  }))

  const exercicios = blocos.flatMap((bloco) => bloco.exercicios)
  const videosUnicos = [...new Set(exercicios.map((e) => e.video))]

  return {
    ...divisao,
    numero: String(indice + 1).padStart(2, '0'),
    blocos,
    totalExercicios: exercicios.length,
    totalClipes: exercicios.filter((e) => e.recorte).length,
    utilSegundos: exercicios.reduce((s, e) => s + (e.recorte ? e.recorte.fim - e.recorte.inicio : 0), 0),
    brutoSegundos: videosUnicos.reduce((s, v) => s + (DURACOES[v] ?? 0), 0),
  }
})

export const TODOS_EXERCICIOS: ExercicioResolvido[] = DIVISOES.flatMap((d) =>
  d.blocos.flatMap((b) => b.exercicios),
)

const VIDEOS_UNICOS = [...new Set(TODOS_EXERCICIOS.map((e) => e.video))]

export const ESTATISTICAS = {
  totalExercicios: TODOS_EXERCICIOS.length,
  totalClipes: TODOS_EXERCICIOS.filter((e) => e.recorte).length,
  totalUtil: TODOS_EXERCICIOS.reduce((s, e) => s + (e.recorte ? e.recorte.fim - e.recorte.inicio : 0), 0),
  totalBruto: VIDEOS_UNICOS.reduce((s, v) => s + (DURACOES[v] ?? 0), 0),
}

const POR_ID = new Map(TODOS_EXERCICIOS.map((e) => [e.id, e]))

export function buscarExercicio(id: string): ExercicioResolvido | undefined {
  return POR_ID.get(id)
}

export function buscarDivisao(chave: string): DivisaoResolvida | undefined {
  return DIVISOES.find((d) => d.chave === chave)
}

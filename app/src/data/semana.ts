import type { ChaveDivisao } from './tipos'

export type Carga = 'pesada' | 'moderada' | 'leve'
export type Sessao = { divisao: ChaveDivisao; carga: Carga }
export type SemanaDoCiclo = { numero: number; sessoes: Sessao[] }
export type LinhaSemana = { dia: string; sessao: string; descanso: boolean }

export const DIAS_DE_FORCA = ['Segunda', 'Quarta', 'Sexta'] as const

/**
 * Os quatro treinos rodam numa fila que não reinicia no domingo: o treino de
 * segunda é o próximo da fila, não "o treino de segunda". Com três sessões por
 * semana e quatro treinos, a fila fecha em quatro semanas — cada treino aparece
 * três vezes, empurrar e puxar seis vezes cada.
 */
export const CICLO: SemanaDoCiclo[] = [
  {
    numero: 1,
    sessoes: [
      { divisao: 'empurrarA', carga: 'pesada' },
      { divisao: 'puxarA', carga: 'moderada' },
      { divisao: 'empurrarB', carga: 'leve' },
    ],
  },
  {
    numero: 2,
    sessoes: [
      { divisao: 'puxarB', carga: 'pesada' },
      { divisao: 'empurrarA', carga: 'moderada' },
      { divisao: 'puxarA', carga: 'leve' },
    ],
  },
  {
    numero: 3,
    sessoes: [
      { divisao: 'empurrarB', carga: 'pesada' },
      { divisao: 'puxarB', carga: 'moderada' },
      { divisao: 'empurrarA', carga: 'leve' },
    ],
  },
  {
    numero: 4,
    sessoes: [
      { divisao: 'puxarA', carga: 'pesada' },
      { divisao: 'empurrarB', carga: 'moderada' },
      { divisao: 'puxarB', carga: 'leve' },
    ],
  },
]

/** Os dias que não são de força são iguais em todas as semanas do ciclo. */
export const DIAS_FIXOS: LinhaSemana[] = [
  { dia: 'Terça', sessao: 'Corrida leve em ritmo de conversa, 25 a 40 min', descanso: false },
  { dia: 'Quinta', sessao: 'Descanso ativo: caminhada, bike leve, mobilidade', descanso: true },
  { dia: 'Sábado', sessao: 'Corrida longa ou de qualidade', descanso: false },
  { dia: 'Domingo', sessao: 'Descanso total', descanso: true },
]

export const REGRA_DE_OURO =
  'Nunca coloque corrida intervalada forte no dia seguinte à sessão pesada. Se precisar juntar força e corrida no mesmo dia, faça força primeiro e deixe pelo menos 3 horas entre as duas — colar as duas custa força explosiva, e separar por 3 horas elimina o efeito.'

export const REGRA_DE_CARGA =
  'A carga mora no dia da semana, não no treino. A primeira sessão da semana é a pesada: topo da carga, base da faixa de repetições, no exercício de perna que abre o Bloco 1. A segunda é moderada. A terceira é leve, com 2 a 3 repetições na reserva. Só uma sessão pesada por semana — é ela que sustenta a corrida.'

export const REGRA_DE_PANTURRILHA =
  'Panturrilha com carga só nos dias de empurrar. Nos dias de puxar ela não aparece: o tendão de Aquiles já recebe carga nas corridas, e a síntese de colágeno só fica positiva entre 36 e 72 horas depois do estímulo.'

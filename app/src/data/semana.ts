import type { ChaveDivisao } from './tipos'

export type SemanaDoCiclo = { numero: number; sessoes: ChaveDivisao[] }
export type LinhaSemana = { dia: string; sessao: string; descanso: boolean }

/**
 * A carga é propriedade da posição na semana, não do treino: a i-ésima sessão
 * de qualquer semana cai em `DIAS_DE_FORCA[i]` e é `CARGAS[i]`. Por isso a
 * carga não aparece no ciclo — repeti-la nas doze sessões seria o mesmo fato
 * escrito quatro vezes, livre para divergir.
 */
export const DIAS_DE_FORCA = ['Segunda', 'Quarta', 'Sexta'] as const
export const CARGAS = ['pesada', 'moderada', 'leve'] as const

/**
 * Os quatro treinos rodam numa fila que não reinicia no domingo: o treino de
 * segunda é o próximo da fila, não "o treino de segunda". Com três sessões por
 * semana e quatro treinos, a fila fecha em quatro semanas — cada treino aparece
 * três vezes, empurrar e puxar seis vezes cada.
 */
export const CICLO: SemanaDoCiclo[] = [
  { numero: 1, sessoes: ['empurrarA', 'puxarA', 'empurrarB'] },
  { numero: 2, sessoes: ['puxarB', 'empurrarA', 'puxarA'] },
  { numero: 3, sessoes: ['empurrarB', 'puxarB', 'empurrarA'] },
  { numero: 4, sessoes: ['puxarA', 'empurrarB', 'puxarB'] },
]

/** Os dias que não são de força são iguais em todas as semanas do ciclo. */
export const DIAS_FIXOS: LinhaSemana[] = [
  { dia: 'Terça', sessao: 'Corrida leve em ritmo de conversa, 25 a 40 min', descanso: false },
  { dia: 'Quinta', sessao: 'Descanso ativo: caminhada, bike leve, mobilidade', descanso: true },
  { dia: 'Sábado', sessao: 'Corrida longa ou de qualidade', descanso: false },
  { dia: 'Domingo', sessao: 'Descanso total', descanso: true },
]

/**
 * A janela é de 48 horas, não de 24. Esta nota dizia "no dia seguinte" — mais
 * frouxo que a spec e que o card do Guia, e é esta versão que aparece em toda
 * divisão de força, ou seja, a mais lida. Em texto de segurança, a cópia mais
 * vista não pode ser a mais permissiva.
 */
export const REGRA_DE_OURO =
  'Corrida de qualidade — tiros ou ritmo forte — só 48 horas depois da sessão pesada. Se precisar juntar força e corrida no mesmo dia, faça força primeiro e deixe pelo menos 3 horas entre as duas: colar as duas custa força explosiva, e separar por 3 horas elimina esse custo.'

export const REGRA_DE_CARGA =
  'A carga mora no dia da semana, não no treino. A primeira sessão da semana é a pesada: topo da carga, base da faixa de repetições, no exercício de perna que abre a sessão. A segunda é moderada. A terceira é leve, com 2 a 3 repetições na reserva. Só uma sessão pesada por semana — é ela que sustenta a corrida.'

export const REGRA_DE_PANTURRILHA =
  'Panturrilha com carga só nos dias de empurrar. Nos dias de puxar ela não aparece: o tendão de Aquiles já leva carga nas corridas, e carregar em dias seguidos desgasta o tendão em vez de fortalecer. Como empurrar e puxar se alternam, sobram sempre pelo menos 48 horas entre uma sessão de panturrilha e a outra.'

/**
 * O freio-mestre. Mora aqui, e não nos dados de cada divisão, porque a nota
 * lateral é uma só e `TabelaSemana` aparece em toda divisão de força: quatro
 * cópias no `plano.ts` seriam quatro textos livres para divergir. O card de
 * alerta do Guia abre pelo mesmo sinal — lá ele encabeça a lista completa de
 * sinais, aqui ele é a regra isolada que segue o leitor para dentro do treino.
 */
export const REGRA_DO_FREIO =
  'Inchaço no joelho na manhã seguinte — qualquer onda ao deslizar a mão — corta 30 a 50% do volume de perna na sessão seguinte. Esse corte vale mais que qualquer regra de frequência deste plano: quando o joelho e o calendário discordam, quem cede é o calendário.'

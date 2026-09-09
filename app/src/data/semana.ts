export type LinhaSemana = { dia: string; sessao: string; divisao?: string; descanso: boolean }

export const SEMANA_4: LinhaSemana[] = [
  { dia: 'Segunda', sessao: 'Força A + corrida leve 20 min (opcional, depois da força)', divisao: 'forcaA', descanso: false },
  { dia: 'Terça', sessao: 'Corrida (qualidade ou leve) + mobilidade', divisao: 'corrida', descanso: false },
  { dia: 'Quarta', sessao: 'Força B', divisao: 'forcaB', descanso: false },
  { dia: 'Quinta', sessao: 'Descanso ativo: caminhada, bike leve, mobilidade', descanso: true },
  { dia: 'Sexta', sessao: "Força A' (variações)", divisao: 'forcaAl', descanso: false },
  { dia: 'Sábado', sessao: 'Corrida longa ou circuito híbrido', divisao: 'circuito', descanso: false },
  { dia: 'Domingo', sessao: 'Descanso', descanso: true },
]

export const SEMANA_3: LinhaSemana[] = [
  { dia: 'Segunda', sessao: 'Força A', divisao: 'forcaA', descanso: false },
  { dia: 'Terça', sessao: 'Corrida leve', divisao: 'corrida', descanso: false },
  { dia: 'Quarta', sessao: 'Força B', divisao: 'forcaB', descanso: false },
  { dia: 'Quinta', sessao: 'Descanso / mobilidade', descanso: true },
  { dia: 'Sexta', sessao: 'Força A', divisao: 'forcaA', descanso: false },
  { dia: 'Sábado', sessao: 'Corrida longa', divisao: 'corrida', descanso: false },
  { dia: 'Domingo', sessao: 'Descanso', descanso: true },
]

export const REGRA_DE_OURO =
  'Nunca coloque corrida intervalada forte no dia seguinte a um treino de perna pesado. Se precisar juntar, faça no mesmo dia — força primeiro, corrida leve depois — e deixe o dia seguinte livre.'

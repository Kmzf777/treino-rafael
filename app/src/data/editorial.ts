export type Card = { titulo: string; texto: string }
export type SemanaCorrida = { semana: number; sessao: string; leve: boolean }

export const CORRIDA = {
  retomando: {
    titulo: 'Se você ainda está retomando',
    lede: 'Três sessões por semana. Cinco minutos caminhando antes e cinco depois, sempre.',
    semanas: [
      { semana: 1, sessao: '6x (2 min corrida / 2 min caminhada)', leve: false },
      { semana: 2, sessao: '6x (3 min corrida / 1min30 caminhada)', leve: false },
      { semana: 3, sessao: '5x (4 min corrida / 1min30 caminhada)', leve: false },
      { semana: 4, sessao: 'Semana leve: 4x (4 min / 2 min)', leve: true },
      { semana: 5, sessao: '4x (6 min corrida / 1min30 caminhada)', leve: false },
      { semana: 6, sessao: '3x (10 min corrida / 2 min caminhada)', leve: false },
      { semana: 7, sessao: '2x (15 min corrida / 2 min caminhada)', leve: false },
      { semana: 8, sessao: '30 min contínuo leve, depois 5 km', leve: false },
    ] as SemanaCorrida[],
  },
  jaCorre: {
    titulo: 'Se você já corre 5 km',
    lede: 'Duas ou três sessões por semana, sempre com um dia entre elas.',
    cards: [
      { titulo: 'Leve (base)', texto: '30 a 40 min em ritmo de conversa. É a maior parte do seu volume — e a parte que a maioria das pessoas corre rápido demais.' },
      { titulo: 'Qualidade — 1x por semana', texto: '6 a 8 tiros de 400 m em ritmo forte com 2 min de trote entre eles. Ou 20 min contínuos em ritmo confortavelmente difícil.' },
      { titulo: 'Longa', texto: '6 a 8 km em ritmo leve, aumentando no máximo 10% por semana.' },
    ] as Card[],
  },
  cuidados: {
    titulo: 'Cuidados para o joelho operado',
    cards: [
      { titulo: 'Cadência entre 170 e 180 passos por minuto', texto: 'Reduz bastante a carga no joelho. Use metrônomo ou playlist com BPM na faixa. Suba de 5% em 5% a partir da sua cadência atual, não de uma vez.' },
      { titulo: 'Passada curta, sob o quadril', texto: 'Pisar muito à frente do corpo freia e joga impacto direto no joelho.' },
      { titulo: 'Piso e tênis', texto: 'Nas primeiras semanas: piso regular, sem descidas íngremes e sem trilha técnica. Tênis com amortecimento adequado e menos de 600 km rodados.' },
      { titulo: 'Uma variável por vez', texto: 'Aumente ou volume ou intensidade por semana. Nunca os dois.' },
    ] as Card[],
  },
  links: [
    { rotulo: 'Ler sobre cadência', url: 'https://www.corridaperfeita.com/cadencia-na-corrida/' },
  ],
  buscaTecnica: 'educativos de corrida técnica de passada cadência',
}

export type SecaoGuia =
  | { tipo: 'texto'; titulo: string; texto: string }
  | { tipo: 'cards'; titulo: string; cards: Card[] }
  | { tipo: 'alerta'; titulo: string; texto: string }
  | { tipo: 'nota'; texto: string }

export const GUIA: SecaoGuia[] = [
  { tipo: 'texto', titulo: 'Antes de tudo', texto: 'Este plano assume que você já teve alta do fisioterapeuta para treino de força com carga e para corrida. Se ainda não teve, ou se está com menos de 9 meses de cirurgia, mostre isto ao seu fisio ou cirurgião antes de começar a parte de corrida.' },
  { tipo: 'cards', titulo: 'Depende de onde saiu o enxerto', cards: [
    { titulo: 'Tendão quadricipital ou patelar', texto: 'O quadríceps costuma demorar mais para recuperar força. Progrida a cadeira extensora com calma nos últimos 30° de extensão e priorize volume de quadríceps.' },
    { titulo: 'Isquiotibiais', texto: 'Priorize flexora, stiff e trabalho excêntrico de posterior.' },
  ] },
  { tipo: 'alerta', titulo: 'Sinais para reduzir a carga', texto: 'Inchaço ou derrame no joelho no dia seguinte, dor acima de 3/10, calor local, sensação de falseio, ou dor no local de retirada do enxerto que não passa em 48 horas.' },
  { tipo: 'texto', titulo: 'Como progredir a carga', texto: 'Quando completar todas as séries no topo da faixa de repetições, com 2 repetições de reserva e sem dor no joelho, aumente 2,5 a 5% na semana seguinte. A cada 4 semanas, faça uma semana leve: metade das séries, mesma carga.' },
  { tipo: 'texto', titulo: 'Saltos e pliometria', texto: 'Só entram se o fisio liberar e se a perna operada tiver pelo menos 90% da força e do salto unipodal da perna boa. Antes disso, o risco não compensa.' },
  { tipo: 'cards', titulo: 'Resumo semanal', cards: [
    { titulo: '3 a 4 sessões de força', texto: 'Corpo inteiro, com trabalho unilateral de perna em todas elas. Sem exceção — é o que mais protege o joelho operado a longo prazo.' },
    { titulo: '2 a 3 corridas', texto: 'Mais 1 dia de descanso total por semana.' },
    { titulo: 'Sono e proteína', texto: '7 a 9 horas de sono e algo entre 1,6 e 2 g de proteína por kg de peso fazem mais diferença na recuperação que qualquer suplemento.' },
  ] },
  { tipo: 'nota', texto: 'Este plano é orientação geral de treino e não substitui avaliação de fisioterapeuta ou médico. Como você teve reconstrução de LCA e LCM com enxerto, vale revisar esta estrutura com o profissional que acompanhou sua reabilitação.' },
]

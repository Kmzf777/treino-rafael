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
  { tipo: 'texto', titulo: 'Como o plano é organizado', texto: 'Quatro treinos numa fila contínua: empurrar A, puxar A, empurrar B, puxar B. O superior alterna — num dia só empurra (peito, ombro, tríceps), no outro só puxa (costas, bíceps, deltoide posterior). O inferior está em todas as sessões, com a ênfase acompanhando o superior: dia de empurrar puxa mais quadríceps, dia de puxar carrega mais quadril e posterior. Cada bloco junta perna, torso e um terceiro movimento que não disputa o mesmo músculo, porque dois exercícios do mesmo motor no mesmo bloco derrubam o desempenho do segundo.' },
  { tipo: 'texto', titulo: 'Joelho operado', texto: 'A cadeira extensora não está proibida — é o exercício que fecha o déficit de reto femoral que agachamento e leg press não fecham, porque na cadeia fechada esse músculo trabalha em quase-isometria. Ela é obrigatória aqui, e sempre unilateral: a máquina bilateral esconde a diferença entre as pernas, justamente em quem tem simetria como critério de segurança. Menos de 9 meses de cirurgia: trabalhe de 90 a 45 graus, sem carga alta até a extensão completa. Mais de 9 meses: amplitude completa liberada, mas a faixa final é faixa de progressão — 10 a 15 repetições com 2 a 3 na reserva, nunca teste de força, nunca até a falha. Suba carga ou amplitude terminal, nunca as duas na mesma semana. O LCM não restringe a extensora, que é movimento puramente sagital: a ressalva do LCM vale para o joelho apontando para dentro no afundo e no búlgaro.' },
  { tipo: 'alerta', titulo: 'Sinais para reduzir a carga', texto: 'Inchaço no joelho na manhã seguinte — qualquer onda ao deslizar a mão — vale mais que qualquer regra de frequência deste plano: corte 30 a 50% do volume de perna na próxima sessão. Dor acima de 3/10, ou dor que não normaliza em 24 horas. Dor na frente do joelho que piora no dia seguinte: reduza a amplitude terminal e a profundidade, não abandone o exercício. Perda de extensão completa comparada ao outro lado, que é o sinal mais precoce de irritação articular. Dor no tendão de Aquiles ou no patelar ao acordar: 72 horas antes de recarregar aquele tecido. Bloqueio, falseio ou dor na linha da articulação: pare e procure reavaliação. Isso não é fadiga.' },
  { tipo: 'texto', titulo: 'Checagem mensal de simetria', texto: 'Uma vez por mês, teste panturrilha unilateral: amplitude completa, 2 segundos por repetição, até não conseguir mais. A meta é 20 ou mais repetições, e a comparação que importa não é com o número — é entre os lados. Se a diferença entre a perna operada e a boa aumentar de um mês para o outro, o volume está mal distribuído: não é hora de subir carga, é hora de igualar. Este teste vale mais que qualquer sensação, porque a perna operada compensa sem você perceber.' },
  { tipo: 'cards', titulo: 'Corrida — as três regras', cards: [
    { titulo: 'Qualidade só 48 h depois da sessão pesada', texto: 'Corrida leve em zona 2 no dia seguinte é aceitável. Uma única sessão de perna pesada prejudica a economia de corrida por 24 a 48 horas, e a queda começa já uma manhã depois.' },
    { titulo: 'Mesmo dia: força primeiro, 3 horas de intervalo', texto: 'Idealmente 6. Colar as duas com menos de 20 minutos custa força explosiva; separar por 3 horas ou mais elimina o efeito, e fazer a força antes rende cerca de 7% a mais de força de perna ao longo do programa. Exceção: em dia de tiro ou tempo run, a corrida é a prioridade e vem primeiro.' },
    { titulo: 'Antes de correr em 24 h: 2 a 3 na reserva', texto: 'Nunca até a falha. Com perna em todas as sessões, nenhuma corrida da semana acontece com as pernas totalmente frescas — esse é o custo real do modelo, e ele só é gerenciável porque uma única sessão por semana é pesada de verdade.' },
  ] },
  { tipo: 'texto', titulo: 'Como progredir a carga', texto: 'Quando completar todas as séries no topo da faixa de repetições, com 2 repetições de reserva e sem dor no joelho, aumente 2,5 a 5% na semana seguinte. A cada 4 a 6 semanas, reduza 40 a 50% do volume de perna por uma semana, mantendo a carga. E na transição para este plano: você está saindo de 2 para 3 sessões de perna por semana — leve 4 a 6 semanas para chegar lá, subindo menos de 10% de carga total por semana. Aumento abrupto de carga é o preditor de lesão, não a frequência em si.' },
  { tipo: 'texto', titulo: 'Saltos e pliometria', texto: 'Continuam fora do plano. Só entram com liberação do fisio e com a perna operada em pelo menos 90% da força e do salto unipodal da perna boa. Antes disso, o risco não compensa.' },
  { tipo: 'cards', titulo: 'Três perguntas que mudam a prescrição', cards: [
    { titulo: 'De onde saiu o enxerto', texto: 'Isquiotibiais: o déficit de flexão profunda persiste por anos e a cadeira flexora deveria aparecer em duas sessões, não em uma — o stiff não substitui. Patelar ou quadricipital: vigilância redobrada com dor na frente do joelho na extensora e no agachamento fundo.' },
    { titulo: 'Quantos meses de cirurgia', texto: 'Menos de 9 meses mantém a extensora em 90 a 45 graus. Mais de 9 meses libera a amplitude e o limitador passa a ser sintoma, não protocolo.' },
    { titulo: 'Houve reparo de menisco junto', texto: 'Se houve, o menisco dita o ritmo no período inicial — sem agachamento abaixo de 90 graus com carga, sem flexão profunda carregada com rotação. Enquanto não souber, o plano roda na configuração conservadora: extensora de 90 a 45, agachamento até 90.' },
  ] },
  { tipo: 'cards', titulo: 'Resumo semanal', cards: [
    { titulo: '3 sessões de força', texto: 'Empurrar e puxar alternados, inferior em todas. Uma única sessão pesada por semana, sempre a primeira — é ela que sustenta a corrida. As outras duas são moderada e leve.' },
    { titulo: '2 corridas e 2 descansos', texto: 'Terça leve, sábado longa ou de qualidade. Quinta é descanso ativo, domingo é descanso total.' },
    { titulo: 'Sono e proteína', texto: '7 a 9 horas de sono e algo entre 1,6 e 2 g de proteína por kg de peso fazem mais diferença na recuperação que qualquer suplemento.' },
  ] },
  { tipo: 'texto', titulo: 'O que este plano não afirma', texto: 'Não afirma que separar peito e costas em dias diferentes é melhor: ninguém testou essa pergunta. O que a evidência permite dizer é que não é pior — e isso basta para organizar o treino do jeito que faz sentido para você. Não afirma que treinar perna 3 vezes por semana rende mais músculo que 2: com o mesmo volume semanal, não rende. O ganho é de distribuição e de exposição frequente ao joelho operado, não de volume extra. E não existe nenhum estudo testando frequência de perna nessa faixa em pessoas com LCA reconstruído que também correm: este plano é extrapolação bem fundamentada, e é por isso que o inchaço na manhã seguinte vale mais que qualquer regra escrita aqui.' },
  { tipo: 'nota', texto: 'Este plano é orientação geral de treino e não substitui avaliação de fisioterapeuta ou médico. Como você teve reconstrução de LCA e LCM com enxerto, vale revisar esta estrutura com o profissional que acompanhou sua reabilitação.' },
]

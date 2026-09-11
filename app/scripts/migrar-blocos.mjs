// Migração de uso único: reorganiza o plano no modelo empurrar/puxar.
// Uso: node scripts/migrar-blocos.mjs
// Depois de rodar e commitar, apague este arquivo.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const raiz = new URL('../src/data/', import.meta.url)
const caminho = (nome) => fileURLToPath(new URL(nome, raiz))

function lerLiteral(arquivo, marcador, abre, fecha) {
  const texto = readFileSync(caminho(arquivo), 'utf8')
  const inicio = texto.indexOf(marcador) + marcador.length
  return JSON.parse(texto.slice(texto.indexOf(abre, inicio), texto.lastIndexOf(fecha) + 1))
}

const PLANO = lerLiteral('plano.ts', 'Divisao[] = ', '[', ']')
const METADADOS = lerLiteral('metadados.ts', '> = ', '{', '}')
const NOVOS = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../docs/dados/videos-novos.json', import.meta.url)), 'utf8'),
)

const PorId = new Map()
for (const d of PLANO) for (const b of d.blocos) for (const e of b.exercicios) PorId.set(e.id, e)

// --- exercícios inteiramente novos -------------------------------------------------
const EXERCICIOS_NOVOS = {
  'ea-triceps': {
    nome: 'Tríceps na polia acima da cabeça',
    prescricao: '3x10-12',
    video: NOVOS['ea-triceps'].video,
    cues: [
      'De costas para a polia, corda acima da cabeça, cotovelos apontando para frente e parados.',
      'Só o antebraço se move. O cotovelo alto é o que coloca a cabeça longa do tríceps em alongamento.',
      'Braço acima da cabeça rende cerca de 1,4x mais hipertrofia de tríceps que a posição neutra.',
    ],
    unilateral: false,
    busca: 'tríceps na polia acima da cabeça execução cabeça longa',
    alternativos: [{ nome: 'Tríceps na polia com corda', video: '7le1JRUUagM' }],
    meta: {
      musculoPrimario: 'Tríceps',
      musculosSecundarios: [],
      equipamento: 'Polia',
      padraoMovimento: 'Isolado',
      porQue:
        'O dia de empurrar não pode ficar sem extensão de cotovelo direta. Acima da cabeça porque a cabeça longa do tríceps só alonga com o ombro em flexão.',
    },
  },
  'pa-deltpost': {
    nome: 'Crucifixo inverso na máquina',
    prescricao: '3x12-15',
    video: NOVOS['pa-deltpost'].video,
    cues: [
      'Peito apoiado, braços quase estendidos na altura dos ombros, abra até a linha do tronco.',
      'Puxe com o cotovelo, não com a mão. Se o trapézio superior subir até a orelha, a carga está alta demais.',
      'Este é o exercício que faltava no dia de puxar: deltoide posterior a ~90% da contração máxima, contra ~58% na puxada.',
    ],
    unilateral: false,
    busca: 'crucifixo inverso máquina peck deck invertido execução',
    alternativos: [{ nome: 'Abertura com elástico, se não houver máquina', video: 'XN0J-hI17SU', inicio: 33 }],
    meta: {
      musculoPrimario: 'Deltoide posterior',
      musculosSecundarios: ['Trapézio médio', 'Romboides'],
      equipamento: 'Máquina',
      padraoMovimento: 'Isolado',
      porQue:
        'Sem ele o dia de puxar é dorsal e bíceps. Puxada e remada deixam o deltoide posterior perto da metade do estímulo que este exercício dá.',
    },
  },
  'pb-abdutor': {
    nome: 'Abdução de quadril na máquina',
    prescricao: '3x12-15',
    video: NOVOS['pb-abdutor'].video,
    cues: [
      'Sentado, tronco levemente inclinado à frente, abra os joelhos contra o apoio e volte devagar.',
      'Tronco à frente recruta mais glúteo médio; tronco reto puxa mais o tensor da fáscia lata.',
      'Aqui é carga de verdade. A caminhada com miniband do aquecimento é ativação, não substitui isto.',
    ],
    unilateral: false,
    busca: 'cadeira abdutora execução glúteo médio',
    alternativos: [],
    meta: {
      musculoPrimario: 'Glúteo médio',
      musculosSecundarios: ['Tensor da fáscia lata', 'Glúteo máximo'],
      equipamento: 'Máquina',
      padraoMovimento: 'Isolado',
      porQue:
        'Único item com base em lesão de corredor sem cobertura com carga no plano. Entra 1x por semana, não mais: a evidência de transferência é conflitante.',
    },
  },
}
EXERCICIOS_NOVOS['pb-deltpost'] = {
  ...EXERCICIOS_NOVOS['pa-deltpost'],
  prescricao: '3x12-15',
}

// --- exercícios que nascem de um alternativo já auditado ----------------------------
const DE_ALTERNATIVO = {
  'eb-inclinado': {
    nome: 'Supino inclinado com barra',
    prescricao: '3x8-12',
    video: 'oZjIQN0YMX0',
    recorte: { inicio: 10, fim: 39 },
    cues: [
      'Banco entre 30 e 45 graus. Mais que isso vira desenvolvimento de ombro.',
      'Barra desce na linha da clavícula, cotovelos a cerca de 45 graus do tronco.',
      'Escápulas encaixadas no banco do começo ao fim.',
    ],
    unilateral: false,
    busca: 'supino inclinado com barra execução correta',
    alternativos: [],
    meta: {
      musculoPrimario: 'Peitoral maior',
      musculosSecundarios: ['Deltoide anterior', 'Tríceps'],
      equipamento: 'Barra',
      padraoMovimento: 'Empurrar horizontal',
      porQue: 'Variante de ângulo do empurrar do dia A, com mais porção clavicular do peitoral.',
    },
  },
  'eb-dips': {
    nome: 'Mergulho nas paralelas',
    prescricao: '3x8-12',
    video: 'gTuw7u2PwlM',
    cues: [
      'Tronco levemente inclinado à frente para pegar mais peito; vertical pega mais tríceps.',
      'Desça até o braço fazer 90 graus. Mais fundo que isso castiga o ombro sem ganho.',
      'Se não fechar as repetições, use o graviton ou um elástico de assistência.',
    ],
    unilateral: false,
    busca: 'mergulho nas paralelas execução dips',
    alternativos: [],
    meta: {
      musculoPrimario: 'Peitoral maior',
      musculosSecundarios: ['Tríceps', 'Deltoide anterior'],
      equipamento: 'Peso do corpo',
      padraoMovimento: 'Empurrar horizontal',
      porQue: 'Fecha o dia de empurrar com um composto de peso do corpo que ainda carrega bem o tríceps.',
    },
  },
  'pb-barra': {
    nome: 'Barra fixa assistida no graviton',
    prescricao: '3x8-12',
    video: 'w0UVe0JAEDQ',
    recorte: { inicio: 54, fim: 85 },
    cues: [
      'Pegada um pouco mais larga que os ombros, ombros longe das orelhas antes de puxar.',
      'Puxe o cotovelo para o bolso, não a mão para a barra.',
      'Ajuste a assistência para fechar as repetições com 2 na reserva.',
    ],
    unilateral: false,
    busca: 'barra fixa assistida graviton execução',
    alternativos: [],
    meta: {
      musculoPrimario: 'Dorsal (latíssimo)',
      musculosSecundarios: ['Bíceps', 'Trapézio médio'],
      equipamento: 'Máquina',
      padraoMovimento: 'Puxar vertical',
      porQue: 'Variante de puxar vertical do dia de puxar A, com a pegada e o padrão da barra fixa.',
    },
  },
  'pb-prancha': {
    nome: 'Prancha frontal',
    prescricao: '3x30-45s',
    video: 'RTxAFDK1OMw',
    recorte: { inicio: 39, fim: 47 },
    cues: [
      'Antebraços no chão, corpo alinhado do calcanhar à cabeça.',
      'Costela para baixo e glúteo apertado. Se a lombar afundar, o exercício acabou.',
      'Qualidade da posição vale mais que segundos acumulados.',
    ],
    unilateral: false,
    busca: 'prancha frontal execução correta core',
    alternativos: [],
    meta: {
      musculoPrimario: 'Abdômen (reto abdominal)',
      musculosSecundarios: ['Transverso do abdômen', 'Glúteo máximo'],
      equipamento: 'Peso do corpo',
      padraoMovimento: 'Core anti-extensão',
      porQue: 'Core anti-extensão do dia de puxar B, sem competir com a dobradiça de quadril do Bloco 1.',
    },
  },
}

// --- sobrescritas de nome, prescrição, cues e alternativos --------------------------
const AJUSTES = {
  'ea-extensora': {
    prescricao: '3x10-15 cada perna',
    cues: [
      'Unilateral sempre: a máquina bilateral esconde a diferença entre as pernas, e simetria é o seu critério de segurança.',
      'Menos de 9 meses de cirurgia: trabalhe de 90 a 45 graus. Mais de 9 meses: amplitude completa, mas a faixa final é de progressão, não de teste de força.',
      'Suba carga ou amplitude terminal — nunca as duas na mesma semana.',
    ],
  },
  'eb-extensora': {
    prescricao: '3x10-15 cada perna',
    cues: [
      'Mesma regra do dia de empurrar A: unilateral, e a faixa final da extensão nunca vai à falha.',
      'Se doer na frente do joelho, reduza a amplitude terminal antes de reduzir a carga.',
      'Aqui a sessão é a leve da semana: pare com 2 a 3 repetições na reserva.',
    ],
  },
  'ea-desenvolv': {
    nome: 'Desenvolvimento de ombro',
    prescricao: '3x8-12',
    alternativos: [],
  },
  'pa-biceps': {
    nome: 'Rosca de bíceps',
    prescricao: '3x10-12',
    cues: [
      'Cotovelo parado ao lado do tronco. Se ele vai para frente, o ombro entrou na jogada.',
      'Desça controlado até estender o cotovelo por inteiro.',
      'A supersérie com tríceps saiu: tríceps agora treina no dia de empurrar, onde pertence.',
    ],
    alternativos: [],
  },
  'pb-biceps': {
    nome: 'Rosca de bíceps',
    prescricao: '3x10-12',
    cues: [
      'Mesma execução do dia de puxar A, aqui como fechamento leve da semana.',
      'Cotovelo parado, descida controlada.',
      'Se a pegada falhar antes do bíceps na remada e na barra, resolva com pegada mista ou straps.',
    ],
    alternativos: [],
  },
  'pa-bulgaro': {
    nome: 'Agachamento búlgaro',
    prescricao: '3x8-12 cada perna',
  },
  'pb-stepup': {
    nome: 'Step-up no banco',
    prescricao: '3x12 cada perna',
  },
  'at-equilibrio': {
    nome: 'Equilíbrio em uma perna',
    prescricao: '30s cada',
  },
  // O resto da coluna `prescrição` do mapa de migração. Sem estas linhas o
  // exercício migrado carrega a prescrição da divisão de onde veio, que é o
  // volume do modelo antigo — dois dias de força, não quatro.
  'ea-agacha': { prescricao: '4x5-8' },
  'ea-supino': { prescricao: '4x6-10' },
  'ea-prancha-lat': { prescricao: '3x25-40s cada lado' },
  'ea-pant-uni': { prescricao: '3x8-15 cada' },
  'ea-pelvica-uni': { prescricao: '3x10-12 cada' },
  'pa-pallof': { prescricao: '3x25-35s cada lado' },
  'eb-leg': { prescricao: '4x10-15' },
  'eb-pant-sent': { prescricao: '3x12-20' },
  // A cadeira flexora deixa de ser unilateral: a prescrição do mapa não tem
  // "cada perna" nos dois dias, e o unilateral carregado de P6 fica com o
  // stiff e a remada no puxar A e com o step-up no puxar B.
  'pa-flexora': { prescricao: '3x10-15', unilateral: false },
  'pb-flexora': { prescricao: '3x12-15', unilateral: false },
}

// --- a nova estrutura ---------------------------------------------------------------
const ESTRUTURA = [
  {
    chave: 'aquecer',
    rotulo: 'Aquecer',
    titulo: 'Aquecimento — 8 a 10 minutos, antes de todo treino',
    lede: PLANO.find((d) => d.chave === 'aquecer').lede,
    blocos: [
      {
        nome: 'Mobilidade',
        sub: '1x15 cada movimento (2x15 se estiver travado)',
        exercicios: ['mob-tornozelo', 'mob-9090', 'mob-gato', 'mob-toracica', 'mob-pullapart', 'mob-rotext'],
      },
      {
        nome: 'Ativação com miniband e bola',
        sub: 'o bloco que você já fazia',
        exercicios: ['at-abre', 'at-ponte', 'at-lateral', 'at-pant', 'at-equilibrio<-a-fin-4'],
      },
      { nome: 'Cardio leve', sub: '5 minutos', exercicios: ['at-bike'] },
    ],
  },
  {
    chave: 'empurrarA',
    rotulo: 'Empurrar A',
    titulo: 'Empurrar A — peito, ombro, tríceps e perna que empurra',
    lede: 'Nenhum exercício de costas, bíceps ou antebraço entra aqui. Cada bloco junta perna, torso e um terceiro movimento que não disputa o mesmo músculo — é isso que deixa a sessão em 45 minutos sem perder carga.',
    blocos: [
      { nome: 'Agachamento · Peito · Core', sub: '4 voltas · 90 a 120s entre voltas', exercicios: ['ea-agacha<-a-agacha', 'ea-supino<-a-supino', 'ea-prancha-lat<-a-prancha-lat'] },
      { nome: 'Extensora · Ombro · Panturrilha', sub: '3 voltas · 60 a 90s entre voltas', exercicios: ['ea-extensora<-a-extensora', 'ea-desenvolv<-b-desenvolv', 'ea-pant-uni<-a-pant-uni'] },
      { nome: 'Pélvica · Deltoide · Tríceps', sub: '3 voltas · 45 a 60s entre voltas', exercicios: ['ea-pelvica-uni<-a-pelvica-uni', 'ea-elev-lat<-a-elev-lat', 'ea-triceps'] },
    ],
  },
  {
    chave: 'puxarA',
    rotulo: 'Puxar A',
    titulo: 'Puxar A — costas, bíceps e perna que puxa pelo quadril',
    lede: 'Nenhum exercício de peito, ombro anterior ou tríceps entra aqui. A panturrilha também não: ela treina nos dias de empurrar, para o tendão de Aquiles não levar carga em dias seguidos.',
    blocos: [
      { nome: 'Stiff · Puxada · Core', sub: '4 voltas · 90 a 120s entre voltas', exercicios: ['pa-stiff<-b-terra-uni', 'pa-puxada<-a-puxada', 'pa-pallof<-b-pallof'] },
      { nome: 'Flexora · Remada · Deltoide posterior', sub: '3 voltas · 60 a 90s entre voltas', exercicios: ['pa-flexora<-b-flexora', 'pa-remada<-b-remada-uni', 'pa-deltpost'] },
      { nome: 'Búlgaro · Bíceps · Lombar', sub: '3 voltas · 45 a 60s entre voltas', exercicios: ['pa-bulgaro<-b-fin-2', 'pa-biceps<-b-biceps', 'pa-lombar<-b-lombar'] },
    ],
  },
  {
    chave: 'empurrarB',
    rotulo: 'Empurrar B',
    titulo: 'Empurrar B — mesma lógica do A, implementos trocados',
    lede: 'Variante do dia de empurrar: máquina e halter no lugar da barra livre, e o sóleo no lugar do gastrocnêmio. Mesma regra — nada de costas, bíceps ou antebraço.',
    blocos: [
      { nome: 'Leg press · Crucifixo · Core', sub: '4 voltas · 90 a 120s entre voltas', exercicios: ['eb-leg<-al-leg', 'eb-cruci<-al-cruci', 'eb-deadbug<-a-deadbug'] },
      { nome: 'Extensora · Inclinado · Sóleo', sub: '3 voltas · 60 a 90s entre voltas', exercicios: ['eb-extensora<-al-extensora', 'eb-inclinado', 'eb-pant-sent<-b-pant-sent'] },
      { nome: 'Pélvica · Deltoide · Paralelas', sub: '3 voltas · 45 a 60s entre voltas', exercicios: ['eb-pelvica<-al-pelvica', 'eb-elev-lat<=a-elev-lat', 'eb-dips'] },
    ],
  },
  {
    chave: 'puxarB',
    rotulo: 'Puxar B',
    titulo: 'Puxar B — mesma lógica do puxar A, implementos trocados',
    lede: 'Variante do dia de puxar: pélvica bilateral no lugar do stiff unilateral, remada baixa e barra assistida. Fecha com abdução de quadril carregada, que é o item que faltava para o corredor.',
    blocos: [
      { nome: 'Pélvica bilateral · Remada baixa · Core', sub: '4 voltas · 90 a 120s entre voltas', exercicios: ['pb-pelvica<-b-pelvica', 'pb-remada<-al-remada', 'pb-prancha'] },
      { nome: 'Flexora · Barra assistida · Deltoide posterior', sub: '3 voltas · 60 a 90s entre voltas', exercicios: ['pb-flexora<=b-flexora', 'pb-barra', 'pb-deltpost'] },
      { nome: 'Step-up · Bíceps · Abdutor', sub: '3 voltas · 45 a 60s entre voltas', exercicios: ['pb-stepup<-b-fin-1', 'pb-biceps<=b-biceps', 'pb-abdutor'] },
    ],
  },
  { chave: 'corrida', rotulo: 'Corrida', titulo: 'Corrida', custom: 'corrida', blocos: [] },
  {
    chave: 'circuito',
    rotulo: 'Circuito',
    titulo: 'Circuito híbrido — opcional, em semana de deload',
    lede: 'Não é sessão de força e não substitui a sessão pesada: trabalho submáximo e isométrico não melhoram economia de corrida. É condicionamento para a semana leve.',
    blocos: [
      { nome: 'Circuito', sub: '4 voltas · 90s entre voltas', exercicios: ['c-remo', 'c-kb', 'c-flexao', 'c-afundo', 'c-prancha'] },
    ],
  },
  { chave: 'guia', rotulo: 'Guia', titulo: 'Guia', custom: 'guia', blocos: [] },
]

// --- montagem ------------------------------------------------------------------------
const metaNova = {}

function montar(spec) {
  // "novo<-antigo" move; "novo<=antigo" copia (o antigo continua existindo); "novo" sozinho
  // é exercício novo ou vem de DE_ALTERNATIVO.
  const [novoId, antigoId] = spec.includes('<-')
    ? spec.split('<-')
    : spec.includes('<=')
      ? spec.split('<=')
      : [spec, spec]

  let base
  if (EXERCICIOS_NOVOS[novoId]) {
    const { meta, ...resto } = EXERCICIOS_NOVOS[novoId]
    base = { id: novoId, ...resto }
    metaNova[novoId] = meta
  } else if (DE_ALTERNATIVO[novoId]) {
    const { meta, ...resto } = DE_ALTERNATIVO[novoId]
    base = { id: novoId, ...resto }
    metaNova[novoId] = meta
  } else {
    const antigo = PorId.get(antigoId)
    if (!antigo) throw new Error(`origem não encontrada: ${antigoId}`)
    base = structuredClone(antigo)
    base.id = novoId
    metaNova[novoId] = structuredClone(METADADOS[antigoId])
  }

  Object.assign(base, AJUSTES[novoId] ?? {})

  const ordem = ['id', 'nome', 'prescricao', 'video', 'recorte', 'cues', 'unilateral', 'busca', 'alternativos']
  const saida = {}
  for (const chave of ordem) if (base[chave] !== undefined) saida[chave] = base[chave]
  return saida
}

// o alternativo de at-equilibrio é o vídeo do antigo b-fin-4
const bFin4 = PorId.get('b-fin-4')
AJUSTES['at-equilibrio'].alternativos = [
  { nome: 'Apoio em superfície instável', video: bFin4.video, ...(bFin4.recorte ? { inicio: bFin4.recorte.inicio } : {}) },
]

const planoNovo = ESTRUTURA.map((d) => {
  const divisao = { chave: d.chave, rotulo: d.rotulo, titulo: d.titulo }
  if (d.lede) divisao.lede = d.lede
  divisao.blocos = d.blocos.map((b) => ({
    nome: b.nome,
    sub: b.sub,
    exercicios: b.exercicios.map(montar),
  }))
  if (d.custom) divisao.custom = d.custom
  const original = PLANO.find((p) => p.chave === d.chave)
  if (original?.avisoFinal) divisao.avisoFinal = original.avisoFinal
  return divisao
})

writeFileSync(
  caminho('plano.ts'),
  `import type { Divisao } from './tipos'\n\nexport const PLANO: Divisao[] = ${JSON.stringify(planoNovo, null, 2)}\n`,
)

writeFileSync(
  caminho('metadados.ts'),
  `import type { Metadados } from './tipos'\n\nexport const METADADOS: Record<string, Metadados> = ${JSON.stringify(metaNova, null, 2)}\n`,
)

const ids = planoNovo.flatMap((d) => d.blocos.flatMap((b) => b.exercicios.map((e) => e.id)))
console.log(`${ids.length} exercícios em ${planoNovo.length} divisões`)
console.log(`${new Set(planoNovo.flatMap((d) => d.blocos.flatMap((b) => b.exercicios.map((e) => e.video)))).size} vídeos únicos`)

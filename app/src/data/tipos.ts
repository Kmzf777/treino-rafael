export type Recorte = { inicio: number; fim: number }

export type Alternativo = { nome: string; video: string; inicio?: number }

export type Metadados = {
  musculoPrimario: string
  musculosSecundarios: string[]
  equipamento: string
  padraoMovimento: string
  porQue: string
}

export type Exercicio = {
  id: string
  nome: string
  prescricao: string
  video: string
  recorte?: Recorte
  cues: string[]
  unilateral: boolean
  busca?: string
  alternativos: Alternativo[]
}

export type Bloco = { nome: string; sub: string; exercicios: Exercicio[] }

export type ChaveDivisao =
  | 'aquecer' | 'forcaA' | 'forcaB' | 'forcaAl' | 'corrida' | 'circuito' | 'guia'

export type Divisao = {
  chave: ChaveDivisao
  rotulo: string
  titulo: string
  lede?: string
  blocos: Bloco[]
  custom?: 'corrida' | 'guia'
  avisoFinal?: { titulo: string; texto: string }
}

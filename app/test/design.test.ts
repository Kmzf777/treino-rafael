import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * As decisões de design que o jsdom não consegue medir.
 *
 * O jsdom não faz layout e não resolve CSS: contraste, largura de leitura,
 * altura de alvo e o tema antes do JS são invisíveis para um teste de
 * componente. Aqui elas são travadas na fonte — não é elegante, mas é a
 * diferença entre uma decisão registrada e uma decisão que volta sozinha no
 * próximo refactor.
 *
 * Vive fora de `src/` porque lê arquivos com `node:fs`: é ferramenta, não app.
 * O `?raw` do Vite não serve aqui — o vitest desliga o pipeline de CSS e um
 * `index.css?raw` volta como string vazia.
 */

const raiz = path.resolve(import.meta.dirname, '..')
const ler = (relativo: string) => readFileSync(path.join(raiz, relativo), 'utf8')

const CSS = ler('src/index.css')
const HTML = ler('index.html')
const FONTE_APP = ler('src/App.tsx')
const FONTE_SHELL = ler('src/components/AppShell.tsx')
const FONTE_INDICE = ler('src/components/IndiceDivisoes.tsx')

/* ------------------------------------------------------------------ contraste */

function luminancia(hex: string) {
  const canais = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r, g, b] = canais.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function razao(a: string, b: string) {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (claro + 0.05) / (escuro + 0.05)
}

/**
 * Lê os tokens `--color-*` do bloco do index.css que abre com `seletor`.
 *
 * O seletor aparece mais de uma vez no arquivo (o shadcn também escreve um
 * `.escuro { … }`, com tokens `--background` em oklch), então vale o primeiro
 * bloco que de fato define a paleta.
 */
function tokens(seletor: string): Record<string, string> {
  for (let i = CSS.indexOf(seletor); i > -1; i = CSS.indexOf(seletor, i + 1)) {
    const corpo = CSS.slice(i, CSS.indexOf('}', i))
    const mapa: Record<string, string> = {}
    for (const [, nome, valor] of corpo.matchAll(/--color-([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)) {
      mapa[nome] = valor
    }
    if (mapa.papel) return mapa
  }
  throw new Error(`nenhum bloco "${seletor}" define a paleta em src/index.css`)
}

const CLARO = tokens('@theme static')
const ESCURO = tokens('.escuro {')

describe('paleta Protocolo', () => {
  it('define os oito tokens nos dois temas', () => {
    const esperados = ['papel', 'papel-2', 'tinta', 'tinta-2', 'fio', 'carimbo', 'tijolo', 'plate']
    for (const token of esperados) {
      expect(CLARO[token], `--color-${token} no claro`).toMatch(/^#[0-9A-F]{6}$/i)
      expect(ESCURO[token], `--color-${token} no escuro`).toMatch(/^#[0-9A-F]{6}$/i)
    }
  })

  /**
   * O caso que estourava: --tinta-2 sobre a lavagem --papel-2 dava 4.21:1 no
   * tema claro. É o par do subtítulo de bloco ("3 a 4 voltas · 90s entre
   * voltas"), da semana leve da Corrida e do músculo na linha destacada da
   * busca. A própria tabela da spec diz "Nunca abaixo de 4.5:1" nessa linha.
   */
  it.each([
    ['claro', CLARO],
    ['escuro', ESCURO],
  ])('mantém texto secundário acima de 4.5:1 no tema %s', (_tema, t) => {
    expect(razao(t['tinta-2'], t['papel-2'])).toBeGreaterThanOrEqual(4.5)
    expect(razao(t['tinta-2'], t.papel)).toBeGreaterThanOrEqual(4.5)
  })

  it.each([
    ['claro', CLARO],
    ['escuro', ESCURO],
  ])('mantém acento e risco legíveis no tema %s', (_tema, t) => {
    expect(razao(t.carimbo, t.papel)).toBeGreaterThanOrEqual(4.5)
    expect(razao(t.tijolo, t.papel)).toBeGreaterThanOrEqual(4.5)
  })

  it.each([
    ['claro', CLARO],
    ['escuro', ESCURO],
  ])('mantém o texto primário acima de 13:1 no tema %s', (_tema, t) => {
    expect(razao(t.tinta, t.papel)).toBeGreaterThanOrEqual(13)
  })
})

describe('tema escuro antes do JavaScript', () => {
  /**
   * O useTema só roda depois do bundle inteiro baixar e avaliar. Sem o script
   * inline, um aparelho no escuro pinta papel a 100% de brilho durante todo esse
   * tempo — que é justamente o que a spec chama de machucar às 22h.
   */
  it('carimba a classe do tema no <html> antes do primeiro paint', () => {
    const cabeca = HTML.slice(0, HTML.indexOf('</head>'))
    expect(cabeca).toContain('treino.tema')
    expect(cabeca).toContain('prefers-color-scheme: dark')
    expect(cabeca).toMatch(/classList\.add\(\s*escuro\s*\?\s*'escuro'\s*:\s*'claro'\s*\)/)
  })

  /** Rede de segurança para JS desligado ou quebrado. */
  it('repete os tokens escuros sob prefers-color-scheme no CSS', () => {
    const inicio = CSS.indexOf('@media (prefers-color-scheme: dark)')
    expect(inicio).toBeGreaterThan(-1)
    const bloco = CSS.slice(inicio, inicio + 600)
    expect(bloco).toContain(':root:not(.claro)')
    expect(bloco).toContain(`--color-papel: ${ESCURO.papel}`)
    expect(bloco).toContain(`--color-tinta: ${ESCURO.tinta}`)
  })
})

describe('tipografia mono', () => {
  /**
   * "tabular-nums ligado em tudo que é mono" fechado numa regra só: classe a
   * classe, a categoria reabria a cada componente novo. Fora de @layer para
   * vencer as utilities do Tailwind sem depender de ordem.
   */
  it('liga tabular-nums em toda a categoria mono de uma vez', () => {
    expect(CSS).toMatch(/\[class\*="font-mono"\]\s*{\s*font-variant-numeric:\s*tabular-nums/)
  })
})

describe('largura de leitura e alvos de toque', () => {
  /**
   * O teto de 672px valia para o app inteiro e o índice era descontado dele:
   * sobravam 420px de prosa no desktop, 42ch, contra os 60–70ch da spec. O teto
   * de leitura agora é da coluna de conteúdo, não do documento.
   */
  it('dá ao desktop as duas colunas da spec: índice de 220px e folha de até 680px', () => {
    expect(FONTE_APP).toContain('sm:grid-cols-[220px_minmax(0,680px)]')
    // 220 + 32 de gap + 680 + 2×20 de margem: o teto acomoda as duas colunas.
    expect(FONTE_SHELL).toContain('sm:max-w-[972px]')
    // Abaixo de 640px continua sendo uma coluna só, no readableContentGuide.
    expect(FONTE_SHELL).toContain('max-w-[672px]')
  })

  /** Margem de 20px acima de 430px de viewport, não acima de 640px. */
  it('abre a margem no telefone grande, não só no desktop', () => {
    expect(FONTE_SHELL).toContain('min-[430px]:px-5')
  })

  /**
   * O gatilho do alvo reduzido era largura de viewport, não tipo de ponteiro:
   * um tablet em paisagem recebia chips de 36px com 4px de folga.
   */
  it('mantém 44px de alvo e 8px de folga nos chips do índice em toda largura', () => {
    const fonte = FONTE_INDICE
    expect(fonte).toContain('min-h-[44px]')
    expect(fonte).not.toContain('sm:min-h-[36px]')
    expect(fonte).toContain('sm:gap-2')
    // Sem vidro: o filete de baixo já separa a faixa do conteúdo.
    expect(fonte).not.toContain('backdrop-blur')
  })
})

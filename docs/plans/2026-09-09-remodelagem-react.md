# Remodelagem em Node + React — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir `index.html` por um app React de consulta — 7 divisões, 47 exercícios, 37 recortes de vídeo em loop e explicações em modal — com a direção de arte "Protocolo" e UX nível Apple.

**Architecture:** SPA estático em Vite + React 19. Todo o plano de treino é embutido no bundle como módulos TypeScript tipados (sem fetch, sem estado de carregamento). Roteamento por hash em ~40 linhas próprias. O player de recorte usa a IFrame API crua com um watchdog em `requestAnimationFrame`, porque `seekTo()` desarma o `endSeconds` e nenhuma biblioteca resolve isso. Servido por um `node:http` de zero dependências, porque embeds do YouTube falham em `file://`.

**Tech Stack:** Vite 8 · React 19 · TypeScript 6 · Tailwind CSS v4 (CSS-first) · shadcn/ui v4 com Base UI · motion 13 · Vitest 5 + Testing Library + jsdom 29 · oxlint · `@fontsource` (Newsreader, IBM Plex Sans, IBM Plex Mono)

**Spec:** `docs/specs/2026-09-09-remodelagem-react-design.md`

---

## Regras que valem para o plano inteiro

Leia antes da Task 1. Cada uma destas foi verificada empiricamente e custa horas se descoberta tarde.

1. **Todo comando roda dentro de `app/`.** O caminho tem três espaços — sempre entre aspas duplas:
   `cd "C:\Users\rafae\OneDrive\Desktop\Canastra Inteligencia\Agentes AI\Treino Rafael\app"`
2. **Pause a sincronização do OneDrive antes do primeiro `npm install`** (ícone da bandeja → engrenagem → Pausar → 2 horas). São ~514 pacotes; com sync ativo dá `EPERM`/`EBUSY` no meio da instalação.
3. **Nunca adicione `"baseUrl"` a nenhum tsconfig.** Com TypeScript 6 isso é `TS5101` fatal e o `tsc -b` aborta. Só `paths`.
4. **Não instale `typescript@latest`** (é 7.x). Fique no `~6.0.2` do template.
5. **Não instale eslint.** O template do Vite 8 usa oxlint.
6. **Não crie `tailwind.config.js`.** Tailwind v4 é CSS-first: tokens vivem em `@theme` no `src/index.css`.
7. **Não instale clsx nem tailwind-merge.** `src/lib/utils.ts` é `export { cn } from "cn"`.
8. **Nos testes, use `toBeInTheDocument()`, não `toBeVisible()`**, em qualquer árvore com `motion`: `initial={{opacity:0}}` deixa `opacity:0` inline no jsdom e o jest-dom considera todos os descendentes invisíveis.
9. **Commit ao fim de cada task.** O repositório git já existe na pasta pai.
10. **Texto em português do Brasil**, com acentos, em todo conteúdo visível.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `app/server/index.js` | Servidor estático `node:http`, zero deps |
| `app/src/index.css` | `@theme` do Tailwind v4: paleta Protocolo, fontes, escala |
| `app/src/data/tipos.ts` | Tipos do domínio |
| `app/src/data/plano.ts` | 7 divisões, blocos, 47 exercícios |
| `app/src/data/metadados.ts` | Músculo, equipamento, padrão, "por quê" por id |
| `app/src/data/duracoes.ts` | Duração total dos 47 videoIds |
| `app/src/data/editorial.ts` | Corrida e Guia estruturados |
| `app/src/data/semana.ts` | Tabelas de 4 e 3 dias |
| `app/src/data/index.ts` | Modelo derivado: junta plano + metadados + durações, numeração de protocolo, estatísticas |
| `app/src/lib/formato.ts` | `mmss`, numeração, montagem de URLs do YouTube |
| `app/src/lib/rota.ts` | Router de hash com `useSyncExternalStore` |
| `app/src/lib/youtube.ts` | Loader singleton da IFrame API |
| `app/src/hooks/useYouTubeClip.ts` | Loop `[inicio, fim]` — o coração |
| `app/src/hooks/usePreferencias.ts` | Tema e modo 4/3 dias em `localStorage` |
| `app/src/components/BarraTrecho.tsx` | A assinatura visual |
| `app/src/components/PranchaFigura.tsx` | Player + moldura + legenda + fallbacks |
| `app/src/components/SheetExercicio.tsx` | Bottom sheet mobile / modal desktop |
| `app/src/components/LinhaExercicio.tsx` | Linha da lista |
| `app/src/components/ListaExercicios.tsx` | Blocos + linhas de uma divisão |
| `app/src/components/IndiceDivisoes.tsx` | Faixa numerada sticky |
| `app/src/components/TabelaSemana.tsx` | Semana 4/3 dias |
| `app/src/components/PainelCorrida.tsx` | Divisão Corrida |
| `app/src/components/PainelGuia.tsx` | Divisão Guia |
| `app/src/components/Busca.tsx` | ⌘K |
| `app/src/components/AppShell.tsx` | Cabeçalho, tema, rodapé |
| `app/src/App.tsx` | Composição por rota |
| `app/scripts/check-clips.mjs` | Saúde dos vídeos via oEmbed |

---

## Task 1: Scaffold, Tailwind v4 e shadcn

**Files:**
- Create: `app/` (via CLI)
- Modify: `app/tsconfig.json`, `app/tsconfig.app.json`, `app/vite.config.ts`, `app/src/index.css`

- [ ] **Step 1: Pausar OneDrive e criar o projeto**

```bash
cd "C:\Users\rafae\OneDrive\Desktop\Canastra Inteligencia\Agentes AI\Treino Rafael"
npm create vite@latest app -- --template react-ts
cd app
npm install
```

- [ ] **Step 2: Instalar Tailwind v4**

```bash
npm install tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Escrever `app/vite.config.ts`**

`base: './'` faz o `dist` ao menos renderizar se alguém der duplo-clique no `index.html`. `import.meta.dirname` porque o projeto é ESM e `__dirname` não existe.

```ts
/// <reference types="vitest/config" />
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

- [ ] **Step 4: Adicionar `paths` aos tsconfigs — SEM `baseUrl`**

Em `app/tsconfig.json`, dentro do objeto raiz:

```json
{
  "compilerOptions": { "paths": { "@/*": ["./src/*"] } },
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Em `app/tsconfig.app.json`, dentro de `compilerOptions`, adicione:

```json
"paths": { "@/*": ["./src/*"] },
"types": ["vitest/globals", "@testing-library/jest-dom", "youtube"]
```

- [ ] **Step 5: Reduzir `src/index.css` a uma linha antes do shadcn init**

```css
@import "tailwindcss";
```

- [ ] **Step 6: Rodar o shadcn init com Base UI**

As flags `-b` e `-p` são obrigatórias — só `-y` trava em prompt interativo.

```bash
npx shadcn@latest init -b base -p nova -y
```

- [ ] **Step 7: Adicionar os componentes**

```bash
npx shadcn@latest add dialog drawer command scroll-area separator skeleton button -y
```

- [ ] **Step 8: Instalar motion, tipos do YouTube, fontes e ferramentas de teste**

```bash
npm install motion
npm install @fontsource-variable/newsreader @fontsource-variable/ibm-plex-sans @fontsource/ibm-plex-mono
npm install -D @types/youtube vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom@^29
```

Se `@fontsource-variable/ibm-plex-sans` não existir no registro, use `@fontsource/ibm-plex-sans` e importe os pesos 400/500/600 explicitamente. Verifique com `npm view <pacote> version` antes de assumir.

- [ ] **Step 9: Criar `app/src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

- [ ] **Step 10: Adicionar scripts ao `app/package.json`**

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "start": "node server/index.js",
  "test": "vitest run",
  "test:watch": "vitest",
  "lint": "oxlint",
  "check:clips": "node scripts/check-clips.mjs"
}
```

- [ ] **Step 11: Verificar que o build passa limpo**

Run: `npm run build`
Expected: sem erros; `dist/` criado. Se aparecer `TS5101`, algum `baseUrl` sobrou — remova.

- [ ] **Step 12: Commit**

```bash
cd "C:\Users\rafae\OneDrive\Desktop\Canastra Inteligencia\Agentes AI\Treino Rafael"
git add app
git commit -m "chore: scaffold do app em Vite + React 19 + Tailwind v4 + shadcn (Base UI)"
```

---

## Task 2: Tokens da direção de arte "Protocolo"

**Files:**
- Modify: `app/src/index.css`

- [ ] **Step 1: Adicionar os imports de fonte no topo do `index.css`**

Depois dos `@import` que o shadcn gerou, antes do bloco `@theme`:

```css
@import "@fontsource-variable/newsreader";
@import "@fontsource-variable/ibm-plex-sans";
@import "@fontsource/ibm-plex-mono/400.css";
@import "@fontsource/ibm-plex-mono/500.css";
```

- [ ] **Step 2: Adicionar o bloco `@theme` do Protocolo ao fim do `index.css`**

```css
@theme {
  --font-display: "Newsreader Variable", Newsreader, Georgia, serif;
  --font-sans: "IBM Plex Sans Variable", "IBM Plex Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  --color-papel: #FCFAF5;
  --color-papel-2: #F2EEE5;
  --color-tinta: #2B2622;
  --color-tinta-2: #77706A;
  --color-fio: #DCD6CC;
  --color-carimbo: #2F5AA8;
  --color-tijolo: #B4462E;
  --color-plate: #FFFFFF;

  --radius-chip: 8px;
  --radius-ios: 10px;
  --radius-modal: 20px;
  --radius-sheet: 24px;
}

:root {
  color-scheme: light dark;
}

.escuro {
  --color-papel: #211E1A;
  --color-papel-2: #2A2622;
  --color-tinta: #EDE7DD;
  --color-tinta-2: #A79E93;
  --color-fio: #423C36;
  --color-carimbo: #6E9BE0;
  --color-tijolo: #E0785C;
  --color-plate: #16130F;
}

body {
  background: var(--color-papel);
  color: var(--color-tinta);
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.294;
  letter-spacing: -0.013em;
  -webkit-font-smoothing: antialiased;
}

.mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }

:focus-visible {
  outline: 2px solid var(--color-carimbo);
  outline-offset: 2px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Verificar visualmente**

Run: `npm run dev`
Expected: a página do template abre com fundo bone quente (`#FCFAF5`) e texto quase-preto quente, não o cinza padrão do Vite.

- [ ] **Step 4: Commit**

```bash
git add app/src/index.css
git commit -m "feat: tokens da direcao de arte Protocolo (paleta, fontes, escala)"
```

---

## Task 3: Tipos e dados do plano

**Files:**
- Create: `app/src/data/tipos.ts`, `app/src/data/plano.ts`, `app/src/data/metadados.ts`, `app/src/data/duracoes.ts`, `app/src/data/semana.ts`, `app/src/data/editorial.ts`
- Fonte de verdade: `index.html` linhas 254–552 e `test/duracoes.json`

- [ ] **Step 1: Escrever `app/src/data/tipos.ts`**

```ts
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
```

- [ ] **Step 2: Gerar `plano.ts` a partir do legado**

Não transcreva à mão. Rode este script uma vez, da raiz do projeto, e depois confira o resultado:

```bash
node --input-type=module -e "
import { readFileSync, writeFileSync } from 'node:fs'
const linhas = readFileSync('index.html','utf8').split(/\r?\n/)
const bloco = linhas.slice(253, 552).join('\n')
const { DATA, ORDEM } = new Function(bloco + '\nreturn { DATA, ORDEM };')()
const ex = x => ({
  id: x.id, nome: x.nome, prescricao: x.sets, video: x.video,
  recorte: x.t ? { inicio: x.t.start, fim: x.t.end } : undefined,
  cues: x.cues, unilateral: !!x.uni, busca: x.busca,
  alternativos: (x.alt||[]).map(a => ({ nome: a.n, video: a.v, inicio: a.t && a.t.start })),
})
const divs = ORDEM.map(k => ({
  chave: k, rotulo: DATA[k].label, titulo: DATA[k].titulo, lede: DATA[k].lede,
  custom: DATA[k].custom,
  blocos: (DATA[k].blocos||[]).map(b => ({ nome: b.nome, sub: b.sub, exercicios: b.ex.map(ex) })),
}))
writeFileSync('app/src/data/plano.ts',
  'import type { Divisao } from \'./tipos\'\n\n' +
  'export const PLANO: Divisao[] = ' + JSON.stringify(divs, null, 2) + '\n')
console.log('exercicios:', divs.flatMap(d=>d.blocos).flatMap(b=>b.exercicios).length)
"
```

Expected: `exercicios: 47`

- [ ] **Step 3: Adicionar o aviso final do Circuito ao `plano.ts`**

Na divisão `circuito`, acrescente a chave:

```ts
avisoFinal: {
  titulo: 'Saltos e pliometria',
  texto: 'Só entram se o fisio liberar e se a perna operada tiver pelo menos 90% da força e do salto unipodal da perna boa.',
},
```

- [ ] **Step 4: Gerar `duracoes.ts`**

```bash
node --input-type=module -e "
import { readFileSync, writeFileSync } from 'node:fs'
const d = JSON.parse(readFileSync('test/duracoes.json','utf8'))
writeFileSync('app/src/data/duracoes.ts',
  'export const DURACOES: Record<string, number> = ' + JSON.stringify(d, null, 2) + '\n')
console.log('videos:', Object.keys(d).length)
"
```

Expected: `videos: 47`

- [ ] **Step 5: Escrever `metadados.ts`**

Copie o conteúdo de `docs/dados/metadados-exercicios.json` (gravado pela pesquisa; se não existir, veja a nota no fim desta task) para:

```ts
import type { Metadados } from './tipos'

export const METADADOS: Record<string, Metadados> = {
  'mob-tornozelo': {
    musculoPrimario: 'Panturrilha (sóleo)',
    musculosSecundarios: ['Tibial anterior'],
    equipamento: 'Peso do corpo',
    padraoMovimento: 'Mobilidade',
    porQue: 'Sem dorsiflexão, o joelho operado paga a conta em todo agachamento.',
  },
  // ... os 47
}
```

**Importante:** o campo `unilateral` NÃO vem daqui. Vem de `plano.ts`, que reflete os 13 `uni:true` do legado.

- [ ] **Step 6: Escrever `semana.ts`**

```ts
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
```

- [ ] **Step 7: Escrever `editorial.ts`**

Fonte: `index.html`, funções `corridaHTML()` (linha 630) e `guiaHTML()` (linha 684). Copie o texto **palavra por palavra**, com uma exceção registrada na spec: no parágrafo "Como progredir a carga", **remova** a frase *"Anote tudo no campo de carga de cada exercício — sem anotar, não existe progressão."* — o campo de carga não existe mais.

```ts
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
```

- [ ] **Step 8: Commit**

```bash
git add app/src/data
git commit -m "feat: camada de dados tipada (plano, metadados, duracoes, semana, editorial)"
```

---

## Task 4: Modelo derivado e testes de integridade

Esta é a task que protege o ativo do produto. Escreva os testes primeiro.

**Files:**
- Create: `app/src/data/index.ts`, `app/src/data/index.test.ts`

- [ ] **Step 1: Escrever os testes que falham**

`app/src/data/index.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { DURACOES } from './duracoes'
import { METADADOS } from './metadados'
import { DIVISOES, ESTATISTICAS, TODOS_EXERCICIOS, buscarExercicio } from './index'

describe('integridade do plano', () => {
  it('tem 47 exercícios', () => {
    expect(TODOS_EXERCICIOS).toHaveLength(47)
  })

  it('não tem ids duplicados', () => {
    const ids = TODOS_EXERCICIOS.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todo recorte tem fim maior que início', () => {
    for (const e of TODOS_EXERCICIOS) {
      if (e.recorte) expect(e.recorte.fim).toBeGreaterThan(e.recorte.inicio)
    }
  })

  it('todo recorte cabe dentro da duração do vídeo', () => {
    for (const e of TODOS_EXERCICIOS) {
      if (e.recorte) expect(e.recorte.fim).toBeLessThanOrEqual(DURACOES[e.video])
    }
  })

  it('todo videoId tem duração conhecida, inclusive dos alternativos', () => {
    for (const e of TODOS_EXERCICIOS) {
      expect(DURACOES[e.video]).toBeGreaterThan(0)
      for (const a of e.alternativos) expect(DURACOES[a.video]).toBeGreaterThan(0)
    }
  })

  it('todo exercício tem metadado e todo metadado tem exercício', () => {
    const ids = new Set(TODOS_EXERCICIOS.map((e) => e.id))
    for (const e of TODOS_EXERCICIOS) expect(METADADOS[e.id]).toBeDefined()
    for (const id of Object.keys(METADADOS)) expect(ids.has(id)).toBe(true)
  })

  it('todo exercício tem ao menos um cue', () => {
    for (const e of TODOS_EXERCICIOS) expect(e.cues.length).toBeGreaterThan(0)
  })

  it('tem exatamente 13 exercícios unilaterais', () => {
    expect(TODOS_EXERCICIOS.filter((e) => e.unilateral)).toHaveLength(13)
  })

  it('tem 37 recortes e 10 exercícios sem recorte', () => {
    expect(TODOS_EXERCICIOS.filter((e) => e.recorte)).toHaveLength(37)
    expect(TODOS_EXERCICIOS.filter((e) => !e.recorte)).toHaveLength(10)
  })
})

describe('numeração de protocolo', () => {
  it('numera as divisões de 01 a 07', () => {
    expect(DIVISOES.map((d) => d.numero)).toEqual(['01', '02', '03', '04', '05', '06', '07'])
  })

  it('dá endereço divisão.posição a cada exercício', () => {
    const primeiro = DIVISOES[0].blocos[0].exercicios[0]
    expect(primeiro.numero).toBe('1.1')
  })

  it('numera continuamente dentro da divisão, atravessando blocos', () => {
    const aquecer = DIVISOES[0]
    const numeros = aquecer.blocos.flatMap((b) => b.exercicios.map((e) => e.numero))
    expect(numeros).toEqual(numeros.map((_, i) => `1.${i + 1}`))
  })
})

describe('estatísticas', () => {
  it('calcula 711s úteis e 8385s brutos', () => {
    expect(ESTATISTICAS.totalUtil).toBe(711)
    expect(ESTATISTICAS.totalBruto).toBe(8385)
  })
})

describe('buscarExercicio', () => {
  it('acha por id', () => {
    expect(buscarExercicio('a-agacha')?.nome).toContain('Agachamento')
  })

  it('devolve undefined para id inexistente', () => {
    expect(buscarExercicio('nao-existe')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./index"`

- [ ] **Step 3: Escrever `app/src/data/index.ts`**

```ts
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
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS, 15 testes.

Se `totalBruto` não der 8385, algum videoId de `duracoes.ts` não casa com `plano.ts` — o teste de "duração conhecida" vai apontar qual.

- [ ] **Step 5: Commit**

```bash
git add app/src/data
git commit -m "feat: modelo derivado com numeracao de protocolo e testes de integridade"
```

---

## Task 5: Formatação e router de hash

**Files:**
- Create: `app/src/lib/formato.ts`, `app/src/lib/formato.test.ts`, `app/src/lib/rota.ts`, `app/src/lib/rota.test.ts`

- [ ] **Step 1: Testes de `formato.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { mmss, urlBusca, urlYouTube } from './formato'

describe('mmss', () => {
  it('formata segundos como m:ss', () => {
    expect(mmss(33)).toBe('0:33')
    expect(mmss(711)).toBe('11:51')
    expect(mmss(8385)).toBe('139:45')
  })
})

describe('urlYouTube', () => {
  it('monta a url com o segundo exato', () => {
    expect(urlYouTube('abc123', 33)).toBe('https://www.youtube.com/watch?v=abc123&t=33s')
  })

  it('omite o t quando não há início', () => {
    expect(urlYouTube('abc123')).toBe('https://www.youtube.com/watch?v=abc123')
  })
})

describe('urlBusca', () => {
  it('codifica a query', () => {
    expect(urlBusca('ponte de glúteo')).toBe(
      'https://www.youtube.com/results?search_query=ponte%20de%20gl%C3%BAteo',
    )
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test src/lib/formato`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Escrever `app/src/lib/formato.ts`**

```ts
export function mmss(segundos: number): string {
  const s = Math.max(0, Math.round(segundos))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function urlYouTube(video: string, inicio?: number): string {
  const base = `https://www.youtube.com/watch?v=${video}`
  return inicio == null ? base : `${base}&t=${Math.floor(inicio)}s`
}

export function urlBusca(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test src/lib/formato`
Expected: PASS.

- [ ] **Step 5: Testes de `rota.ts`**

```ts
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { irPara, lerRota, useRota } from './rota'

beforeEach(() => {
  window.location.hash = ''
})

describe('lerRota', () => {
  it('usa aquecer quando o hash está vazio', () => {
    expect(lerRota('')).toEqual({ divisao: 'aquecer', exercicio: undefined })
  })

  it('lê a divisão', () => {
    expect(lerRota('#/forcaA')).toEqual({ divisao: 'forcaA', exercicio: undefined })
  })

  it('lê divisão e exercício', () => {
    expect(lerRota('#/forcaA/a-agacha')).toEqual({ divisao: 'forcaA', exercicio: 'a-agacha' })
  })

  it('ignora divisão desconhecida e cai em aquecer', () => {
    expect(lerRota('#/inventada')).toEqual({ divisao: 'aquecer', exercicio: undefined })
  })
})

describe('useRota', () => {
  it('reage a mudança de hash', () => {
    const { result } = renderHook(() => useRota())
    expect(result.current.divisao).toBe('aquecer')
    act(() => {
      irPara('forcaB')
    })
    expect(result.current.divisao).toBe('forcaB')
  })

  it('abre e fecha o exercício', () => {
    const { result } = renderHook(() => useRota())
    act(() => {
      irPara('forcaB', 'b-flexora')
    })
    expect(result.current.exercicio).toBe('b-flexora')
    act(() => {
      irPara('forcaB')
    })
    expect(result.current.exercicio).toBeUndefined()
  })
})
```

- [ ] **Step 6: Rodar e ver falhar**

Run: `npm test src/lib/rota`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 7: Escrever `app/src/lib/rota.ts`**

```ts
import { useSyncExternalStore } from 'react'
import { PLANO } from '@/data/plano'

const CHAVES = new Set(PLANO.map((d) => d.chave as string))
const PADRAO = 'aquecer'

export type Rota = { divisao: string; exercicio?: string }

export function lerRota(hash: string): Rota {
  const partes = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const divisao = partes[0] && CHAVES.has(partes[0]) ? partes[0] : PADRAO
  return { divisao, exercicio: partes[1] || undefined }
}

function assinar(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

export function irPara(divisao: string, exercicio?: string) {
  const alvo = exercicio ? `#/${divisao}/${exercicio}` : `#/${divisao}`
  if (window.location.hash !== alvo) window.location.hash = alvo
  else window.dispatchEvent(new HashChangeEvent('hashchange'))
}

export function useRota(): Rota {
  const hash = useSyncExternalStore(
    assinar,
    () => window.location.hash,
    () => '',
  )
  return lerRota(hash)
}
```

- [ ] **Step 8: Rodar e ver passar**

Run: `npm test src/lib`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add app/src/lib
git commit -m "feat: formatacao e router de hash sem dependencias"
```

---

## Task 6: Loader da IFrame API e o hook do recorte

O coração do app. Leia a seção 4 da spec antes de começar.

**Files:**
- Create: `app/src/lib/youtube.ts`, `app/src/hooks/useYouTubeClip.ts`, `app/src/hooks/useYouTubeClip.test.tsx`

- [ ] **Step 1: Escrever `app/src/lib/youtube.ts`**

Singleton com Promise em escopo de módulo. Encadeia o callback global anterior em vez de sobrescrever — sem isso o duplo mount do StrictMode perde o segundo player.

```ts
let promessa: Promise<typeof YT> | null = null

export const ehFileProtocol = () =>
  typeof window !== 'undefined' && window.location.protocol === 'file:'

export function carregarApiYouTube(timeoutMs = 3000): Promise<typeof YT> {
  if (ehFileProtocol()) return Promise.reject(new Error('file-protocol'))
  if (promessa) return promessa

  promessa = new Promise<typeof YT>((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT)

    const anterior = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      anterior?.()
      resolve(window.YT)
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.onerror = () => reject(new Error('script-falhou'))
    document.head.appendChild(script)

    setTimeout(() => reject(new Error('timeout')), timeoutMs)
  })

  promessa.catch(() => {
    promessa = null
  })

  return promessa
}
```

- [ ] **Step 2: Escrever o teste do hook**

O `YT` falso permite dirigir o tempo e verificar o comportamento do watchdog.

```tsx
import { act, render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useYouTubeClip } from './useYouTubeClip'

let tempoAtual = 0
let aoPronto: (() => void) | null = null
const seekTo = vi.fn()
const playVideo = vi.fn()
const destroy = vi.fn()

class PlayerFalso {
  constructor(_host: HTMLElement, opcoes: { events: { onReady: (e: unknown) => void } }) {
    aoPronto = () => opcoes.events.onReady({ target: this })
  }
  getCurrentTime() { return tempoAtual }
  getDuration() { return 300 }
  seekTo(...args: unknown[]) { seekTo(...args) }
  playVideo() { playVideo() }
  mute() {}
  destroy() { destroy() }
}

beforeEach(() => {
  tempoAtual = 0
  seekTo.mockClear(); playVideo.mockClear(); destroy.mockClear()
  vi.stubGlobal('YT', { Player: PlayerFalso, PlayerState: { PLAYING: 1, ENDED: 0 } })
})

function Sonda({ ativo = true }: { ativo?: boolean }) {
  const { ref } = useYouTubeClip({ video: 'abc', inicio: 30, fim: 40, ativo })
  return <div ref={ref} data-testid="host" />
}

describe('useYouTubeClip', () => {
  it('cria o player e chama onReady', async () => {
    render(<Sonda />)
    await waitFor(() => expect(aoPronto).not.toBeNull())
    act(() => { aoPronto?.() })
    expect(playVideo).toHaveBeenCalled()
  })

  it('volta ao início quando passa do fim', async () => {
    render(<Sonda />)
    await waitFor(() => expect(aoPronto).not.toBeNull())
    act(() => { aoPronto?.() })
    tempoAtual = 39.95
    await act(async () => { await new Promise((r) => requestAnimationFrame(() => r(null))) })
    expect(seekTo).toHaveBeenCalledWith(30, true)
  })

  it('não dispara seek em rajada dentro do guard', async () => {
    render(<Sonda />)
    await waitFor(() => expect(aoPronto).not.toBeNull())
    act(() => { aoPronto?.() })
    tempoAtual = 39.95
    for (let i = 0; i < 10; i++) {
      await act(async () => { await new Promise((r) => requestAnimationFrame(() => r(null))) })
    }
    expect(seekTo).toHaveBeenCalledTimes(1)
  })

  it('destrói o player no unmount', async () => {
    const { unmount } = render(<Sonda />)
    await waitFor(() => expect(aoPronto).not.toBeNull())
    act(() => { aoPronto?.() })
    unmount()
    expect(destroy).toHaveBeenCalled()
  })
})
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npm test useYouTubeClip`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 4: Escrever `app/src/hooks/useYouTubeClip.ts`**

```ts
import { useCallback, useEffect, useRef, useState } from 'react'
import { carregarApiYouTube, ehFileProtocol } from '@/lib/youtube'

const EPSILON = 0.08
const GUARD_MS = 400

export type EstadoClipe =
  | 'ocioso' | 'carregando' | 'tocando' | 'bloqueado' | 'erro' | 'indisponivel'

export type OpcoesClipe = {
  video: string
  inicio?: number
  fim?: number
  ativo: boolean
}

export function useYouTubeClip({ video, inicio, fim, ativo }: OpcoesClipe) {
  const ref = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const [estado, setEstado] = useState<EstadoClipe>('ocioso')
  const [codigoErro, setCodigoErro] = useState<number | null>(null)

  const tocar = useCallback(() => {
    try { playerRef.current?.playVideo() } catch { /* player ainda não pronto */ }
  }, [])

  useEffect(() => {
    if (!ativo) return
    if (ehFileProtocol()) { setEstado('indisponivel'); return }

    const container = ref.current
    if (!container) return

    let descartado = false
    let raf = 0
    let guardAte = 0

    setEstado('carregando')

    // YT.Player SUBSTITUI o nó que recebe. Nunca passe um nó do React.
    const host = document.createElement('div')
    container.replaceChildren(host)

    const guardProporcional =
      inicio != null && fim != null ? Math.min(GUARD_MS, (fim - inicio) * 1000 * 0.4) : GUARD_MS

    const voltarAoInicio = (player: YT.Player) => {
      if (inicio == null) return
      if (performance.now() < guardAte) return
      guardAte = performance.now() + guardProporcional
      try { player.seekTo(inicio, true); player.playVideo() } catch { /* ignorado */ }
    }

    const vigiar = (player: YT.Player) => {
      raf = requestAnimationFrame(() => {
        if (descartado) return
        try {
          if (fim != null && player.getCurrentTime() >= fim - EPSILON) voltarAoInicio(player)
        } catch { /* leitura antes do infoDelivery */ }
        vigiar(player)
      })
    }

    carregarApiYouTube()
      .then((api) => {
        if (descartado) return
        const player = new api.Player(host, {
          videoId: video,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            rel: 0,
            playsinline: 1,
            mute: 1,
            autoplay: 1,
            controls: 1,
            ...(inicio != null ? { start: Math.floor(inicio) } : {}),
            ...(fim != null ? { end: Math.ceil(fim) } : {}),
          },
          events: {
            onReady: (evento) => {
              if (descartado) return
              playerRef.current = evento.target
              try { evento.target.mute(); evento.target.playVideo() } catch { /* ignorado */ }
              if (fim != null) vigiar(evento.target)
            },
            onStateChange: (evento) => {
              if (evento.data === 1) setEstado('tocando')
              if (evento.data === 0) voltarAoInicio(evento.target)
            },
            onError: (evento) => { setCodigoErro(evento.data); setEstado('erro') },
            onAutoplayBlocked: () => setEstado('bloqueado'),
          },
        } as YT.PlayerOptions)
        playerRef.current = player
      })
      .catch(() => { if (!descartado) setEstado('indisponivel') })

    return () => {
      descartado = true
      cancelAnimationFrame(raf)
      try { playerRef.current?.destroy() } catch { /* destroy antes do onReady */ }
      playerRef.current = null
      container.replaceChildren()
    }
  }, [video, inicio, fim, ativo])

  return { ref, estado, codigoErro, tocar }
}
```

- [ ] **Step 5: Rodar e ver passar**

Run: `npm test useYouTubeClip`
Expected: PASS, 4 testes.

- [ ] **Step 6: Commit**

```bash
git add app/src/lib/youtube.ts app/src/hooks
git commit -m "feat: loader singleton da IFrame API e hook de loop de recorte"
```

---

## Task 7: `BarraTrecho` — a assinatura

**Files:**
- Create: `app/src/components/BarraTrecho.tsx`, `app/src/components/BarraTrecho.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BarraTrecho } from './BarraTrecho'

describe('BarraTrecho', () => {
  it('posiciona a janela proporcionalmente à duração total', () => {
    render(<BarraTrecho duracao={100} inicio={20} fim={40} />)
    const janela = screen.getByTestId('janela')
    expect(janela).toHaveStyle({ left: '20%', width: '20%' })
  })

  it('descreve a economia para leitores de tela', () => {
    render(<BarraTrecho duracao={100} inicio={20} fim={40} />)
    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Trecho de 0:20 a 0:40 dentro de um vídeo de 1:40',
    )
  })

  it('não quebra quando a duração é zero', () => {
    render(<BarraTrecho duracao={0} inicio={0} fim={0} />)
    expect(screen.getByTestId('janela')).toHaveStyle({ width: '0%' })
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test BarraTrecho`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Escrever `app/src/components/BarraTrecho.tsx`**

```tsx
import { mmss } from '@/lib/formato'

type Props = { duracao: number; inicio: number; fim: number; progresso?: number }

export function BarraTrecho({ duracao, inicio, fim, progresso }: Props) {
  const pct = (v: number) => (duracao > 0 ? (v / duracao) * 100 : 0)
  const esquerda = pct(inicio)
  const largura = Math.max(0, pct(fim) - esquerda)

  return (
    <div
      role="img"
      aria-label={`Trecho de ${mmss(inicio)} a ${mmss(fim)} dentro de um vídeo de ${mmss(duracao)}`}
      className="relative mt-2 h-[3px] w-full bg-fio"
    >
      <div
        data-testid="janela"
        className="absolute inset-y-0 bg-carimbo"
        style={{ left: `${esquerda}%`, width: `${largura}%` }}
      />
      {progresso != null && largura > 0 && (
        <div
          data-testid="playhead"
          className="absolute inset-y-[-2px] w-[2px] bg-tinta"
          style={{ left: `${esquerda + largura * progresso}%` }}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test BarraTrecho`
Expected: PASS, 3 testes.

- [ ] **Step 5: Commit**

```bash
git add app/src/components/BarraTrecho.tsx app/src/components/BarraTrecho.test.tsx
git commit -m "feat: barra do trecho mostrando a janela curada dentro do video bruto"
```

---

## Task 8: `PranchaFigura` — player, moldura, legenda e fallbacks

**Files:**
- Create: `app/src/components/PranchaFigura.tsx`, `app/src/components/PranchaFigura.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PranchaFigura } from './PranchaFigura'

const base = {
  numero: '2.3',
  nome: 'Ponte de glúteo com miniband',
  video: 'q5U-p6vA3uo',
  duracao: 300,
  inicio: 33,
  fim: 68,
}

describe('PranchaFigura', () => {
  it('mostra o pôster antes de qualquer player (facade)', () => {
    render(<PranchaFigura {...base} />)
    expect(screen.getByRole('button', { name: /ver execução/i })).toBeInTheDocument()
    expect(document.querySelector('iframe')).toBeNull()
  })

  it('escreve a legenda com número, timecode e loop', () => {
    render(<PranchaFigura {...base} />)
    expect(screen.getByText(/Fig\. 2\.3/)).toBeInTheDocument()
    expect(screen.getByText(/0:33–1:08/)).toBeInTheDocument()
    expect(screen.getByText(/em loop/)).toBeInTheDocument()
  })

  it('omite "em loop" quando não há recorte', () => {
    render(<PranchaFigura {...base} inicio={undefined} fim={undefined} />)
    expect(screen.queryByText(/em loop/)).not.toBeInTheDocument()
  })

  it('sempre oferece o link permanente no segundo exato', () => {
    render(<PranchaFigura {...base} />)
    expect(screen.getByRole('link', { name: /abrir no youtube/i })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=q5U-p6vA3uo&t=33s',
    )
  })

  it('ativa o player ao tocar no pôster', async () => {
    vi.stubGlobal('YT', undefined)
    const usuario = userEvent.setup()
    render(<PranchaFigura {...base} />)
    await usuario.click(screen.getByRole('button', { name: /ver execução/i }))
    expect(screen.queryByRole('button', { name: /ver execução/i })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test PranchaFigura`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Escrever `app/src/components/PranchaFigura.tsx`**

Facade: nada do YouTube carrega até o toque. `aspect-video` reserva a caixa no primeiro paint — CLS zero. Moldura de filete único sobre `--plate`.

```tsx
import { useState } from 'react'
import { useYouTubeClip } from '@/hooks/useYouTubeClip'
import { mmss, urlYouTube } from '@/lib/formato'
import { BarraTrecho } from './BarraTrecho'

type Props = {
  numero: string
  nome: string
  video: string
  duracao: number
  inicio?: number
  fim?: number
}

const MENSAGENS: Record<number, string> = {
  100: 'Este vídeo foi removido ou está privado.',
  101: 'O dono deste vídeo não permite que ele seja incorporado.',
  150: 'O dono deste vídeo não permite que ele seja incorporado.',
  153: 'Este vídeo não pode ser incorporado a partir de um arquivo local.',
}

export function PranchaFigura({ numero, nome, video, duracao, inicio, fim }: Props) {
  const [ativo, setAtivo] = useState(false)
  const { ref, estado, codigoErro, tocar } = useYouTubeClip({ video, inicio, fim, ativo })
  const temRecorte = inicio != null && fim != null

  return (
    <figure className="m-0">
      <div className="relative aspect-video w-full overflow-hidden border border-fio bg-plate">
        <div ref={ref} className="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0" />

        {!ativo && (
          <button
            type="button"
            onClick={() => setAtivo(true)}
            className="absolute inset-0 grid place-items-center bg-cover bg-center"
            style={{ backgroundImage: `url(https://i.ytimg.com/vi/${video}/hqdefault.jpg)` }}
          >
            <span className="bg-tinta px-4 py-2 font-mono text-[13px] font-medium text-papel">
              Ver execução
            </span>
          </button>
        )}

        {estado === 'bloqueado' && (
          <button
            type="button"
            onClick={tocar}
            className="absolute inset-0 grid place-items-center bg-black/50 text-papel"
          >
            <span className="font-mono text-[13px]">Toque para tocar</span>
          </button>
        )}

        {(estado === 'erro' || estado === 'indisponivel') && (
          <div className="absolute inset-0 grid place-items-center bg-papel-2 p-4 text-center">
            <p className="max-w-[36ch] text-[15px] text-tinta-2">
              {(codigoErro != null && MENSAGENS[codigoErro]) ||
                'Não foi possível carregar o vídeo aqui.'}
            </p>
          </div>
        )}
      </div>

      {temRecorte && <BarraTrecho duracao={duracao} inicio={inicio} fim={fim} />}

      <figcaption className="mt-2 font-mono text-[13px] tracking-[-0.003em] text-tinta-2">
        Fig. {numero} — {nome}
        {temRecorte && <> · {mmss(inicio)}–{mmss(fim)} · em loop</>}
        {' · '}
        <a
          className="text-carimbo underline underline-offset-2"
          href={urlYouTube(video, inicio)}
          target="_blank"
          rel="noopener"
        >
          Abrir no YouTube
        </a>
      </figcaption>
    </figure>
  )
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test PranchaFigura`
Expected: PASS, 5 testes.

- [ ] **Step 5: Commit**

```bash
git add app/src/components/PranchaFigura.tsx app/src/components/PranchaFigura.test.tsx
git commit -m "feat: prancha de figura com facade, fallbacks e legenda de protocolo"
```

---

## Task 9: `SheetExercicio`

**Files:**
- Create: `app/src/components/SheetExercicio.tsx`, `app/src/components/SheetExercicio.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { buscarExercicio } from '@/data'
import { SheetExercicio } from './SheetExercicio'

const exercicio = buscarExercicio('a-agacha')!

describe('SheetExercicio', () => {
  it('mostra nome, número e prescrição', () => {
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={() => {}} />)
    expect(screen.getByText(exercicio.nome)).toBeInTheDocument()
    expect(screen.getByText(exercicio.numero)).toBeInTheDocument()
    expect(screen.getByText(exercicio.prescricao)).toBeInTheDocument()
  })

  it('lista todos os cues, numerados', () => {
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={() => {}} />)
    for (const cue of exercicio.cues) expect(screen.getByText(cue)).toBeInTheDocument()
    expect(screen.getByText(`${exercicio.numero}.1`)).toBeInTheDocument()
  })

  it('mostra o motivo do exercício estar no plano', () => {
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={() => {}} />)
    expect(screen.getByText(exercicio.meta.porQue)).toBeInTheDocument()
  })

  it('oferece os vídeos alternativos', () => {
    const comAlt = buscarExercicio('a-agacha')!
    render(<SheetExercicio exercicio={comAlt} aberto onFechar={() => {}} />)
    for (const alt of comAlt.alternativos) {
      expect(screen.getByRole('link', { name: alt.nome })).toBeInTheDocument()
    }
  })

  it('fecha com Escape', async () => {
    const onFechar = vi.fn()
    const usuario = userEvent.setup()
    render(<SheetExercicio exercicio={exercicio} aberto onFechar={onFechar} />)
    await usuario.keyboard('{Escape}')
    expect(onFechar).toHaveBeenCalled()
  })

  it('não renderiza nada quando fechado', () => {
    render(<SheetExercicio exercicio={exercicio} aberto={false} onFechar={() => {}} />)
    expect(screen.queryByText(exercicio.nome)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test SheetExercicio`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Escrever `app/src/components/SheetExercicio.tsx`**

Use `Dialog` do shadcn (Base UI) para toda a mecânica de acessibilidade — focus trap, `inert` no fundo, Escape, retorno de foco. Classes responsivas fazem o papel de bottom sheet abaixo de 640px e de modal centrado acima.

Detecção de cue de risco: um cue entra em `--tijolo` quando começa com "Não", "Nunca", "Sem ", "Se sentir", "Pare" ou contém "dor". Isso reproduz a classe `.warn` do legado sem exigir marcação nova nos dados.

```tsx
import { AnimatePresence, motion } from 'motion/react'
import type { ExercicioResolvido } from '@/data'
import { urlBusca, urlYouTube } from '@/lib/formato'
import { PranchaFigura } from './PranchaFigura'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

const RISCO = /^(não|nunca|sem |se sentir|pare)|dor/i

type Props = { exercicio: ExercicioResolvido; aberto: boolean; onFechar: () => void }

export function SheetExercicio({ exercicio, aberto, onFechar }: Props) {
  return (
    <Dialog open={aberto} onOpenChange={(v) => !v && onFechar()}>
      <AnimatePresence>
        {aberto && (
          <DialogContent
            showCloseButton
            className="max-h-[92dvh] gap-0 overflow-y-auto rounded-t-[24px] border-fio bg-papel p-0 sm:max-h-[88dvh] sm:max-w-[640px] sm:rounded-[20px]"
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: 'spring', visualDuration: 0.45, bounce: 0.12 }}
              className="p-5 pb-[max(24px,env(safe-area-inset-bottom))]"
            >
              <p className="font-mono text-[13px] font-medium text-carimbo">{exercicio.numero}</p>

              <DialogTitle className="mt-1 font-display text-[20px] font-medium leading-[1.25] tracking-[-0.017em] text-tinta">
                {exercicio.nome}
              </DialogTitle>

              <p className="mt-1 font-mono text-[13px] text-tinta-2">
                <span className="text-tinta">{exercicio.prescricao}</span>
                {' · '}{exercicio.meta.equipamento}
                {' · '}{exercicio.meta.musculoPrimario}
                {exercicio.unilateral && ' · unilateral'}
              </p>

              <div className="mt-4">
                <PranchaFigura
                  numero={exercicio.numero}
                  nome={exercicio.nome}
                  video={exercicio.video}
                  duracao={exercicio.duracaoVideo}
                  inicio={exercicio.recorte?.inicio}
                  fim={exercicio.recorte?.fim}
                />
              </div>

              <ol className="mt-6 list-none space-y-3 p-0">
                {exercicio.cues.map((cue, i) => (
                  <li key={cue} className="grid grid-cols-[44px_1fr] gap-2">
                    <span className="font-mono text-[13px] text-tinta-2">
                      {exercicio.numero}.{i + 1}
                    </span>
                    <span
                      className={`text-[17px] leading-[1.47] ${RISCO.test(cue) ? 'text-tijolo' : 'text-tinta'}`}
                    >
                      {cue}
                    </span>
                  </li>
                ))}
              </ol>

              <p className="mt-6 border-t border-fio pt-4 text-[15px] text-tinta-2">
                <span className="font-mono text-[12px] uppercase tracking-[0.04em]">
                  Por que está no plano
                </span>
                <br />
                {exercicio.meta.porQue}
              </p>

              {(exercicio.alternativos.length > 0 || exercicio.busca) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exercicio.alternativos.map((alt) => (
                    <a
                      key={alt.video}
                      href={urlYouTube(alt.video, alt.inicio)}
                      target="_blank"
                      rel="noopener"
                      className="rounded-chip border border-fio px-3 py-2 text-[15px] text-tinta-2 hover:text-tinta"
                    >
                      {alt.nome}
                    </a>
                  ))}
                  {exercicio.busca && (
                    <a
                      href={urlBusca(exercicio.busca)}
                      target="_blank"
                      rel="noopener"
                      className="rounded-chip border border-fio px-3 py-2 text-[15px] text-tinta-2 hover:text-tinta"
                    >
                      Outros vídeos
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test SheetExercicio`
Expected: PASS, 6 testes. Se algum falhar por visibilidade, confirme que está usando `toBeInTheDocument()` e não `toBeVisible()` — `motion` com `initial` deixa `opacity:0` no jsdom.

- [ ] **Step 5: Commit**

```bash
git add app/src/components/SheetExercicio.tsx app/src/components/SheetExercicio.test.tsx
git commit -m "feat: sheet do exercicio com prancha, cues numerados e alternativos"
```

---

## Task 10: Lista, linha e índice de divisões

**Files:**
- Create: `app/src/components/LinhaExercicio.tsx`, `app/src/components/ListaExercicios.tsx`, `app/src/components/IndiceDivisoes.tsx`, `app/src/components/ListaExercicios.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { buscarDivisao } from '@/data'
import { ListaExercicios } from './ListaExercicios'

const forcaA = buscarDivisao('forcaA')!

describe('ListaExercicios', () => {
  it('mostra os cabeçalhos de bloco', () => {
    render(<ListaExercicios divisao={forcaA} onAbrir={() => {}} />)
    for (const bloco of forcaA.blocos) {
      expect(screen.getByText(bloco.nome)).toBeInTheDocument()
    }
  })

  it('mostra os 13 exercícios com número e prescrição', () => {
    render(<ListaExercicios divisao={forcaA} onAbrir={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(13)
    expect(screen.getByText('2.1')).toBeInTheDocument()
  })

  it('avisa quando o exercício não tem clipe', () => {
    render(<ListaExercicios divisao={forcaA} onAbrir={() => {}} />)
    expect(screen.getAllByText('sem clipe').length).toBe(
      forcaA.blocos.flatMap((b) => b.exercicios).filter((e) => !e.recorte).length,
    )
  })

  it('chama onAbrir com o id ao clicar', async () => {
    const onAbrir = vi.fn()
    const usuario = userEvent.setup()
    render(<ListaExercicios divisao={forcaA} onAbrir={onAbrir} />)
    await usuario.click(screen.getAllByRole('button')[0])
    expect(onAbrir).toHaveBeenCalledWith('a-agacha')
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test ListaExercicios`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Escrever `app/src/components/LinhaExercicio.tsx`**

Sem chevron, sem checkbox: a linha inteira é o alvo, com no mínimo 44px de altura.

```tsx
import { motion } from 'motion/react'
import type { ExercicioResolvido } from '@/data'
import { mmss } from '@/lib/formato'

type Props = { exercicio: ExercicioResolvido; onAbrir: (id: string) => void }

export function LinhaExercicio({ exercicio, onAbrir }: Props) {
  const recorte = exercicio.recorte

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', visualDuration: 0.25, bounce: 0 }}
      onClick={() => onAbrir(exercicio.id)}
      className="grid w-full grid-cols-[44px_1fr_auto] items-baseline gap-2 border-b border-fio py-3.5 text-left"
    >
      <span className="font-mono text-[13px] font-medium text-carimbo">{exercicio.numero}</span>

      <span>
        <span className="block text-[17px] font-semibold leading-[1.294] tracking-[-0.013em] text-tinta">
          {exercicio.nome}
        </span>
        <span className="mt-0.5 block font-mono text-[13px] text-tinta-2">
          {recorte ? `${mmss(recorte.fim - recorte.inicio)} de clipe` : 'sem clipe'}
          {exercicio.unilateral && ' · unilateral'}
        </span>
      </span>

      <span className="font-mono text-[15px] font-medium text-tinta-2">{exercicio.prescricao}</span>
    </motion.button>
  )
}
```

- [ ] **Step 4: Escrever `app/src/components/ListaExercicios.tsx`**

```tsx
import type { DivisaoResolvida } from '@/data'
import { LinhaExercicio } from './LinhaExercicio'

type Props = { divisao: DivisaoResolvida; onAbrir: (id: string) => void }

export function ListaExercicios({ divisao, onAbrir }: Props) {
  return (
    <div>
      {divisao.blocos.map((bloco) => (
        <section key={bloco.nome} className="mt-8 first:mt-0">
          <div className="border-b-2 border-carimbo bg-papel-2 px-3 py-2">
            <h3 className="font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-tinta">
              {bloco.nome}
            </h3>
            <p className="font-mono text-[12px] text-tinta-2">{bloco.sub}</p>
          </div>
          {bloco.exercicios.map((exercicio) => (
            <LinhaExercicio key={exercicio.id} exercicio={exercicio} onAbrir={onAbrir} />
          ))}
        </section>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Escrever `app/src/components/IndiceDivisoes.tsx`**

A ativa é marcada por um filete de 2px sob o número, nunca por pílula preenchida.

```tsx
import { motion } from 'motion/react'
import { DIVISOES } from '@/data'

type Props = { atual: string; onIr: (chave: string) => void }

export function IndiceDivisoes({ atual, onIr }: Props) {
  return (
    <nav
      aria-label="Divisões do plano"
      className="sticky top-0 z-30 -mx-4 flex gap-5 overflow-x-auto border-b border-fio bg-papel/95 px-4 py-3 backdrop-blur [scrollbar-width:none] sm:mx-0 sm:flex-col sm:gap-3 sm:border-b-0 sm:border-r sm:px-0 sm:pr-5"
    >
      {DIVISOES.map((divisao) => {
        const ativa = divisao.chave === atual
        return (
          <button
            key={divisao.chave}
            type="button"
            onClick={() => onIr(divisao.chave)}
            aria-current={ativa ? 'page' : undefined}
            className="relative flex-none whitespace-nowrap pb-1 text-left"
          >
            <span className="font-mono text-[12px] text-tinta-2">{divisao.numero}</span>{' '}
            <span
              className={`font-mono text-[12px] uppercase tracking-[0.04em] ${ativa ? 'text-tinta' : 'text-tinta-2'}`}
            >
              {divisao.rotulo}
            </span>
            {ativa && (
              <motion.span
                layoutId="indice-ativo"
                transition={{ type: 'spring', visualDuration: 0.35, bounce: 0.1 }}
                className="absolute inset-x-0 bottom-0 h-[2px] bg-carimbo"
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 6: Rodar e ver passar**

Run: `npm test ListaExercicios`
Expected: PASS, 4 testes.

- [ ] **Step 7: Commit**

```bash
git add app/src/components
git commit -m "feat: lista de exercicios, linha e indice numerado de divisoes"
```

---

## Task 11: Semana, Corrida e Guia

**Files:**
- Create: `app/src/components/TabelaSemana.tsx`, `app/src/components/PainelCorrida.tsx`, `app/src/components/PainelGuia.tsx`, `app/src/hooks/usePreferencias.ts`, `app/src/components/TabelaSemana.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TabelaSemana } from './TabelaSemana'

describe('TabelaSemana', () => {
  it('mostra os 7 dias', () => {
    render(<TabelaSemana />)
    expect(screen.getAllByRole('row')).toHaveLength(8) // cabeçalho + 7
  })

  it('troca de 4 para 3 dias', async () => {
    const usuario = userEvent.setup()
    render(<TabelaSemana />)
    expect(screen.getByText(/Força A \+ corrida leve/)).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: '3 dias' }))
    expect(screen.queryByText(/Força A \+ corrida leve/)).not.toBeInTheDocument()
    expect(screen.getAllByText('Força A').length).toBe(2)
  })

  it('mostra a regra de ouro', () => {
    render(<TabelaSemana />)
    expect(screen.getByText(/nunca coloque corrida intervalada forte/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test TabelaSemana`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Escrever `app/src/hooks/usePreferencias.ts`**

```ts
import { useCallback, useEffect, useState } from 'react'

function ler<T extends string>(chave: string, padrao: T): T {
  try {
    return (localStorage.getItem(chave) as T | null) ?? padrao
  } catch {
    return padrao
  }
}

export function usePreferencia<T extends string>(chave: string, padrao: T) {
  const [valor, setValor] = useState<T>(() => ler(chave, padrao))

  const definir = useCallback(
    (novo: T) => {
      setValor(novo)
      try { localStorage.setItem(chave, novo) } catch { /* modo privado */ }
    },
    [chave],
  )

  return [valor, definir] as const
}

export type Tema = 'claro' | 'escuro' | 'auto'

export function useTema() {
  const [tema, setTema] = usePreferencia<Tema>('treino.tema', 'auto')

  useEffect(() => {
    const escuro =
      tema === 'escuro' ||
      (tema === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('escuro', escuro)
  }, [tema])

  return [tema, setTema] as const
}
```

- [ ] **Step 4: Escrever `app/src/components/TabelaSemana.tsx`**

```tsx
import { REGRA_DE_OURO, SEMANA_3, SEMANA_4 } from '@/data/semana'
import { usePreferencia } from '@/hooks/usePreferencias'

export function TabelaSemana() {
  const [modo, setModo] = usePreferencia<'4' | '3'>('treino.modo', '4')
  const linhas = modo === '4' ? SEMANA_4 : SEMANA_3

  return (
    <section className="mb-8">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h3 className="font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-tinta-2">
          A semana
        </h3>
        <div className="flex gap-4">
          {(['4', '3'] as const).map((opcao) => (
            <button
              key={opcao}
              type="button"
              onClick={() => setModo(opcao)}
              aria-pressed={modo === opcao}
              className={`font-mono text-[12px] uppercase tracking-[0.04em] ${
                modo === opcao ? 'text-tinta underline decoration-carimbo decoration-2 underline-offset-4' : 'text-tinta-2'
              }`}
            >
              {opcao} dias
            </button>
          ))}
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b border-fio pb-2 text-left font-mono text-[12px] uppercase tracking-[0.04em] text-tinta-2">Dia</th>
            <th className="border-b border-fio pb-2 text-left font-mono text-[12px] uppercase tracking-[0.04em] text-tinta-2">Sessão</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr key={linha.dia}>
              <td className="w-[92px] border-b border-fio py-3 align-top font-mono text-[13px] text-tinta-2">
                {linha.dia}
              </td>
              <td className={`border-b border-fio py-3 align-top text-[17px] ${linha.descanso ? 'text-tinta-2' : 'text-tinta'}`}>
                {linha.sessao}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 border-l-2 border-carimbo pl-3 text-[15px] leading-[1.47] text-tinta-2">
        <strong className="text-tinta">Regra de ouro:</strong> {REGRA_DE_OURO}
      </p>
    </section>
  )
}
```

- [ ] **Step 5: Escrever `app/src/components/PainelCorrida.tsx`**

```tsx
import { CORRIDA } from '@/data/editorial'
import { urlBusca } from '@/lib/formato'
import { TabelaSemana } from './TabelaSemana'

function Cards({ titulo, cards }: { titulo: string; cards: { titulo: string; texto: string }[] }) {
  return (
    <section className="mt-8">
      <h3 className="mb-2 font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-tinta-2">
        {titulo}
      </h3>
      <dl className="m-0">
        {cards.map((card) => (
          <div key={card.titulo} className="border-b border-fio py-3">
            <dt className="text-[17px] font-semibold text-tinta">{card.titulo}</dt>
            <dd className="m-0 mt-1 text-[17px] leading-[1.47] text-tinta-2">{card.texto}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function PainelCorrida() {
  return (
    <div>
      <TabelaSemana />

      <section className="mt-8">
        <h3 className="font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-tinta-2">
          {CORRIDA.retomando.titulo}
        </h3>
        <p className="mt-1 max-w-[60ch] text-[17px] leading-[1.47] text-tinta-2">
          {CORRIDA.retomando.lede}
        </p>
        <table className="mt-3 w-full border-collapse">
          <tbody>
            {CORRIDA.retomando.semanas.map((s) => (
              <tr key={s.semana}>
                <td className="w-[92px] border-b border-fio py-3 font-mono text-[13px] text-tinta-2">
                  Semana {s.semana}
                </td>
                <td className={`border-b border-fio py-3 text-[17px] ${s.leve ? 'text-carimbo' : 'text-tinta'}`}>
                  {s.sessao}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Cards titulo={CORRIDA.jaCorre.titulo} cards={CORRIDA.jaCorre.cards} />
      <Cards titulo={CORRIDA.cuidados.titulo} cards={CORRIDA.cuidados.cards} />

      <div className="mt-6 flex flex-wrap gap-2">
        {CORRIDA.links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener"
            className="rounded-chip border border-fio px-3 py-2 text-[15px] text-tinta-2 hover:text-tinta"
          >
            {link.rotulo}
          </a>
        ))}
        <a
          href={urlBusca(CORRIDA.buscaTecnica)}
          target="_blank"
          rel="noopener"
          className="rounded-chip border border-fio px-3 py-2 text-[15px] text-tinta-2 hover:text-tinta"
        >
          Vídeos de técnica de corrida
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Escrever `app/src/components/PainelGuia.tsx`**

```tsx
import { GUIA } from '@/data/editorial'
import { TabelaSemana } from './TabelaSemana'

export function PainelGuia() {
  return (
    <div>
      <TabelaSemana />
      {GUIA.map((secao, i) => {
        if (secao.tipo === 'nota') {
          return (
            <p key={i} className="mt-8 border-l-2 border-fio pl-3 text-[15px] leading-[1.47] text-tinta-2">
              {secao.texto}
            </p>
          )
        }
        if (secao.tipo === 'alerta') {
          return (
            <p key={i} className="mt-8 border-l-2 border-tijolo pl-3 text-[17px] leading-[1.47] text-tinta">
              <strong>{secao.titulo}:</strong> {secao.texto}
            </p>
          )
        }
        return (
          <section key={i} className="mt-8">
            <h3 className="mb-2 font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-tinta-2">
              {secao.titulo}
            </h3>
            {secao.tipo === 'texto' ? (
              <p className="max-w-[60ch] text-[17px] leading-[1.47] text-tinta">{secao.texto}</p>
            ) : (
              <dl className="m-0">
                {secao.cards.map((card) => (
                  <div key={card.titulo} className="border-b border-fio py-3">
                    <dt className="text-[17px] font-semibold text-tinta">{card.titulo}</dt>
                    <dd className="m-0 mt-1 text-[17px] leading-[1.47] text-tinta-2">{card.texto}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 7: Rodar e ver passar**

Run: `npm test TabelaSemana`
Expected: PASS, 3 testes.

- [ ] **Step 8: Commit**

```bash
git add app/src/components app/src/hooks
git commit -m "feat: tabela da semana, painel de corrida e guia"
```

---

## Task 12: Busca ⌘K

**Files:**
- Create: `app/src/components/Busca.tsx`, `app/src/components/Busca.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Busca } from './Busca'

describe('Busca', () => {
  it('filtra por nome do exercício', async () => {
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
    await usuario.type(screen.getByRole('combobox'), 'agacha')
    expect(screen.getByText(/Agachamento \(barra, goblet ou hack\)/)).toBeInTheDocument()
  })

  it('filtra por músculo', async () => {
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
    await usuario.type(screen.getByRole('combobox'), 'sóleo')
    expect(screen.getByText(/Panturrilha sentada/)).toBeInTheDocument()
  })

  it('mostra estado vazio quando nada casa', async () => {
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={() => {}} />)
    await usuario.type(screen.getByRole('combobox'), 'zzzzzz')
    expect(screen.getByText(/nenhum exercício/i)).toBeInTheDocument()
  })

  it('devolve o exercício escolhido', async () => {
    const onEscolher = vi.fn()
    const usuario = userEvent.setup()
    render(<Busca aberta onFechar={() => {}} onEscolher={onEscolher} />)
    await usuario.type(screen.getByRole('combobox'), 'agacha')
    await usuario.click(screen.getByText(/Agachamento \(barra, goblet ou hack\)/))
    expect(onEscolher).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'a-agacha', divisao: 'forcaA' }),
    )
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test Busca`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Escrever `app/src/components/Busca.tsx`**

```tsx
import { useMemo, useState } from 'react'
import { TODOS_EXERCICIOS, type ExercicioResolvido } from '@/data'
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from './ui/command'

const semAcento = (texto: string) =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const INDICE = TODOS_EXERCICIOS.map((exercicio) => ({
  exercicio,
  chave: semAcento(
    [exercicio.nome, exercicio.meta.musculoPrimario, exercicio.meta.equipamento,
     ...exercicio.meta.musculosSecundarios].join(' '),
  ),
}))

type Props = {
  aberta: boolean
  onFechar: () => void
  onEscolher: (exercicio: ExercicioResolvido) => void
}

export function Busca({ aberta, onFechar, onEscolher }: Props) {
  const [termo, setTermo] = useState('')

  const resultados = useMemo(() => {
    const alvo = semAcento(termo.trim())
    if (!alvo) return INDICE.map((i) => i.exercicio)
    return INDICE.filter((i) => i.chave.includes(alvo)).map((i) => i.exercicio)
  }, [termo])

  return (
    <CommandDialog open={aberta} onOpenChange={(v) => !v && onFechar()} shouldFilter={false}>
      <CommandInput
        value={termo}
        onValueChange={setTermo}
        placeholder="Buscar exercício, músculo ou equipamento…"
      />
      <CommandList>
        <CommandEmpty>Nenhum exercício encontrado.</CommandEmpty>
        <CommandGroup>
          {resultados.map((exercicio) => (
            <CommandItem
              key={exercicio.id}
              value={exercicio.id}
              onSelect={() => onEscolher(exercicio)}
            >
              <span className="font-mono text-[13px] text-carimbo">{exercicio.numero}</span>
              <span className="text-[17px] text-tinta">{exercicio.nome}</span>
              <span className="ml-auto font-mono text-[13px] text-tinta-2">
                {exercicio.meta.musculoPrimario}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test Busca`
Expected: PASS, 4 testes.

Se `CommandInput` não expuser `role="combobox"`, ajuste o seletor do teste para `screen.getByPlaceholderText(/buscar exercício/i)` — a API do cmdk varia entre versões. Confira o componente gerado em `src/components/ui/command.tsx` antes de mudar o teste.

- [ ] **Step 5: Commit**

```bash
git add app/src/components/Busca.tsx app/src/components/Busca.test.tsx
git commit -m "feat: busca por nome, musculo e equipamento com atalho de teclado"
```

---

## Task 13: `AppShell` e `App` — a composição

**Files:**
- Create: `app/src/components/AppShell.tsx`
- Modify: `app/src/App.tsx`, `app/src/main.tsx`, `app/index.html`

- [ ] **Step 1: Escrever `app/src/components/AppShell.tsx`**

```tsx
import type { ReactNode } from 'react'
import { ESTATISTICAS } from '@/data'
import { useTema } from '@/hooks/usePreferencias'
import { mmss } from '@/lib/formato'

type Props = { children: ReactNode; onAbrirBusca: () => void }

export function AppShell({ children, onAbrirBusca }: Props) {
  const [tema, setTema] = useTema()
  const proximo = { auto: 'claro', claro: 'escuro', escuro: 'auto' } as const

  return (
    <div className="mx-auto min-h-dvh max-w-[672px] px-4 pt-[env(safe-area-inset-top)] sm:px-5">
      <header className="flex items-baseline justify-between gap-4 py-5">
        <h1 className="font-display text-[28px] font-medium leading-[1.214] tracking-[-0.021em] text-tinta">
          Protocolo de treino
        </h1>
        <div className="flex flex-none gap-4">
          <button
            type="button"
            onClick={onAbrirBusca}
            className="font-mono text-[12px] uppercase tracking-[0.04em] text-tinta-2 hover:text-tinta"
          >
            Buscar ⌘K
          </button>
          <button
            type="button"
            onClick={() => setTema(proximo[tema])}
            className="font-mono text-[12px] uppercase tracking-[0.04em] text-tinta-2 hover:text-tinta"
          >
            {tema}
          </button>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-12 border-t border-fio py-6 font-mono text-[13px] text-tinta-2">
        {ESTATISTICAS.totalClipes} clipes · {mmss(ESTATISTICAS.totalUtil)} úteis de{' '}
        {mmss(ESTATISTICAS.totalBruto)} brutos
        <br />
        Orientação geral de treino. Não substitui avaliação de fisioterapeuta ou médico.
      </footer>
    </div>
  )
}
```

- [ ] **Step 2: Escrever `app/src/App.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { Busca } from './components/Busca'
import { IndiceDivisoes } from './components/IndiceDivisoes'
import { ListaExercicios } from './components/ListaExercicios'
import { PainelCorrida } from './components/PainelCorrida'
import { PainelGuia } from './components/PainelGuia'
import { SheetExercicio } from './components/SheetExercicio'
import { TabelaSemana } from './components/TabelaSemana'
import { buscarDivisao, buscarExercicio } from './data'
import { irPara, useRota } from './lib/rota'
import { mmss } from './lib/formato'

export default function App() {
  const rota = useRota()
  const [buscaAberta, setBuscaAberta] = useState(false)
  const divisao = buscarDivisao(rota.divisao)!
  const exercicio = rota.exercicio ? buscarExercicio(rota.exercicio) : undefined

  useEffect(() => {
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'k' && (evento.metaKey || evento.ctrlKey)) {
        evento.preventDefault()
        setBuscaAberta((v) => !v)
      }
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [])

  return (
    <AppShell onAbrirBusca={() => setBuscaAberta(true)}>
      <div className="sm:grid sm:grid-cols-[180px_1fr] sm:gap-8">
        <IndiceDivisoes atual={divisao.chave} onIr={(chave) => irPara(chave)} />

        <div className="pt-6 sm:pt-0">
          <p className="font-mono text-[12px] uppercase tracking-[0.04em] text-tinta-2">
            {divisao.numero}
          </p>
          <h2 className="mt-1 font-display text-[28px] font-medium leading-[1.214] tracking-[-0.021em] text-tinta">
            {divisao.titulo}
          </h2>
          {divisao.lede && (
            <p className="mt-2 max-w-[60ch] text-[17px] leading-[1.47] text-tinta-2">{divisao.lede}</p>
          )}
          {divisao.totalExercicios > 0 && (
            <p className="mt-2 font-mono text-[13px] text-tinta-2">
              {divisao.totalExercicios} exercícios · {divisao.totalClipes} clipes ·{' '}
              {mmss(divisao.utilSegundos)} de {mmss(divisao.brutoSegundos)}
            </p>
          )}

          <div className="mt-6">
            {divisao.custom === 'corrida' ? (
              <PainelCorrida />
            ) : divisao.custom === 'guia' ? (
              <PainelGuia />
            ) : (
              <>
                {divisao.chave !== 'aquecer' && <TabelaSemana />}
                <ListaExercicios divisao={divisao} onAbrir={(id) => irPara(divisao.chave, id)} />
              </>
            )}
          </div>

          {divisao.avisoFinal && (
            <p className="mt-8 border-l-2 border-tijolo pl-3 text-[17px] leading-[1.47] text-tinta">
              <strong>{divisao.avisoFinal.titulo}:</strong> {divisao.avisoFinal.texto}
            </p>
          )}
        </div>
      </div>

      {exercicio && (
        <SheetExercicio
          exercicio={exercicio}
          aberto
          onFechar={() => irPara(rota.divisao)}
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
```

- [ ] **Step 3: Ajustar `app/index.html`**

```html
<html lang="pt-BR">
```

E o `<title>`: `Protocolo de treino — Rafael`

- [ ] **Step 4: Rodar tudo**

Run: `npm test && npm run build && npm run dev`
Expected: todos os testes passam, build limpo, e o app abre em `http://localhost:5173` com as 7 divisões navegáveis.

- [ ] **Step 5: Commit**

```bash
git add app
git commit -m "feat: composicao do app com rotas, busca e sheet por deep link"
```

---

## Task 14: Servidor Node e script de saúde dos vídeos

**Files:**
- Create: `app/server/index.js`, `app/scripts/check-clips.mjs`

- [ ] **Step 1: Escrever `app/server/index.js`**

Existe porque embeds do YouTube falham em `file://` com erro 153. Zero dependências.

```js
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const PORTA = Number(process.env.PORT) || 5173

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
}

if (!existsSync(RAIZ)) {
  console.error('dist/ não existe. Rode "npm run build" primeiro.')
  process.exit(1)
}

createServer((req, res) => {
  const pedido = decodeURIComponent((req.url || '/').split('?')[0])
  let arquivo = path.join(RAIZ, pedido)

  if (!arquivo.startsWith(RAIZ)) {
    res.writeHead(403).end('Proibido')
    return
  }
  if (!existsSync(arquivo) || statSync(arquivo).isDirectory()) {
    arquivo = path.join(RAIZ, 'index.html')
  }

  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' })
  createReadStream(arquivo).pipe(res)
}).listen(PORTA, () => {
  console.log(`Protocolo de treino em http://localhost:${PORTA}`)
})
```

- [ ] **Step 2: Escrever `app/scripts/check-clips.mjs`**

```js
import { DURACOES } from '../src/data/duracoes.ts'

const ids = Object.keys(DURACOES)
let quebrados = 0

for (const id of ids) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
  try {
    const resposta = await fetch(url)
    if (!resposta.ok) {
      quebrados += 1
      console.log(`FORA DO AR  ${id}  (HTTP ${resposta.status})`)
    }
  } catch (erro) {
    quebrados += 1
    console.log(`ERRO DE REDE  ${id}  ${erro.message}`)
  }
}

console.log(`\n${ids.length - quebrados} de ${ids.length} vídeos no ar.`)
process.exit(quebrados > 0 ? 1 : 0)
```

Nota: Node não importa `.ts` diretamente. Se `npm run check:clips` falhar, troque o import por uma leitura de `test/duracoes.json` da raiz do repositório — o conteúdo é idêntico.

- [ ] **Step 3: Verificar o servidor**

```bash
npm run build
npm start
```

Expected: `Protocolo de treino em http://localhost:5173`. Abra e confirme que um vídeo toca em loop dentro do trecho.

- [ ] **Step 4: Commit**

```bash
git add app/server app/scripts app/package.json
git commit -m "feat: servidor estatico node:http e verificacao de saude dos videos"
```

---

## Task 15: README e aposentadoria do legado

**Files:**
- Create: `app/README.md`
- Modify: `index.html` (só um aviso no topo)

- [ ] **Step 1: Escrever `app/README.md`**

```markdown
# Protocolo de treino

App de consulta ao plano de treino: 7 divisões, 47 exercícios, 37 recortes de vídeo
apontando para o segundo exato da execução correta.

## Rodar

```bash
cd app
npm install
npm run dev        # desenvolvimento
npm run build      # gera dist/
npm start          # serve dist/ em http://localhost:5173
```

**Sirva sempre por HTTP.** Abrir `dist/index.html` com duplo-clique cai em `file://`,
onde o YouTube recusa todo embed com erro 153 — o app detecta isso e cai no link direto,
mas você perde o loop no trecho.

## Comandos

| | |
|---|---|
| `npm test` | Testes (Vitest) |
| `npm run lint` | oxlint |
| `npm run check:clips` | Verifica se algum vídeo saiu do ar |

## Estrutura

- `src/data/` — o plano inteiro, tipado, embutido no bundle
- `src/hooks/useYouTubeClip.ts` — o loop `[início, fim]`, a parte mais delicada
- `src/components/` — a interface

## Notas de manutenção

- O `unilateral` de cada exercício vem de `plano.ts`, não dos metadados.
- Se um vídeo sair do ar, `npm run check:clips` aponta o id; troque em `plano.ts`
  e ajuste `duracoes.ts`.
- OneDrive: pause a sincronização antes de qualquer `npm install`.
```

- [ ] **Step 2: Marcar o legado como aposentado**

Adicione logo depois de `<head>` em `index.html`:

```html
<!-- APOSENTADO em 2026-09-09. Substituído por app/ (React).
     Mantido como referência histórica dos dados e do player de recorte. -->
```

- [ ] **Step 3: Rodar a verificação final completa**

```bash
cd app
npm run lint
npm test
npm run build
```

Expected: os três limpos.

- [ ] **Step 4: Commit**

```bash
git add app/README.md index.html
git commit -m "docs: readme do app e aviso de aposentadoria no legado"
```

---

## Auto-revisão do plano

**Cobertura da spec.** Escopo → Tasks 3, 4, 11. Direção de arte → Task 2 (tokens) e Tasks 7–13 (aplicação). Camada de dados → Tasks 3–4. Roteamento → Task 5. Player e fallbacks → Tasks 6, 8. Sheet → Task 9. Navegação e busca → Tasks 10, 12, 13. Stack → Task 1. Servidor → Task 14. Testes → distribuídos, com integridade de dados na Task 4. Acessibilidade → Tasks 2 (foco, reduced-motion), 9 (Dialog), 10 (alvos de 44px), 13 (`lang="pt-BR"`, safe areas).

**Lacunas conhecidas, aceitas conscientemente:**

- **Drag-to-dismiss no bottom sheet** não está implementado como task própria. O `Dialog` do shadcn entrega a mecânica de acessibilidade e as classes responsivas entregam a forma; o gesto de arrastar fica para depois, quando o app estiver rodando e der para sentir. A spec descreve a física completa (25% ou 500px/s, rubberband 0.35, arbitragem com `scrollTop === 0`) para quando isso for feito.
- **Scale do fundo (0.936)** pela mesma razão: depende do drag para valer a pena.
- **Playhead na `BarraTrecho`** tem a prop `progresso` pronta, mas nenhuma task a alimenta. Ligar exige expor o tempo corrente do `useYouTubeClip`, o que adiciona re-render a 60fps — decisão adiada de propósito até medir.

**Consistência de tipos.** `ExercicioResolvido` (Task 4) é o tipo usado em Tasks 9, 10, 12, 13. `mmss`, `urlYouTube`, `urlBusca` (Task 5) são usados em 7, 8, 9, 11, 13. `useYouTubeClip` devolve `{ ref, estado, codigoErro, tocar }` (Task 6) e é consumido exatamente assim na Task 8. `irPara(divisao, exercicio?)` (Task 5) é chamado em 10 e 13 com essa assinatura.

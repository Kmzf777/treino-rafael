# Blocos empurrar/puxar — plano de implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development
> (recomendado) ou superpowers:executing-plans para executar tarefa a tarefa.
> Os passos usam checkbox (`- [ ]`) para acompanhamento.

**Goal:** Trocar as três divisões de força (`forcaA`, `forcaB`, `forcaAl`) por quatro
treinos numa fila contínua — `empurrarA`, `puxarA`, `empurrarB`, `puxarB` — com
inferior em toda sessão e blocos de tríade não-competitiva.

**Architecture:** A mudança é 90% de dados. `plano.ts` é reescrito por um script de
migração de uso único que lê a estrutura atual, move cada exercício para seu novo
endereço, renomeia ids e aplica as mudanças de prescrição. O script é o artefato
revisável; a saída dele é o que se commita. Os componentes React não mudam de forma
(`IndiceDivisoes` e `ListaExercicios` são dirigidos pelos dados) — só `TabelaSemana`
muda, porque a semana deixa de ser uma grade fixa e vira um ciclo de 4 semanas.

**Tech Stack:** Vite + React 19 + TypeScript, Vitest, oxlint, Node 22, Python 3.12
(só para o script de migração de uso único).

**Spec:** [`docs/specs/2026-09-10-blocos-empurrar-puxar-design.md`](../specs/2026-09-10-blocos-empurrar-puxar-design.md)

---

## Estrutura de arquivos

| Arquivo | Responsabilidade | Ação |
|---|---|---|
| `app/src/data/tipos.ts` | Tipos do domínio; `ChaveDivisao` | Modificar |
| `app/src/data/plano.ts` | O plano inteiro, tipado | Reescrever (via script) |
| `app/src/data/metadados.ts` | Músculo, equipamento, padrão, porquê de cada exercício | Reescrever (via script) |
| `app/src/data/duracoes.ts` | Duração de cada vídeo | Acrescentar 3 entradas |
| `test/duracoes.json` | Espelho de `duracoes.ts` para `check:clips` | Acrescentar 3 entradas |
| `app/src/data/semana.ts` | Ciclo de 4 semanas e regras de carga | Reescrever |
| `app/src/data/editorial.ts` | Cards do Guia | Modificar seção `GUIA` |
| `app/src/lib/rota.ts` | Chaves de rota válidas | Modificar |
| `app/src/components/TabelaSemana.tsx` | Render do ciclo | Reescrever |
| `app/src/data/index.test.ts` | Integridade e contagens | Modificar |
| `app/src/lib/rota.test.ts`, `App.test.tsx`, `Busca.test.tsx`, `IndiceDivisoes.test.tsx`, `ListaExercicios.test.tsx`, `TabelaSemana.test.tsx` | Referências às chaves antigas | Modificar |
| `app/scripts/migrar-blocos.mjs` | Migração de uso único | Criar, executar, **apagar no fim** |
| `docs/dados/videos-novos.json` | Ids e durações dos 3 vídeos novos | Criar |
| `README.md` | Tabela de ativos e estrutura | Modificar |

---

## Mapa de migração (fonte da verdade para a Tarefa 2)

Formato: `novo-id ← origem`. `@id` significa **reusar o vídeo e os cues** de um
exercício que também existe com outro id (o app já faz isso hoje com
`a-extensora`/`al-extensora`).

### `aquecer` — Aquecimento (sem mudança estrutural)

Bloco `Mobilidade`: `mob-tornozelo`, `mob-9090`, `mob-gato`, `mob-toracica`,
`mob-pullapart`, `mob-rotext` — todos inalterados.

Bloco `Ativação com miniband e bola`: `at-abre`, `at-ponte`, `at-lateral`, `at-pant`
— inalterados. **Acrescentar ao fim:** `at-equilibrio ← a-fin-4`.

Bloco `Cardio leve`: `at-bike` — inalterado.

### `empurrarA` — EMPURRAR A

| Bloco | novo id | origem | prescrição |
|---|---|---|---|
| Bloco 1 — Agachamento · Peito · Core<br>`4 voltas · 90-120 s entre voltas` | `ea-agacha` | `a-agacha` | `4x5-8` |
| | `ea-supino` | `a-supino` | `4x6-10` |
| | `ea-prancha-lat` | `a-prancha-lat` | `3x25-40s cada lado` |
| Bloco 2 — Extensora · Ombro · Panturrilha<br>`3 voltas · 60-90 s` | `ea-extensora` | `a-extensora` | `3x10-15 cada perna` |
| | `ea-desenvolv` | `b-desenvolv` | `3x8-12` |
| | `ea-pant-uni` | `a-pant-uni` | `3x8-15 cada` |
| Bloco 3 — Pélvica · Deltoide · Tríceps<br>`3 voltas · 45-60 s` | `ea-pelvica-uni` | `a-pelvica-uni` | `3x10-12 cada` |
| | `ea-elev-lat` | `a-elev-lat` | `3x12-15` |
| | `ea-triceps` | **NOVO** | `3x10-12` |

### `puxarA` — PUXAR A

| Bloco | novo id | origem | prescrição |
|---|---|---|---|
| Bloco 1 — Stiff · Puxada · Core<br>`4 voltas · 90-120 s` | `pa-stiff` | `b-terra-uni` | `4x8-10 cada perna` |
| | `pa-puxada` | `a-puxada` | `4x8-12` |
| | `pa-pallof` | `b-pallof` | `3x25-35s cada lado` |
| Bloco 2 — Flexora · Remada · Deltoide posterior<br>`3 voltas · 60-90 s` | `pa-flexora` | `b-flexora` | `3x10-15` |
| | `pa-remada` | `b-remada-uni` | `3x10-12 cada` |
| | `pa-deltpost` | **NOVO** | `3x12-15` |
| Bloco 3 — Búlgaro · Bíceps · Lombar<br>`3 voltas · 45-60 s` | `pa-bulgaro` | `b-fin-2` | `3x8-12 cada perna` |
| | `pa-biceps` | `b-biceps` | `3x10-12` |
| | `pa-lombar` | `b-lombar` | `3x12` |

### `empurrarB` — EMPURRAR B

| Bloco | novo id | origem | prescrição |
|---|---|---|---|
| Bloco 1 — Leg press · Crucifixo · Core<br>`4 voltas · 90-120 s` | `eb-leg` | `al-leg` | `4x10-15` |
| | `eb-cruci` | `al-cruci` | `3-4x10-12` |
| | `eb-deadbug` | `a-deadbug` | `3x10-12` |
| Bloco 2 — Extensora · Inclinado · Sóleo<br>`3 voltas · 60-90 s` | `eb-extensora` | `al-extensora` | `3x10-15 cada perna` |
| | `eb-inclinado` | vídeo `oZjIQN0YMX0`, recorte 10-39 | `3x8-12` |
| | `eb-pant-sent` | `b-pant-sent` | `3x12-20` |
| Bloco 3 — Pélvica · Deltoide · Paralelas<br>`3 voltas · 45-60 s` | `eb-pelvica` | `al-pelvica` | `3x12 cada` |
| | `eb-elev-lat` | `@a-elev-lat` | `3x12-15` |
| | `eb-dips` | vídeo `gTuw7u2PwlM`, sem recorte | `3x8-12` |

### `puxarB` — PUXAR B

| Bloco | novo id | origem | prescrição |
|---|---|---|---|
| Bloco 1 — Pélvica bilateral · Remada baixa · Core<br>`4 voltas · 90-120 s` | `pb-pelvica` | `b-pelvica` | `3x10-12` |
| | `pb-remada` | `al-remada` | `4x8-12` |
| | `pb-prancha` | vídeo `RTxAFDK1OMw`, recorte 39-47 | `3x30-45s` |
| Bloco 2 — Flexora · Barra assistida · Deltoide posterior<br>`3 voltas · 60-90 s` | `pb-flexora` | `@b-flexora` | `3x12-15` |
| | `pb-barra` | vídeo `w0UVe0JAEDQ`, recorte 54-85 | `3x8-12` |
| | `pb-deltpost` | **NOVO** (mesmo vídeo de `pa-deltpost`) | `3x12-15` |
| Bloco 3 — Step-up · Bíceps · Abdutor<br>`3 voltas · 45-60 s` | `pb-stepup` | `b-fin-1` | `3x12 cada perna` |
| | `pb-biceps` | `@b-biceps` | `3x10-12` |
| | `pb-abdutor` | **NOVO** | `3x12-15` |

### `circuito` — inalterado

`c-remo`, `c-kb`, `c-flexao`, `c-afundo`, `c-prancha`.

### Saem do plano

`a-fin-1`, `a-fin-2`, `a-fin-3`, `b-fin-3` são removidos. `b-fin-4` deixa de ser
exercício e vira o alternativo de `at-equilibrio`.

### Alternativos que mudam de dono

| Alternativo | Sai de | Vai para |
|---|---|---|
| Tríceps na polia com corda (`7le1JRUUagM`) | `b-biceps` | alternativo de `ea-triceps` |
| Supino inclinado com barra (`oZjIQN0YMX0`) | `b-desenvolv` | vira o exercício `eb-inclinado` |
| Mergulho nas paralelas (`gTuw7u2PwlM`) | `al-cruci` | vira o exercício `eb-dips` |
| Barra fixa assistida (`w0UVe0JAEDQ`) | `a-puxada` | vira o exercício `pb-barra` |
| Prancha frontal (`RTxAFDK1OMw`) | `b-pallof` | vira o exercício `pb-prancha` |
| Ou agachamento búlgaro (`a3-bQbTdA_0`) | `al-leg` | alternativo de `pa-bulgaro` |
| Apoio em superfície instável (vídeo de `b-fin-4`) | — | alternativo de `at-equilibrio` |

---

## Task 1: Encontrar e verificar os 3 vídeos novos

**Files:**
- Create: `docs/dados/videos-novos.json`
- Create: `app/scripts/duracao-video.mjs` (temporário, apagado na Tarefa 6)

Três exercícios não existem no inventário e precisam de vídeo: crucifixo inverso
(**essencial** — aparece em dois treinos), tríceps overhead e abdução de quadril com
carga. Eles entram **sem recorte**, como os 10 exercícios que já são só link: a
auditoria quadro a quadro exige `yt-dlp` e `ffmpeg`, que não estão disponíveis neste
ambiente. O recorte é trabalho de follow-up, registrado na Tarefa 6.

- [ ] **Step 1: Escrever o script que lê a duração de um vídeo**

Não existe `yt-dlp` aqui. A duração sai do `lengthSeconds` embutido na página do
YouTube. Criar `app/scripts/duracao-video.mjs`:

```javascript
// Lê a duração de um vídeo do YouTube a partir do lengthSeconds embutido na página.
// Uso: node scripts/duracao-video.mjs VIDEO_ID [VIDEO_ID...]
const ids = process.argv.slice(2)

for (const id of ids) {
  const resposta = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: { 'accept-language': 'pt-BR,pt;q=0.9' },
  })
  if (!resposta.ok) {
    console.log(`${id}\tHTTP ${resposta.status}`)
    continue
  }
  const html = await resposta.text()
  const achado = html.match(/"lengthSeconds":"(\d+)"/)
  console.log(achado ? `${id}\t${achado[1]}` : `${id}\tNAO ENCONTRADO`)
}
```

- [ ] **Step 2: Buscar os candidatos a vídeo**

Para cada um dos três exercícios, achar um vídeo do YouTube que atenda aos mesmos
critérios que o resto do app usa (ver `docs/RELATORIO.md`):

1. Execução limpa, câmera lateral ou frontal estável, sem narração longa antes.
2. Sem vinheta, sem banner cobrindo o corpo, sem tela final no trecho útil.
3. Preferir vídeo curto (menos de 3 min) — reduz o risco de o recorte futuro cair
   em trecho errado.
4. Preferir português do Brasil; inglês é aceitável se a execução for melhor.

Buscas sugeridas:

| Exercício | Busca |
|---|---|
| `pa-deltpost` / `pb-deltpost` | `crucifixo inverso na máquina execução` · `peck deck invertido deltoide posterior` · `reverse pec deck form` |
| `ea-triceps` | `tríceps francês na polia acima da cabeça execução` · `overhead cable triceps extension form` |
| `pb-abdutor` | `cadeira abdutora execução glúteo médio` · `hip abduction machine form` |

- [ ] **Step 3: Verificar que cada vídeo está no ar e pegar a duração**

Run: `cd app && node scripts/duracao-video.mjs <ID_DELTPOST> <ID_TRICEPS> <ID_ABDUTOR>`

Expected: três linhas no formato `ID<TAB>NUMERO`. Se alguma linha vier
`NAO ENCONTRADO` ou `HTTP 404`, escolher outro vídeo e repetir. Um `lengthSeconds`
ausente normalmente significa vídeo restrito ou removido — não use.

- [ ] **Step 4: Gravar o resultado**

Criar `docs/dados/videos-novos.json` com os ids confirmados (substituindo os valores
de exemplo abaixo pelos reais):

```json
{
  "pa-deltpost": {
    "video": "COLOQUE_O_ID",
    "duracao": 0,
    "titulo": "título exato do vídeo",
    "canal": "nome do canal",
    "porque": "por que este vídeo foi escolhido: enquadramento, ausência de vinheta, qualidade da execução",
    "recorte": null
  },
  "ea-triceps": {
    "video": "COLOQUE_O_ID",
    "duracao": 0,
    "titulo": "",
    "canal": "",
    "porque": "",
    "recorte": null
  },
  "pb-abdutor": {
    "video": "COLOQUE_O_ID",
    "duracao": 0,
    "titulo": "",
    "canal": "",
    "porque": "",
    "recorte": null
  }
}
```

`recorte: null` é intencional e permanente até que alguém com `yt-dlp` e `ffmpeg`
faça a auditoria. `pb-deltpost` usa o mesmo vídeo de `pa-deltpost` e por isso não
aparece neste arquivo.

- [ ] **Step 5: Commit**

```bash
git add docs/dados/videos-novos.json app/scripts/duracao-video.mjs
git commit -m "feat: escolhe os tres videos que faltavam para o modelo empurrar/puxar"
```

---

## Task 2: Migrar os dados do plano

**Files:**
- Create: `app/scripts/migrar-blocos.mjs`
- Modify: `app/src/data/tipos.ts`
- Modify: `app/src/lib/rota.ts:9-17`
- Rewrite: `app/src/data/plano.ts`, `app/src/data/metadados.ts`
- Modify: `app/src/data/duracoes.ts`, `test/duracoes.json`
- Modify: `app/src/data/index.test.ts`
- Test: `app/src/data/index.test.ts`

Esta tarefa é atômica: os tipos, as chaves de rota, o plano, os metadados e as
contagens dos testes mudam juntos ou a suíte fica vermelha no meio do caminho.

> **Errata, registrada durante a execução.** O objeto `AJUSTES` do script abaixo
> cobre só parte da coluna `prescrição` do mapa de migração. Dez exercícios ficam
> com a prescrição do modelo antigo se o script for usado como está — entre eles
> `pa-flexora` e `pb-flexora`, que continuariam `unilateral: true` e fariam a
> contagem dar 13 em vez de 11. **O mapa de migração é a fonte da verdade**: ao
> usar este script, complete o `AJUSTES` com o resto da coluna `prescrição`, e
> marque as duas flexoras como `unilateral: false`. A versão unilateral da flexora
> só entra se o enxerto for de isquiotibiais, que é uma das perguntas em aberto da
> spec.

- [ ] **Step 1: Escrever os invariantes do novo modelo como testes que falham**

Acrescentar ao fim de `app/src/data/index.test.ts`:

```typescript
const TORSO_PUXAR = [
  'Dorsal (latíssimo)',
  'Bíceps',
  'Trapézio médio',
  'Deltoide posterior',
  'Antebraço',
]

const TORSO_EMPURRAR = ['Peitoral maior', 'Deltoide anterior', 'Deltoide lateral', 'Tríceps']

const DIAS_EMPURRAR = ['empurrarA', 'empurrarB']
const DIAS_PUXAR = ['puxarA', 'puxarB']
const DIAS_FORCA = [...DIAS_EMPURRAR, ...DIAS_PUXAR]

function exerciciosDe(chave: string) {
  return buscarDivisao(chave)!.blocos.flatMap((b) => b.exercicios)
}

describe('modelo empurrar/puxar', () => {
  it('existe um dia para cada ponto da fila', () => {
    for (const chave of DIAS_FORCA) expect(buscarDivisao(chave)).toBeDefined()
  })

  it('nenhum dia de empurrar contém músculo de puxar como primário', () => {
    for (const chave of DIAS_EMPURRAR) {
      for (const e of exerciciosDe(chave)) {
        expect(TORSO_PUXAR).not.toContain(e.meta.musculoPrimario)
      }
    }
  })

  it('nenhum dia de puxar contém músculo de empurrar como primário', () => {
    for (const chave of DIAS_PUXAR) {
      for (const e of exerciciosDe(chave)) {
        expect(TORSO_EMPURRAR).not.toContain(e.meta.musculoPrimario)
      }
    }
  })

  // Filtra por músculo, não por padrão de movimento: 'Isolado' é o padrão de
  // `ea-triceps` e `pa-biceps`, então um filtro por padrão deixaria uma extensão de
  // tríceps satisfazer um teste que se chama "tem exercício de perna".
  it('toda sessão de força tem pelo menos 3 exercícios de perna — inferior em toda sessão', () => {
    const MUSCULOS_PERNA = [
      'Quadríceps',
      'Isquiotibiais',
      'Glúteo máximo',
      'Glúteo médio',
      'Panturrilha (gastrocnêmio)',
      'Panturrilha (sóleo)',
      'Adutores',
    ]
    for (const chave of DIAS_FORCA) {
      const perna = exerciciosDe(chave).filter((e) =>
        MUSCULOS_PERNA.includes(e.meta.musculoPrimario),
      )
      expect(perna.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('toda sessão de força tem ao menos um unilateral — P6 da spec', () => {
    for (const chave of DIAS_FORCA) {
      expect(exerciciosDe(chave).some((e) => e.unilateral)).toBe(true)
    }
  })

  it('toda sessão de força tem joelho-dominante e quadril-dominante — P5 da spec', () => {
    const JOELHO = ['Agachar', 'Unilateral de perna']
    const QUADRIL = ['Dobradiça de quadril']
    for (const chave of DIAS_FORCA) {
      const padroes = exerciciosDe(chave).map((e) => e.meta.padraoMovimento)
      expect(padroes.some((p) => JOELHO.includes(p))).toBe(true)
      expect(padroes.some((p) => QUADRIL.includes(p))).toBe(true)
    }
  })

  it('panturrilha carregada só nos dias de empurrar — P8 da spec', () => {
    const ehPanturrilha = (m: string) => m.startsWith('Panturrilha')
    for (const chave of DIAS_PUXAR) {
      expect(exerciciosDe(chave).some((e) => ehPanturrilha(e.meta.musculoPrimario))).toBe(false)
    }
    for (const chave of DIAS_EMPURRAR) {
      expect(exerciciosDe(chave).some((e) => ehPanturrilha(e.meta.musculoPrimario))).toBe(true)
    }
  })

  it('todo dia de força tem exatamente 3 blocos de 3 exercícios', () => {
    for (const chave of DIAS_FORCA) {
      const divisao = buscarDivisao(chave)!
      expect(divisao.blocos).toHaveLength(3)
      for (const bloco of divisao.blocos) expect(bloco.exercicios).toHaveLength(3)
    }
  })

  it('nenhum bloco junta dois exercícios do mesmo músculo primário', () => {
    for (const chave of DIAS_FORCA) {
      for (const bloco of buscarDivisao(chave)!.blocos) {
        const primarios = bloco.exercicios.map((e) => e.meta.musculoPrimario)
        expect(new Set(primarios).size).toBe(primarios.length)
      }
    }
  })
})
```

Acrescentar `buscarDivisao` ao import do topo do arquivo:

```typescript
import { DIVISOES, ESTATISTICAS, TODOS_EXERCICIOS, buscarDivisao, buscarExercicio } from './index'
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `cd app && npm test -- src/data/index.test.ts`
Expected: FAIL — `buscarDivisao('empurrarA')` devolve `undefined`, então
`expect(...).toBeDefined()` quebra e os testes seguintes quebram ao chamar
`.blocos` de `undefined`.

- [ ] **Step 3: Trocar as chaves de divisão**

Em `app/src/data/tipos.ts`, substituir o tipo `ChaveDivisao`:

```typescript
export type ChaveDivisao =
  | 'aquecer'
  | 'empurrarA'
  | 'puxarA'
  | 'empurrarB'
  | 'puxarB'
  | 'corrida'
  | 'circuito'
  | 'guia'
```

Em `app/src/lib/rota.ts`, trocar `'forcaA'`, `'forcaB'`, `'forcaAl'` na lista de
chaves válidas por `'empurrarA'`, `'puxarA'`, `'empurrarB'`, `'puxarB'`, mantendo a
ordem `aquecer → os quatro treinos → corrida → circuito → guia`.

- [ ] **Step 4: Escrever o script de migração**

Criar `app/scripts/migrar-blocos.mjs`. Ele lê `plano.ts` e `metadados.ts`, monta a
nova estrutura a partir do mapa e grava os dois arquivos de volta.

```javascript
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

const alt = (idDono, trecho) =>
  PorId.get(idDono).alternativos.find((a) => a.nome.includes(trecho))

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
```

- [ ] **Step 5: Conferir o cabeçalho real de `metadados.ts` antes de rodar**

O script localiza o literal de `metadados.ts` pelo marcador `'> = '`. Confirmar que
ele bate:

Run: `cd app && head -3 src/data/metadados.ts`
Expected: uma linha de `import type`, uma linha em branco, e uma linha terminando em
`Record<string, Metadados> = {`. Se o marcador for outro, ajuste a chamada
`lerLiteral('metadados.ts', ...)` para o texto que de fato aparece.

- [ ] **Step 6: Rodar a migração**

Run: `cd app && node scripts/migrar-blocos.mjs`
Expected: `53 exercícios em 8 divisões` e `44 vídeos únicos`.

Se o número de exercícios não for 53, algum id do mapa não bateu — o script lança
`origem não encontrada: <id>` antes de gravar qualquer coisa, então nada fica pela
metade.

- [ ] **Step 7: Acrescentar a duração dos 3 vídeos novos**

Em `app/src/data/duracoes.ts` e em `test/duracoes.json`, acrescentar uma entrada
para cada id de `docs/dados/videos-novos.json`, com a duração lida na Tarefa 1.
Manter a ordem alfabética das chaves, que é como o arquivo está hoje. Os dois
arquivos precisam ficar idênticos — `check:clips` lê o JSON, o app lê o `.ts`.

- [ ] **Step 8: Atualizar as contagens de `index.test.ts`**

Trocar os valores das asserções existentes:

```typescript
  it('tem 53 exercícios', () => {
    expect(TODOS_EXERCICIOS).toHaveLength(53)
  })
```

```typescript
  it('tem 40 recortes e 13 exercícios sem recorte', () => {
    expect(TODOS_EXERCICIOS.filter((e) => e.recorte)).toHaveLength(40)
    expect(TODOS_EXERCICIOS.filter((e) => !e.recorte)).toHaveLength(13)
  })
```

Substituir o teste `'tem exatamente 13 exercícios unilaterais'` — a contagem fixa
não diz nada sobre a intenção, e o invariante que importa (P6 da spec) já está no
bloco `modelo empurrar/puxar`. No lugar dele:

```typescript
  it('tem exatamente 11 exercícios unilaterais', () => {
    expect(TODOS_EXERCICIOS.filter((e) => e.unilateral)).toHaveLength(11)
  })
```

Em `numeração de protocolo`, trocar a lista de divisões:

```typescript
  it('numera as divisões de 01 a 08', () => {
    expect(DIVISOES.map((d) => d.numero)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08'])
  })
```

Em `buscarExercicio`, trocar o id de exemplo:

```typescript
  it('acha por id', () => {
    expect(buscarExercicio('ea-agacha')?.nome).toContain('Agachamento')
  })
```

O teste de `estatísticas` depende dos 3 vídeos novos, cuja duração só é conhecida
agora. Rodar a suíte uma vez, ler os dois números que o Vitest reporta como
`received`, e escrever esses números no teste:

```typescript
  it('calcula 770s úteis e os segundos brutos dos 44 vídeos', () => {
    expect(ESTATISTICAS.totalUtil).toBe(770)
    expect(ESTATISTICAS.totalBruto).toBe(0) // <- trocar pelo valor reportado
  })
```

`totalUtil` é 770 e não depende dos vídeos novos (eles entram sem recorte).
`totalBruto` é 8199 mais a soma das durações dos três vídeos novos.

- [ ] **Step 9: Atualizar os testes que citam as chaves antigas**

| Arquivo | Troca |
|---|---|
| `src/lib/rota.test.ts:22,26,39,41,47,51` | `forcaA` → `empurrarA`, `forcaB` → `puxarA`, `a-agacha` → `ea-agacha`, `b-flexora` → `pa-flexora` |
| `src/App.test.tsx:31` | `'37 clipes'` → `'40 clipes'` |
| `src/App.test.tsx:41,73,91` | `#/forcaA` → `#/empurrarA`, `a-agacha` → `ea-agacha`, `#/forcaB/b-flexora` → `#/puxarA/pa-flexora` |
| `src/components/Busca.test.tsx:122` | `{ id: 'a-agacha', divisao: 'forcaA' }` → `{ id: 'ea-agacha', divisao: 'empurrarA' }` |
| `src/components/IndiceDivisoes.test.tsx:18` | `atual="forcaB"` → `atual="puxarA"` |
| `src/components/ListaExercicios.test.tsx:7` | `buscarDivisao('forcaA')` → `buscarDivisao('empurrarA')`; renomear as variáveis `forcaA`/`exerciciosDeForcaA` para `empurrarA`/`exerciciosDeEmpurrarA` |
| `src/components/SheetExercicio.test.tsx` | `a-agacha` → `ea-agacha`, `b-fin-2` → `pa-bulgaro` |

Esta tabela não é exaustiva: ela lista o que foi encontrado ao escrever o plano.
Rode `grep -rn "forcaA\|forcaB\|forcaAl" app/src` e confirme que não sobrou nada,
e espere que asserções de contagem em outros testes de componente (número de
divisões no índice, número de exercícios numa lista, texto do colofão) também
precisem de ajuste.

- [ ] **Step 10: Rodar a suíte inteira**

Run: `cd app && npm test`
Expected: PASS em todos os arquivos. Se `App.test.tsx` falhar na contagem de clipes,
o número certo é o que o `received` mostrar — o app renderiza `ESTATISTICAS.totalClipes`.

- [ ] **Step 11: Lint e build**

Run: `cd app && npm run lint && npm run build`
Expected: oxlint sem erros; `tsc -b` sem erro de tipo. Um erro de tipo em
`ChaveDivisao` aqui significa que alguma chave antiga sobrou em `rota.ts` ou em
`semana.ts` — `semana.ts` é tratado na Tarefa 3 e pode falhar neste ponto; nesse
caso, siga para a Tarefa 3 antes de commitar.

- [ ] **Step 12: Verificar que os vídeos continuam no ar**

Run: `cd app && npm run check:clips`
Expected: `N de N vídeos no ar.` — o que importa é que os dois números sejam iguais,
não qual é o N. O total conta os ids de `test/duracoes.json`, que inclui os vídeos
que só aparecem como alternativos, e por isso é maior que a contagem de vídeos
principais.

- [ ] **Step 13: Commit**

```bash
git add app/src/data app/src/lib/rota.ts app/src/App.test.tsx app/src/components app/scripts/migrar-blocos.mjs test/duracoes.json
git commit -m "feat: reorganiza o plano em empurrar/puxar com inferior em toda sessao"
```

---

## Task 3: Ciclo de 4 semanas

**Files:**
- Rewrite: `app/src/data/semana.ts`
- Test: `app/src/data/semana.test.ts` (criar)

A semana deixa de ser uma grade fixa de dias. Os quatro treinos rodam numa fila
contínua que fecha em 4 semanas, e a carga é propriedade da posição na semana, não
do treino.

- [ ] **Step 1: Escrever o teste que falha**

Criar `app/src/data/semana.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import { CICLO, DIAS_DE_FORCA, REGRA_DE_OURO, REGRA_DE_CARGA } from './semana'
import { buscarDivisao } from './index'

describe('ciclo de 4 semanas', () => {
  it('tem 4 semanas de 3 sessões de força', () => {
    expect(CICLO).toHaveLength(4)
    for (const semana of CICLO) expect(semana.sessoes).toHaveLength(3)
  })

  it('toda sessão aponta para uma divisão que existe', () => {
    for (const semana of CICLO) {
      for (const sessao of semana.sessoes) {
        expect(buscarDivisao(sessao.divisao)).toBeDefined()
      }
    }
  })

  it('cada treino aparece exatamente 3 vezes no ciclo', () => {
    const contagem = new Map<string, number>()
    for (const semana of CICLO) {
      for (const sessao of semana.sessoes) {
        contagem.set(sessao.divisao, (contagem.get(sessao.divisao) ?? 0) + 1)
      }
    }
    expect([...contagem.values()]).toEqual([3, 3, 3, 3])
  })

  it('a fila não repete um treino em sessões consecutivas', () => {
    const fila = CICLO.flatMap((s) => s.sessoes.map((x) => x.divisao))
    for (let i = 1; i < fila.length; i += 1) expect(fila[i]).not.toBe(fila[i - 1])
  })

  it('empurrar e puxar se alternam ao longo de todo o ciclo', () => {
    const fila = CICLO.flatMap((s) => s.sessoes.map((x) => x.divisao))
    for (let i = 1; i < fila.length; i += 1) {
      const anterior = fila[i - 1].startsWith('empurrar')
      const atual = fila[i].startsWith('empurrar')
      expect(atual).toBe(!anterior)
    }
  })

  it('a carga é pesada, moderada e leve, nessa ordem, em toda semana', () => {
    for (const semana of CICLO) {
      expect(semana.sessoes.map((s) => s.carga)).toEqual(['pesada', 'moderada', 'leve'])
    }
  })

  it('os dias de força são segunda, quarta e sexta', () => {
    expect(DIAS_DE_FORCA).toEqual(['Segunda', 'Quarta', 'Sexta'])
  })

  it('a regra de ouro e a regra de carga existem e não estão vazias', () => {
    expect(REGRA_DE_OURO.length).toBeGreaterThan(40)
    expect(REGRA_DE_CARGA.length).toBeGreaterThan(40)
  })
})
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `cd app && npm test -- src/data/semana.test.ts`
Expected: FAIL — `CICLO`, `DIAS_DE_FORCA` e `REGRA_DE_CARGA` não existem em
`semana.ts`.

- [ ] **Step 3: Reescrever `semana.ts`**

Substituir todo o conteúdo de `app/src/data/semana.ts`:

```typescript
import type { ChaveDivisao } from './tipos'

export type Carga = 'pesada' | 'moderada' | 'leve'
export type Sessao = { divisao: ChaveDivisao; carga: Carga }
export type SemanaDoCiclo = { numero: number; sessoes: Sessao[] }
export type LinhaSemana = { dia: string; sessao: string; divisao?: ChaveDivisao; descanso: boolean }

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
  { dia: 'Terça', sessao: 'Corrida leve em ritmo de conversa, 25 a 40 min', divisao: 'corrida', descanso: false },
  { dia: 'Quinta', sessao: 'Descanso ativo: caminhada, bike leve, mobilidade', descanso: true },
  { dia: 'Sábado', sessao: 'Corrida longa ou de qualidade', divisao: 'corrida', descanso: false },
  { dia: 'Domingo', sessao: 'Descanso total', descanso: true },
]

export const REGRA_DE_OURO =
  'Nunca coloque corrida intervalada forte no dia seguinte à sessão pesada. Se precisar juntar força e corrida no mesmo dia, faça força primeiro e deixe pelo menos 3 horas entre as duas — colar as duas custa força explosiva, e separar por 3 horas elimina o efeito.'

export const REGRA_DE_CARGA =
  'A carga mora no dia da semana, não no treino. A primeira sessão da semana é a pesada: topo da carga, base da faixa de repetições, no exercício de perna que abre o Bloco 1. A segunda é moderada. A terceira é leve, com 2 a 3 repetições na reserva. Só uma sessão pesada por semana — é ela que sustenta a corrida.'

export const REGRA_DE_PANTURRILHA =
  'Panturrilha com carga só nos dias de empurrar. Nos dias de puxar ela não aparece: o tendão de Aquiles já recebe carga nas corridas, e a síntese de colágeno só fica positiva entre 36 e 72 horas depois do estímulo.'
```

- [ ] **Step 4: Rodar o teste**

Run: `cd app && npm test -- src/data/semana.test.ts`
Expected: PASS, 8 testes.

- [ ] **Step 5: Commit**

```bash
git add app/src/data/semana.ts app/src/data/semana.test.ts
git commit -m "feat: semana vira ciclo de 4 semanas com carga por posicao"
```

---

## Task 4: Render do ciclo

**Files:**
- Rewrite: `app/src/components/TabelaSemana.tsx`
- Test: `app/src/components/TabelaSemana.test.tsx` (criar)

O toggle `3 dias / 4 dias` sai: agora existe um ciclo só. No lugar dele, a tabela
das 4 semanas e as três regras.

- [ ] **Step 1: Escrever o teste que falha**

Criar `app/src/components/TabelaSemana.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TabelaSemana } from './TabelaSemana'

describe('TabelaSemana', () => {
  it('mostra as quatro semanas do ciclo', () => {
    render(<TabelaSemana />)
    for (const n of [1, 2, 3, 4]) {
      expect(screen.getByText(`Semana ${n}`)).toBeInTheDocument()
    }
  })

  it('mostra os três dias de força como cabeçalho', () => {
    render(<TabelaSemana />)
    expect(screen.getByText(/Segunda/)).toBeInTheDocument()
    expect(screen.getByText(/Quarta/)).toBeInTheDocument()
    expect(screen.getByText(/Sexta/)).toBeInTheDocument()
  })

  it('mostra o rótulo de cada treino nas células', () => {
    render(<TabelaSemana />)
    expect(screen.getAllByText('Empurrar A')).toHaveLength(3)
    expect(screen.getAllByText('Puxar B')).toHaveLength(3)
  })

  it('mostra os dias fixos da semana', () => {
    render(<TabelaSemana />)
    expect(screen.getByText(/Descanso ativo/)).toBeInTheDocument()
    expect(screen.getByText(/Descanso total/)).toBeInTheDocument()
  })

  it('mostra a regra de ouro e a regra de carga', () => {
    render(<TabelaSemana />)
    expect(screen.getByText('Regra de ouro')).toBeInTheDocument()
    expect(screen.getByText('A carga')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `cd app && npm test -- src/components/TabelaSemana.test.tsx`
Expected: FAIL — o componente ainda renderiza o toggle e as linhas de `SEMANA_4`.

- [ ] **Step 3: Reescrever o componente**

Substituir todo o conteúdo de `app/src/components/TabelaSemana.tsx`:

```typescript
import { DIVISOES } from '@/data'
import {
  CICLO,
  DIAS_DE_FORCA,
  DIAS_FIXOS,
  REGRA_DE_CARGA,
  REGRA_DE_OURO,
  REGRA_DE_PANTURRILHA,
} from '@/data/semana'
import { NotaLateral } from './SecaoEditorial'

const CABECALHO =
  'border-b border-fio pb-2 text-left font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-tinta-2'

const ROTULOS = new Map(DIVISOES.map((d) => [d.chave, d.rotulo]))

// A carga de cada posição vem do próprio ciclo, não de uma lista paralela que
// poderia sair de sincronia com `semana.ts`.
const CARGAS = CICLO[0].sessoes.map((s) => s.carga)

export function TabelaSemana() {
  return (
    <section className="border-t border-fio pt-5">
      <h3 className="font-display text-[20px] font-medium leading-[1.25] tracking-[-0.017em] text-tinta">
        O ciclo
      </h3>

      <p className="mt-2 text-[15px] leading-[1.55] text-tinta-2">
        Quatro treinos numa fila que não reinicia no domingo. O treino de segunda é o
        próximo da fila, não “o treino de segunda”. A fila fecha em quatro semanas.
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse">
          <caption className="sr-only">Ciclo de quatro semanas de treino de força</caption>
          <thead>
            <tr>
              <th scope="col" className={`w-[92px] pr-3 ${CABECALHO}`}>
                {' '}
              </th>
              {DIAS_DE_FORCA.map((dia, i) => (
                <th key={dia} scope="col" className={`pr-3 ${CABECALHO}`}>
                  {dia}
                  <span className="ml-1 normal-case text-tinta-2">({CARGAS[i]})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CICLO.map((semana) => (
              <tr key={semana.numero}>
                <th
                  scope="row"
                  className="border-b border-fio py-3 pr-3 text-left align-baseline font-mono text-[13px] font-normal text-tinta-2"
                >
                  Semana {semana.numero}
                </th>
                {semana.sessoes.map((sessao) => (
                  <td
                    key={sessao.divisao}
                    className="border-b border-fio py-3 pr-3 align-baseline text-[17px] leading-[1.47] text-tinta"
                  >
                    {ROTULOS.get(sessao.divisao)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <table className="mt-5 w-full border-collapse">
        <caption className="sr-only">Os dias que não mudam de semana para semana</caption>
        <tbody>
          {DIAS_FIXOS.map((linha) => (
            <tr key={linha.dia}>
              <td className="border-b border-fio py-3 pr-3 align-baseline font-mono text-[13px] text-tinta-2">
                {linha.dia}
              </td>
              <td
                className={`border-b border-fio py-3 align-baseline text-[17px] leading-[1.47] ${
                  linha.descanso ? 'text-tinta-2' : 'text-tinta'
                }`}
              >
                {linha.sessao}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <NotaLateral rotulo="Regra de ouro" texto={REGRA_DE_OURO} />
      <NotaLateral rotulo="A carga" texto={REGRA_DE_CARGA} />
      <NotaLateral rotulo="Panturrilha" texto={REGRA_DE_PANTURRILHA} />
    </section>
  )
}
```

- [ ] **Step 4: Conferir a assinatura de `NotaLateral`**

Run: `cd app && grep -n "export function NotaLateral" -A 6 src/components/SecaoEditorial.tsx`
Expected: o componente aceita `{ rotulo, texto }` e renderiza `rotulo` como texto
visível — é isso que o teste do Step 1 procura com `getByText('A carga')`. Se a
prop tiver outro nome, ajuste as três chamadas no fim do componente.

- [ ] **Step 5: Rodar o teste**

Run: `cd app && npm test -- src/components/TabelaSemana.test.tsx`
Expected: PASS, 5 testes.

- [ ] **Step 6: Remover a preferência órfã**

O toggle `treino.modo` deixou de existir. Conferir se `usePreferencia` ainda é usado
em algum lugar:

Run: `cd app && grep -rn "treino.modo\|usePreferencia" src`
Expected: se `treino.modo` não aparecer mais fora de `usePreferencias.test.ts`,
nada a fazer — o hook continua sendo útil e tem teste próprio. Se o hook ficou sem
nenhum consumidor, deixe-o assim mesmo: removê-lo é escopo de outra tarefa.

- [ ] **Step 7: Rodar a suíte inteira e o build**

Run: `cd app && npm test && npm run lint && npm run build`
Expected: tudo PASS, build sem erro de tipo.

- [ ] **Step 8: Commit**

```bash
git add app/src/components/TabelaSemana.tsx app/src/components/TabelaSemana.test.tsx
git commit -m "feat: tabela da semana vira o ciclo de 4 semanas"
```

---

## Task 5: Cards do Guia

**Files:**
- Modify: `app/src/data/editorial.ts:38-63`
- Test: `app/src/components/PaineisEditoriais.test.tsx`

O Guia hoje fala de um plano que não existe mais ("3 a 4 sessões de força, corpo
inteiro"). Os quatro cards da spec entram no lugar.

- [ ] **Step 1: Escrever o teste que falha**

Acrescentar a `app/src/components/PaineisEditoriais.test.tsx`:

```typescript
import { GUIA } from '@/data/editorial'

describe('cards do guia no modelo empurrar/puxar', () => {
  const titulos = GUIA.map((s) => ('titulo' in s ? s.titulo : ''))

  it('tem o card do joelho operado', () => {
    expect(titulos).toContain('Joelho operado')
  })

  it('tem o card de sinais de alerta', () => {
    expect(titulos).toContain('Sinais para reduzir a carga')
  })

  it('tem o card das três regras da corrida', () => {
    expect(titulos).toContain('Corrida — as três regras')
  })

  it('tem o card de honestidade editorial', () => {
    expect(titulos).toContain('O que este plano não afirma')
  })

  it('não promete que separar peito e costas é melhor', () => {
    const texto = JSON.stringify(GUIA)
    expect(texto).toContain('não é pior')
  })

  it('registra as perguntas em aberto sobre a cirurgia', () => {
    const texto = JSON.stringify(GUIA)
    expect(texto).toMatch(/enxerto/i)
    expect(texto).toMatch(/menisco/i)
  })
})
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `cd app && npm test -- src/components/PaineisEditoriais.test.tsx`
Expected: FAIL — nenhum desses títulos existe hoje.

- [ ] **Step 3: Reescrever o array `GUIA`**

Em `app/src/data/editorial.ts`, substituir o conteúdo de `export const GUIA` por:

```typescript
export const GUIA: SecaoGuia[] = [
  { tipo: 'texto', titulo: 'Antes de tudo', texto: 'Este plano assume que você já teve alta do fisioterapeuta para treino de força com carga e para corrida. Se ainda não teve, ou se está com menos de 9 meses de cirurgia, mostre isto ao seu fisio ou cirurgião antes de começar a parte de corrida.' },
  { tipo: 'texto', titulo: 'Como o plano é organizado', texto: 'Quatro treinos numa fila contínua: empurrar A, puxar A, empurrar B, puxar B. O superior alterna — num dia só empurra (peito, ombro, tríceps), no outro só puxa (costas, bíceps, deltoide posterior). O inferior está em todas as sessões, com a ênfase acompanhando o superior: dia de empurrar puxa mais quadríceps, dia de puxar carrega mais quadril e posterior. Cada bloco junta perna, torso e um terceiro movimento que não disputa o mesmo músculo, porque dois exercícios do mesmo motor no mesmo bloco derrubam o desempenho do segundo.' },
  { tipo: 'texto', titulo: 'Joelho operado', texto: 'A cadeira extensora não está proibida — é o exercício que fecha o déficit de reto femoral que agachamento e leg press não fecham, porque na cadeia fechada esse músculo trabalha em quase-isometria. Ela é obrigatória aqui, e sempre unilateral: a máquina bilateral esconde a diferença entre as pernas, justamente em quem tem simetria como critério de segurança. Menos de 9 meses de cirurgia: trabalhe de 90 a 45 graus, sem carga alta até a extensão completa. Mais de 9 meses: amplitude completa liberada, mas a faixa final é faixa de progressão — 10 a 15 repetições com 2 a 3 na reserva, nunca teste de força, nunca até a falha. Suba carga ou amplitude terminal, nunca as duas na mesma semana. O LCM não restringe a extensora, que é movimento puramente sagital: a ressalva do LCM vale para o joelho apontando para dentro no afundo e no búlgaro.' },
  { tipo: 'alerta', titulo: 'Sinais para reduzir a carga', texto: 'Inchaço no joelho na manhã seguinte — qualquer onda ao deslizar a mão — vale mais que qualquer regra de frequência deste plano: corte 30 a 50% do volume de perna na próxima sessão. Dor acima de 3/10, ou dor que não normaliza em 24 horas. Dor na frente do joelho que piora no dia seguinte: reduza a amplitude terminal e a profundidade, não abandone o exercício. Perda de extensão completa comparada ao outro lado, que é o sinal mais precoce de irritação articular. Dor no tendão de Aquiles ou no patelar ao acordar: 72 horas antes de recarregar aquele tecido. Bloqueio, falseio ou dor na linha da articulação: pare e procure reavaliação. Isso não é fadiga.' },
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
```

- [ ] **Step 4: Rodar o teste**

Run: `cd app && npm test -- src/components/PaineisEditoriais.test.tsx`
Expected: PASS. Se algum teste antigo do arquivo esperava um título que saiu
(por exemplo `'Depende de onde saiu o enxerto'`), atualize-o para o novo título
`'Três perguntas que mudam a prescrição'`.

- [ ] **Step 5: Commit**

```bash
git add app/src/data/editorial.ts app/src/components/PaineisEditoriais.test.tsx
git commit -m "feat: guia reescrito para o modelo empurrar/puxar"
```

---

## Task 6: Fechamento e verificação

**Files:**
- Modify: `README.md`
- Delete: `app/scripts/migrar-blocos.mjs`, `app/scripts/duracao-video.mjs`
- Modify: `docs/RELATORIO.md`

- [ ] **Step 1: Apagar os scripts de uso único**

```bash
rm app/scripts/migrar-blocos.mjs app/scripts/duracao-video.mjs
```

Eles já cumpriram a função e o resultado está commitado. Manter script de migração
no repo confunde quem chega depois: parece ferramenta, é entulho.

- [ ] **Step 2: Atualizar a tabela de ativos do README**

Em `README.md`, a tabela que hoje diz 47 exercícios, 37 recortes, 10 sem recorte,
39 vídeos, 139:45 de vídeo bruto e 11:51 de útil. Substituir pelos números reais:

Run: `cd app && npm test -- src/data/index.test.ts`

Ler os valores de `ESTATISTICAS` que os testes agora afirmam e escrever no README:
53 exercícios, 40 com recorte, 13 sem recorte, 44 vídeos únicos, e os segundos
bruto/útil convertidos para `mm:ss`. Recalcular a linha de redução percentual.

- [ ] **Step 3: Atualizar a seção Estrutura do README**

Acrescentar `docs/pesquisa/` à árvore de diretórios, logo abaixo de `docs/plans/`:

```
docs/pesquisa/            dossiê de evidência que sustenta o desenho do treino
```

- [ ] **Step 4: Trocar a descrição do plano no topo do README**

O primeiro parágrafo descreve o app, não o plano, e continua válido. Abaixo de
"O ativo", acrescentar um parágrafo curto explicando o modelo:

```markdown
## O plano

Quatro treinos numa fila contínua — **Empurrar A, Puxar A, Empurrar B, Puxar B** —
com trabalho de perna em todas as sessões. O superior alterna: num dia só empurra,
no outro só puxa. Cada bloco junta perna, torso e um terceiro movimento que não
disputa o mesmo músculo. O desenho e a evidência que o sustenta estão em
[`docs/specs/2026-09-10-blocos-empurrar-puxar-design.md`](docs/specs/2026-09-10-blocos-empurrar-puxar-design.md).
```

- [ ] **Step 5: Registrar a pendência de recorte**

Em `docs/RELATORIO.md`, na seção "Pendências não resolvidas", acrescentar:

```markdown
- **Recorte dos 3 vídeos novos.** `pa-deltpost`/`pb-deltpost` (crucifixo inverso),
  `ea-triceps` (tríceps overhead) e `pb-abdutor` (abdução de quadril) entraram em
  2026-09-10 sem recorte, só com link. A auditoria quadro a quadro exige `yt-dlp` e
  `ffmpeg`, que não estavam disponíveis no ambiente. Os ids e a justificativa de
  escolha de cada vídeo estão em `docs/dados/videos-novos.json`.
```

- [ ] **Step 6: Travar a deriva entre `duracoes.ts` e `test/duracoes.json`**

A Tarefa 2 acrescentou um teste que impede entrada órfã em `duracoes.ts`, mas nada
garante que `test/duracoes.json` continue idêntico a ele — e essa é justamente a
armadilha que o comentário do topo de `check-clips.mjs` já avisa em prosa. Um teste
do Vitest não é o lugar: ele teria que ler fora de `app/`, e não há precedente disso
no repositório. O lugar certo é o próprio `check-clips.mjs`, que já é quem lê o JSON.

Acrescentar no início de `app/scripts/check-clips.mjs`, logo depois da linha que
carrega `DURACOES`:

```javascript
// O JSON e o .ts precisam ser o mesmo dado. Se derivarem, esta verificação passa a
// olhar para um conjunto de vídeos que o app não usa mais — falha silenciosa que já
// aconteceu uma vez.
const TS = fileURLToPath(new URL('../src/data/duracoes.ts', import.meta.url))
const texto = readFileSync(TS, 'utf8')
const doTs = JSON.parse(texto.slice(texto.indexOf('{'), texto.lastIndexOf('}') + 1))

const soNoJson = Object.keys(DURACOES).filter((id) => !(id in doTs))
const soNoTs = Object.keys(doTs).filter((id) => !(id in DURACOES))
const divergentes = Object.keys(DURACOES).filter((id) => id in doTs && doTs[id] !== DURACOES[id])

if (soNoJson.length || soNoTs.length || divergentes.length) {
  console.log('test/duracoes.json e src/data/duracoes.ts divergiram:')
  if (soNoJson.length) console.log(`  só no JSON: ${soNoJson.join(', ')}`)
  if (soNoTs.length) console.log(`  só no .ts:  ${soNoTs.join(', ')}`)
  if (divergentes.length) console.log(`  duração diferente: ${divergentes.join(', ')}`)
  process.exit(1)
}
```

Verificar que a guarda pega a regressão de verdade: mude a duração de um vídeo
qualquer só em `test/duracoes.json`, rode `npm run check:clips`, confirme que ele
sai com `duração diferente: <id>` e código 1, e desfaça a mudança.

- [ ] **Step 7: Verificação final**

Run: `cd app && npm test && npm run lint && npm run build && npm run check:clips`

Expected, nesta ordem:
- Vitest: todos os arquivos PASS, nenhum teste pulado.
- oxlint: nenhum erro.
- `tsc -b && vite build`: build concluído, sem erro de tipo.
- `check:clips`: `N de N vídeos no ar.`, com os dois números iguais.

Se `check:clips` reclamar de um vídeo, ele saiu do ar depois da Tarefa 1 — escolha
outro, atualize `plano.ts`, `duracoes.ts`, `test/duracoes.json` e
`docs/dados/videos-novos.json`.

- [ ] **Step 8: Conferir no navegador**

Run: `cd app && npm run build && npm start`

Abrir `http://localhost:5173` e confirmar, na ordem:
1. O índice mostra 8 divisões: `01 AQUECER`, `02 EMPURRAR A`, `03 PUXAR A`,
   `04 EMPURRAR B`, `05 PUXAR B`, `06 CORRIDA`, `07 CIRCUITO`, `08 GUIA`.
2. Em `EMPURRAR A`, os três blocos aparecem com os nomes temáticos e nenhum
   exercício de costas ou bíceps está na lista.
3. Clicar em `2.2 Desenvolvimento de ombro` abre o vídeo no trecho certo, em loop.
4. Clicar em `3.9 Tríceps na polia acima da cabeça` abre o vídeo do começo (sem
   recorte, como esperado) e mostra o alternativo `Tríceps na polia com corda`.
5. No `GUIA`, o card `Joelho operado` e o `O que este plano não afirma` aparecem.
6. A tabela do ciclo mostra as 4 semanas e as três notas laterais.

- [ ] **Step 9: Commit**

```bash
git add README.md docs/RELATORIO.md
git rm --cached app/scripts/migrar-blocos.mjs app/scripts/duracao-video.mjs 2>/dev/null || true
git add -A
git commit -m "docs: README e relatorio atualizados para o modelo empurrar/puxar"
```

---

## Verificação de cobertura da spec

| Seção da spec | Tarefa |
|---|---|
| Modelo AB Alternado, fila de 4 treinos | 2, 3 |
| Ciclo de 4 semanas impresso, sem automação | 3, 4 |
| Carga por posição na semana | 3, 4 |
| Tríade não-competitiva, 3 blocos de 3 | 2 (invariantes nos Steps 1 e 8) |
| Proibições de bloco | 2 (teste `nenhum bloco junta dois exercícios do mesmo músculo primário`) |
| Os quatro treinos, exercício a exercício | 2 (mapa de migração) |
| Aquecer com `at-equilibrio` | 2 |
| Circuito rebaixado a condicionamento | 2 (lede da divisão) |
| O que sai | 2 (ids ausentes do mapa) |
| Lacunas de vídeo 1, 2, 3 | 1 |
| Lacuna 4 (pliometria) — bloqueada | 5 (card `Saltos e pliometria`) |
| Cards do joelho, alerta, corrida, honestidade | 5 |
| Perguntas em aberto (enxerto, meses, menisco) | 5 |
| Impacto no código e nos testes | 2, 3, 4, 6 |

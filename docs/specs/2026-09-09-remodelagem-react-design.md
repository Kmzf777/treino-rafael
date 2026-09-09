# Remodelagem em Node + React — design

Data: 2026-09-09 · Substitui: `index.html` (mantido como legado) · Destino: `app/`

## 1. O que estamos construindo

Um app pessoal de **consulta** ao plano de treino do Rafael. Uma pessoa, um plano, sem conta,
sem servidor de dados, sem sincronização.

O usuário abre, acha a divisão do dia, percorre a lista de exercícios, toca em um deles, vê a
execução no segundo exato em loop e lê as três linhas que importam. Fecha. Volta para a série.

**Não é** um app de registro de treino. Foi decisão explícita do usuário: *"sem iniciar treino ou
algo do tipo, quero somente as divisões, os vídeos, e as explicações em modais."*

### O ativo real

O plano de treino qualquer um escreve. O que não se refaz em uma tarde são os **37 recortes de vídeo
auditados manualmente**, cada um apontando para o segundo exato onde a execução correta aparece.

Números verificados por script sobre os dados de produção (não pelo relatório anterior, que
divergia):

| | |
|---|---|
| Exercícios | 47, zero ids duplicados |
| Com recorte completo (`start`+`end`) | 37 |
| Sem recorte (só link) | 10 |
| Vídeos únicos | 39 (+8 em alternativos = 47 ids com duração conhecida) |
| Alternativos | 11, sendo 7 com timestamp |
| Unilaterais (badge) | 13 |
| Recortes inválidos (`end ≤ start`, ou além da duração) | **0** |
| Recorte mais curto / mais longo | 8s / 37s |
| **Vídeo bruto** | **139:45** |
| **Vídeo útil depois do recorte** | **11:51** |
| **Redução** | **91,5%** |

Esse é o número que o app deve exibir, não esconder. O design inteiro se organiza em volta dele.

### Correção de dados registrada

`docs/RELATORIO.md` afirma "47 vídeos únicos" e "181 minutos → 14 minutos". Ambos estão
errados: são 39 vídeos únicos nos exercícios principais e a razão real é 139:45 → 11:51. A spec usa
os números verificados. O relatório antigo fica como está (é registro histórico), mas o app não deve
repetir os números dele.

## 2. Escopo

### Entra

- As 7 divisões: Aquecer, Força A, Força B, Força A', Corrida, Circuito, Guia
- Os 47 exercícios com blocos, prescrição (séries/reps), cues e badge de unilateral
- Os 37 recortes de vídeo em loop + os 11 vídeos alternativos + o link de "outros vídeos"
- Tabela da semana em 4 dias e 3 dias
- Conteúdo editorial de Corrida (protocolo de 8 semanas, cards, cuidados) e Guia
- Busca por nome de exercício, músculo ou equipamento (⌘K / botão)
- Deep link por exercício (URL compartilhável, botão voltar do Android fecha o modal)
- Metadados novos por exercício: músculo primário, secundários, equipamento, padrão de movimento,
  e uma linha de "por que este exercício está neste plano"
- Tema claro/escuro/automático

### Sai

Cronômetro de descanso · checkbox de "feito" · campo de carga · contador de progresso ·
"limpar marcações" · todo o `localStorage` de sessão.

### Único estado persistido

`localStorage`, duas chaves, ambas preferência de leitura e não sessão de treino:

- `treino.modo` → `"4"` | `"3"` (dias de academia na tabela da semana)
- `treino.tema` → `"claro"` | `"escuro"` | `"auto"`

### Consequência editorial

O Guia dizia *"Anote tudo no campo de carga de cada exercício — sem anotar, não existe progressão."*
Como o campo de carga sai, a frase sai junto — ela apontaria para algo que não existe. O resto do
parágrafo de progressão fica intacto.

## 3. Direção de arte — "Protocolo"

**Tese.** Não é um app, é o protocolo de reabilitação impresso que um bom fisioterapeuta entrega na
mão: numerado, hierárquico, sem ambiguidade — e as figuras dele por acaso se movem. O app não tem
cronômetro nem log porque não é uma ferramenta que se opera, é um documento que se consulta. O
visual assume isso até o fim.

Foi escolhida sobre duas alternativas: "Painel" (industrial hi-vis — descartada porque a metáfora de
instrumento promete interatividade que o produto deliberadamente não tem, e o verde hi-vis fica a um
passo do clichê de app fitness) e "Trecho" (cinemateca com folha de contato — descartada porque
depende de 37 thumbnails do YouTube com enquadramento e qualidade inconsistentes, e o grid de 2
colunas corta pela metade o alvo de toque de um polegar suado).

### Enxerto

Da direção "Painel" trazemos **a barra do trecho** para dentro da prancha de figura: é o único
elemento que torna visível, sem uma palavra, o diferencial real do produto.

### Sistema visual

**Sem cards. Sem sombras. Sem bordas de caixa.** O único dispositivo estrutural é o filete de 1px.
A hierarquia inteira é tamanho, peso, espaço e régua. Se a tipografia estiver frouxa, a tela desaba
numa parede de texto — por isso a escala abaixo não é negociável.

**Numeração de protocolo.** Divisões são `01`–`07`. Blocos herdam o número da divisão. Exercícios
recebem endereço estável `2.3`. Isso dá ao Rafael um endereço verbal para cada movimento — que
sobrevive a suor, brilho e rolagem com uma mão só, e que ele pode usar para falar com o
fisioterapeuta.

### Paleta

Bone quente no claro, carbono quente no escuro — nunca cinza neutro, que é o que denuncia dark mode
gerado por IA. O escuro é primeira classe, não afterthought: papel puro a 100% de brilho num canto
escuro da academia às 22h machuca.

> **Correção de 2026-09-09.** A primeira versão desta tabela trazia `--tinta-2` claro em `#77706A`,
> que mede **4,21:1** sobre `--papel-2` — abaixo do mínimo de 4.5:1 que a própria linha exige e que a
> seção 10 repete. O par aparece 15 vezes no app. Escurecer o token para `#6B645E` resolve na origem;
> a alternativa (trocar as chamadas para `--tinta`) deixaria a legenda da figura com 0,17 de margem.
> Quando a spec se contradiz, vale a restrição, não o hex.

| Token | Claro | Escuro | Papel |
|---|---|---|---|
| `--papel` | `#FCFAF5` | `#211E1A` | Fundo |
| `--papel-2` | `#F2EEE5` | `#2A2622` | Lavagem recessada: faixa de bloco, fundo do sheet |
| `--tinta` | `#2B2622` | `#EDE7DD` | Texto primário. Contraste ≥13:1 nos dois modos |
| `--tinta-2` | `#6B645E` | `#A79E93` | Metadados. Nunca abaixo de 4.5:1 |
| `--fio` | `#DCD6CC` | `#423C36` | Filete de 1px — o único dispositivo estrutural |
| `--carimbo` | `#2F5AA8` | `#6E9BE0` | Acento institucional: numeração, aba ativa, foco, janela do trecho |
| `--tijolo` | `#B4462E` | `#E0785C` | Só cues de risco articular. ~12 linhas no app inteiro |
| `--plate` | `#FFFFFF` | `#16130F` | Fundo da moldura da figura / letterbox do clipe |

### Tipografia

Vozes: **Newsreader** (variável, optical sizing) para display; **IBM Plex Sans** para corpo;
**IBM Plex Mono** para todo dado. Todas locais via `@fontsource`, nunca Google Fonts por `<link>` —
o app tem que abrir com sinal ruim na academia.

A escala segue as métricas da HIG da Apple (não a proposta original da direção de arte, que era mais
apertada). Legibilidade sob luz forte ganha de elegância: 17px de corpo, não 15,5.

| Papel | Fonte | Tamanho | Peso | Tracking | Line-height |
|---|---|---|---|---|---|
| Título de divisão | Newsreader | 28px | 500 | −0.021em | 1.214 |
| Nome do exercício (lista) | Plex Sans | 17px | 600 | −0.013em | 1.294 |
| Nome do exercício (sheet) | Newsreader | 20px | 500 | −0.017em | 1.25 |
| Cues / prosa | Plex Sans | 17px | 400 | −0.013em | **1.47** |
| Prescrição (`4x6-10`) | Plex Mono | 15px | 500 | −0.009em | 1.333 |
| Cabeçalho de bloco | Plex Mono | 12px | 500 | +0.04em, CAIXA ALTA | 1.333 |
| Legenda de figura / timecode | Plex Mono | 13px | 500 | −0.003em | 1.385 |
| Número de protocolo | Plex Mono | 13px | 500 | 0 | 1 |

`font-variant-numeric: tabular-nums` ligado em tudo que é mono. Títulos nunca em caixa alta, nunca
centralizados: alinhados à esquerda com o número no gutter, como uma norma técnica.

### Grid e espaço

Base de 4px, ritmo dominante de 8. Margem horizontal de 16px no mobile, 20px acima de 430px de
viewport. Largura de leitura máxima de 672px (o `readableContentGuide` do UIKit); o vídeo pode ir a
720px. Linha de exercício com no mínimo 44px de alvo de toque. Espaço acima de um título ≈ 2–3× o
espaço abaixo — é o que faz agrupamento parecer intencional.

Raios: 6 (badge), 8 (chip), 10 (canônico Apple), 20 (modal desktop), 24 (topo do bottom sheet),
`9999` (cápsula). **Concentricidade obrigatória**: raio interno = raio externo − padding.

### Movimento

Springs para geometria, bezier para material. Nunca spring em opacidade.

| Transição | Spec |
|---|---|
| Press (tap em linha, chip) | spring `visualDuration .25 / bounce 0`, `scale(.97)`, só transform |
| Troca de divisão | spring `.35 / .10` no indicador (layout animation) + crossfade 150ms no conteúdo |
| Sheet — entrar | spring `.45 / .12` |
| Sheet — sair | spring `.32 / 0` — assimétrico de propósito, sem overshoot |
| Backdrop | tween 300ms `cubic-bezier(.32,.72,0,1)` |
| Fade puro | tween 150ms entrada / 100ms linear saída |

Stagger de lista: 20–30ms por item, no máximo 6 itens. `prefers-reduced-motion` desliga translate e
scale, mantém crossfade de 150ms, desativa o scale do fundo.

## 4. Arquitetura

```
app/
  server/index.js            # servidor estático em node:http, zero dependências
  src/
    data/
      plano.ts               # 7 divisões, blocos, 47 exercícios (tipado)
      metadados.ts           # músculo, equipamento, padrão, "por quê" por id
      duracoes.ts            # duração total de cada um dos 47 videoIds
      editorial.ts           # Corrida e Guia (texto estruturado, não HTML)
      semana.ts              # tabelas de 4 e 3 dias
      index.ts               # monta e valida o modelo derivado
    lib/
      rota.ts                # router de hash (~40 linhas, useSyncExternalStore)
      youtube.ts             # loader singleton da IFrame API
      formato.ts             # mm:ss, numeração de protocolo
    hooks/
      useYouTubeClip.ts      # o coração: loop [start,end]
      useTema.ts
      usePreferencias.ts
    components/
      ui/                    # shadcn (base ui)
      AppShell.tsx
      IndiceDivisoes.tsx     # faixa numerada sticky
      ListaExercicios.tsx
      LinhaExercicio.tsx
      SheetExercicio.tsx     # bottom sheet mobile / modal desktop
      PranchaFigura.tsx      # player + moldura + legenda
      BarraTrecho.tsx        # a assinatura
      Busca.tsx              # ⌘K
      TabelaSemana.tsx
      PainelCorrida.tsx
      PainelGuia.tsx
    App.tsx
    index.css                # @theme do Tailwind v4
```

### Camada de dados

O `DATA` do legado vira **módulos TypeScript tipados**, não JSON carregado em runtime. O plano é
fixo e pequeno (~40 KB); embutir no bundle elimina estado de carregamento, spinner, erro de rede e
um modo de falha inteiro. Os textos são copiados palavra por palavra do legado.

```ts
type Recorte = { inicio: number; fim: number }
type Alternativo = { nome: string; video: string; inicio?: number }

type Exercicio = {
  id: string                    // estável, vem do legado — é a chave do deep link
  nome: string
  prescricao: string            // "4x6-10"
  video: string                 // videoId
  recorte?: Recorte
  cues: string[]
  unilateral: boolean           // do campo `uni` do legado, NÃO dos metadados
  busca?: string                // query de fallback do YouTube
  alternativos: Alternativo[]
  meta: Metadados               // músculo, equipamento, padrão, porQue
}
```

`unilateral` vem do legado (13 exercícios), não dos metadados gerados — o agente marcou mais 3
exercícios de mobilidade que são "cada lado" mas não carregam o conceito de trabalho unilateral. O
badge ficaria ruidoso.

### Roteamento

**Sem `react-router`.** Motivos, nessa ordem:

1. `react-router@8` exige Node ≥22.22.0. O Node desta máquina é 22.16.0, e o npm **rebaixa em
   silêncio** para a 7.x com apenas um `warn EBADENGINE` — você desenvolveria contra uma versão
   diferente da que pensa. O app tem que rodar na máquina como ela está.
2. O modal é o único estado navegável. Um `useSyncExternalStore` sobre `location.hash` resolve em
   ~40 linhas, zero dependência, e o botão voltar do Android fecha o modal de graça.

```
#/                        → redireciona para #/aquecer
#/:divisao                → divisão
#/:divisao/:exercicioId   → divisão com o sheet aberto
```

### O player de recorte — `useYouTubeClip`

É a parte difícil do app e a que mais merece cuidado. A documentação da IFrame API diz:

> *"If you specify an `endSeconds` value and then call `seekTo()`, the `endSeconds` value will no
> longer be in effect."*

Ou seja: `end` vale para a **primeira passada**. No instante em que você faz `seekTo(inicio)` para
reiniciar, o YouTube **desarma o ponto final** e a segunda volta toca o vídeo inteiro. Isso valida
retroativamente o legado: o `setInterval` que ele chamava de "cão-de-guarda" **é o mecanismo de loop
de verdade a partir da 2ª volta**. `onStateChange ENDED` é um evento de uma volta só.

Nenhuma biblioteca (`react-youtube`, `lite-youtube-embed`) resolve isso — você escreveria o watchdog
do mesmo jeito, pagando peso e perdendo controle sobre o único ponto que importa. Então: **IFrame
API crua + hook próprio**, com `@types/youtube` como única adição (tipos, sem runtime).

Desenho:

- **Facade.** Nada do YouTube é carregado até o primeiro toque. Pôster próprio primeiro; o iframe
  entra depois. Ganha performance, privacidade real e o gesto de abertura ajuda o autoplay.
- **`requestAnimationFrame` como loop primário**, não `setInterval(500)`. Erro de ~50–150ms contra
  ~900ms, sem drift, e **para sozinho quando o app vai para segundo plano** — bateria e dados na
  academia.
- **Guard anti-seek-storm de 400ms**, que o legado não tem. Depois do `seekTo`, `getCurrentTime()`
  segue devolvendo o valor antigo por alguns frames; sem guard o rAF dispara 5–10 seeks seguidos e o
  player engasga ou trava em BUFFERING.
- **`end` nos playerVars como rede de segurança, não mecanismo.** O watchdog corta em `fim − 0.08s`,
  então sempre ganha. O `end` só existe para o caso do JS ser congelado em segundo plano.
- **`mute: 1` + `mute()` no `onReady` + `playsinline: 1`.** Não é opcional: sem `playsinline` o
  iPhone sequestra a tela em fullscreen e destrói o layout de "vídeo + cues juntos". Botão discreto
  de ativar som (o toque nele é gesto do usuário, então `unMute()` funciona).
- **`host: 'https://www.youtube-nocookie.com'`.** Custo zero.
- **Nó descartável.** `YT.Player` **substitui** o nó que recebe por um `<iframe>`. Nunca passe o nó
  que o React possui — `createElement` + `appendChild` dentro do ref, senão o unmount lança
  `NotFoundError: removeChild`. O legado já acerta isso; não perder no port.
- **StrictMode.** Loader singleton com Promise em escopo de módulo, encadeando o callback global
  anterior em vez de sobrescrever. Flag `disposed` checada dentro do `.then()` e do `onReady`.
  `destroy()` em try/catch e `replaceChildren()` como varredura final.
- **Fade do pôster em `PLAYING (1)`, nunca em `onReady`** — `onReady` dispara antes do primeiro
  frame.
- **Destruir o player antes da animação de saída do sheet**, não junto com o unmount.
- **`modestbranding` removido** — está deprecado e sem efeito desde 2023.

### Cascata de fallback

| Nível | Situação | Ação |
|---|---|---|
| 0 | `file://` | Erro 153 em todo embed, sem parâmetro que resolva. Detectar e ir direto ao link-out. Ainda relevante: duplo-clique em `dist/index.html` é comportamento esperado. `base: './'` no Vite para o resto renderizar. |
| 1 | Script da API não carrega (rede da academia, bloqueador, DNS) | Timeout de 3s → iframe simples |
| 2 | `onError` 101/150 (embed proibido) ou 100 (removido) | Permanente e específico daquele vídeo: mensagem certa + link-out + "outros vídeos". Não tentar iframe. |
| 2b | `onError` 5 (erro de player) | Transitório: um retry |
| 3 | `onAutoplayBlocked` (iOS Low Power Mode, data saver) | **Não é erro, é estado**: overlay "Toque para tocar" |
| 4 | Qualquer coisa | Link permanente `youtube.com/watch?v=ID&t=INICIOs` sempre visível, por exercício |

### Zero CLS

Container `aspect-video` reserva a altura no primeiro paint, antes do script, antes do iframe. O
iframe entra `absolute inset-0`. A caixa é reservada **dentro do sheet também**, senão o sheet cresce
e reflowa os cues.

## 5. O sheet do exercício

É a tela principal do produto.

**Mobile (<640px)** — bottom sheet. Altura orientada pelo conteúdo, `max-height: 92dvh` (`dvh`, não
`vh`: a barra do Safari iOS quebra `vh`). Cantos `24px 24px 0 0`. Grabber 36×5px. Superfície sólida,
**sem blur** — cobre 90% da tela e material grosso vira cinza sujo. Backdrop `rgba(0,0,0,.40)` claro
/ `.56` escuro. Scale do fundo `.936` com `transform-origin: top center` (só mobile; no desktop
escalar a página parece bug).

**Drag-to-dismiss.** Segue o dedo 1:1 para baixo, rubberband 0.35 para cima. Dismiss se
`arrasto > 25% da altura` **ou** `velocidade > 500px/s` — flick curto tem que fechar. **Só habilitar
o drag quando o container rolável estiver em `scrollTop === 0`**; sem isso, rolar os cues fecha o
modal e o app fica insuportável na academia.

**Desktop (≥640px)** — modal centrado, `max-width: 640px`, raio 20px, `max-height: 88dvh`, sem
grabber, sem drag. Entra com `opacity` + `scale .96→1` + `translateY 8→0`.

**Obrigatório:** focus trap, `inert` no fundo, Escape fecha, foco volta ao elemento que abriu,
`role="dialog"` + `aria-modal` + `aria-labelledby`. Scroll lock no iOS com `position:fixed` +
`top:-scrollY` (`overflow:hidden` sozinho não segura o Safari iOS). O `<iframe>` **desmontado** ao
fechar, não escondido.

### Conteúdo do sheet — a prancha de figura

```
┌─────────────────────────────────────┐
│  ▬▬▬▬  (grabber)                    │
│  2.3                            ✕   │
│  Ponte de glúteo com miniband       │  Newsreader 20/500
│  2x15 · Miniband · Glúteo máximo    │  Plex Mono 13 + Plex Sans 13
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │  moldura de filete único
│  │        vídeo 16:9             │  │  --plate
│  │                               │  │
│  └───────────────────────────────┘  │
│  ├──────█████──────────────────┤    │  ← BARRA DO TRECHO
│  Fig. 2.3 · 0:33–1:08 · em loop     │  Plex Mono 13
│                                     │
│  2.3.1  Suba o quadril até…         │  cues numerados, 17/1.47
│  2.3.2  Termine apertando…          │
│  ⚠ 2.3.3  Se sentir a lombar…       │  --tijolo quando risco
│                                     │
│  Abrir no YouTube · Outros vídeos   │
│  Por que está no plano: …           │
└─────────────────────────────────────┘
```

### A barra do trecho (assinatura)

Uma régua fina representando a **duração inteira do vídeo original**, com a janela curada acesa em
`--carimbo` e um playhead percorrendo só aquele segmento. Em uma linha, sem texto, mostra o produto:
35 minutos de vídeo bruto reduzidos a 22 segundos.

Ela renderiza **instantaneamente**, antes de qualquer player existir, porque `test/duracoes.json` já
tem a duração real dos 47 videoIds. Isso é o que a torna viável — não depende de `getDuration()`.

No topo de cada divisão, o mesmo dado em texto: `Força A · 13 exercícios · 10 clipes · 3:16 de
56:14`. No rodapé do app: `11:51 úteis de 139:45 brutos`.

## 6. Navegação

**Índice de divisões**: faixa numerada sticky, rolável na horizontal —
`01 AQUECER · 02 FORÇA A · 03 FORÇA B · 04 FORÇA A' · 05 CORRIDA · 06 CIRCUITO · 07 GUIA`. A ativa é
marcada por um **filete de 2px em `--carimbo` sob o número**, nunca por pílula preenchida (pílula é o
visual de todo app genérico). O indicador desliza com layout animation.

**Lista**: folha corrida, sem cards. Cabeçalho de bloco em mono/caixa alta sobre `--papel-2` com
régua de 2px. Cada exercício é uma linha com gutter de 44px para o número, nome à esquerda,
prescrição em mono à direita. Sem chevron, sem checkbox — a linha inteira é o alvo.

**Desktop**: duas colunas assimétricas — índice fixo à esquerda em 220px, folha à direita em no
máximo 680px.

**Busca (⌘K)**: `command` do shadcn. Filtra os 47 por nome, músculo primário e equipamento. Enter
abre o sheet direto. Estado vazio explícito.

## 7. Stack

| | |
|---|---|
| Build | Vite 8 |
| UI | React 19 + TypeScript 6 |
| Estilo | Tailwind CSS v4 (CSS-first, `@theme`, **sem `tailwind.config.js`**) |
| Componentes | shadcn CLI v4 com **Base UI** (`-b base -p nova`) |
| Movimento | `motion` v13 |
| Rotas | próprio, hash, ~40 linhas |
| Player | IFrame API crua + `@types/youtube` |
| Fontes | `@fontsource` local (Newsreader, IBM Plex Sans, IBM Plex Mono) |
| Testes | Vitest 5 + Testing Library + jsdom **29** |
| Lint | oxlint (o template do Vite 8 não usa mais ESLint) |
| Servidor | `node:http`, zero dependências |

### Base UI, não Radix

O shadcn tornou o Base UI padrão em julho/2026. Com `-b radix`, o `drawer` puxa o **Vaul**, cujo
README diz textualmente *"This repo is unmaintained"* (último release dez/2024, 136 issues abertas).
O Drawer do Base UI é nativo e mantido, com swipe, snap points, `SwipeArea` e variáveis CSS
(`--drawer-swipe-progress`, `--drawer-snap-point-offset`) que entregam exatamente a física de sheet
iOS que a direção pede. O drawer é a interação central deste app — não pode ficar sobre uma
dependência abandonada.

### Armadilhas confirmadas empiricamente

- **`baseUrl` quebra o build.** Os docs do shadcn ainda mandam adicionar `"baseUrl": "."`. Com
  TypeScript 6 isso é `TS5101` fatal e o `tsc -b` aborta. Use só `paths`.
- **O CLI do shadcn trava** em prompt interativo se receber apenas `-y`. As flags `-b` e `-p` são
  obrigatórias.
- **`shadcn` é dependência de runtime**, não devDependency — o `index.css` faz
  `@import "shadcn/tailwind.css"`.
- **`cn` mudou**: `src/lib/utils.ts` agora é `export { cn } from "cn"`. Não instalar clsx nem
  tailwind-merge.
- **Radix é o pacote unificado `radix-ui`**, não mais dezenas de `@radix-ui/react-*`.
- **`@vitest/coverage-v8` precisa casar exato** com a versão do vitest.
- **Não instalar `typescript@latest`** (é 7.x). O template do Vite 8 pina `~6.0.2`.
- **`strict` não aparece no tsconfig e não é bug** — TS 6 liga strict por padrão.
- **`import.meta.dirname`**, não `__dirname` (o projeto é ESM).
- **jsdom 30 exige Node ≥22.22.2** → pinar 29.
- **Teste com Motion**: `initial={{opacity:0}}` deixa o elemento em `opacity:0` no jsdom e
  `toBeVisible()` falha para todos os descendentes. Usar `toBeInTheDocument()` ou `MotionConfig` com
  `reducedMotion`.

### Windows + OneDrive

O projeto vive em `C:\Users\rafae\OneDrive\Desktop\Canastra Inteligencia\Agentes AI\Treino Rafael` —
três espaços no caminho e sincronização ativa. Consequências: aspas obrigatórias em todo comando;
pausar o OneDrive antes do `npm install` (são ~514 pacotes e o sync causa EPERM/EBUSY no meio);
`git config --global core.longpaths true`. `LongPathsEnabled` já está `1` no registro desta máquina.

A recomendação honesta é mover o projeto para fora do OneDrive (`C:\dev\treino-rafael`) — o git já
dá o backup. Fica registrado, não bloqueia.

## 8. Servidor

`app/server/index.js` em `node:http`, sem dependências: serve `dist/` com os MIME types certos e
faz fallback para `index.html`. `npm start` → `http://localhost:5173`.

Existe por um motivo concreto, não por formalidade: **embeds do YouTube falham em `file://` com erro
153**, sem parâmetro que resolva. O produto inteiro depende do vídeo funcionar. Servir por HTTP não é
detalhe de deploy, é requisito funcional.

## 9. Testes

Vitest, com foco no que quebra de verdade.

**Integridade de dados** (mais valioso do que parece — protege o ativo):
- 47 exercícios, ids únicos
- todo `recorte` tem `fim > inicio` e `fim ≤ duracao[video]`
- todo `videoId` (principal e alternativo) tem duração conhecida
- todo id de metadado casa com um id do plano, e vice-versa
- todo exercício tem ao menos um cue
- `unilateral` bate com os 13 do legado

**`useYouTubeClip`** com um `YT` falso: faz `seekTo(inicio)` ao passar de `fim − ε`; **não** dispara
seek em rajada dentro do guard de 400ms; destrói o player no unmount; sobrevive ao duplo mount do
StrictMode.

**Router de hash**: parse, navegação, back fecha o sheet.

**`SheetExercicio`**: renderiza nome, prescrição, todos os cues, alternativos e o link permanente com
`t=` correto; Escape fecha; foco volta.

**Busca**: filtra por nome, músculo e equipamento; estado vazio.

**Script de saúde dos vídeos** (`npm run check:clips`): bate na oEmbed pública de cada videoId e
reporta 404/401. Roda em segundos e avisa que um vídeo saiu do ar **antes** do Rafael descobrir na
academia. Fora do `npm test` (depende de rede).

## 10. Acessibilidade

Contraste ≥ 4.5:1 em todo texto (o primário fica ≥ 13:1). Alvos de toque ≥ 44px com gap ≥ 8px.
Foco visível em `--carimbo` com offset. Navegação completa por teclado, incluindo o índice de
divisões. `prefers-reduced-motion` respeitado. Safe areas do iPhone (`env(safe-area-inset-*)`) no
sheet e no índice sticky. Todo texto em português do Brasil, `lang="pt-BR"`.

## 11. Fora de escopo, deliberadamente

Mapa muscular interativo (depende de arte que não temos e são só 47 exercícios) · filtro por
equipamento (o plano é fixo) · coleções estilo Netflix (são 6 divisões) · PWA/offline shell ·
qualquer coisa social, de progresso ou de conta.

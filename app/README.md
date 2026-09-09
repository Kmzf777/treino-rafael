# Protocolo de treino

App de consulta ao plano de treino: 7 divisões, 47 exercícios e 37 recortes de vídeo
apontando para o segundo exato da execução correta — 11:51 de vídeo útil no lugar de
139:45 de vídeo bruto.

Substitui o `treino-rafael.html` da raiz do repositório, que ficou como referência
histórica dos dados.

## Rodar

```bash
cd app
npm install
npm run dev        # desenvolvimento, com HMR
npm run build      # gera dist/
npm start          # serve dist/ em http://localhost:5173
```

**Sirva sempre por HTTP.** Abrir `dist/index.html` com duplo-clique cai em `file://`,
onde o YouTube recusa todo embed com erro 153 — o app detecta isso e cai no link direto
para o vídeo, mas você perde o loop no trecho. O servidor de `server/index.js` existe
exatamente por causa disso: `node:http`, zero dependências, e toda rota desconhecida cai
no `index.html` para o roteamento por hash funcionar.

Porta: `PORT=8080 npm start` se a 5173 estiver ocupada.

## Comandos

| | |
|---|---|
| `npm test` | Testes (Vitest + Testing Library + jsdom) |
| `npm run test:watch` | Testes em modo watch |
| `npm run lint` | oxlint (não há eslint neste projeto) |
| `npm run check:clips` | Verifica pela oEmbed se algum vídeo saiu do ar |
| `npm run build` | `tsc -b` + build de produção |

## Estrutura

- `src/data/` — o plano inteiro, tipado, embutido no bundle: sem fetch, sem estado de
  carregamento, funciona offline depois do primeiro carregamento. Importe sempre de
  `@/data` (o modelo derivado), não dos módulos crus.
- `src/hooks/useYouTubeClip.ts` — o loop `[início, fim]`, a parte mais delicada do app.
- `src/lib/rota.ts` — roteamento por hash (`#/forcaA/a-agacha`) em ~40 linhas.
- `src/components/` — a interface. `AppShell` é a moldura, `App.tsx` a composição por rota.
- `server/index.js` — servidor estático.
- `scripts/check-clips.mjs` — saúde dos vídeos.

## Direção de arte "Protocolo"

O app é um protocolo de reabilitação impresso, numerado e hierárquico, cujas figuras por
acaso se movem. Não é um dashboard. Quem for mexer na interface:

- Sem cards, sem sombras, sem bordas de caixa. O único dispositivo estrutural é o filete
  de 1px (`--fio`). Hierarquia se faz com tamanho, peso, espaço e régua.
- Numeração de protocolo: divisões `01`–`07`, exercícios `2.3`, cues `2.3.1`.
- Newsreader (display) · IBM Plex Sans (corpo, 17px) · IBM Plex Mono (todo dado, com
  `tabular-nums`).
- `--tijolo` **só** em cue de risco articular. `--carimbo` em numeração, indicador ativo
  e foco. Alvo de toque mínimo de 44px.
- Movimento: spring para geometria, bezier para opacidade — nunca spring em opacidade.
  `prefers-reduced-motion` é respeitado.

## Notas de manutenção

- **Tokens da paleta:** vivem em `@theme static` no `src/index.css`. O `static` não é
  opcional — sem ele o Tailwind v4 poda toda variável que nenhuma utility referencia, e
  as regras em CSS puro (`body`, `.mono`, `:focus-visible`) leem os tokens por `var()`,
  o que o Tailwind não rastreia. Tirar o `static` deixa o modo claro sem fundo.
- **Classe de tema:** é `.escuro` no `<html>`, não `.dark`. A variante `dark:` do shadcn
  foi reapontada para ela no `index.css`; as duas coisas precisam continuar de acordo.
- **`unilateral`** de cada exercício vem de `plano.ts`, nunca dos metadados.
- **Se um vídeo sair do ar:** `npm run check:clips` aponta o id. Troque em
  `src/data/plano.ts`, ajuste `src/data/duracoes.ts` **e espelhe em `test/duracoes.json`
  na raiz do repositório** — é esse JSON que o `check:clips` lê, então esquecer dele faz
  a verificação validar ids velhos em silêncio.
- **Nunca adicione `baseUrl`** a nenhum tsconfig: com TypeScript 6 é `TS5101` fatal e o
  build aborta. Só `paths`.
- **Não crie `tailwind.config.js`** (v4 é CSS-first) e não instale `eslint`, `clsx` nem
  `tailwind-merge` (o projeto usa oxlint, e `cn` vem do pacote `cn`).
- **Nos testes**, use `toBeInTheDocument()` e não `toBeVisible()`: `initial={{opacity:0}}`
  do motion deixa `opacity: 0` inline no jsdom e o jest-dom considera invisível toda a
  subárvore.
- **OneDrive:** pause a sincronização antes de qualquer `npm install`.

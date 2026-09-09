# Recorte de vídeos no minuto certo — design

Data: 2026-09-08
Alvo: `treino-rafael.html`
Origem: `BRIEFING-claude-code.md`

## Problema

Rafael abre o app na academia, entre séries, com o celular na mão. Vários exercícios
apontam para tutoriais longos: vinheta, propaganda de consultoria, teoria, e só então a
execução. O vídeo do agachamento tem 23 minutos e 41 segundos. Ele precisa ver o
movimento, não a aula.

## Objetivo

Cada exercício abre num trecho de 12 a 40 segundos que mostra a execução completa,
começando no momento certo e repetindo em loop.

## Triagem medida

O briefing classificava por palpite. Todos os 46 IDs foram medidos com `yt-dlp`:

| Faixa | Vídeos | Ação |
|---|---|---|
| ≤45s | 11 | não mexer |
| 46–120s | 12 | analisar |
| >120s | 22 | analisar |
| fora do ar | 1 | substituir |

- **34 vídeos** entram na análise.
- **43 decisões de recorte**, porque 7 vídeos servem 2 ou 3 exercícios e cada uso tem
  seu próprio trecho.
- **6 vídeos têm capítulos**, que dão hipótese inicial de graça.
- **11 vídeos alternativos** recebem apenas `?t=` no link.

### Correções ao mapa do briefing

O mapa da seção 4 do briefing está incompleto. Faltam `a-fin-1`, `a-fin-2`, `b-fin-3`,
`b-fin-4` e `al-pelvica`. O inventário real foi extraído do HTML: 46 exercícios,
11 alternativos, 46 IDs únicos.

Dois vídeos estão quebrados por motivos diferentes:

- `kLcjscPyLqI` (`b-lombar`, extensão lombar) — **fora do ar**. O briefing dizia
  "conferir"; na verdade retorna *"This video is not available"*.
- `nfT-wE0SjLk` em `at-bike` — vídeo **errado**. É remo indoor onde deveria ser
  bike ou esteira leve. O mesmo ID está correto em `c-remo`.

## Modelo de dados

O helper não muda. `opts` já é espalhado no objeto do exercício:

```js
const e = (id, nome, sets, video, cues, opts={}) => ({id, nome, sets, video, cues, ...opts});
```

Campo novo, opcional:

```js
{ t: {start: 619, end: 648} }
```

Para alternativos, `{n, v, t:{start}}` — só o início, porque alternativo é link, não player.

O campo `t` é **do exercício, não do vídeo**. Não existe tabela global por videoId.
`RTxAFDK1OMw` é o exemplo: 38–46s para a prancha frontal, 60–92s para a lateral.

## Player com loop

Substituir o iframe simples pela IFrame Player API, com três camadas:

1. `playerVars {start, end}` — recorta por conta própria.
2. `onStateChange` com estado `ENDED` → `seekTo(start)` + `playVideo()`.
3. Cão-de-guarda: `setInterval` comparando `getCurrentTime()` com `end`, voltando ao
   início quando passar. Cobre o caso do `ENDED` não disparar.

**Fallback obrigatório:** se `iframe_api` não carregar em 3 segundos, usar o iframe atual
com `?start=&end=`. O app nunca pode ficar sem vídeo.

Um player por exercício, criado no clique — mantém o carregamento preguiçoso de hoje.
Ao abrir um player, pausar o anterior.

Exercício sem `t` continua com o comportamento atual, sem recorte.

## Descoberta dos timestamps

Por vídeo, nesta ordem:

1. **Capítulos**, quando existirem, dão a hipótese inicial.
2. **Transcrição automática** em pt via `yt-dlp --write-auto-sub`, para achar onde a
   teoria termina.
3. **Contact sheet**: mosaico de ~30 quadros com o segundo carimbado em cada um,
   gerado por `ffmpeg` a partir da URL de stream. A imagem é examinada visualmente.
4. **Zoom**: se a janela ficar ambígua, segundo mosaico só daquele trecho, 1 quadro
   por segundo.
5. Registrar `start`, `end`, justificativa e confiança.

O passo 3 é o que torna o critério de aceite verificável. "Começa com a pessoa já em
posição e não falando" é uma afirmação sobre a imagem; transcrição não prova isso,
porque o instrutor costuma falar por cima da demonstração.

### Critérios de aceite de um trecho

1. Começa com a pessoa em posição ou iniciando o movimento, não falando para a câmera.
2. Mostra ao menos 2 repetições completas, ou 5s de sustentação em isométrico.
3. Dura entre 12 e 40 segundos.
4. Não corta no meio de uma repetição.
5. Não pega vinheta, propaganda, "se inscreve" ou tela final.

## Substituições

Recebem busca por substituto: o vídeo fora do ar, o vídeo errado, e qualquer um sem
trecho aproveitável. Todo ID novo é validado com `yt-dlp` antes de entrar, e passa pelo
mesmo pipeline de recorte.

Os `cues` de cada exercício **permanecem intactos**. Foram escritos com o joelho
operado em mente e continuam valendo mesmo com outro vídeo.

## Fora de escopo

O vídeo brasileiro de educativos de corrida e de cadência com metrônomo, pendência da
seção 4 do briefing, fica de fora. É busca aberta sem critério objetivo de aceite;
entra no relatório final como pendência em vez de ser escolhido no chute.

## Verificação

- Os 46 IDs mais substitutos respondem no `yt-dlp`.
- Todo `t` satisfaz `start < end`, `12 ≤ end-start ≤ 40`, `end ≤ duração`.
- Diff confirma que nenhum `cue`, o aviso médico e o `window.storage` foram tocados.
- O HTML abre e um exercício de cada aba entra em loop no trecho certo.

## Restrições preservadas

- Arquivo único, sem build, sem framework. Precisa abrir direto no celular.
- Persistência em `window.storage` com fallback em memória. Nada de `localStorage`.
- Aviso de que o plano não substitui fisioterapeuta ou médico fica onde está.
- Os princípios do plano de treino (trabalho unilateral em toda sessão, cadência,
  liberação do fisio para pliometria, sinais de alerta) não são tocados por esta
  mudança, que é só de vídeo.

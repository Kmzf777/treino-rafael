# Treino Rafael

App de consulta a um plano de treino híbrido — academia e corrida de 5 km — com um joelho
operado (reconstrução de LCA + LCM) como restrição central.

Você abre, acha a divisão do dia, toca num exercício e vê a execução **no segundo exato**,
em loop, com as três linhas que importam. Fecha e volta para a série.

Não é app de registro de treino: **sem cronômetro, sem marcar feito, sem log de carga,
sem contador de progresso.** É um documento que se consulta.

## O ativo

O plano qualquer um escreve. O que não se refaz numa tarde são os **37 recortes de vídeo
auditados à mão**, cada um apontando para o segundo em que a execução correta aparece.

| | |
|---|---|
| Exercícios | 47 |
| Com recorte (`início`+`fim`) | 37 |
| Sem recorte (só link) | 10 |
| Vídeos únicos | 39 |
| Vídeo bruto | 139:45 |
| Vídeo útil depois do recorte | **11:51** |
| Redução | **91,5%** |

## Rodar

```bash
cd app
npm install
npm run dev                  # desenvolvimento
npm run build && npm start   # http://localhost:5173
```

| | |
|---|---|
| `npm test` | 147 testes (Vitest) |
| `npm run lint` | oxlint |
| `npm run check:clips` | verifica se algum vídeo saiu do ar |

## Precisa ser servido por HTTP

Abrir o `dist/index.html` com dois cliques cai em `file://`, onde o navegador não manda
cabeçalho `Referer` e o YouTube **recusa todo embed com erro 153**. Não é contornável por
parâmetro — foi testado com e sem `enablejsapi`, com e sem `loop`/`playlist`.

O app detecta esse caso e cai no link direto para o YouTube no segundo certo. Funciona,
mas sem o loop no trecho. Por isso existe o `npm start`: um servidor `node:http` de zero
dependências que serve o `dist/`.

## Deploy

A Vercel constrói o `app/` e publica o `app/dist/`. O `vercel.json` na raiz cuida de
install, build e output — deixe os três campos **vazios** no painel, senão ele sobrescreve
o arquivo.

**O Root Directory precisa ficar em `./`** (a raiz do repositório). É a única configuração
do painel que importa: o `outputDirectory` do `vercel.json` é `app/dist`, relativo à raiz.
Se o Root Directory for mudado para `app`, o build ainda roda — os comandos detectam onde
estão — mas a Vercel procura o output em `app/app/dist` e falha com "No Output Directory
found". Nesse caso, troque `outputDirectory` para `dist`.

JSON não aceita comentário e a Vercel valida o schema: qualquer propriedade desconhecida
no `vercel.json`, inclusive um campo `"//"` usado como nota, faz o deploy ser recusado
antes de começar com *"Invalid request: should NOT have additional property"*.

## Estrutura

```
app/                      o app (Vite + React 19 + TypeScript)
  src/data/               o plano inteiro, tipado, embutido no bundle
  src/hooks/              useYouTubeClip — o loop [início, fim]
  src/components/         a interface
  server/index.js         servidor estático, zero dependências
docs/specs/               design aprovado
docs/plans/               planos de implementação
docs/dados/               timestamps, auditoria, metadados dos exercícios
docs/RELATORIO.md         como cada recorte foi decidido
docs/original-antes-do-recorte.html   o app original, antes do trabalho de recorte
test/duracoes.json        duração real dos 47 vídeos
vercel.json               configuração de deploy
```

## O ponto técnico que define o app

A documentação da YouTube IFrame API diz:

> *"If you specify an `endSeconds` value and then call `seekTo()`, the `endSeconds` value
> will no longer be in effect."*

Ou seja: o `end` vale para a **primeira passada**. No instante em que você faz
`seekTo(início)` para reiniciar o trecho, o YouTube desarma o ponto final e a segunda
volta toca o vídeo inteiro. Não existe parâmetro de URL que faça loop de trecho, e
nenhuma biblioteca de player resolve isso — você escreveria o mesmo watchdog de qualquer
jeito.

Por isso `useYouTubeClip` usa a IFrame API crua com um watchdog em `requestAnimationFrame`
(que para sozinho quando o app vai para segundo plano) e um guard de 400 ms contra
tempestade de `seekTo`.

## Direção de arte

"Protocolo": o app é o protocolo de reabilitação impresso que um bom fisioterapeuta
entrega na mão — numerado, hierárquico, sem ambiguidade — e as figuras dele por acaso se
movem. Sem cards, sem sombras: o único dispositivo estrutural é o filete de 1 px. Cada
exercício tem um endereço estável (`2.3`) que serve para falar com o fisioterapeuta.

Detalhes em [`docs/specs/2026-09-09-remodelagem-react-design.md`](docs/specs/2026-09-09-remodelagem-react-design.md).

## Histórico

O app nasceu como uma página HTML única, sem build. Essa versão foi aposentada em
2026-09-09 e vive no histórico do git (`254b621` e anteriores). O trabalho de recorte dos
vídeos, feito sobre ela, está descrito em [`docs/RELATORIO.md`](docs/RELATORIO.md) — e os
dados que ele produziu são os mesmos que o app React usa hoje.

## Aviso

Este plano é orientação geral de treino e não substitui avaliação de fisioterapeuta ou
médico. Saltos e pliometria só com liberação do fisio.

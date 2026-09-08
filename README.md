# Treino Rafael

App de página única para treino híbrido de academia e corrida de 5 km, com um joelho
operado (reconstrução de LCA + LCM) como restrição central do plano.

Cada exercício abre num trecho curto do vídeo mostrando **só a execução**, em loop.
Serve para ser consultado no celular, na academia, entre séries.

**Sem build, sem framework, sem dependências.** É um arquivo HTML.

## Publicar na Vercel

O projeto é estático. Importe o repositório na Vercel e aceite os padrões:

| Campo | Valor |
|---|---|
| Framework Preset | Other |
| Build Command | *(vazio)* |
| Output Directory | *(vazio, usa a raiz)* |
| Install Command | *(vazio)* |

O `vercel.json` já cuida de `cleanUrls` e dos cabeçalhos. `index.html` é servido na raiz.

Para rodar local, qualquer servidor estático serve:

```bash
python -m http.server 8000
# abre http://127.0.0.1:8000
```

Abrir o arquivo por `file://` funciona parcialmente: os embeds do YouTube preferem
uma origem HTTP.

## Testes

```bash
node test/validate.js
```

São 211 checagens sobre `index.html`: estrutura preservada (47 exercícios, 11
alternativos, nenhum `cue` perdido em relação ao original), coerência de todos os
trechos de vídeo, e presença do player com recorte, loop e fallback.

O teste compara contra `docs/original-antes-do-recorte.html`, que é o app como estava
antes do trabalho de recorte.

## Como os trechos foram definidos

Capítulos e transcrição propõem a janela; um mosaico de quadros com o segundo
carimbado confirma na imagem. Nenhum timestamp entrou sem alguém ter olhado os
quadros. Depois, uma auditoria adversarial independente tentou reprovar cada trecho,
também olhando os quadros — e reprovou 9 dos 43 primeiros.

Detalhes em [`docs/RELATORIO.md`](docs/RELATORIO.md). Os dados brutos (timestamps,
veredictos da auditoria, metadados dos vídeos) estão em `docs/dados/`.

## Estrutura

```
index.html                      o app inteiro
vercel.json                     configuração de deploy
docs/RELATORIO.md               o que foi feito, com tabela de todos os trechos
docs/specs/                     design aprovado
docs/plans/                     plano de implementação
docs/dados/                     timestamps, auditoria, metadados dos vídeos
docs/original-antes-do-recorte.html   referência para o teste de regressão
test/validate.js                211 checagens
```

## Modelo de dados

No `<script>`, a constante `DATA` tem uma chave por aba. Exercícios são criados por:

```js
const e = (id, nome, sets, video, cues, opts={}) => ({id, nome, sets, video, cues, ...opts});
```

`opts` aceita `{uni:true, busca:'termo', alt:[{n,v,t}], t:{start,end}}`.

O campo `t` é **do exercício, não do vídeo**: o mesmo vídeo aparece em exercícios
diferentes com trechos diferentes. `RTxAFDK1OMw` é o exemplo — 39–47s para a prancha
frontal, 65–91s para a lateral.

## Restrições que não mudam

- Persistência em `window.storage` com fallback em memória. **Nada de `localStorage`.**
- Arquivo único, sem build. Precisa abrir direto no celular.
- Os `cues` foram escritos com o joelho operado em mente. Trocar um vídeo não invalida
  os cues.
- O aviso de que o plano não substitui fisioterapeuta ou médico fica onde está.

## Aviso

Este plano não substitui avaliação de fisioterapeuta ou médico. Saltos e pliometria
só com liberação do fisio.

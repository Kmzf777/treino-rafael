# Recorte de vídeos — relatório final

Data: 2026-09-08 · App: `treino-rafael.html` · Backup: `treino-rafael.ORIGINAL.bak`

## Resultado

| | |
|---|---|
| Exercícios no app | 47 |
| Com trecho de execução | 37 |
| Alternativos com link no minuto certo | 7 de 11 |
| Vídeos únicos | 47, **todos no ar** |
| Vídeos substituídos | 2 |
| Trechos corrigidos pela auditoria | 8 |
| Validação automática | 211/211 |

**Duração dos trechos:** 8 a 37 segundos, média 19,3.

**O ganho concreto:** para ver a execução de todos esses exercícios, o Rafael teria
que varrer **181 minutos** de vídeo. Agora são **14 minutos**, sempre no ponto certo,
em loop.

O caso extremo é o agachamento: o vídeo tem 23min41s e agora abre em 13:30, num
trecho de 22 segundos com três repetições completas.

## Como cada trecho foi decidido

Capítulos e transcrição propõem a janela; um mosaico de quadros com o segundo
carimbado confirma na imagem. Nenhum timestamp foi definido sem alguém ter olhado
os quadros. Depois, uma auditoria adversarial independente tentou reprovar cada
trecho, também olhando os quadros.

A auditoria reprovou **9 dos 43** trechos iniciais. Sem ela, o app teria entregue:

- `a-fin-2` (flexão de braço) abrindo na **demonstração do erro** — costas arqueadas,
  exatamente a técnica que não se quer ensinar;
- `c-afundo` com timestamp **5 segundos deslocado**;
- quatro trechos cortando no meio da repetição;
- dois trechos cuja justificativa não batia com a imagem.

## Vídeos substituídos

| Exercício | Antes | Depois | Motivo |
|---|---|---|---|
| `b-lombar` | `kLcjscPyLqI` | `W_kuBiLk5s0` | vídeo saiu do ar |
| `at-bike` | `nfT-wE0SjLk` | `UeK0QVyA4UM` | era remo indoor, exercício errado |

`nfT-wE0SjLk` continua em `c-remo`, onde está correto. Os `cues` dos dois exercícios
foram preservados intactos.

## O que revisar quando sobrar tempo

12 trechos ficaram com confiança **média**. Todos passaram na auditoria, mas valem um
olhar: `mob-gato`, `b-biceps`, `b-pallof`, `al-pelvica`, `a-pelvica-uni`, `c-flexao`,
`at-pant`, `a-extensora`, `al-leg`, `al-extensora` e dois alternativos.

## Pendências não resolvidas

- **Vídeo de corrida.** O briefing pede educativos de corrida e cadência com
  metrônomo. Ficou fora: é busca aberta sem critério objetivo de aceite, e escolher
  no chute seria pior que deixar a aba como está.
- **`c-prancha` tem 8 segundos.** É todo o tempo que o vídeo dedica à prancha
  frontal. Preferi um clipe honesto de 8s a inflar até 12s pegando conversa.

## Correções ao briefing

O briefing dizia 46 exercícios; são **47**. O mapa da seção 4 omitia `a-fin-1`,
`a-fin-2`, `b-fin-3`, `b-fin-4`, `al-pelvica` e `al-extensora` — esse último escapava
de qualquer busca por regex porque o nome usa aspas duplas.

## Mudanças técnicas no app

- Campo opcional `t:{start,end}` por exercício, e `t:{start}` nos alternativos.
- Player pela IFrame Player API com loop no trecho (`onStateChange` + cão-de-guarda
  por `getCurrentTime`).
- Fallback para iframe simples com `start`/`end` e `loop=1&playlist=ID`, para o caso
  de a API não carregar sobre HTTP.
- Aberto por `file://` o app **não embute vídeo nenhum**: o botão vira "Ver no YouTube"
  e abre o vídeo no segundo certo. Motivo: sem origem HTTP o navegador não manda
  `Referer` e o YouTube recusa todo embed com erro 153. Testado com e sem
  `enablejsapi`, com e sem `loop`/`playlist`, e com os parâmetros originais do app —
  os quatro casos falham igual. Não é contornável pelo lado do app.
- Links "Abrir no YouTube" levam ao timestamp.

Sem build, sem framework, arquivo único. `window.storage` intocado, sem `localStorage`.
Aviso de fisioterapeuta e médico onde estava. Nenhum `cue` alterado.

## Tabela completa

### Aquecer

| Exercício | Vídeo | Duração | Trecho | Conf. |
|---|---|---|---|---|
| `mob-tornozelo` Mobilidade de tornozelo (joelho à parede | `3pprN9t_P1o` | 1:36 | 0:16–0:38 (22s) | alta |
| `mob-9090` Mobilidade de quadril 90/90 | `i8Y_v2AWqKc` | 6:54 | 6:10–6:25 (15s) | alta |
| `mob-gato` Gato-camelo | `BMdYxIDt5Ys` | 2:55 | 0:50–1:12 (22s) | media |
| `mob-toracica` Rotação torácica em quatro apoios | `1NCcTlR17rs` | 0:22 | — | — |
| `mob-pullapart` Abertura de ombro com elástico (band pul | `XN0J-hI17SU` | 6:52 | 0:33–0:49 (16s) | alta |
| `mob-rotext` Rotação externa de ombro com elástico | `PZPbasPoJQ8` | 8:03 | 3:03–3:16 (13s) | alta ⚑ |
| `at-abre` Deitado: bola entre os joelhos + miniban | `FsmU1SzfMsc` | 0:15 | — | — |
| `at-ponte` Ponte de glúteo com miniband nos joelhos | `q5U-p6vA3uo` | 1:37 | 0:33–1:08 (35s) | alta |
| `at-lateral` Caminhada lateral com miniband | `jpPCvWQgcSA` | 0:37 | — | — |
| `at-pant` Panturrilha em pé | `Xb-nuSxLVSY` | 2:51 | 0:33–0:52 (19s) | media |
| `at-bike` Bike ou esteira em ritmo leve | `UeK0QVyA4UM` | 0:11 | — | — |

### Força A

| Exercício | Vídeo | Duração | Trecho | Conf. |
|---|---|---|---|---|
| `a-agacha` Agachamento (barra, goblet ou hack) | `kOgcM3NCYA0` | 23:41 | 13:30–13:52 (22s) | alta |
| `a-puxada` Puxada alta ou barra assistida | `mPmfwbc_svw` | 0:40 | — | — |
| `a-prancha-lat` Prancha lateral | `RTxAFDK1OMw` | 1:53 | 1:05–1:31 (26s) | alta |
| `a-extensora` Cadeira extensora | `exLCpU7mT3g` | 1:25 | 0:34–0:52 (18s) | media |
| `a-supino` Supino reto ou flexão de braço | `vIGvt-vgrvY` | 2:15 | 0:33–0:59 (26s) | alta |
| `a-pelvica-uni` Elevação pélvica unilateral | `Sk-mBla2h8A` | 4:53 | 4:12–4:25 (13s) | media |
| `a-pant-uni` Panturrilha em pé unilateral | `Xb-nuSxLVSY` | 2:51 | 1:54–2:12 (18s) | alta ⚑ |
| `a-elev-lat` Elevação lateral de ombro | `jannLx4RxKo` | 1:58 | 0:19–0:35 (16s) | alta |
| `a-deadbug` Dead bug (ou abdominal à escolha) | `0loS0bRNqfs` | 1:18 | 0:53–1:16 (23s) | alta |
| `a-fin-1` Bola entre os joelhos + miniband, abre e | `FsmU1SzfMsc` | 0:15 | — | — |
| `a-fin-2` Flexão de braço | `UkDVBs9GEWo` | 7:43 | 1:55–2:10 (15s) | alta ⚑ |
| `a-fin-3` Agachamento peso do corpo | `CaTbpJH49i4` | 7:08 | 1:57–2:16 (19s) | alta |
| `a-fin-4` Equilíbrio em uma perna | `5OKF9DJcP6M` | 0:14 | — | — |

### Força B

| Exercício | Vídeo | Duração | Trecho | Conf. |
|---|---|---|---|---|
| `b-terra-uni` Levantamento terra / stiff unilateral | `5t3TzJ3oW7I` | 4:06 | 1:43–2:06 (23s) | alta |
| `b-desenvolv` Desenvolvimento de ombro ou supino incli | `IDOZyXHq7aI` | 1:22 | 0:13–0:42 (29s) | alta |
| `b-pallof` Pallof press (ou prancha frontal) | `LuePuoHEt6s` | 4:44 | 1:52–2:07 (15s) | media |
| `b-flexora` Cadeira flexora | `AFG0wxXmTH4` | 8:20 | 7:55–8:11 (16s) | alta |
| `b-remada-uni` Remada unilateral com halter (serrote) | `VoGNKTI5wG8` | 0:19 | — | — |
| `b-pelvica` Elevação pélvica bilateral com carga | `np35bxrQqRI` | 8:17 | 6:56–7:33 (37s) | alta |
| `b-pant-sent` Panturrilha sentada | `1x2QAgstSn4` | 3:13 | 2:26–2:35 (9s) | alta |
| `b-biceps` Bíceps em supersérie com tríceps | `LlJ6wf3NjeA` | 1:03 | 0:45–0:55 (10s) | media |
| `b-lombar` Extensão lombar no banco romano (ou bird | `W_kuBiLk5s0` | 0:44 | 0:24–0:42 (18s) | alta ★ |
| `b-fin-1` Step-up no banco | `9LBlAgBjDKM` | 5:49 | 2:50–3:12 (22s) | alta ⚑ |
| `b-fin-2` Afundo estático ou búlgaro | `a3-bQbTdA_0` | 2:38 | 1:21–1:40 (19s) | alta |
| `b-fin-3` Abdominal à escolha | `0loS0bRNqfs` | 1:18 | 1:00–1:17 (17s) | alta |
| `b-fin-4` Apoio em uma perna em superfície instáve | `5OKF9DJcP6M` | 0:14 | — | — |

### Força A'

| Exercício | Vídeo | Duração | Trecho | Conf. |
|---|---|---|---|---|
| `al-leg` Leg press 45° (no lugar do agachamento l | `waAxlYvtCcI` | 0:56 | 0:21–0:38 (17s) | media |
| `al-remada` Remada baixa (no lugar da puxada) | `s_c8SikiFAU` | 0:31 | — | — |
| `al-cruci` Crucifixo ou paralelas (no lugar do supi | `ZjIKUMtW37c` | 1:41 | 0:33–0:46 (13s) | alta |
| `al-extensora` Cadeira extensora (mantém) | `exLCpU7mT3g` | 1:25 | 0:34–0:52 (18s) | media ↩ |
| `al-pelvica` Elevação pélvica unilateral (mantém) | `Sk-mBla2h8A` | 4:53 | 3:58–4:10 (12s) | media |

### Circuito

| Exercício | Vídeo | Duração | Trecho | Conf. |
|---|---|---|---|---|
| `c-remo` Remo ou bike | `nfT-wE0SjLk` | 4:34 | 2:04–2:28 (24s) | alta |
| `c-kb` Kettlebell swing | `MB87gQFA_y0` | 4:45 | 2:08–2:32 (24s) | alta |
| `c-flexao` Flexão de braço | `UkDVBs9GEWo` | 7:43 | 6:41–7:02 (21s) | media |
| `c-afundo` Afundo caminhando | `9bxRdpUFW4c` | 1:22 | 0:09–0:30 (21s) | alta ⚑ |
| `c-prancha` Prancha | `RTxAFDK1OMw` | 1:53 | 0:39–0:47 (8s) | alta |

### Alternativos (link com timestamp)

| Alternativo | Vídeo | Duração | Abre em |
|---|---|---|---|
| Versão goblet (mais fácil de aprender) | `HE7JTnLmMxg` | 0:20 | — |
| Versão hack machine | `weyTbC-AjRg` | 5:14 | 4:18 |
| Barra fixa assistida no graviton | `w0UVe0JAEDQ` | 2:30 | 0:54 |
| Flexão de braço (push-up) | `UkDVBs9GEWo` | 7:43 | 1:55 |
| Versão stiff unilateral com halteres | `Pj9dbkj9Wsc` | 3:54 | 1:58 |
| Supino inclinado com barra | `oZjIQN0YMX0` | 1:01 | 0:10 |
| Prancha frontal | `RTxAFDK1OMw` | 1:53 | 0:39 |
| Tríceps na polia com corda | `7le1JRUUagM` | 0:43 | — |
| Bird-dog (alternativa sem máquina) | `GcIxfCvnLW8` | 0:34 | — |
| Ou agachamento búlgaro | `a3-bQbTdA_0` | 2:38 | 1:07 |
| Mergulho nas paralelas (dips) | `gTuw7u2PwlM` | 0:31 | — |

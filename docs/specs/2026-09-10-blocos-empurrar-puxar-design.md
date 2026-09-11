# Redesenho dos blocos de treino — empurrar / puxar com inferior em toda sessão

Data: 2026-09-10 · Status: aprovado

## O problema

As divisões de força misturam padrões opostos. `Força A` diz "quadríceps e empurrar"
mas abre com puxada alta. `Força B` diz "posterior e puxar" e traz desenvolvimento de
ombro. `Força A'` mistura crucifixo com remada baixa.

A causa raiz não é o exercício fora do lugar — é o bloco sem nome. Um "Bloco A" é só
um agrupamento de circuito. Nada nele denuncia que uma puxada não pertence ali.

E o defeito é pior do que a mistura. No padrão **A-B-A'**, "puxar" treina **1x por
semana** enquanto peito e ombro treinam 2x. O ACSM Position Stand 2026 (137 revisões
sistemáticas) crava todo grupo muscular 2x/semana como o principal driver de
hipertrofia e força. A puxada no dia errado era o sintoma; o A-B-A' era a doença.

## O modelo

**AB Alternado — Empurrar+Perna / Puxar+Perna.** Equivalente estrutural do
"Full Push / Full Pull" de Helms, com inferior em todas as sessões.

Quatro treinos distintos numa fila contínua:

```
EMPURRAR A  →  PUXAR A  →  EMPURRAR B  →  PUXAR B  →  (volta ao início)
```

Três sessões de força por semana (Seg/Qua/Sex). A fila **não reinicia no domingo**:
o treino de segunda é simplesmente o próximo da fila. O ciclo fecha em 4 semanas,
com cada treino aparecendo 3 vezes e cada padrão (empurrar/puxar) 6 vezes.

### Ciclo de 4 semanas — tabela estática impressa no app

|          | Seg (pesada) | Qua (moderada) | Sex (leve) |
|----------|--------------|----------------|------------|
| Semana 1 | EMPURRAR A   | PUXAR A        | EMPURRAR B |
| Semana 2 | PUXAR B      | EMPURRAR A     | PUXAR A    |
| Semana 3 | EMPURRAR B   | PUXAR B        | EMPURRAR A |
| Semana 4 | PUXAR A      | EMPURRAR B     | PUXAR B    |

Sem automação: o app imprime a tabela, o usuário olha. Não há estado salvo, não há
"marcar feito", não há índice derivado da data. É um documento, como o resto do app.

Terça e sábado continuam de corrida; quinta é descanso ativo; domingo é descanso total.

### A carga mora no dia da semana, não no treino

A pesquisa é dura neste ponto: só carga alta (≥80% 1RM) compra economia de corrida
— ES −0,266 (p=0,039). Trabalho submáximo (p=0,131) e isométrico (p=0,253) não
compram nada (Llanos-Lagos 2024). É preciso **exatamente uma sessão pesada por
semana**. Se "pesada" fosse propriedade do treino A, a fila entregaria pesada
0,75x/semana.

Então a regra é posicional, e vale para o exercício de perna que abre o Bloco 1:

- **1ª sessão da semana (seg):** pesada — topo da carga, base da faixa de repetições.
- **2ª sessão (qua):** moderada — meio da faixa.
- **3ª sessão (sex):** leve — base da carga, 2-3 repetições na reserva.

## Taxonomia dos blocos

Cada treino tem **3 blocos de 3 exercícios**, rodados em voltas. Cada bloco é uma
tríade **não-competitiva**:

> **slot 1 = PERNA · slot 2 = TORSO · slot 3 = CORE / PANTURRILHA / ISOLADO**

Isto não é estética. Blocos com dois exercícios do mesmo motor primário custam
**SMD −1,08 em volume-carga** (Zhang et al., *Sports Med* 2025). Blocos não
competitivos economizam 37-45% do tempo sem custo de adaptação. O efeito líquido é
que cada músculo recebe 2,5-4 min de descanso real — a faixa que preserva força e
hipertrofia — dentro de uma sessão que no relógio parece de descanso curto.

**A pureza de tema é garantida pelo DIA, não pelo bloco.** Num dia de EMPURRAR não
existe um único exercício de costas, bíceps ou antebraço. É isso que resolve o
problema original, e resolve por completo.

O nome de cada bloco lista o que tem dentro (`Agachamento · Peito · Core`), de modo
que um exercício fora do lugar continua visível a olho nu.

### Proibições de bloco (auditar todos os blocos contra isto)

- Nunca agachamento + cadeira extensora no mesmo bloco.
- Nunca supino + paralelas/dips no mesmo bloco.
- Nunca stiff + cadeira flexora no mesmo bloco.
- Nunca core pesado imediatamente antes de agachamento ou terra.

### Descanso

- Entre exercícios dentro do bloco: 45-60 s (o suficiente para trocar de estação).
- Entre voltas: 90-120 s no Bloco 1; 60-90 s no Bloco 2; 45-60 s no Bloco 3.

Duração-alvo: 40-55 min de trabalho + 8-10 min de aquecimento.
Proximidade da falha: RPE 7-8 no Bloco 1, 8-9 nos Blocos 2 e 3. Falha total nunca.
2-3 RIR obrigatórios em qualquer sessão a ≤24 h de uma corrida.

## Princípios que o desenho respeita

| | Princípio | Fonte |
|---|---|---|
| P1 | Nenhum padrão de movimento pode cair para 1x/semana de forma sistemática | ACSM Position Stand 2026; Helms & Morgan |
| P2 | Perna em toda sessão é **distribuição** de volume, não ganho extra | Ralston 2018 (ES 0,03, p=0,78); Grgic 2018 (MMII p=0,070) |
| P3 | Perna 12-18 séries/semana (4-6 por sessão); peito e costas 10-14/semana | Baz-Valle 2022; Remmert & Pelland 2026 |
| P4 | Exatamente uma sessão pesada por semana | Llanos-Lagos 2024; Eihara 2022 |
| P5 | Cada sessão leva joelho-dominante **e** quadril-dominante; o que alterna é a ênfase | Gentil, Fisher & Steele, *Sports Med* 2017 |
| P6 | Um unilateral principal carregado por sessão, sempre ao lado de um bilateral | Oliveira et al., *OJSM* 2022 (só unilateral atrasa força absoluta) |
| P7 | Cadeira extensora unilateral é obrigatória, com amplitude declarada | Pamboris 2024; Wilk et al., IJSPT; Beynnon/Fleming |
| P8 | Panturrilha carregada no máximo 2x/semana, ≥48 h entre elas | Kjaer 2009; Kinoshita 2023 |
| P9 | Corrida de qualidade só ≥48 h após perna pesada; mesmo dia = força primeiro, ≥3 h | Schumann 2022; Eddens 2018; Doma 2017 |
| P10 | O freio-mestre é o teste do derrame, não uma regra a priori de frequência | Kikuchi et al., *KSSTA* 2023 |

## Os quatro treinos

Legenda: **[OK]** já existe · **[MIGRA]** existe, muda de divisão ·
**[PROMOVER]** vídeo já auditado, vira exercício próprio (custo zero) ·
**[NOVO]** precisa de auditoria de vídeo.

### EMPURRAR A — `empurrarA`

**Bloco 1 — Agachamento · Peito · Core** · 4 voltas, 90-120 s

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `ea-agacha` | Agachamento (barra, goblet ou hack) | 4×5-8 | [OK] `a-agacha` |
| `ea-supino` | Supino reto ou flexão de braço | 4×6-10 | [OK] `a-supino` |
| `ea-prancha-lat` | Prancha lateral | 3×25-40 s cada | [OK] `a-prancha-lat` |

**Bloco 2 — Extensora · Ombro · Panturrilha** · 3 voltas, 60-90 s

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `ea-extensora` | Cadeira extensora **unilateral** | 3×10-15 cada | [OK] `a-extensora`, prescrição muda |
| `ea-desenvolv` | Desenvolvimento de ombro | 3×8-12 | **[MIGRA]** `b-desenvolv` |
| `ea-pant-uni` | Panturrilha em pé unilateral, excêntrica 3 s | 3×8-15 cada | [OK] `a-pant-uni` |

**Bloco 3 — Pélvica · Deltoide · Tríceps** · 3 voltas, 45-60 s

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `ea-pelvica-uni` | Elevação pélvica unilateral | 3×10-12 cada | [OK] `a-pelvica-uni` |
| `ea-elev-lat` | Elevação lateral de ombro | 3×12-15 | [OK] `a-elev-lat` |
| `ea-triceps` | Tríceps na polia **acima da cabeça** | 3×10-12 | **[NOVO]**, alternativo = corda [PROMOVER] |

### PUXAR A — `puxarA`

**Bloco 1 — Stiff · Puxada · Core** · 4 voltas, 90-120 s

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `pa-stiff` | Levantamento terra / stiff unilateral | 4×8-10 cada | [OK] `b-terra-uni` |
| `pa-puxada` | Puxada alta ou barra assistida | 4×8-12 | **[MIGRA]** `a-puxada` |
| `pa-pallof` | Pallof press | 3×25-35 s cada | [OK] `b-pallof` |

**Bloco 2 — Flexora · Remada · Deltoide posterior** · 3 voltas, 60-90 s

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `pa-flexora` | Cadeira flexora | 3×10-15 | [OK] `b-flexora` |
| `pa-remada` | Remada unilateral com halter (serrote) | 3×10-12 cada | [OK] `b-remada-uni` |
| `pa-deltpost` | Crucifixo inverso na máquina (ou face pull) | 3×12-15 | **[NOVO]** — essencial |

**Bloco 3 — Búlgaro · Bíceps · Lombar** · 3 voltas, 45-60 s

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `pa-bulgaro` | Agachamento búlgaro | 3×8-12 cada | **[PROMOVER]** `b-fin-2` |
| `pa-biceps` | Rosca de bíceps | 3×10-12 | [OK] `b-biceps` desmembrado |
| `pa-lombar` | Extensão lombar no banco romano (ou bird-dog) | 3×12 | [OK] `b-lombar` |

### EMPURRAR B — `empurrarB`

**Bloco 1 — Leg press · Crucifixo · Core** · 4 voltas, 90-120 s

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `eb-leg` | Leg press 45° | 4×10-15 | [OK] `al-leg` |
| `eb-cruci` | Crucifixo | 3-4×10-12 | [OK] `al-cruci` |
| `eb-deadbug` | Dead bug | 3×10-12 | **[MIGRA]** `a-deadbug` |

**Bloco 2 — Extensora · Inclinado · Sóleo** · 3 voltas, 60-90 s

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `eb-extensora` | Cadeira extensora unilateral | 3×10-15 cada | [OK] `al-extensora` |
| `eb-inclinado` | Supino inclinado com barra | 3×8-12 | **[PROMOVER]** de `b-desenvolv` |
| `eb-pant-sent` | Panturrilha sentada (sóleo) | 3×12-20 | **[MIGRA]** `b-pant-sent` |

**Bloco 3 — Pélvica · Deltoide · Paralelas** · 3 voltas, 45-60 s

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `eb-pelvica` | Elevação pélvica unilateral | 3×12 cada | [OK] `al-pelvica` |
| `eb-elev-lat` | Elevação lateral de ombro | 3×12-15 | [OK] reuso do vídeo de `a-elev-lat` |
| `eb-dips` | Mergulho nas paralelas | 3×8-12 | **[PROMOVER]** de `al-cruci` |

### PUXAR B — `puxarB`

**Bloco 1 — Pélvica bilateral · Remada baixa · Core** · 4 voltas, 90-120 s

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `pb-pelvica` | Elevação pélvica bilateral com carga | 3×10-12 | [OK] `b-pelvica` |
| `pb-remada` | Remada baixa | 4×8-12 | **[MIGRA]** `al-remada` |
| `pb-prancha` | Prancha frontal | 3×30-45 s | **[PROMOVER]** de `b-pallof` |

**Bloco 2 — Flexora · Barra assistida · Deltoide posterior** · 3 voltas, 60-90 s

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `pb-flexora` | Cadeira flexora | 3×12-15 | [OK] reuso do vídeo de `b-flexora` |
| `pb-barra` | Barra fixa assistida no graviton | 3×8-12 | **[PROMOVER]** de `a-puxada` |
| `pb-deltpost` | Crucifixo inverso na máquina | 3×12-15 | **[NOVO]** — mesmo vídeo de `pa-deltpost` |

**Bloco 3 — Step-up · Bíceps · Abdutor** · 3 voltas, 45-60 s

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `pb-stepup` | Step-up no banco | 3×12 cada | **[PROMOVER]** `b-fin-1` |
| `pb-biceps` | Rosca de bíceps | 3×10-12 | [OK] reuso do vídeo de `b-biceps` |
| `pb-abdutor` | Abdução de quadril com carga | 3×12-15 | **[NOVO]** — desejável |

### Aquecer — `aquecer`

Sem mudança estrutural. Os 11 exercícios atuais permanecem. Entra um 12º:

| id | Exercício | Prescrição | Origem |
|---|---|---|---|
| `at-equilibrio` | Equilíbrio em uma perna | 30 s cada | **[PROMOVER]** `a-fin-4`, alternativo = `b-fin-4` (superfície instável) |

O bloco de ativação de glúteo médio com miniband fica aqui e **só aqui**: é priming
(30-50% MVIC), não é volume.

### Circuito — `circuito`

Os 5 exercícios permanecem, mas o texto muda: deixa de ser sessão de força e vira
opção de condicionamento em semana de deload. Trabalho submáximo e isométrico não
melhoram economia de corrida e não substituem carga alta.

## O que sai

| Sai | Por quê |
|---|---|
| `a-puxada` do dia de empurrar | Migra para `puxarA`. Quebrava a premissa central. |
| `b-desenvolv` do dia de puxar | Migra para `empurrarA`. Mesmo motivo. |
| `al-remada` do Força A' | Migra para `puxarB`. |
| Superssérie bíceps+tríceps | Desmembrada. Tríceps vai para os dias de empurrar. |
| O Força A' como "sessão de substituições" | Conceito dissolvido. Vira `empurrarB`, sessão completa de 9 slots. |
| Panturrilha em toda sessão | Vira 1,5x/semana, só nos dias de empurrar, nunca <48 h. |
| Cadeira extensora bilateral por padrão | Vira unilateral. Máquina bilateral mascara assimetria. |
| `a-fin-1` (miniband no finalizador) | Duplicata de `at-abre`. Miniband é aquecimento. |
| `a-fin-2` (flexão no finalizador) | Já existe como alternativo de `ea-supino`. |
| `a-fin-3` (agachamento peso do corpo) | Redundante com o Bloco 1, submáximo, sem efeito em economia de corrida. |
| `b-fin-3` (abdominal à escolha) | Absorvido pelos slots de core dos blocos. |
| O padrão A-B-A' | Substituído pela fila de 4 treinos. Entregava "puxar" 1x/semana. |

## Lacunas de vídeo

| # | O que falta | Por quê | Prioridade |
|---|---|---|---|
| 1 | Crucifixo inverso na máquina (ou face pull na polia) | Reverse pec deck ~90% MVIC no deltoide posterior vs. ~58% na puxada e ~54% na remada, p<0,05 (Botton 2013). Sem ele o dia de puxar é dorsal + bíceps. Aparece em 2 dos 4 treinos. | **ESSENCIAL** |
| 2 | Tríceps na polia acima da cabeça | 19,9% vs 13,5% de hipertrofia, ~1,4x, p<0,001 (Maeo 2023). Interino: o vídeo da corda, já auditado. | DESEJÁVEL |
| 3 | Abdução de quadril com carga | Único item com base em lesão de corredor sem cobertura com carga. Evidência conflitante — por isso 1x/semana, não essencial. `at-lateral` não serve: 30-50% MVIC. | DESEJÁVEL |
| 4 | Pliometria leve bilateral | **Fora por ora.** O guia exige liberação do fisio, e enxerto e tempo pós-op são desconhecidos. Entra quando essas respostas existirem. | BLOQUEADA |

Antebraço, encolhimento e nórdico de isquiotibiais foram avaliados e **descartados**:
não há ECR mostrando ganho acima do que os compostos já dão, e o efeito preventivo
do nórdico não se replicou em reanálise (Impellizzeri 2021).

## Ressalvas que precisam aparecer no app

Três cards novos ou reescritos no Guia, e um aviso no topo das divisões de força.

**JOELHO OPERADO.** A cadeira extensora não está proibida — é o exercício que fecha
o déficit de reto femoral que agachamento e leg press não fecham. É obrigatória,
unilateral. Amplitude: menos de 9 meses de cirurgia → 90° a 45°, sem carga alta até
extensão completa; mais de 9 meses → amplitude completa, mas a faixa final (45°→0°)
é faixa de progressão, 10-15 repetições com 2-3 na reserva, nunca 1RM, nunca AMRAP,
nunca falha. Aumente carga **ou** amplitude terminal, nunca as duas na mesma semana.
O LCM não restringe a extensora (movimento puramente sagital) — a ressalva do LCM
vale para valgo dinâmico no afundo e no búlgaro.

**SINAIS DE ALERTA.** Inchaço na manhã seguinte (qualquer onda ao deslizar a mão) →
corte 30-50% do volume de perna na próxima sessão. Este é o freio-mestre e vale mais
que qualquer regra de frequência deste plano. Dor acima de 3/10 ou que não normaliza
em 24 h. Dor anterior que piora no dia seguinte → reduza amplitude terminal e
profundidade, não abandone o exercício. Perda de extensão completa comparada ao outro
lado. Dor no Aquiles ou no tendão patelar de manhã → 72 h antes de recarregar.
Bloqueio, falseio ou dor na linha articular → pare e reavalie clinicamente.
Checagem mensal: panturrilha unilateral, amplitude completa, 2 s por repetição —
meta de 20+ repetições sem diferença entre os lados.

**CORRIDA.** (1) Nunca corrida de qualidade nas 48 h seguintes à sessão pesada;
zona 2 no dia seguinte é aceitável. (2) Mesmo dia: força primeiro, ≥3 h de intervalo
(idealmente 6) — colar as duas com menos de 20 min custa força explosiva, e fazer
força antes rende ~7% a mais de força dinâmica de perna. Exceção: em dia de tiro, a
corrida vem primeiro. (3) Sessões a ≤24 h de uma corrida: 2-3 RIR, nunca falha.
Com perna em todas as sessões, nenhuma corrida acontece com as pernas frescas — esse
é o custo real, e é gerenciável porque só uma sessão por semana é pesada.
Deload a cada 4-6 semanas: 40-50% menos volume de perna, mesma carga.
Transição: de 2 para 3-4 sessões de perna por semana em 4 a 6 semanas, subindo menos
de 10% de carga total por semana.

**O QUE ESTE PLANO NÃO AFIRMA.** Não afirma que separar peito e costas é *melhor* —
ninguém testou essa pergunta. O que a evidência permite dizer é que **não é pior**.
Não afirma que treinar perna 3-4x/semana rende mais músculo que 2x: com o mesmo
volume semanal, não rende. O ganho é de distribuição e de exposição frequente ao
joelho operado. Não existe nenhum estudo testando frequência de perna nessa faixa em
pessoas pós-reconstrução de LCA que também correm — este plano é extrapolação bem
fundamentada, e é por isso que o teste do derrame vale mais que qualquer regra escrita
aqui.

**Perguntas em aberto que mudam a prescrição** (o app deve exibi-las como pendência):
tipo de enxerto, meses pós-operatório, e se houve reparo meniscal concomitante.
Enquanto não houver resposta, o app mostra a configuração conservadora — extensora
90°→45°, agachamento até 90° — e diz por quê.

## Impacto no código

| Arquivo | Mudança |
|---|---|
| `app/src/data/plano.ts` | Divisões de força reescritas: 3 viram 4, blocos ganham tema, ids renomeados |
| `app/src/data/tipos.ts` | `ChaveDivisao`: as três chaves de força dão lugar a `empurrarA`, `puxarA`, `empurrarB`, `puxarB` |
| `app/src/lib/rota.ts` | Lista de chaves válidas |
| `app/src/data/semana.ts` | `SEMANA_4`/`SEMANA_3` dão lugar ao ciclo de 4 semanas + regra de carga posicional |
| `app/src/data/metadados.ts` | Metadados dos ids novos; remoção dos ids que saem |
| `app/src/data/duracoes.ts` | Duração dos 3 vídeos novos |
| `app/src/data/editorial.ts` | Cards do Guia reescritos (joelho, sinais de alerta, corrida, o que não afirma) |
| `app/src/components/TabelaSemana.tsx` | Renderiza o ciclo de 4 semanas em vez do toggle 3/4 dias |
| `docs/dados/*.json` | Recortes dos vídeos novos, veredictos da auditoria |

**Testes que dependem de contagens** e precisam ser recalculados a partir dos dados,
nunca chutados: `index.test.ts` (47 exercícios, 37 recortes, 10 sem recorte, 13
unilaterais, 711 s úteis, 8385 s brutos, divisões 01-07), `App.test.tsx`,
`Busca.test.tsx`, `IndiceDivisoes.test.tsx`, `ListaExercicios.test.tsx`,
`rota.test.ts`.

Números esperados após a mudança: **8 divisões** (01-08), **53 exercícios**,
**42 vídeos únicos** (39 atuais + 3 novos). Recortes, unilaterais e segundos úteis
são derivados — a implementação recalcula e atualiza as asserções.

## Decisões registradas

| Decisão | Escolha | Alternativas descartadas |
|---|---|---|
| Escopo de vídeo | Pode adicionar o que for preciso | Só rearranjar o existente; adicionar só o essencial |
| Interior do bloco | Tríade não-competitiva perna+torso+core | Bloco temático puro em séries retas; híbrido com encaixe |
| Simetria empurrar/puxar | Rodízio contínuo de 4 treinos em 3 sessões/semana | 4 sessões/semana; 3 dias fixos com desequilíbrio |
| Ênfase do inferior | Acoplada ao superior | Inferior completo toda sessão; ênfase + dose mínima do outro |
| Saber qual treino é hoje | Sem automação — tabela estática do ciclo de 4 semanas | Calendário derivado da data; fila com posição salva |
| Enxerto | Desconhecido → configuração conservadora + pendência no app | — |

## Referências

Dossiê completo de pesquisa — estudos, diretrizes e 36 vídeos do YouTube verificados
— em [`docs/pesquisa/2026-09-10-referencias-split.md`](../pesquisa/2026-09-10-referencias-split.md).

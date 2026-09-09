import type { Divisao } from './tipos'

export const PLANO: Divisao[] = [
  {
    "chave": "aquecer",
    "rotulo": "Aquecer",
    "titulo": "Aquecimento — 8 a 10 minutos, antes de todo treino",
    "lede": "Três partes: soltar as articulações, acordar glúteo e core, subir a frequência cardíaca. Não pule a parte 2: é ela que protege o joelho operado.",
    "blocos": [
      {
        "nome": "Mobilidade",
        "sub": "1x15 cada movimento (2x15 se estiver travado)",
        "exercicios": [
          {
            "id": "mob-tornozelo",
            "nome": "Mobilidade de tornozelo (joelho à parede)",
            "prescricao": "15 cada lado",
            "video": "3pprN9t_P1o",
            "recorte": {
              "inicio": 16,
              "fim": 38
            },
            "cues": [
              "Pé a ~10 cm da parede, leve o joelho para tocar a parede sem tirar o calcanhar do chão.",
              "É o exercício mais importante da lista para agachar fundo e correr sem sobrecarregar o joelho.",
              "Se um lado vai bem menos longe que o outro, insista mais nesse lado."
            ],
            "unilateral": false,
            "busca": "mobilidade de tornozelo joelho na parede dorsiflexão",
            "alternativos": []
          },
          {
            "id": "mob-9090",
            "nome": "Mobilidade de quadril 90/90",
            "prescricao": "10 rotações cada lado",
            "video": "i8Y_v2AWqKc",
            "recorte": {
              "inicio": 370,
              "fim": 385
            },
            "cues": [
              "Sentado no chão, uma perna à frente e outra ao lado, ambas em 90°.",
              "Gire o quadril alternando os lados mantendo o tronco alto.",
              "Vá até onde não dói. Amplitude vem com semanas, não com força."
            ],
            "unilateral": false,
            "busca": "exercício 90/90 mobilidade de quadril",
            "alternativos": []
          },
          {
            "id": "mob-gato",
            "nome": "Gato-camelo",
            "prescricao": "15 repetições",
            "video": "BMdYxIDt5Ys",
            "recorte": {
              "inicio": 50,
              "fim": 72
            },
            "cues": [
              "Em quatro apoios, alterne arredondar e estender a coluna acompanhando a respiração.",
              "Movimento lento, vértebra por vértebra. Sem impulso."
            ],
            "unilateral": false,
            "busca": "gato camelo mobilidade da coluna como fazer",
            "alternativos": []
          },
          {
            "id": "mob-toracica",
            "nome": "Rotação torácica em quatro apoios",
            "prescricao": "10 cada lado",
            "video": "1NCcTlR17rs",
            "cues": [
              "Mão na nuca, gire o tronco abrindo o cotovelo para o teto, olhando para a mão.",
              "O quadril fica parado. A rotação vem da parte de cima das costas."
            ],
            "unilateral": false,
            "busca": "mobilidade torácica rotação quatro apoios",
            "alternativos": []
          },
          {
            "id": "mob-pullapart",
            "nome": "Abertura de ombro com elástico (band pull-apart)",
            "prescricao": "15 repetições",
            "video": "XN0J-hI17SU",
            "recorte": {
              "inicio": 33,
              "fim": 49
            },
            "cues": [
              "Elástico à frente na altura do peito, braços quase estendidos, abra até tocar o peito.",
              "Puxe pelas escápulas, não pelas mãos. Ombros longe das orelhas."
            ],
            "unilateral": false,
            "busca": "band pull apart elástico execução",
            "alternativos": []
          },
          {
            "id": "mob-rotext",
            "nome": "Rotação externa de ombro com elástico",
            "prescricao": "15 cada braço",
            "video": "PZPbasPoJQ8",
            "recorte": {
              "inicio": 183,
              "fim": 196
            },
            "cues": [
              "Cotovelo colado na costela, dobrado em 90°, gire o antebraço para fora contra o elástico.",
              "Elástico leve. Isso é estabilidade do manguito, não é treino de força."
            ],
            "unilateral": false,
            "busca": "rotação externa de ombro com elástico manguito rotador",
            "alternativos": []
          }
        ]
      },
      {
        "nome": "Ativação com miniband e bola",
        "sub": "o bloco que você já fazia",
        "exercicios": [
          {
            "id": "at-abre",
            "nome": "Deitado: bola entre os joelhos + miniband nos pés, abre e fecha",
            "prescricao": "2x20",
            "video": "FsmU1SzfMsc",
            "cues": [
              "Deitado de costas, joelhos dobrados, bola apertada entre os joelhos e miniband nos pés.",
              "Abra e feche os pés contra o elástico sem soltar a bola.",
              "Sente o glúteo trabalhando na lateral do quadril, não na lombar."
            ],
            "unilateral": false,
            "busca": "abdução de quadril deitado com mini band joelhos flexionados",
            "alternativos": []
          },
          {
            "id": "at-ponte",
            "nome": "Ponte de glúteo com miniband nos joelhos",
            "prescricao": "2x15",
            "video": "q5U-p6vA3uo",
            "recorte": {
              "inicio": 33,
              "fim": 68
            },
            "cues": [
              "Suba o quadril até alinhar ombro-quadril-joelho, empurrando os joelhos levemente para fora.",
              "Termine apertando o glúteo no topo. Se sentir a lombar, subiu demais."
            ],
            "unilateral": false,
            "busca": "ponte de glúteo com mini band execução correta",
            "alternativos": []
          },
          {
            "id": "at-lateral",
            "nome": "Caminhada lateral com miniband",
            "prescricao": "2x10 passos cada lado",
            "video": "jpPCvWQgcSA",
            "cues": [
              "Joelhos semiflexionados, passos curtos e controlados, sem juntar os pés.",
              "Não deixe o joelho cair para dentro em nenhum passo."
            ],
            "unilateral": false,
            "busca": "caminhada lateral com mini band glúteo médio",
            "alternativos": []
          },
          {
            "id": "at-pant",
            "nome": "Panturrilha em pé",
            "prescricao": "2x15",
            "video": "Xb-nuSxLVSY",
            "recorte": {
              "inicio": 33,
              "fim": 52
            },
            "cues": [
              "Suba devagar até a ponta dos pés, desça mais devagar ainda, amplitude total.",
              "A panturrilha é o primeiro amortecedor da corrida. Trate como exercício, não como enfeite."
            ],
            "unilateral": false,
            "busca": "panturrilha em pé execução correta",
            "alternativos": []
          }
        ]
      },
      {
        "nome": "Cardio leve",
        "sub": "5 minutos",
        "exercicios": [
          {
            "id": "at-bike",
            "nome": "Bike ou esteira em ritmo leve",
            "prescricao": "5 min",
            "video": "UeK0QVyA4UM",
            "cues": [
              "Ritmo de conversa. Objetivo é aquecer, não cansar.",
              "Se o joelho estiver rígido no dia, bike é melhor escolha que esteira."
            ],
            "unilateral": false,
            "busca": "aquecimento bike ergométrica ritmo leve",
            "alternativos": []
          }
        ]
      }
    ]
  },
  {
    "chave": "forcaA",
    "rotulo": "Força A",
    "titulo": "Força A — quadríceps e empurrar",
    "lede": "Tri-set: faça A1, A2 e A3 em sequência, descanse 90 segundos, repita. 3 a 4 voltas por bloco.",
    "blocos": [
      {
        "nome": "Bloco A",
        "sub": "3 a 4 voltas · 90s entre voltas",
        "exercicios": [
          {
            "id": "a-agacha",
            "nome": "Agachamento (barra, goblet ou hack)",
            "prescricao": "4x6-10",
            "video": "kOgcM3NCYA0",
            "recorte": {
              "inicio": 810,
              "fim": 832
            },
            "cues": [
              "Desça abaixo da linha do quadril, dentro do que o joelho aceita sem dor.",
              "Joelho na direção da ponta do pé o tempo todo. Nada de joelho caindo para dentro.",
              "Carga progressiva: só sobe quando fecha todas as séries no topo da faixa."
            ],
            "unilateral": false,
            "busca": "agachamento livre com barra execução correta",
            "alternativos": [
              {
                "nome": "Versão goblet (mais fácil de aprender)",
                "video": "HE7JTnLmMxg"
              },
              {
                "nome": "Versão hack machine",
                "video": "weyTbC-AjRg",
                "inicio": 258
              }
            ]
          },
          {
            "id": "a-puxada",
            "nome": "Puxada alta ou barra assistida",
            "prescricao": "4x8-12",
            "video": "mPmfwbc_svw",
            "cues": [
              "Puxe levando os cotovelos em direção às costelas, escápulas para baixo.",
              "Sem jogar o tronco para trás para vencer a carga."
            ],
            "unilateral": false,
            "busca": "puxada alta frente pronada execução correta",
            "alternativos": [
              {
                "nome": "Barra fixa assistida no graviton",
                "video": "w0UVe0JAEDQ",
                "inicio": 54
              }
            ]
          },
          {
            "id": "a-prancha-lat",
            "nome": "Prancha lateral",
            "prescricao": "3x20-40s cada lado",
            "video": "RTxAFDK1OMw",
            "recorte": {
              "inicio": 65,
              "fim": 91
            },
            "cues": [
              "Cotovelo alinhado com o ombro, corpo em linha reta, quadril alto.",
              "Pare quando a forma quebrar, não quando o tempo acabar."
            ],
            "unilateral": false,
            "busca": "prancha lateral execução correta",
            "alternativos": []
          }
        ]
      },
      {
        "nome": "Bloco B",
        "sub": "3 a 4 voltas · 90s entre voltas",
        "exercicios": [
          {
            "id": "a-extensora",
            "nome": "Cadeira extensora",
            "prescricao": "3x12-15 bilateral + 2x12 cada perna",
            "video": "exLCpU7mT3g",
            "recorte": {
              "inicio": 34,
              "fim": 52
            },
            "cues": [
              "Encaixe o joelho no eixo da máquina e mantenha o quadril colado no banco.",
              "Se o enxerto foi do tendão quadricipital ou patelar: progrida devagar nos últimos 30° de extensão.",
              "A parte unilateral não é opcional. É ela que mostra e corrige a diferença entre as pernas."
            ],
            "unilateral": true,
            "busca": "cadeira extensora execução correta",
            "alternativos": []
          },
          {
            "id": "a-supino",
            "nome": "Supino reto ou flexão de braço",
            "prescricao": "3-4x8-12",
            "video": "vIGvt-vgrvY",
            "recorte": {
              "inicio": 33,
              "fim": 59
            },
            "cues": [
              "Escápulas encaixadas no banco, pés firmes no chão, barra descendo na linha do peito.",
              "Cotovelos em ~45° do tronco, não abertos a 90°."
            ],
            "unilateral": false,
            "busca": "supino reto com barra execução correta",
            "alternativos": [
              {
                "nome": "Flexão de braço (push-up)",
                "video": "UkDVBs9GEWo",
                "inicio": 115
              }
            ]
          },
          {
            "id": "a-pelvica-uni",
            "nome": "Elevação pélvica unilateral",
            "prescricao": "3x12 cada",
            "video": "Sk-mBla2h8A",
            "recorte": {
              "inicio": 252,
              "fim": 265
            },
            "cues": [
              "Peso do corpo primeiro. Calcanhar sob o joelho, empurre pelo calcanhar.",
              "Quadril sobe nivelado: não deixe um lado ficar mais baixo que o outro."
            ],
            "unilateral": true,
            "busca": "elevação pélvica unilateral 3 dicas",
            "alternativos": []
          }
        ]
      },
      {
        "nome": "Bloco C",
        "sub": "3 voltas",
        "exercicios": [
          {
            "id": "a-pant-uni",
            "nome": "Panturrilha em pé unilateral",
            "prescricao": "3x12-15 cada",
            "video": "Xb-nuSxLVSY",
            "recorte": {
              "inicio": 114,
              "fim": 132
            },
            "cues": [
              "Amplitude total: desça o calcanhar abaixo do degrau e suba até o máximo.",
              "Compare os lados. A perna operada quase sempre começa mais fraca aqui."
            ],
            "unilateral": true,
            "busca": "panturrilha unilateral em pé execução",
            "alternativos": []
          },
          {
            "id": "a-elev-lat",
            "nome": "Elevação lateral de ombro",
            "prescricao": "3x12-15",
            "video": "jannLx4RxKo",
            "recorte": {
              "inicio": 19,
              "fim": 35
            },
            "cues": [
              "Suba até a linha dos ombros, sem impulso de tronco.",
              "Carga leve funciona melhor que carga pesada aqui."
            ],
            "unilateral": false,
            "busca": "elevação lateral com halteres técnica correta",
            "alternativos": []
          },
          {
            "id": "a-deadbug",
            "nome": "Dead bug (ou abdominal à escolha)",
            "prescricao": "3x10-12",
            "video": "0loS0bRNqfs",
            "recorte": {
              "inicio": 53,
              "fim": 76
            },
            "cues": [
              "Lombar colada no chão do começo ao fim. Se descolou, reduza a amplitude.",
              "Estenda braço e perna opostos devagar, expirando."
            ],
            "unilateral": false,
            "busca": "dead bug exercício core execução correta",
            "alternativos": []
          }
        ]
      },
      {
        "nome": "Finalizador",
        "sub": "2 a 3 voltas — o combo que você gosta",
        "exercicios": [
          {
            "id": "a-fin-1",
            "nome": "Bola entre os joelhos + miniband, abre e fecha",
            "prescricao": "20",
            "video": "FsmU1SzfMsc",
            "cues": [
              "Mesma execução do aquecimento, agora com a perna já cansada."
            ],
            "unilateral": false,
            "busca": "abdução de quadril deitado mini band",
            "alternativos": []
          },
          {
            "id": "a-fin-2",
            "nome": "Flexão de braço",
            "prescricao": "10",
            "video": "UkDVBs9GEWo",
            "recorte": {
              "inicio": 115,
              "fim": 130
            },
            "cues": [
              "Corpo em prancha, desça até o peito quase tocar o chão.",
              "Joelhos apoiados se a forma quebrar."
            ],
            "unilateral": false,
            "busca": "flexão de braço push up execução correta",
            "alternativos": []
          },
          {
            "id": "a-fin-3",
            "nome": "Agachamento peso do corpo",
            "prescricao": "20",
            "video": "CaTbpJH49i4",
            "recorte": {
              "inicio": 117,
              "fim": 136
            },
            "cues": [
              "Ritmo contínuo e controlado, sem travar o joelho no topo."
            ],
            "unilateral": false,
            "busca": "agachamento livre peso do corpo passo a passo iniciantes",
            "alternativos": []
          },
          {
            "id": "a-fin-4",
            "nome": "Equilíbrio em uma perna",
            "prescricao": "30s cada",
            "video": "5OKF9DJcP6M",
            "cues": [
              "Olhos abertos primeiro. Quando ficar fácil: olhos fechados, depois em almofada.",
              "Fique perto de uma parede nas primeiras vezes."
            ],
            "unilateral": true,
            "busca": "equilíbrio unipodal propriocepção exercício",
            "alternativos": []
          }
        ]
      }
    ]
  },
  {
    "chave": "forcaB",
    "rotulo": "Força B",
    "titulo": "Força B — posterior, glúteo e puxar",
    "lede": "Mesma lógica de tri-set: A1, A2, A3 em sequência, 90 segundos de descanso, 3 a 4 voltas.",
    "blocos": [
      {
        "nome": "Bloco A",
        "sub": "3 a 4 voltas · 90s entre voltas",
        "exercicios": [
          {
            "id": "b-terra-uni",
            "nome": "Levantamento terra / stiff unilateral",
            "prescricao": "4x8-10 cada perna",
            "video": "5t3TzJ3oW7I",
            "recorte": {
              "inicio": 103,
              "fim": 126
            },
            "cues": [
              "Empurre o quadril para trás, tronco desce como uma gangorra, perna livre estendendo atrás.",
              "Coluna neutra sempre. Suba contraindo o glúteo da perna de apoio.",
              "Se o enxerto foi de isquiotibiais, este é o exercício mais importante do seu plano."
            ],
            "unilateral": true,
            "busca": "levantamento terra unilateral SDL execução correta",
            "alternativos": [
              {
                "nome": "Versão stiff unilateral com halteres",
                "video": "Pj9dbkj9Wsc",
                "inicio": 118
              }
            ]
          },
          {
            "id": "b-desenvolv",
            "nome": "Desenvolvimento de ombro ou supino inclinado",
            "prescricao": "3-4x8-12",
            "video": "IDOZyXHq7aI",
            "recorte": {
              "inicio": 13,
              "fim": 42
            },
            "cues": [
              "Não trave os cotovelos no topo e não deixe os halteres baterem.",
              "Costelas para baixo: sem arquear a lombar para empurrar."
            ],
            "unilateral": false,
            "busca": "desenvolvimento com halteres sentado execução correta",
            "alternativos": [
              {
                "nome": "Supino inclinado com barra",
                "video": "oZjIQN0YMX0",
                "inicio": 10
              }
            ]
          },
          {
            "id": "b-pallof",
            "nome": "Pallof press (ou prancha frontal)",
            "prescricao": "3x30s",
            "video": "LuePuoHEt6s",
            "recorte": {
              "inicio": 112,
              "fim": 127
            },
            "cues": [
              "De lado para a polia, empurre as mãos à frente resistindo à rotação.",
              "O tronco não pode girar. É esse \"não girar\" que é o exercício."
            ],
            "unilateral": false,
            "busca": "pallof press anti rotação execução",
            "alternativos": [
              {
                "nome": "Prancha frontal",
                "video": "RTxAFDK1OMw",
                "inicio": 39
              }
            ]
          }
        ]
      },
      {
        "nome": "Bloco B",
        "sub": "3 a 4 voltas · 90s entre voltas",
        "exercicios": [
          {
            "id": "b-flexora",
            "nome": "Cadeira flexora",
            "prescricao": "3x12 bilateral + 2x10 cada perna",
            "video": "AFG0wxXmTH4",
            "recorte": {
              "inicio": 475,
              "fim": 491
            },
            "cues": [
              "Regule o banco: joelho alinhado com o eixo da máquina.",
              "Volte devagar. A fase de descida é onde o posterior mais ganha."
            ],
            "unilateral": true,
            "busca": "cadeira flexora execução correta posterior de coxa",
            "alternativos": []
          },
          {
            "id": "b-remada-uni",
            "nome": "Remada unilateral com halter (serrote)",
            "prescricao": "3x10-12 cada",
            "video": "VoGNKTI5wG8",
            "cues": [
              "Puxe o cotovelo na direção do quadril, sem girar o tronco.",
              "Coluna neutra, sem transformar em rosca de bíceps."
            ],
            "unilateral": true,
            "busca": "remada unilateral com halter serrote execução correta",
            "alternativos": []
          },
          {
            "id": "b-pelvica",
            "nome": "Elevação pélvica bilateral com carga",
            "prescricao": "3x10-12",
            "video": "np35bxrQqRI",
            "recorte": {
              "inicio": 416,
              "fim": 453
            },
            "cues": [
              "Barra na dobra do quadril com protetor, queixo levemente para dentro.",
              "Suba até alinhar tronco e coxa, segure 1 segundo apertando o glúteo."
            ],
            "unilateral": false,
            "busca": "elevação pélvica com barra execução correta",
            "alternativos": []
          }
        ]
      },
      {
        "nome": "Bloco C",
        "sub": "3 voltas",
        "exercicios": [
          {
            "id": "b-pant-sent",
            "nome": "Panturrilha sentada",
            "prescricao": "3x15-20",
            "video": "1x2QAgstSn4",
            "recorte": {
              "inicio": 146,
              "fim": 155
            },
            "cues": [
              "Joelho dobrado tira o gastrocnêmio e joga o trabalho para o sóleo.",
              "O sóleo é o músculo que mais sofre na corrida. Amplitude completa e cadência lenta."
            ],
            "unilateral": false,
            "busca": "panturrilha sentada gêmeos sentado execução correta",
            "alternativos": []
          },
          {
            "id": "b-biceps",
            "nome": "Bíceps em supersérie com tríceps",
            "prescricao": "3x12 + 3x12",
            "video": "LlJ6wf3NjeA",
            "recorte": {
              "inicio": 45,
              "fim": 55
            },
            "cues": [
              "Cotovelos parados ao lado do corpo, sem balanço de tronco."
            ],
            "unilateral": false,
            "busca": "rosca direta com halteres execução correta",
            "alternativos": [
              {
                "nome": "Tríceps na polia com corda",
                "video": "7le1JRUUagM"
              }
            ]
          },
          {
            "id": "b-lombar",
            "nome": "Extensão lombar no banco romano (ou bird-dog)",
            "prescricao": "3x12",
            "video": "W_kuBiLk5s0",
            "recorte": {
              "inicio": 24,
              "fim": 42
            },
            "cues": [
              "Movimento vem do quadril, coluna neutra, glúteo contraindo na subida.",
              "Não hiperestenda a lombar no final. Pare na linha do corpo."
            ],
            "unilateral": false,
            "busca": "extensão lombar banco romano execução correta",
            "alternativos": [
              {
                "nome": "Bird-dog (alternativa sem máquina)",
                "video": "GcIxfCvnLW8"
              }
            ]
          }
        ]
      },
      {
        "nome": "Finalizador",
        "sub": "2 a 3 voltas",
        "exercicios": [
          {
            "id": "b-fin-1",
            "nome": "Step-up no banco",
            "prescricao": "12 cada perna",
            "video": "9LBlAgBjDKM",
            "recorte": {
              "inicio": 170,
              "fim": 192
            },
            "cues": [
              "Pé inteiro apoiado no banco, empurre pelo calcanhar da perna de cima.",
              "Não dê impulso com a perna de baixo. Desça controlando."
            ],
            "unilateral": true,
            "busca": "step up subida no banco execução correta",
            "alternativos": []
          },
          {
            "id": "b-fin-2",
            "nome": "Afundo estático ou búlgaro",
            "prescricao": "10 cada perna",
            "video": "a3-bQbTdA_0",
            "recorte": {
              "inicio": 81,
              "fim": 100
            },
            "cues": [
              "Tronco levemente à frente, joelho da frente estável na direção do pé.",
              "Se incomodar o joelho operado, reduza a altura do apoio de trás."
            ],
            "unilateral": true,
            "busca": "agachamento búlgaro afundo execução correta",
            "alternativos": []
          },
          {
            "id": "b-fin-3",
            "nome": "Abdominal à escolha",
            "prescricao": "15",
            "video": "0loS0bRNqfs",
            "recorte": {
              "inicio": 60,
              "fim": 77
            },
            "cues": [
              "Qualquer variação que você consiga fazer sem puxar o pescoço."
            ],
            "unilateral": false,
            "busca": "dead bug abdominal execução",
            "alternativos": []
          },
          {
            "id": "b-fin-4",
            "nome": "Apoio em uma perna em superfície instável",
            "prescricao": "30s cada",
            "video": "5OKF9DJcP6M",
            "cues": [
              "Almofada, colchonete dobrado ou bosu. Joelho semiflexionado e estável."
            ],
            "unilateral": true,
            "busca": "equilíbrio unipodal superfície instável propriocepção",
            "alternativos": []
          }
        ]
      }
    ]
  },
  {
    "chave": "forcaAl",
    "rotulo": "Força A'",
    "titulo": "Força A' — mesma lógica de A, exercícios trocados",
    "lede": "Sexta-feira. Mantém o padrão de movimento e troca o exercício: você foge da monotonia sem perder o estímulo. Aquecimento e finalizador são os mesmos do treino A.",
    "blocos": [
      {
        "nome": "Substituições",
        "sub": "trocas em relação ao Força A",
        "exercicios": [
          {
            "id": "al-leg",
            "nome": "Leg press 45° (no lugar do agachamento livre)",
            "prescricao": "4x8-12",
            "video": "waAxlYvtCcI",
            "recorte": {
              "inicio": 21,
              "fim": 38
            },
            "cues": [
              "Lombar totalmente apoiada no encosto. Se o quadril descola, você desceu demais.",
              "Não estenda o joelho até travar no topo.",
              "Pés um pouco mais altos na plataforma tiram carga do joelho."
            ],
            "unilateral": false,
            "busca": "leg press 45 execução correta",
            "alternativos": [
              {
                "nome": "Ou agachamento búlgaro",
                "video": "a3-bQbTdA_0",
                "inicio": 67
              }
            ]
          },
          {
            "id": "al-remada",
            "nome": "Remada baixa (no lugar da puxada)",
            "prescricao": "4x8-12",
            "video": "s_c8SikiFAU",
            "cues": [
              "Tronco estável, puxe até o abdômen, escápulas se aproximando no final.",
              "Sem embalo de lombar para trás."
            ],
            "unilateral": false,
            "busca": "remada baixa polia execução correta",
            "alternativos": []
          },
          {
            "id": "al-cruci",
            "nome": "Crucifixo ou paralelas (no lugar do supino)",
            "prescricao": "3-4x10-12",
            "video": "ZjIKUMtW37c",
            "recorte": {
              "inicio": 33,
              "fim": 46
            },
            "cues": [
              "No crucifixo, cotovelos levemente dobrados e fixos durante todo o arco.",
              "Nas paralelas, desça até o ombro chegar na altura do cotovelo, não mais."
            ],
            "unilateral": false,
            "busca": "crucifixo reto com halteres execução correta",
            "alternativos": [
              {
                "nome": "Mergulho nas paralelas (dips)",
                "video": "gTuw7u2PwlM"
              }
            ]
          },
          {
            "id": "al-extensora",
            "nome": "Cadeira extensora (mantém)",
            "prescricao": "3x12-15 + 2x12 cada perna",
            "video": "exLCpU7mT3g",
            "recorte": {
              "inicio": 34,
              "fim": 52
            },
            "cues": [
              "Este não troca. É o exercício mais direto para o quadríceps da perna operada."
            ],
            "unilateral": true,
            "busca": "cadeira extensora execução correta",
            "alternativos": []
          },
          {
            "id": "al-pelvica",
            "nome": "Elevação pélvica unilateral (mantém)",
            "prescricao": "3x12 cada",
            "video": "Sk-mBla2h8A",
            "recorte": {
              "inicio": 238,
              "fim": 250
            },
            "cues": [
              "Também não troca. Trabalho unilateral em toda sessão de força, sem exceção."
            ],
            "unilateral": true,
            "busca": "elevação pélvica unilateral execução",
            "alternativos": []
          }
        ]
      }
    ]
  },
  {
    "chave": "corrida",
    "rotulo": "Corrida",
    "titulo": "Corrida",
    "lede": "Duas rotas: retomando (ainda não corre 5 km contínuos) ou já correndo 5 km. Escolha a sua e siga só ela.",
    "custom": "corrida",
    "blocos": []
  },
  {
    "chave": "circuito",
    "rotulo": "Circuito",
    "titulo": "Circuito híbrido — sábado, opcional",
    "lede": "Só entra depois de 4 semanas consistentes no plano. 4 voltas, 90 segundos de descanso entre voltas.",
    "blocos": [
      {
        "nome": "Circuito",
        "sub": "4 voltas · 90s entre voltas",
        "exercicios": [
          {
            "id": "c-remo",
            "nome": "Remo ou bike",
            "prescricao": "300 m / 500 m",
            "video": "nfT-wE0SjLk",
            "recorte": {
              "inicio": 124,
              "fim": 148
            },
            "cues": [
              "No remo a ordem é pernas, tronco, braços na puxada — e o inverso na volta.",
              "Sem arredondar a lombar para alcançar mais distância."
            ],
            "unilateral": false,
            "busca": "técnica remo indoor concept2 português",
            "alternativos": []
          },
          {
            "id": "c-kb",
            "nome": "Kettlebell swing",
            "prescricao": "15",
            "video": "MB87gQFA_y0",
            "recorte": {
              "inicio": 128,
              "fim": 152
            },
            "cues": [
              "O movimento é de quadril, não de agachamento nem de ombro.",
              "Se o swing incomodar o joelho, troque por levantamento terra leve."
            ],
            "unilateral": false,
            "busca": "kettlebell swing execução correta técnica",
            "alternativos": []
          },
          {
            "id": "c-flexao",
            "nome": "Flexão de braço",
            "prescricao": "10",
            "video": "UkDVBs9GEWo",
            "recorte": {
              "inicio": 401,
              "fim": 422
            },
            "cues": [
              "Corpo em linha, sem deixar o quadril cair."
            ],
            "unilateral": false,
            "busca": "flexão de braço execução correta",
            "alternativos": []
          },
          {
            "id": "c-afundo",
            "nome": "Afundo caminhando",
            "prescricao": "10 cada perna",
            "video": "9bxRdpUFW4c",
            "recorte": {
              "inicio": 9,
              "fim": 30
            },
            "cues": [
              "Passo firme, joelho da frente estável, tronco ereto.",
              "Em circuito, cansaço quebra a técnica. Prefira menos repetições com forma boa."
            ],
            "unilateral": true,
            "busca": "passada com halteres afundo caminhando execução",
            "alternativos": []
          },
          {
            "id": "c-prancha",
            "nome": "Prancha",
            "prescricao": "30s",
            "video": "RTxAFDK1OMw",
            "recorte": {
              "inicio": 39,
              "fim": 47
            },
            "cues": [
              "Glúteo e abdômen contraídos, quadril na linha dos ombros."
            ],
            "unilateral": false,
            "busca": "prancha frontal execução correta",
            "alternativos": []
          }
        ]
      }
    ],
    "avisoFinal": {
      "titulo": "Saltos e pliometria",
      "texto": "Só entram se o fisio liberar e se a perna operada tiver pelo menos 90% da força e do salto unipodal da perna boa."
    }
  },
  {
    "chave": "guia",
    "rotulo": "Guia",
    "titulo": "Guia",
    "custom": "guia",
    "blocos": []
  }
]

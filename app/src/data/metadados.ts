import type { Metadados } from './tipos'

export const METADADOS: Record<string, Metadados> = {
  "mob-tornozelo": {
    "musculoPrimario": "Panturrilha (sóleo)",
    "musculosSecundarios": [
      "Tibial anterior",
      "Panturrilha (gastrocnêmio)"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Mobilidade",
    "porQue": "Sem dorsiflexão, o joelho operado paga a conta em todo agachamento."
  },
  "mob-9090": {
    "musculoPrimario": "Rotadores do quadril",
    "musculosSecundarios": [
      "Glúteo médio",
      "Adutores"
    ],
    "equipamento": "Nenhum",
    "padraoMovimento": "Mobilidade",
    "porQue": "Quadril que gira poupa o joelho de girar no lugar dele."
  },
  "mob-gato": {
    "musculoPrimario": "Eretores da espinha",
    "musculosSecundarios": [
      "Abdômen (reto abdominal)"
    ],
    "equipamento": "Nenhum",
    "padraoMovimento": "Mobilidade",
    "porQue": "Coluna que se move impede quadril e joelho de compensar por ela."
  },
  "mob-toracica": {
    "musculoPrimario": "Eretores da espinha (torácicos)",
    "musculosSecundarios": [
      "Oblíquos",
      "Deltoide posterior"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Mobilidade",
    "porQue": "Rotação que acontece em cima não desce para o joelho operado."
  },
  "mob-pullapart": {
    "musculoPrimario": "Deltoide posterior",
    "musculosSecundarios": [
      "Trapézio médio",
      "Romboides"
    ],
    "equipamento": "Elástico",
    "padraoMovimento": "Ativação",
    "porQue": "Prepara o ombro para o volume de empurrar e puxar da semana."
  },
  "mob-rotext": {
    "musculoPrimario": "Manguito rotador (infraespinhal)",
    "musculosSecundarios": [
      "Deltoide posterior"
    ],
    "equipamento": "Elástico",
    "padraoMovimento": "Ativação",
    "porQue": "Ombro estável agora evita que ele vire a próxima lesão do plano."
  },
  "at-abre": {
    "musculoPrimario": "Glúteo médio",
    "musculosSecundarios": [
      "Adutores",
      "Glúteo máximo"
    ],
    "equipamento": "Miniband",
    "padraoMovimento": "Ativação",
    "porQue": "Acorda o freio lateral do quadril que impede o joelho de cair para dentro."
  },
  "at-ponte": {
    "musculoPrimario": "Glúteo máximo",
    "musculosSecundarios": [
      "Isquiotibiais",
      "Glúteo médio"
    ],
    "equipamento": "Miniband",
    "padraoMovimento": "Ativação",
    "porQue": "Liga o glúteo antes da carga, para ele puxar o movimento no lugar do joelho."
  },
  "at-lateral": {
    "musculoPrimario": "Glúteo médio",
    "musculosSecundarios": [
      "Glúteo máximo",
      "Tensor da fáscia lata"
    ],
    "equipamento": "Miniband",
    "padraoMovimento": "Ativação",
    "porQue": "Treina o quadril a manter o joelho alinhado sob carga lateral."
  },
  "at-pant": {
    "musculoPrimario": "Panturrilha (gastrocnêmio)",
    "musculosSecundarios": [
      "Panturrilha (sóleo)"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Isolado",
    "porQue": "Aquece o primeiro amortecedor da passada antes de exigir dele."
  },
  "at-bike": {
    "musculoPrimario": "Quadríceps",
    "musculosSecundarios": [
      "Glúteo máximo",
      "Panturrilha (gastrocnêmio)"
    ],
    "equipamento": "Bike",
    "padraoMovimento": "Cardio",
    "porQue": "Aquece a articulação sem impacto nos dias em que ela acorda rígida."
  },
  "a-agacha": {
    "musculoPrimario": "Quadríceps",
    "musculosSecundarios": [
      "Glúteo máximo",
      "Eretores da espinha",
      "Adutores"
    ],
    "equipamento": "Barra",
    "padraoMovimento": "Agachar",
    "porQue": "Reconstrói a força de base que a perna operada perdeu na cirurgia."
  },
  "a-puxada": {
    "musculoPrimario": "Dorsal (latíssimo)",
    "musculosSecundarios": [
      "Bíceps",
      "Trapézio médio"
    ],
    "equipamento": "Máquina",
    "padraoMovimento": "Puxar vertical",
    "porQue": "Mantém as costas evoluindo enquanto a perna dita o ritmo do plano."
  },
  "a-prancha-lat": {
    "musculoPrimario": "Oblíquos",
    "musculosSecundarios": [
      "Glúteo médio",
      "Quadrado lombar"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Core anti-rotação",
    "porQue": "Tronco firme de lado evita que o quadril desabe e jogue carga no joelho."
  },
  "a-extensora": {
    "musculoPrimario": "Quadríceps",
    "musculosSecundarios": [],
    "equipamento": "Máquina",
    "padraoMovimento": "Isolado",
    "porQue": "Ataca direto o músculo que mais atrofia depois da cirurgia."
  },
  "a-supino": {
    "musculoPrimario": "Peitoral maior",
    "musculosSecundarios": [
      "Tríceps",
      "Deltoide anterior"
    ],
    "equipamento": "Barra",
    "padraoMovimento": "Empurrar horizontal",
    "porQue": "Mantém o tronco forte sem pedir nada do joelho em recuperação."
  },
  "a-pelvica-uni": {
    "musculoPrimario": "Glúteo máximo",
    "musculosSecundarios": [
      "Isquiotibiais",
      "Abdômen (reto abdominal)"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Dobradiça de quadril",
    "porQue": "Mede a força de quadril perna a perna, sem a boa esconder a diferença."
  },
  "a-pant-uni": {
    "musculoPrimario": "Panturrilha (gastrocnêmio)",
    "musculosSecundarios": [
      "Panturrilha (sóleo)"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Isolado",
    "porQue": "Expõe e corrige o déficit que sobra do tempo de imobilização."
  },
  "a-elev-lat": {
    "musculoPrimario": "Deltoide lateral",
    "musculosSecundarios": [
      "Trapézio superior"
    ],
    "equipamento": "Halteres",
    "padraoMovimento": "Isolado",
    "porQue": "Equilibra o físico enquanto a perna se recupera em ritmo próprio."
  },
  "a-deadbug": {
    "musculoPrimario": "Abdômen (reto abdominal)",
    "musculosSecundarios": [
      "Transverso do abdômen",
      "Oblíquos"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Core anti-extensão",
    "porQue": "Ensina o tronco a ficar firme enquanto as pernas se movem sozinhas."
  },
  "a-fin-1": {
    "musculoPrimario": "Glúteo médio",
    "musculosSecundarios": [
      "Adutores",
      "Glúteo máximo"
    ],
    "equipamento": "Miniband",
    "padraoMovimento": "Ativação",
    "porQue": "Repete a ativação com a perna cansada, que é quando ela falha."
  },
  "a-fin-2": {
    "musculoPrimario": "Peitoral maior",
    "musculosSecundarios": [
      "Tríceps",
      "Deltoide anterior",
      "Abdômen (reto abdominal)"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Empurrar horizontal",
    "porQue": "Fecha a sessão com volume de tronco e zero carga extra no joelho."
  },
  "a-fin-3": {
    "musculoPrimario": "Quadríceps",
    "musculosSecundarios": [
      "Glúteo máximo"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Agachar",
    "porQue": "Volume leve de flexão de joelho para ganhar confiança sem risco."
  },
  "a-fin-4": {
    "musculoPrimario": "Tornozelo (estabilizadores)",
    "musculosSecundarios": [
      "Glúteo médio",
      "Quadríceps"
    ],
    "equipamento": "Nenhum",
    "padraoMovimento": "Equilíbrio",
    "porQue": "Devolve a propriocepção que se perde junto com o ligamento rompido."
  },
  "b-terra-uni": {
    "musculoPrimario": "Isquiotibiais",
    "musculosSecundarios": [
      "Glúteo máximo",
      "Eretores da espinha"
    ],
    "equipamento": "Halteres",
    "padraoMovimento": "Dobradiça de quadril",
    "porQue": "Trabalha o posterior perna a perna, essencial se o enxerto veio dali."
  },
  "b-desenvolv": {
    "musculoPrimario": "Deltoide anterior",
    "musculosSecundarios": [
      "Tríceps",
      "Trapézio superior"
    ],
    "equipamento": "Halteres",
    "padraoMovimento": "Empurrar vertical",
    "porQue": "Mantém o empurrar vertical em dia enquanto a perna se recupera."
  },
  "b-pallof": {
    "musculoPrimario": "Oblíquos",
    "musculosSecundarios": [
      "Transverso do abdômen",
      "Glúteo médio"
    ],
    "equipamento": "Polia",
    "padraoMovimento": "Core anti-rotação",
    "porQue": "Tronco que resiste à torção poupa o joelho de girar sob carga."
  },
  "b-flexora": {
    "musculoPrimario": "Isquiotibiais",
    "musculosSecundarios": [
      "Panturrilha (gastrocnêmio)"
    ],
    "equipamento": "Máquina",
    "padraoMovimento": "Isolado",
    "porQue": "Posterior forte é o freio que segura a tíbia e alivia o enxerto."
  },
  "b-remada-uni": {
    "musculoPrimario": "Dorsal (latíssimo)",
    "musculosSecundarios": [
      "Trapézio médio",
      "Bíceps"
    ],
    "equipamento": "Halteres",
    "padraoMovimento": "Puxar horizontal",
    "porQue": "Aplica no tronco a mesma lógica lado a lado usada nas pernas."
  },
  "b-pelvica": {
    "musculoPrimario": "Glúteo máximo",
    "musculosSecundarios": [
      "Isquiotibiais",
      "Quadríceps"
    ],
    "equipamento": "Barra",
    "padraoMovimento": "Dobradiça de quadril",
    "porQue": "Glúteo forte tira do joelho a conta de estender o quadril."
  },
  "b-pant-sent": {
    "musculoPrimario": "Panturrilha (sóleo)",
    "musculosSecundarios": [],
    "equipamento": "Máquina",
    "padraoMovimento": "Isolado",
    "porQue": "Isola o músculo que mais sofre quando a corrida volta ao plano."
  },
  "b-biceps": {
    "musculoPrimario": "Bíceps",
    "musculosSecundarios": [
      "Tríceps",
      "Antebraço"
    ],
    "equipamento": "Halteres",
    "padraoMovimento": "Isolado",
    "porQue": "Mantém os braços equilibrados sem roubar tempo do trabalho de perna."
  },
  "b-lombar": {
    "musculoPrimario": "Eretores da espinha",
    "musculosSecundarios": [
      "Glúteo máximo",
      "Isquiotibiais"
    ],
    "equipamento": "Máquina",
    "padraoMovimento": "Dobradiça de quadril",
    "porQue": "Cadeia posterior firme dá base para o quadril mandar na corrida."
  },
  "b-fin-1": {
    "musculoPrimario": "Quadríceps",
    "musculosSecundarios": [
      "Glúteo máximo",
      "Isquiotibiais"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Unilateral de perna",
    "porQue": "Ensaia com controle o gesto de subir degrau que a vida cobra todo dia."
  },
  "b-fin-2": {
    "musculoPrimario": "Quadríceps",
    "musculosSecundarios": [
      "Glúteo máximo",
      "Adutores"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Unilateral de perna",
    "porQue": "Carga em apoio único, a posição em que o joelho precisa voltar a confiar."
  },
  "b-fin-3": {
    "musculoPrimario": "Abdômen (reto abdominal)",
    "musculosSecundarios": [
      "Oblíquos",
      "Transverso do abdômen"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Core anti-extensão",
    "porQue": "Core no fim da sessão, quando o cansaço tenta quebrar a postura."
  },
  "b-fin-4": {
    "musculoPrimario": "Tornozelo (estabilizadores)",
    "musculosSecundarios": [
      "Glúteo médio",
      "Quadríceps"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Equilíbrio",
    "porQue": "Treina o terreno irregular que existe fora da academia."
  },
  "al-leg": {
    "musculoPrimario": "Quadríceps",
    "musculosSecundarios": [
      "Glúteo máximo",
      "Isquiotibiais"
    ],
    "equipamento": "Máquina",
    "padraoMovimento": "Agachar",
    "porQue": "Carga alta de perna com a lombar apoiada e o joelho num trilho fixo."
  },
  "al-remada": {
    "musculoPrimario": "Dorsal (latíssimo)",
    "musculosSecundarios": [
      "Trapézio médio",
      "Bíceps"
    ],
    "equipamento": "Polia",
    "padraoMovimento": "Puxar horizontal",
    "porQue": "Muda o ângulo da puxada para as costas crescerem sem desgaste repetido."
  },
  "al-cruci": {
    "musculoPrimario": "Peitoral maior",
    "musculosSecundarios": [
      "Deltoide anterior",
      "Tríceps"
    ],
    "equipamento": "Halteres",
    "padraoMovimento": "Empurrar horizontal",
    "porQue": "Varia o estímulo de peito e poupa o ombro de repetir a mesma barra."
  },
  "al-extensora": {
    "musculoPrimario": "Quadríceps",
    "musculosSecundarios": [],
    "equipamento": "Máquina",
    "padraoMovimento": "Isolado",
    "porQue": "Repete na sexta o estímulo direto que a perna operada não pode perder."
  },
  "al-pelvica": {
    "musculoPrimario": "Glúteo máximo",
    "musculosSecundarios": [
      "Isquiotibiais",
      "Glúteo médio"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Dobradiça de quadril",
    "porQue": "Garante que nenhuma sessão de força passe sem uma perna sozinha."
  },
  "c-remo": {
    "musculoPrimario": "Dorsal (latíssimo)",
    "musculosSecundarios": [
      "Quadríceps",
      "Glúteo máximo"
    ],
    "equipamento": "Máquina",
    "padraoMovimento": "Cardio",
    "porQue": "Condicionamento de corpo inteiro sem impacto no joelho operado."
  },
  "c-kb": {
    "musculoPrimario": "Glúteo máximo",
    "musculosSecundarios": [
      "Isquiotibiais",
      "Eretores da espinha"
    ],
    "equipamento": "Kettlebell",
    "padraoMovimento": "Dobradiça de quadril",
    "porQue": "Potência gerada no quadril, com o joelho quase parado no movimento."
  },
  "c-flexao": {
    "musculoPrimario": "Peitoral maior",
    "musculosSecundarios": [
      "Tríceps",
      "Abdômen (reto abdominal)"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Empurrar horizontal",
    "porQue": "Eleva o ritmo do circuito sem somar carga na perna."
  },
  "c-afundo": {
    "musculoPrimario": "Quadríceps",
    "musculosSecundarios": [
      "Glúteo máximo",
      "Isquiotibiais"
    ],
    "equipamento": "Halteres",
    "padraoMovimento": "Unilateral de perna",
    "porQue": "Testa o controle de uma perna só sob fadiga, onde o joelho costuma ceder."
  },
  "c-prancha": {
    "musculoPrimario": "Abdômen (reto abdominal)",
    "musculosSecundarios": [
      "Transverso do abdômen",
      "Glúteo máximo"
    ],
    "equipamento": "Peso do corpo",
    "padraoMovimento": "Core anti-extensão",
    "porQue": "Segura o tronco no circuito para a corrida não virar compensação."
  }
}

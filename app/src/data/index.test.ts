import { describe, expect, it } from 'vitest'
import { DURACOES } from './duracoes'
import { METADADOS } from './metadados'
import { DIVISOES, ESTATISTICAS, TODOS_EXERCICIOS, buscarDivisao, buscarExercicio } from './index'

describe('integridade do plano', () => {
  it('tem 53 exercícios', () => {
    expect(TODOS_EXERCICIOS).toHaveLength(53)
  })

  it('não tem ids duplicados', () => {
    const ids = TODOS_EXERCICIOS.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todo recorte tem fim maior que início', () => {
    for (const e of TODOS_EXERCICIOS) {
      if (e.recorte) expect(e.recorte.fim).toBeGreaterThan(e.recorte.inicio)
    }
  })

  it('todo recorte cabe dentro da duração do vídeo', () => {
    for (const e of TODOS_EXERCICIOS) {
      if (e.recorte) expect(e.recorte.fim).toBeLessThanOrEqual(DURACOES[e.video])
    }
  })

  it('todo videoId tem duração conhecida, inclusive dos alternativos', () => {
    for (const e of TODOS_EXERCICIOS) {
      expect(DURACOES[e.video]).toBeGreaterThan(0)
      for (const a of e.alternativos) expect(DURACOES[a.video]).toBeGreaterThan(0)
    }
  })

  /**
   * O lado oposto do teste acima. Sem ele, um vídeo que sai do plano continua
   * em `duracoes.ts` sem ninguém notar — e o `check:clips`, que lê o espelho
   * `test/duracoes.json`, passa a bater num vídeo que o app não usa mais.
   */
  it('não tem duração cadastrada para vídeo que o plano não usa', () => {
    const usados = new Set(
      TODOS_EXERCICIOS.flatMap((e) => [e.video, ...e.alternativos.map((a) => a.video)]),
    )
    for (const id of Object.keys(DURACOES)) expect(usados.has(id)).toBe(true)
  })

  it('todo exercício tem metadado e todo metadado tem exercício', () => {
    const ids = new Set(TODOS_EXERCICIOS.map((e) => e.id))
    for (const e of TODOS_EXERCICIOS) expect(METADADOS[e.id]).toBeDefined()
    for (const id of Object.keys(METADADOS)) expect(ids.has(id)).toBe(true)
  })

  it('todo exercício tem ao menos um cue', () => {
    for (const e of TODOS_EXERCICIOS) expect(e.cues.length).toBeGreaterThan(0)
  })

  it('tem exatamente 11 exercícios unilaterais', () => {
    expect(TODOS_EXERCICIOS.filter((e) => e.unilateral)).toHaveLength(11)
  })

  it('tem 40 recortes e 13 exercícios sem recorte', () => {
    expect(TODOS_EXERCICIOS.filter((e) => e.recorte)).toHaveLength(40)
    expect(TODOS_EXERCICIOS.filter((e) => !e.recorte)).toHaveLength(13)
  })

  /**
   * O endereço de protocolo (2.3) existe para o Rafael ter como falar de um
   * movimento com o fisioterapeuta. Os blocos do Aquecer vinham do legado com
   * numeração própria — "1. Mobilidade", "2. Ativação…", "3. Cardio leve" —
   * impressa em mono a 8px das linhas 1.1 a 1.11, e o bloco "2" continha os
   * exercícios 1.7 a 1.10. Duas numerações concorrentes na mesma coluna: dizer
   * "o 2" no Aquecer virava ambíguo.
   */
  it('nenhum cabeçalho de bloco carrega numeração própria', () => {
    for (const divisao of DIVISOES) {
      for (const bloco of divisao.blocos) {
        expect(bloco.nome).not.toMatch(/^\d+[.)]\s/)
      }
    }
  })
})

describe('numeração de protocolo', () => {
  it('numera as divisões de 01 a 08', () => {
    expect(DIVISOES.map((d) => d.numero)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08'])
  })

  it('dá endereço divisão.posição a cada exercício', () => {
    const primeiro = DIVISOES[0].blocos[0].exercicios[0]
    expect(primeiro.numero).toBe('1.1')
  })

  it('numera continuamente dentro da divisão, atravessando blocos', () => {
    const aquecer = DIVISOES[0]
    const numeros = aquecer.blocos.flatMap((b) => b.exercicios.map((e) => e.numero))
    expect(numeros).toEqual(numeros.map((_, i) => `1.${i + 1}`))
  })
})

describe('estatísticas', () => {
  it('calcula 770s úteis e os segundos brutos dos 44 vídeos', () => {
    expect(ESTATISTICAS.totalUtil).toBe(770)
    expect(ESTATISTICAS.totalBruto).toBe(8259)
  })
})

describe('buscarExercicio', () => {
  it('acha por id', () => {
    expect(buscarExercicio('ea-agacha')?.nome).toContain('Agachamento')
  })

  it('devolve undefined para id inexistente', () => {
    expect(buscarExercicio('nao-existe')).toBeUndefined()
  })
})

/**
 * As duas variantes soletradas uma vez só. O arquivo usava `startsWith` aqui e
 * a lista completa ali para o mesmo problema; agora há uma grafia só.
 */
const PANTURRILHA = ['Panturrilha (gastrocnêmio)', 'Panturrilha (sóleo)']

/**
 * A classificação muscular do modelo. Cada string foi levantada do vocabulário
 * que `metadados.ts` de fato usa como `musculoPrimario` nos quatro dias de
 * força — não escrita à mão a partir da spec. É o que o teste de classificação
 * abaixo garante: string que não é primário de ninguém é entrada morta, e foi
 * entrada morta ('Trapézio médio', 'Antebraço', 'Adutores', que só existem como
 * secundários) que deixou a versão anterior destes testes verde por acidente.
 */
const CLASSES_MUSCULARES: Record<string, string[]> = {
  puxar: ['Dorsal (latíssimo)', 'Bíceps', 'Deltoide posterior'],
  empurrar: ['Peitoral maior', 'Deltoide anterior', 'Deltoide lateral', 'Tríceps'],
  perna: ['Quadríceps', 'Isquiotibiais', 'Glúteo máximo', 'Glúteo médio', ...PANTURRILHA],
  neutro: ['Abdômen (reto abdominal)', 'Oblíquos', 'Eretores da espinha'],
}

const DIAS_EMPURRAR = ['empurrarA', 'empurrarB']
const DIAS_PUXAR = ['puxarA', 'puxarB']
const DIAS_FORCA = [...DIAS_EMPURRAR, ...DIAS_PUXAR]

function exerciciosDe(chave: string) {
  return buscarDivisao(chave)!.blocos.flatMap((b) => b.exercicios)
}

describe('modelo empurrar/puxar', () => {
  /**
   * O guarda que dá sentido aos dois testes de pureza abaixo. Eles são
   * asserções negativas sobre uma `string` livre: sozinhos, ficariam verdes
   * para sempre se alguém renomeasse 'Dorsal (latíssimo)' em `metadados.ts`, e
   * um dorsal poderia migrar para um dia de empurrar sem ninguém notar. Este
   * teste é o que transforma "não está na lista errada" em "está em exatamente
   * uma lista conhecida".
   */
  it('todo músculo primário dos dias de força está classificado em exatamente uma classe', () => {
    for (const chave of DIAS_FORCA) {
      for (const e of exerciciosDe(chave)) {
        const classes = Object.entries(CLASSES_MUSCULARES)
          .filter(([, musculos]) => musculos.includes(e.meta.musculoPrimario))
          .map(([nome]) => nome)
        expect(classes, `${e.id}: músculo primário "${e.meta.musculoPrimario}"`).toHaveLength(1)
      }
    }
  })

  it('nenhuma classe muscular tem entrada que não é primário de ninguém', () => {
    const primarios = new Set(
      DIAS_FORCA.flatMap((chave) => exerciciosDe(chave).map((e) => e.meta.musculoPrimario)),
    )
    for (const [classe, musculos] of Object.entries(CLASSES_MUSCULARES)) {
      for (const musculo of musculos) {
        expect(primarios.has(musculo), `${classe}: "${musculo}" não é primário de nenhum exercício`).toBe(true)
      }
    }
  })

  it('nenhum dia de empurrar contém músculo de puxar como primário', () => {
    for (const chave of DIAS_EMPURRAR) {
      for (const e of exerciciosDe(chave)) {
        expect(CLASSES_MUSCULARES.puxar).not.toContain(e.meta.musculoPrimario)
      }
    }
  })

  it('nenhum dia de puxar contém músculo de empurrar como primário', () => {
    for (const chave of DIAS_PUXAR) {
      for (const e of exerciciosDe(chave)) {
        expect(CLASSES_MUSCULARES.empurrar).not.toContain(e.meta.musculoPrimario)
      }
    }
  })

  it('toda sessão de força tem pelo menos 3 exercícios de perna — inferior em toda sessão', () => {
    for (const chave of DIAS_FORCA) {
      const perna = exerciciosDe(chave).filter((e) =>
        CLASSES_MUSCULARES.perna.includes(e.meta.musculoPrimario),
      )
      expect(perna.length, chave).toBeGreaterThanOrEqual(3)
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
    const temPanturrilha = (chave: string) =>
      exerciciosDe(chave).some((e) => PANTURRILHA.includes(e.meta.musculoPrimario))
    for (const chave of DIAS_PUXAR) expect(temPanturrilha(chave), chave).toBe(false)
    for (const chave of DIAS_EMPURRAR) expect(temPanturrilha(chave), chave).toBe(true)
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

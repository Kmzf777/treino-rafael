import { describe, expect, it } from 'vitest'
import { DURACOES } from './duracoes'
import { METADADOS } from './metadados'
import { DIVISOES, ESTATISTICAS, TODOS_EXERCICIOS, buscarExercicio } from './index'

describe('integridade do plano', () => {
  it('tem 47 exercícios', () => {
    expect(TODOS_EXERCICIOS).toHaveLength(47)
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

  it('todo exercício tem metadado e todo metadado tem exercício', () => {
    const ids = new Set(TODOS_EXERCICIOS.map((e) => e.id))
    for (const e of TODOS_EXERCICIOS) expect(METADADOS[e.id]).toBeDefined()
    for (const id of Object.keys(METADADOS)) expect(ids.has(id)).toBe(true)
  })

  it('todo exercício tem ao menos um cue', () => {
    for (const e of TODOS_EXERCICIOS) expect(e.cues.length).toBeGreaterThan(0)
  })

  it('tem exatamente 13 exercícios unilaterais', () => {
    expect(TODOS_EXERCICIOS.filter((e) => e.unilateral)).toHaveLength(13)
  })

  it('tem 37 recortes e 10 exercícios sem recorte', () => {
    expect(TODOS_EXERCICIOS.filter((e) => e.recorte)).toHaveLength(37)
    expect(TODOS_EXERCICIOS.filter((e) => !e.recorte)).toHaveLength(10)
  })
})

describe('numeração de protocolo', () => {
  it('numera as divisões de 01 a 07', () => {
    expect(DIVISOES.map((d) => d.numero)).toEqual(['01', '02', '03', '04', '05', '06', '07'])
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
  it('calcula 711s úteis e 8385s brutos', () => {
    expect(ESTATISTICAS.totalUtil).toBe(711)
    expect(ESTATISTICAS.totalBruto).toBe(8385)
  })
})

describe('buscarExercicio', () => {
  it('acha por id', () => {
    expect(buscarExercicio('a-agacha')?.nome).toContain('Agachamento')
  })

  it('devolve undefined para id inexistente', () => {
    expect(buscarExercicio('nao-existe')).toBeUndefined()
  })
})

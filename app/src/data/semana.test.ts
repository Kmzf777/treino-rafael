import { describe, expect, it } from 'vitest'
import { CICLO, DIAS_DE_FORCA, REGRA_DE_OURO, REGRA_DE_CARGA } from './semana'
import { buscarDivisao } from './index'

describe('ciclo de 4 semanas', () => {
  it('tem 4 semanas de 3 sessões de força', () => {
    expect(CICLO).toHaveLength(4)
    for (const semana of CICLO) expect(semana.sessoes).toHaveLength(3)
  })

  it('toda sessão aponta para uma divisão que existe', () => {
    for (const semana of CICLO) {
      for (const sessao of semana.sessoes) {
        expect(buscarDivisao(sessao.divisao)).toBeDefined()
      }
    }
  })

  it('cada treino aparece exatamente 3 vezes no ciclo', () => {
    const contagem = new Map<string, number>()
    for (const semana of CICLO) {
      for (const sessao of semana.sessoes) {
        contagem.set(sessao.divisao, (contagem.get(sessao.divisao) ?? 0) + 1)
      }
    }
    expect([...contagem.values()]).toEqual([3, 3, 3, 3])
  })

  it('a fila não repete um treino em sessões consecutivas', () => {
    const fila = CICLO.flatMap((s) => s.sessoes.map((x) => x.divisao))
    for (let i = 1; i < fila.length; i += 1) expect(fila[i]).not.toBe(fila[i - 1])
  })

  it('empurrar e puxar se alternam ao longo de todo o ciclo', () => {
    const fila = CICLO.flatMap((s) => s.sessoes.map((x) => x.divisao))
    for (let i = 1; i < fila.length; i += 1) {
      const anterior = fila[i - 1].startsWith('empurrar')
      const atual = fila[i].startsWith('empurrar')
      expect(atual).toBe(!anterior)
    }
  })

  it('a carga é pesada, moderada e leve, nessa ordem, em toda semana', () => {
    for (const semana of CICLO) {
      expect(semana.sessoes.map((s) => s.carga)).toEqual(['pesada', 'moderada', 'leve'])
    }
  })

  it('os dias de força são segunda, quarta e sexta', () => {
    expect(DIAS_DE_FORCA).toEqual(['Segunda', 'Quarta', 'Sexta'])
  })

  it('a regra de ouro e a regra de carga existem e não estão vazias', () => {
    expect(REGRA_DE_OURO.length).toBeGreaterThan(40)
    expect(REGRA_DE_CARGA.length).toBeGreaterThan(40)
  })
})

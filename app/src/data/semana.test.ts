import { describe, expect, it } from 'vitest'
import { CARGAS, CICLO, DIAS_DE_FORCA, REGRA_DE_OURO, REGRA_DE_CARGA } from './semana'
import { buscarDivisao } from './index'

describe('ciclo de 4 semanas', () => {
  it('tem 4 semanas de 3 sessões de força', () => {
    expect(CICLO).toHaveLength(4)
    for (const semana of CICLO) expect(semana.sessoes).toHaveLength(3)
  })

  /**
   * Os invariantes abaixo travam as propriedades da fila, não a fila. Uma tabela
   * diferente e errada passa em todos eles — `A → PB → B → PA`, por exemplo,
   * alterna empurrar/puxar, dá 3 aparições por treino e nunca repete em sessões
   * consecutivas. Como o app não tem automação de "qual é o treino de hoje", esta
   * tabela impressa é o produto: se ela derivar, o app mente em silêncio. Por isso
   * a literal da spec também é asserção, e não é redundante com o resto.
   */
  it('a fila é exatamente a tabela da spec', () => {
    expect(CICLO.map((s) => s.sessoes)).toEqual([
      ['empurrarA', 'puxarA', 'empurrarB'],
      ['puxarB', 'empurrarA', 'puxarA'],
      ['empurrarB', 'puxarB', 'empurrarA'],
      ['puxarA', 'empurrarB', 'puxarB'],
    ])
  })

  it('toda sessão aponta para uma divisão que existe', () => {
    for (const semana of CICLO) {
      for (const divisao of semana.sessoes) {
        expect(buscarDivisao(divisao)).toBeDefined()
      }
    }
  })

  it('cada treino aparece exatamente 3 vezes no ciclo', () => {
    const contagem = new Map<string, number>()
    for (const semana of CICLO) {
      for (const divisao of semana.sessoes) {
        contagem.set(divisao, (contagem.get(divisao) ?? 0) + 1)
      }
    }
    expect([...contagem.values()]).toEqual([3, 3, 3, 3])
  })

  it('a fila não repete um treino em sessões consecutivas', () => {
    const fila = CICLO.flatMap((s) => s.sessoes)
    for (let i = 1; i < fila.length; i += 1) expect(fila[i]).not.toBe(fila[i - 1])
  })

  it('empurrar e puxar se alternam ao longo de todo o ciclo', () => {
    const fila = CICLO.flatMap((s) => s.sessoes)
    for (let i = 1; i < fila.length; i += 1) {
      const anterior = fila[i - 1].startsWith('empurrar')
      const atual = fila[i].startsWith('empurrar')
      expect(atual).toBe(!anterior)
    }
  })

  it('os dias de força são segunda, quarta e sexta', () => {
    expect(DIAS_DE_FORCA).toEqual(['Segunda', 'Quarta', 'Sexta'])
  })

  /**
   * A carga não mora mais em cada sessão: `CARGAS[i]` vale para a i-ésima
   * sessão de qualquer semana. O preço dessa forma é o pareamento por índice —
   * um dia de força a mais sem a carga correspondente imprimiria "(undefined)"
   * no cabeçalho. É esse pareamento que a asserção de comprimento trava.
   */
  it('cada dia de força tem a sua carga, na ordem da semana', () => {
    expect(CARGAS).toEqual(['pesada', 'moderada', 'leve'])
    expect(CARGAS).toHaveLength(DIAS_DE_FORCA.length)
  })

  it('a regra de ouro e a regra de carga existem e não estão vazias', () => {
    expect(REGRA_DE_OURO.length).toBeGreaterThan(40)
    expect(REGRA_DE_CARGA.length).toBeGreaterThan(40)
  })
})

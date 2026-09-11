import { describe, expect, it } from 'vitest'
import {
  CARGAS,
  CICLO,
  DIAS_DE_FORCA,
  REGRA_DE_OURO,
  REGRA_DE_CARGA,
  REGRA_DE_PANTURRILHA,
  REGRA_DO_FREIO,
} from './semana'
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

  /**
   * A janela da corrida de qualidade é de 48 h — princípio P9 da spec. Esta nota
   * já disse "no dia seguinte", que é metade da janela, e como ela aparece em
   * toda divisão de força era a cópia mais lida e a mais permissiva ao mesmo
   * tempo. As negativas são deliberadas: se um dia a nota precisar mesmo falar
   * do dia seguinte (para permitir zona 2, por exemplo), este teste é o lugar
   * de revisar a janela junto, não de contornar a asserção.
   */
  it('a regra de ouro trava a janela em 48 h, não em 24', () => {
    expect(REGRA_DE_OURO).toMatch(/corrida de qualidade/i)
    expect(REGRA_DE_OURO).toMatch(/48 horas depois da sessão pesada/i)
    expect(REGRA_DE_OURO).not.toMatch(/dia seguinte/i)
    expect(REGRA_DE_OURO).not.toMatch(/24 h/i)

    // O resto da nota, que não muda: força primeiro e o intervalo mínimo.
    expect(REGRA_DE_OURO).toMatch(/força primeiro/i)
    expect(REGRA_DE_OURO).toMatch(/3 horas/)
  })

  /**
   * A nota irmã da regra de ouro, e a que ficou sem cinto: nenhum teste a
   * importava, e `TabelaSemana.test.tsx` cobria três das quatro notas. Trocar
   * "pelo menos 48 horas" por "24 horas" passava nos 182 — o mesmo defeito que
   * a regra de ouro já teve. O que se trava é a claim, não a prosa: a janela de
   * 48 h (P8 da spec, que é sobre tendão de Aquiles, não sobre organização de
   * semana) e o dia em que a panturrilha aparece.
   *
   * As negativas cobrem o afrouxamento que NÃO apaga o número — "48 horas,
   * mas 24 já serve" continuaria batendo na positiva. `/dias seguidos/` não
   * serve de negativa: a própria nota usa a expressão para dizer o que não
   * fazer.
   */
  it('a nota da panturrilha trava a janela de 48 h e o dia em que ela aparece', () => {
    expect(REGRA_DE_PANTURRILHA).toMatch(/pelo menos 48 horas/i)
    expect(REGRA_DE_PANTURRILHA).toMatch(/só nos dias de empurrar/i)
    expect(REGRA_DE_PANTURRILHA).toMatch(/nos dias de puxar ela não aparece/i)
    // A razão da janela, que é o que distingue esta nota de uma regra de
    // calendário: o tecido que paga a conta.
    expect(REGRA_DE_PANTURRILHA).toMatch(/aquiles/i)

    expect(REGRA_DE_PANTURRILHA).not.toMatch(/24 h/i)
    expect(REGRA_DE_PANTURRILHA).not.toMatch(/dia seguinte/i)
  })

  /**
   * Comprimento não basta aqui: esta nota é o freio-mestre, e o que vale nela
   * são o gatilho (o inchaço), o número (30 a 50%) e a precedência sobre as
   * outras regras desta mesma tela. Sem os três ela vira conselho genérico.
   */
  it('a nota do freio traz o gatilho, o corte e a precedência', () => {
    expect(REGRA_DO_FREIO).toMatch(/inchaço/i)
    expect(REGRA_DO_FREIO).toMatch(/30 a 50/)
    expect(REGRA_DO_FREIO).toMatch(/vale mais que qualquer regra de frequência/i)
  })
})

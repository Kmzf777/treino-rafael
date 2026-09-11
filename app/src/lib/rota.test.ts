import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { PLANO } from '@/data/plano'
import { CHAVES_DIVISAO, irPara, lerRota, useRota } from './rota'

beforeEach(() => {
  window.location.hash = ''
})

describe('CHAVES_DIVISAO', () => {
  it('cobre exatamente as divisões do plano, na mesma ordem', () => {
    expect([...CHAVES_DIVISAO]).toEqual(PLANO.map((d) => d.chave))
  })
})

describe('lerRota', () => {
  it('usa aquecer quando o hash está vazio', () => {
    expect(lerRota('')).toEqual({ divisao: 'aquecer', exercicio: undefined })
  })

  it('lê a divisão', () => {
    expect(lerRota('#/empurrarA')).toEqual({ divisao: 'empurrarA', exercicio: undefined })
  })

  it('lê divisão e exercício', () => {
    expect(lerRota('#/empurrarA/ea-agacha')).toEqual({ divisao: 'empurrarA', exercicio: 'ea-agacha' })
  })

  it('ignora divisão desconhecida e cai em aquecer', () => {
    expect(lerRota('#/inventada')).toEqual({ divisao: 'aquecer', exercicio: undefined })
  })
})

describe('useRota', () => {
  it('reage a mudança de hash', () => {
    const { result } = renderHook(() => useRota())
    expect(result.current.divisao).toBe('aquecer')
    act(() => {
      irPara('puxarA')
    })
    expect(result.current.divisao).toBe('puxarA')
  })

  it('abre e fecha o exercício', () => {
    const { result } = renderHook(() => useRota())
    act(() => {
      irPara('puxarA', 'pa-flexora')
    })
    expect(result.current.exercicio).toBe('pa-flexora')
    act(() => {
      irPara('puxarA')
    })
    expect(result.current.exercicio).toBeUndefined()
  })
})

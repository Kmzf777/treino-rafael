import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePreferencia, useTema } from './usePreferencias'

const MODOS = ['4', '3'] as const

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.documentElement.classList.remove('escuro')
  document.documentElement.style.colorScheme = ''
})

describe('usePreferencia', () => {
  it('começa no padrão e persiste a escolha', () => {
    const { result } = renderHook(() => usePreferencia('treino.modo', '4', MODOS))
    expect(result.current[0]).toBe('4')

    act(() => {
      result.current[1]('3')
    })
    expect(result.current[0]).toBe('3')
    expect(localStorage.getItem('treino.modo')).toBe('3')
  })

  it('lê o valor já gravado', () => {
    localStorage.setItem('treino.modo', '3')
    const { result } = renderHook(() => usePreferencia('treino.modo', '4', MODOS))
    expect(result.current[0]).toBe('3')
  })

  it('ignora valor gravado fora do conjunto conhecido', () => {
    localStorage.setItem('treino.modo', '7')
    const { result } = renderHook(() => usePreferencia('treino.modo', '4', MODOS))
    expect(result.current[0]).toBe('4')
  })

  it('sobrevive a localStorage indisponível (modo privado)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('acesso negado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('acesso negado')
    })

    const { result } = renderHook(() => usePreferencia('treino.modo', '4', MODOS))
    expect(result.current[0]).toBe('4')

    act(() => {
      result.current[1]('3')
    })
    // A preferência não persiste, mas a UI responde na mesma sessão.
    expect(result.current[0]).toBe('3')
  })
})

describe('useTema', () => {
  it('não quebra sem matchMedia e trata auto como claro', () => {
    expect(window.matchMedia).toBeUndefined() // jsdom 29 não implementa
    const { result } = renderHook(() => useTema())
    expect(result.current[0]).toBe('auto')
    expect(document.documentElement.classList.contains('escuro')).toBe(false)
  })

  it('aplica a classe escuro e guarda a escolha', () => {
    const { result } = renderHook(() => useTema())
    act(() => {
      result.current[1]('escuro')
    })
    expect(document.documentElement.classList.contains('escuro')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')
    expect(localStorage.getItem('treino.tema')).toBe('escuro')

    act(() => {
      result.current[1]('claro')
    })
    expect(document.documentElement.classList.contains('escuro')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('em auto, segue o sistema e reage quando ele muda', () => {
    let ouvinte: (() => void) | null = null
    let escuroNoSistema = true
    vi.stubGlobal('matchMedia', () => ({
      get matches() {
        return escuroNoSistema
      },
      addEventListener: (_: string, fn: () => void) => {
        ouvinte = fn
      },
      removeEventListener: () => {
        ouvinte = null
      },
    }))

    renderHook(() => useTema())
    expect(document.documentElement.classList.contains('escuro')).toBe(true)

    escuroNoSistema = false
    act(() => {
      ouvinte?.()
    })
    expect(document.documentElement.classList.contains('escuro')).toBe(false)
  })
})

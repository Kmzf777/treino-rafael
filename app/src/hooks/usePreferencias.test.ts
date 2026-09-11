import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePreferencia, useTema } from './usePreferencias'

// Fixture neutra: o hook é genérico, e a única chave que o app persiste hoje é
// `treino.tema`, exercitada no describe de baixo.
const CHAVE = 'teste.chave'
const VALIDOS = ['a', 'b'] as const

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
    const { result } = renderHook(() => usePreferencia(CHAVE, 'a', VALIDOS))
    expect(result.current[0]).toBe('a')

    act(() => {
      result.current[1]('b')
    })
    expect(result.current[0]).toBe('b')
    expect(localStorage.getItem(CHAVE)).toBe('b')
  })

  it('lê o valor já gravado', () => {
    localStorage.setItem(CHAVE, 'b')
    const { result } = renderHook(() => usePreferencia(CHAVE, 'a', VALIDOS))
    expect(result.current[0]).toBe('b')
  })

  it('ignora valor gravado fora do conjunto conhecido', () => {
    localStorage.setItem(CHAVE, 'z')
    const { result } = renderHook(() => usePreferencia(CHAVE, 'a', VALIDOS))
    expect(result.current[0]).toBe('a')
  })

  it('sobrevive a localStorage indisponível (modo privado)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('acesso negado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('acesso negado')
    })

    const { result } = renderHook(() => usePreferencia(CHAVE, 'a', VALIDOS))
    expect(result.current[0]).toBe('a')

    act(() => {
      result.current[1]('b')
    })
    // A preferência não persiste, mas a UI responde na mesma sessão.
    expect(result.current[0]).toBe('b')
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

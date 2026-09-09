import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

/**
 * Dois buracos do jsdom 29 que o cmdk (usado pela Busca) exercita de verdade:
 * 1. `scrollIntoView()` é chamado no item selecionado a cada tecla digitada;
 * 2. o `CommandList` observa a própria altura com `ResizeObserver`.
 *
 * Sem os dois stubs, montar a paleta estoura antes de qualquer asserção — vale
 * para o teste da Busca e para qualquer teste que monte o App inteiro.
 * Ficam aqui, e não num `beforeAll` por arquivo, para não haver duas cópias.
 */
Element.prototype.scrollIntoView = vi.fn()

globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

afterEach(() => {
  cleanup()
})

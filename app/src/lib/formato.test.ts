import { describe, expect, it } from 'vitest'
import { mmss, urlBusca, urlYouTube } from './formato'

describe('mmss', () => {
  it('formata segundos como m:ss', () => {
    expect(mmss(33)).toBe('0:33')
    expect(mmss(711)).toBe('11:51')
    expect(mmss(8385)).toBe('139:45')
  })
})

describe('urlYouTube', () => {
  it('monta a url com o segundo exato', () => {
    expect(urlYouTube('abc123', 33)).toBe('https://www.youtube.com/watch?v=abc123&t=33s')
  })

  it('omite o t quando não há início', () => {
    expect(urlYouTube('abc123')).toBe('https://www.youtube.com/watch?v=abc123')
  })
})

describe('urlBusca', () => {
  it('codifica a query', () => {
    expect(urlBusca('ponte de glúteo')).toBe(
      'https://www.youtube.com/results?search_query=ponte%20de%20gl%C3%BAteo',
    )
  })
})

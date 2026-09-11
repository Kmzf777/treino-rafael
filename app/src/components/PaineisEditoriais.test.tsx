import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { CORRIDA, GUIA } from '@/data/editorial'
import { PainelCorrida } from './PainelCorrida'
import { PainelGuia } from './PainelGuia'

beforeEach(() => {
  localStorage.clear()
})

describe('PainelCorrida', () => {
  it('mostra as 8 semanas da retomada', () => {
    render(<PainelCorrida />)
    for (const semana of CORRIDA.retomando.semanas) {
      expect(screen.getByText(semana.sessao)).toBeInTheDocument()
    }
  })

  it('não perde os ledes das seções', () => {
    render(<PainelCorrida />)
    expect(screen.getByText(CORRIDA.retomando.lede)).toBeInTheDocument()
    expect(screen.getByText(CORRIDA.jaCorre.lede)).toBeInTheDocument()
  })

  it('mostra todos os cards de cuidados com o joelho', () => {
    render(<PainelCorrida />)
    for (const card of CORRIDA.cuidados.cards) {
      expect(screen.getByText(card.titulo)).toBeInTheDocument()
      expect(screen.getByText(card.texto)).toBeInTheDocument()
    }
  })

  it('leva à leitura de cadência e à busca de técnica no YouTube', () => {
    render(<PainelCorrida />)
    expect(screen.getByRole('link', { name: /Ler sobre cadência/ })).toHaveAttribute(
      'href',
      CORRIDA.links[0].url,
    )
    expect(screen.getByRole('link', { name: /Vídeos de técnica de corrida/ })).toHaveAttribute(
      'href',
      'https://www.youtube.com/results?search_query=educativos%20de%20corrida%20t%C3%A9cnica%20de%20passada%20cad%C3%AAncia',
    )
  })
})

describe('PainelGuia', () => {
  it('renderiza todas as seções do guia, seja qual for o tipo', () => {
    render(<PainelGuia />)
    for (const secao of GUIA) {
      if (secao.tipo === 'cards') {
        expect(screen.getByText(secao.titulo)).toBeInTheDocument()
        for (const card of secao.cards) expect(screen.getByText(card.texto)).toBeInTheDocument()
      } else {
        expect(screen.getByText(secao.texto)).toBeInTheDocument()
      }
    }
  })

  it('destaca o alerta de reduzir a carga como aviso', () => {
    render(<PainelGuia />)
    const rotulo = screen.getByText('Sinais para reduzir a carga')
    expect(rotulo).toHaveClass('text-tijolo')
    expect(rotulo.closest('aside')).toHaveClass('border-tijolo')
  })

  it('não repete a frase do campo de carga, que saiu do escopo', () => {
    render(<PainelGuia />)
    expect(screen.queryByText(/sem anotar, não existe progressão/i)).not.toBeInTheDocument()
  })
})

describe('cards do guia no modelo empurrar/puxar', () => {
  const titulos = GUIA.map((s) => ('titulo' in s ? s.titulo : ''))

  it('tem o card do joelho operado', () => {
    expect(titulos).toContain('Joelho operado')
  })

  it('tem o card de sinais de alerta', () => {
    expect(titulos).toContain('Sinais para reduzir a carga')
  })

  it('tem a checagem mensal de simetria entre as pernas', () => {
    expect(titulos).toContain('Checagem mensal de simetria')
  })

  it('tem o card das três regras da corrida', () => {
    expect(titulos).toContain('Corrida — as três regras')
  })

  it('tem o card de honestidade editorial', () => {
    expect(titulos).toContain('O que este plano não afirma')
  })

  it('não promete que separar peito e costas é melhor', () => {
    const texto = JSON.stringify(GUIA)
    expect(texto).toContain('não é pior')
  })

  it('registra as perguntas em aberto sobre a cirurgia', () => {
    const texto = JSON.stringify(GUIA)
    expect(texto).toMatch(/enxerto/i)
    expect(texto).toMatch(/menisco/i)
  })
})

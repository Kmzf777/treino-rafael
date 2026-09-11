import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { buscarDivisao } from '@/data'
import { CORRIDA, GUIA } from '@/data/editorial'
import { DIAS_DE_FORCA, DIAS_FIXOS, REGRA_DE_OURO } from '@/data/semana'
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

/**
 * O painel de corrida e a `TabelaSemana` aparecem na MESMA tela, e o painel já
 * mentiu sobre ela: dizia "Três sessões por semana" enquanto `DIAS_FIXOS` tinha
 * duas. A terceira corrida saiu junto com o toggle 3/4 dias, o texto ficou, e
 * nada travava a diferença. Aqui a estrutura que o texto anuncia é lida do
 * dado, não escrita à mão.
 */
describe('estrutura de corrida', () => {
  const DIAS_DE_CORRIDA = DIAS_FIXOS.filter((linha) => !linha.descanso)
  const POR_EXTENSO = ['nenhuma', 'uma', 'duas', 'três', 'quatro', 'cinco']
  const LEDES = [CORRIDA.retomando.lede, CORRIDA.jaCorre.lede].map((l) => l.toLowerCase())
  const TUDO = JSON.stringify(CORRIDA).toLowerCase()

  it('os dois ledes anunciam tantas sessões fixas quantas a semana tem', () => {
    const quantas = POR_EXTENSO[DIAS_DE_CORRIDA.length]
    for (const lede of LEDES) expect(lede).toContain(`${quantas} sessões fixas`)
  })

  it('os dois ledes nomeiam os dias em que a semana marca corrida', () => {
    for (const { dia } of DIAS_DE_CORRIDA) {
      for (const lede of LEDES) expect(lede, dia).toContain(dia.toLowerCase())
    }
  })

  /**
   * A terceira corrida do briefing: leve, opcional, no primeiro dia de força e
   * DEPOIS dele. Ela não cabe em `DIAS_FIXOS` — segunda é dia de força e o
   * treino muda a cada semana do ciclo —, então o texto é o único lugar onde
   * ela existe, e seria de novo o único lugar de onde ela poderia sumir sem
   * ninguém ver.
   */
  it('a corrida opcional mora no primeiro dia de força, e depois dele', () => {
    const primeiro = DIAS_DE_FORCA[0].toLowerCase()
    expect(TUDO).toMatch(new RegExp(`opcional n[ao] ${primeiro}`))
    expect(TUDO).toContain('depois da força')
  })

  /**
   * O intervalo entre a força e a opcional não é número próprio do painel: é o
   * mesmo da `REGRA_DE_OURO`, que a `TabelaSemana` imprime nesta mesma tela.
   * Lido do texto dela de propósito — mover um obriga a mover o outro, em vez
   * de deixar duas cifras livres para divergir a um metro de distância.
   */
  it('o intervalo da opcional é o que a regra de ouro já exige', () => {
    const horas = REGRA_DE_OURO.match(/pelo menos (\d+) horas/)?.[1]
    expect(horas, 'a regra de ouro perdeu o intervalo mínimo').toBeDefined()
    expect(TUDO).toContain(`pelo menos ${horas} horas`)
  })

  /**
   * `DIAS_FIXOS` dá ao sábado duas sessões — "Corrida longa ou de qualidade" —
   * e ele é o único slot possível para as duas: a terça está a 24 h da sessão
   * pesada e o tiro pede 48. O painel prometia as duas toda semana, com um card
   * "Qualidade — 1x por semana" ao lado de um card de longa sem ressalva.
   */
  it('o painel diz que o sábado se reveza, em vez de prometer as duas', () => {
    const acumula = DIAS_DE_CORRIDA.find(
      (linha) => /longa/i.test(linha.sessao) && /qualidade/i.test(linha.sessao),
    )
    expect(acumula, 'a semana perdeu o dia que acumula longa e qualidade').toBeDefined()

    const cards = CORRIDA.jaCorre.cards
      .map((c) => `${c.titulo}. ${c.texto}`)
      .join(' ')
      .toLowerCase()

    expect(cards).toContain(acumula!.dia.toLowerCase())
    expect(cards).toMatch(/semana sim, semana não|se revezam|alterna/)
    expect(cards).not.toMatch(/1x por semana/)
  })
})

/**
 * Asserção por título é falsa segurança num arquivo cujo produto é o texto:
 * trocar o card de alerta inteiro por "Se doer, pegue leve." deixava os 176
 * testes verdes. O que se trava aqui é a **afirmação de segurança** — o número,
 * a proibição, a ordem —, nunca a prosa inteira, que muda a cada revisão de
 * texto sem mudar o que o leitor faz.
 */
describe('cards do guia no modelo empurrar/puxar', () => {
  const titulos = GUIA.map((s) => ('titulo' in s ? s.titulo : ''))

  const indiceDe = (titulo: string) => titulos.indexOf(titulo)

  /** Todo o texto de uma seção, seja ela `texto`, `alerta` ou `cards`. */
  const textoDe = (titulo: string) => {
    const secao = GUIA.find((s) => 'titulo' in s && s.titulo === titulo)
    if (!secao) throw new Error(`o guia perdeu a seção "${titulo}"`)
    return secao.tipo === 'cards'
      ? secao.cards.map((c) => `${c.titulo}. ${c.texto}`).join(' ')
      : secao.texto
  }

  it('tem o card das três regras da corrida', () => {
    expect(titulos).toContain('Corrida — as três regras')
  })

  /**
   * Este texto vive em dois lugares: aqui e no `avisoFinal` do circuito, que é
   * nota lateral no fim de outra divisão. Um não pode importar o outro —
   * `plano.ts` é gerado —, então o que segura as duas cópias juntas é esta
   * asserção. Elas já divergiram uma vez: o Guia foi reescrito nesta branch e o
   * `avisoFinal` ficou com a redação anterior.
   */
  it('o aviso de pliometria do circuito repete o do guia, palavra por palavra', () => {
    const circuito = buscarDivisao('circuito')!
    expect(circuito.avisoFinal?.titulo).toBe('Saltos e pliometria')
    expect(circuito.avisoFinal?.texto).toBe(textoDe('Saltos e pliometria'))
  })

  it('tem o card de honestidade editorial', () => {
    expect(titulos).toContain('O que este plano não afirma')
  })

  it('não promete que separar peito e costas é melhor', () => {
    const texto = JSON.stringify(GUIA)
    expect(texto).toContain('não é pior')
  })

  /**
   * "Freio-mestre" não é ênfase de redação: é hierarquia. O inchaço precisa
   * aparecer antes dos outros sinais e mandar mais que a regra de frequência —
   * uma asserção de índice é o que distingue "primeiro da lista" de "mais um
   * item da lista".
   */
  it('o alerta abre pelo inchaço, com o corte de volume que ele obriga', () => {
    const texto = textoDe('Sinais para reduzir a carga').toLowerCase()

    expect(texto).toContain('inchaço')
    expect(texto).toContain('30 a 50')
    expect(texto).toMatch(/vale mais que qualquer regra de frequência/)

    const inchaco = texto.indexOf('inchaço')
    for (const sinal of ['3/10', '72 horas', 'bloqueio', 'extensão completa']) {
      expect(texto.indexOf(sinal), `"${sinal}" deveria vir depois do inchaço`).toBeGreaterThan(
        inchaco,
      )
    }
  })

  it('o card do joelho nomeia as duas amplitudes e proíbe a falha na terminal', () => {
    const texto = textoDe('Joelho operado')

    // A faixa terminal da spec, em graus: "a faixa final" sozinha não diz a quem
    // não leu a spec qual faixa é.
    expect(texto).toContain('45 a 0 graus')
    // A configuração conservadora, para menos de 9 meses.
    expect(texto).toContain('90 a 45 graus')
    expect(texto).toMatch(/nunca até a falha/i)
    expect(texto).toMatch(/nunca teste de força/i)
  })

  it('a checagem mensal traz o alvo absoluto, não só a variação do mês', () => {
    const texto = textoDe('Checagem mensal de simetria')

    expect(texto).toContain('20 ou mais repetições')
    // Critério absoluto: uma assimetria grande e estável também reprova.
    expect(texto).toContain('sem diferença entre os lados')
    expect(texto).toMatch(/não é hora de subir carga/i)
  })

  /**
   * Este teste checava `/enxerto/i` sobre o guia inteiro e passava mesmo com a
   * seção apagada — a nota de rodapé diz "LCA e LCM com enxerto". Agora ele
   * assere sobre a seção certa.
   */
  it('as três perguntas nomeiam enxerto, meses e menisco, e a configuração conservadora', () => {
    const texto = textoDe('Três perguntas que mudam a prescrição')

    expect(texto).toMatch(/enxerto/i)
    expect(texto).toMatch(/menisco/i)
    expect(texto).toMatch(/meses de cirurgia/i)
    expect(texto).toMatch(/configuração conservadora/i)
  })

  /**
   * O protocolo da extensora é condicional a estas três respostas. Lendo o
   * joelho antes das perguntas, o leitor recebe a prescrição sem saber que ela
   * depende de algo que ele ainda não respondeu.
   */
  it('as três perguntas vêm antes do card do joelho, porque são o input dele', () => {
    expect(indiceDe('Três perguntas que mudam a prescrição')).toBeGreaterThanOrEqual(0)
    expect(indiceDe('Joelho operado')).toBe(
      indiceDe('Três perguntas que mudam a prescrição') + 1,
    )
  })

  /**
   * `TabelaSemana` imprime as notas laterais na mesma tela do Guia. Quando um
   * card reenuncia uma nota, as duas cópias divergem sem ninguém notar — as
   * cláusulas abaixo são as que já estavam duplicadas.
   */
  it('os cards do guia não recopiam as notas laterais da semana', () => {
    const texto = JSON.stringify(GUIA)
    // Uma cláusula distintiva de cada nota. Guardar a frase inteira seria
    // frágil; guardar a afirmação que a nota carrega é o que importa.
    expect(texto).not.toContain('é ela que sustenta a corrida') // REGRA_DE_CARGA
    expect(texto).not.toContain('custa força explosiva') // REGRA_DE_OURO
  })
})

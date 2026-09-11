import { useSyncExternalStore } from 'react'

/**
 * As oito chaves de divisão do plano. Ficam aqui, e não importadas de
 * `@/data/plano`, para que a camada de roteamento não dependa da camada de
 * dados: `rota.ts` precisa apenas saber quais endereços são válidos.
 * A integridade entre as duas listas é garantida por `rota.test.ts`.
 */
export const CHAVES_DIVISAO = [
  'aquecer',
  'empurrarA',
  'puxarA',
  'empurrarB',
  'puxarB',
  'corrida',
  'circuito',
  'guia',
] as const

const CHAVES: ReadonlySet<string> = new Set(CHAVES_DIVISAO)

const PADRAO = 'aquecer'

export type Rota = { divisao: string; exercicio?: string }

export function lerRota(hash: string): Rota {
  const partes = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const divisao = partes[0] && CHAVES.has(partes[0]) ? partes[0] : PADRAO
  return { divisao, exercicio: partes[1] || undefined }
}

function assinar(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

/**
 * `substituir` troca o push por um replaceState. Fechar o sheet não é navegar
 * para lugar nenhum, é desfazer a abertura: empilhando, o botão Voltar do
 * Android — o gesto natural de sair — reabre o exercício que o usuário acabou
 * de fechar.
 */
export function irPara(divisao: string, exercicio?: string, substituir = false) {
  const alvo = exercicio ? `#/${divisao}/${exercicio}` : `#/${divisao}`
  if (window.location.hash !== alvo) {
    if (substituir) window.history.replaceState(null, '', alvo)
    else window.location.hash = alvo
  }
  // `location.hash` muda na hora, mas o `hashchange` é uma tarefa enfileirada —
  // tanto no navegador quanto no jsdom. Sem este aviso síncrono a interface só
  // reagiria no tick seguinte ao clique. Quando o evento real chegar, o
  // snapshot já será idêntico e o useSyncExternalStore não re-renderiza.
  // Com `substituir` ele deixa de ser otimização e passa a ser obrigatório:
  // replaceState não dispara `hashchange` nenhum.
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

export function useRota(): Rota {
  const hash = useSyncExternalStore(
    assinar,
    () => window.location.hash,
    () => '',
  )
  return lerRota(hash)
}

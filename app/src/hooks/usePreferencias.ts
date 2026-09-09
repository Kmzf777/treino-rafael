import { useCallback, useEffect, useState } from 'react'

/**
 * As duas únicas chaves persistidas do app. Ambas são preferência de leitura,
 * não sessão de treino: não há cronômetro, "feito", carga nem progresso.
 *
 * - `treino.modo` → '4' | '3'  (dias de academia na tabela da semana)
 * - `treino.tema` → 'claro' | 'escuro' | 'auto'
 */

function ler<T extends string>(chave: string, padrao: T, validos: readonly T[]): T {
  try {
    const bruto = localStorage.getItem(chave)
    // Valor fora do conjunto conhecido (versão antiga, edição manual) volta ao
    // padrão em vez de contaminar a UI com um estado impossível.
    return bruto !== null && (validos as readonly string[]).includes(bruto) ? (bruto as T) : padrao
  } catch {
    // Modo privado / storage bloqueado: a preferência simplesmente não persiste.
    return padrao
  }
}

export function usePreferencia<T extends string>(chave: string, padrao: T, validos: readonly T[]) {
  const [valor, setValor] = useState<T>(() => ler(chave, padrao, validos))

  const definir = useCallback(
    (novo: T) => {
      setValor(novo)
      try {
        localStorage.setItem(chave, novo)
      } catch {
        // Sem storage a escolha vale só nesta sessão — mas a UI responde igual.
      }
    },
    [chave],
  )

  return [valor, definir] as const
}

export const TEMAS = ['claro', 'escuro', 'auto'] as const
export type Tema = (typeof TEMAS)[number]

const CONSULTA_ESCURO = '(prefers-color-scheme: dark)'

/** jsdom 29 não implementa `matchMedia`; o app não pode quebrar por causa disso. */
function consultaEscuro(): MediaQueryList | null {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(CONSULTA_ESCURO)
    : null
}

export function useTema() {
  const [tema, setTema] = usePreferencia<Tema>('treino.tema', 'auto', TEMAS)

  useEffect(() => {
    const aplicar = () => {
      const escuro =
        tema === 'escuro' || (tema === 'auto' && (consultaEscuro()?.matches ?? false))
      const raiz = document.documentElement
      raiz.classList.toggle('escuro', escuro)
      // A classe `claro` é explícita porque o CSS precisa distinguir "o usuário
      // escolheu claro" de "ninguém escolheu nada ainda": é ela que desarma o
      // bloco @media (prefers-color-scheme: dark) do index.css, a rede de
      // segurança que pinta o escuro antes do JS existir.
      raiz.classList.toggle('claro', !escuro)
      // Alinha barras de rolagem e controles nativos ao tema escolhido: sem isso,
      // "claro" num sistema escuro devolve scrollbar preta numa página de papel.
      raiz.style.colorScheme = tema === 'auto' ? 'light dark' : tema === 'escuro' ? 'dark' : 'light'
    }

    aplicar()

    // Em 'auto', seguir o sistema quer dizer seguir também quando ele muda com
    // o app aberto (o agendamento noturno do iOS/Windows faz isso sozinho).
    if (tema !== 'auto') return
    const consulta = consultaEscuro()
    if (!consulta?.addEventListener) return
    consulta.addEventListener('change', aplicar)
    return () => consulta.removeEventListener('change', aplicar)
  }, [tema])

  return [tema, setTema] as const
}

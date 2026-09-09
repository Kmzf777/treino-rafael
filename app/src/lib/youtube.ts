/**
 * Loader singleton da IFrame API do YouTube.
 *
 * A API é global e só pode ser carregada uma vez por documento. Com o StrictMode
 * do React 19 todo efeito monta duas vezes em desenvolvimento, então a promessa
 * fica em escopo de módulo e o callback global anterior é ENCADEADO, nunca
 * sobrescrito — sobrescrever faz o segundo player nunca receber o aviso de pronto.
 */

declare global {
  interface Window {
    YT?: typeof YT
    onYouTubeIframeAPIReady?: () => void
  }
}

let promessa: Promise<typeof YT> | null = null

/** Em `file://` todo embed do YouTube devolve o erro 153. Nem vale tentar. */
export const ehFileProtocol = () =>
  typeof window !== 'undefined' && window.location.protocol === 'file:'

export function carregarApiYouTube(timeoutMs = 3000): Promise<typeof YT> {
  if (ehFileProtocol()) return Promise.reject(new Error('file-protocol'))
  if (promessa) return promessa

  promessa = new Promise<typeof YT>((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT)

    const anterior = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      anterior?.()
      resolve(window.YT as typeof YT)
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.onerror = () => reject(new Error('script-falhou'))
    document.head.appendChild(script)

    setTimeout(() => reject(new Error('timeout')), timeoutMs)
  })

  // Falhou (rede da academia, bloqueador, DNS): esquece o cache para que um
  // próximo toque possa tentar de novo.
  promessa.catch(() => {
    promessa = null
  })

  return promessa
}

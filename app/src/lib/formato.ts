export function mmss(segundos: number): string {
  const s = Math.max(0, Math.round(segundos))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function urlYouTube(video: string, inicio?: number): string {
  const base = `https://www.youtube.com/watch?v=${video}`
  return inicio == null ? base : `${base}&t=${Math.floor(inicio)}s`
}

export function urlBusca(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}

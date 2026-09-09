import path from 'node:path'

/**
 * Resolve um caminho pedido pelo cliente DENTRO da raiz servida, ou devolve
 * `null` se ele escapa.
 *
 * `path.join` já normaliza os `..`, então "/../package.json" cai fora sozinho.
 * O que não basta é comparar por prefixo puro: sem o separador, qualquer irmão
 * de `dist/` cujo nome comece igual — um `dist.bak/` de um build anterior, um
 * `dist-privado/` — passaria pela trava e seria servido.
 */
export function resolverDentro(raiz, pedido) {
  const arquivo = path.join(raiz, pedido)
  if (arquivo !== raiz && !arquivo.startsWith(raiz + path.sep)) return null
  return arquivo
}

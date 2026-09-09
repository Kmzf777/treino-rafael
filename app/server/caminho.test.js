import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolverDentro } from './caminho.js'

const RAIZ = path.join('C:', 'app', 'dist')

describe('trava de caminho do servidor', () => {
  it('serve o que está dentro da raiz', () => {
    expect(resolverDentro(RAIZ, '/index.html')).toBe(path.join(RAIZ, 'index.html'))
    expect(resolverDentro(RAIZ, '/assets/app.js')).toBe(path.join(RAIZ, 'assets', 'app.js'))
    // A própria raiz (que o servidor depois troca pelo index.html) não é escape.
    expect(resolverDentro(RAIZ, '/')).not.toBeNull()
  })

  it('barra a subida clássica de diretório', () => {
    expect(resolverDentro(RAIZ, '/../package.json')).toBeNull()
    expect(resolverDentro(RAIZ, '/../../.git/config')).toBeNull()
  })

  // O caso que o prefixo puro deixava passar: `dist.bak` "começa com" `dist`.
  it('não deixa escapar para um irmão que só começa igual', () => {
    expect(resolverDentro(RAIZ, '/../dist.bak/segredo.txt')).toBeNull()
    expect(resolverDentro(RAIZ, '/../dist-privado/segredo.txt')).toBeNull()
    expect(resolverDentro(RAIZ, '/../distx')).toBeNull()
  })
})

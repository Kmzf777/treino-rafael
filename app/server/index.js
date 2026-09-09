import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const PORTA = Number(process.env.PORT) || 5173

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
}

if (!existsSync(RAIZ)) {
  console.error('dist/ não existe. Rode "npm run build" primeiro.')
  process.exit(1)
}

createServer((req, res) => {
  const bruto = (req.url || '/').split('?')[0]
  let pedido
  try {
    pedido = decodeURIComponent(bruto)
  } catch {
    res.writeHead(400).end('Requisição inválida')
    return
  }

  let arquivo = path.join(RAIZ, pedido)

  if (!arquivo.startsWith(RAIZ)) {
    res.writeHead(403).end('Proibido')
    return
  }
  if (!existsSync(arquivo) || statSync(arquivo).isDirectory()) {
    arquivo = path.join(RAIZ, 'index.html')
  }

  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' })
  createReadStream(arquivo).pipe(res)
}).listen(PORTA, () => {
  console.log(`Protocolo de treino em http://localhost:${PORTA}`)
})

// Verifica se os vídeos do plano continuam no ar, batendo na oEmbed pública do YouTube.
//
// A fonte dos ids é `test/duracoes.json` na raiz do repositório, e não
// `src/data/duracoes.ts`, porque o Node não importa `.ts` diretamente. O conteúdo
// dos dois é idêntico — se um id for trocado em `plano.ts`/`duracoes.ts`, atualize
// também o JSON, senão esta verificação passa a olhar para o passado.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const CAMINHO = fileURLToPath(new URL('../../test/duracoes.json', import.meta.url))
const DURACOES = JSON.parse(readFileSync(CAMINHO, 'utf8'))

const ids = Object.keys(DURACOES)
let quebrados = 0

for (const id of ids) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
  try {
    const resposta = await fetch(url)
    if (!resposta.ok) {
      quebrados += 1
      console.log(`FORA DO AR  ${id}  (HTTP ${resposta.status})`)
    }
  } catch (erro) {
    quebrados += 1
    console.log(`ERRO DE REDE  ${id}  ${erro.message}`)
  }
}

console.log(`\n${ids.length - quebrados} de ${ids.length} vídeos no ar.`)
process.exit(quebrados > 0 ? 1 : 0)

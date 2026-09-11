// Verifica se os vídeos do plano continuam no ar, batendo na oEmbed pública do YouTube.
//
// A fonte dos ids é `test/duracoes.json` na raiz do repositório, e não
// `src/data/duracoes.ts`, porque o Node não importa `.ts` diretamente. Os dois
// precisam ser o mesmo dado, e este script confere isso antes de sair para a rede:
// se derivarem, ele falha aqui em vez de auditar em silêncio um conjunto de vídeos
// que o app não usa mais.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const CAMINHO = fileURLToPath(new URL('../../test/duracoes.json', import.meta.url))
const DURACOES = JSON.parse(readFileSync(CAMINHO, 'utf8'))

// O JSON e o .ts precisam ser o mesmo dado. Se derivarem, esta verificação passa a
// olhar para um conjunto de vídeos que o app não usa mais — falha silenciosa que já
// aconteceu uma vez.
const TS = fileURLToPath(new URL('../src/data/duracoes.ts', import.meta.url))
const texto = readFileSync(TS, 'utf8')
const doTs = JSON.parse(texto.slice(texto.indexOf('{'), texto.lastIndexOf('}') + 1))

const soNoJson = Object.keys(DURACOES).filter((id) => !(id in doTs))
const soNoTs = Object.keys(doTs).filter((id) => !(id in DURACOES))
const divergentes = Object.keys(DURACOES).filter((id) => id in doTs && doTs[id] !== DURACOES[id])

if (soNoJson.length || soNoTs.length || divergentes.length) {
  console.log('test/duracoes.json e src/data/duracoes.ts divergiram:')
  if (soNoJson.length) console.log(`  só no JSON: ${soNoJson.join(', ')}`)
  if (soNoTs.length) console.log(`  só no .ts:  ${soNoTs.join(', ')}`)
  if (divergentes.length) console.log(`  duração diferente: ${divergentes.join(', ')}`)
  process.exit(1)
}

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

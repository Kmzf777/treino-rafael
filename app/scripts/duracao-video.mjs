// Lê a duração de um vídeo do YouTube a partir do lengthSeconds embutido na página.
// Uso: node scripts/duracao-video.mjs VIDEO_ID [VIDEO_ID...]
const ids = process.argv.slice(2)

for (const id of ids) {
  const resposta = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: { 'accept-language': 'pt-BR,pt;q=0.9' },
  })
  if (!resposta.ok) {
    console.log(`${id}\tHTTP ${resposta.status}`)
    continue
  }
  const html = await resposta.text()
  const achado = html.match(/"lengthSeconds":"(\d+)"/)
  console.log(achado ? `${id}\t${achado[1]}` : `${id}\tNAO ENCONTRADO`)
}

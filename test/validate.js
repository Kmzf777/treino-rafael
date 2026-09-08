// Validação de invariantes do treino-rafael.html
// uso: node test/validate.js [app.html] [original.bak]
const fs = require('fs');

const APP = process.argv[2] || 'index.html';
const BAK = process.argv[3] || 'docs/original-antes-do-recorte.html';
const src = fs.readFileSync(APP, 'utf8');
const bak = fs.existsSync(BAK) ? fs.readFileSync(BAK, 'utf8') : null;

const falhas = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) falhas.push(msg); };

const BS = String.fromCharCode(92);

/* avalia o objeto DATA — mais confiável que regex, que já errou com
   nome entre aspas duplas (al-extensora) */
function carregarDATA(html) {
  const js = html.split('<script>')[1].split('</script>')[0];
  const ini = js.indexOf('const e = (');
  const ds = js.indexOf('const DATA');
  let d = js.indexOf('{', ds), dep = 0, q = null, end = -1;
  for (let k = d; k < js.length; k++) {
    const c = js[k];
    if (q) { if (c === BS) { k++; continue; } if (c === q) q = null; }
    else if (c === '"' || c === "'" || c === '`') q = c;
    else if ('([{'.includes(c)) dep++;
    else if (')]}'.includes(c)) { dep--; if (!dep) { end = k + 1; break; } }
  }
  if (end < 0) throw new Error('não achei o fim de DATA');
  const DATA = new Function(js.slice(ini, js.indexOf('\n', ini)) + '\nreturn ' + js.slice(d, end) + ';')();
  const ex = [], alt = [];
  for (const [aba, sec] of Object.entries(DATA))
    for (const b of (sec.blocos || []))
      for (const x of b.ex) {
        ex.push({ aba, ...x });
        for (const a of (x.alt || [])) alt.push({ dono: x.id, ...a });
      }
  return { ex, alt };
}

let dados;
try { dados = carregarDATA(src); }
catch (e) { console.log('FALHA FATAL: DATA não avalia — ' + e.message); process.exit(1); }
const { ex, alt } = dados;

/* ---- 1. Restrições do briefing ---- */
ok(!/\blocalStorage\b/.test(src), 'localStorage apareceu no arquivo');
ok(/window\.storage/.test(src), 'window.storage sumiu');
ok(/fisioterapeuta|médico/i.test(src), 'aviso de fisioterapeuta/médico sumiu');
const scripts = [...src.matchAll(/<script[^>]*\ssrc=["']([^"']+)["']/g)].map(m => m[1]);
ok(scripts.length === 0, `script externo no HTML: ${scripts.join(', ')}`);

/* ---- 2. Estrutura preservada ---- */
ok(ex.length === 47, `esperado 47 exercícios, achei ${ex.length}`);
ok(alt.length === 11, `esperado 11 alternativos, achei ${alt.length}`);
ok(ex.every(x => x.cues && x.cues.length),
   `exercício sem cues: ${ex.filter(x => !x.cues || !x.cues.length).map(x => x.id).join(', ')}`);
ok(ex.every(x => /^[A-Za-z0-9_-]{11}$/.test(x.video)),
   `videoId inválido: ${ex.filter(x => !/^[A-Za-z0-9_-]{11}$/.test(x.video)).map(x => x.id).join(', ')}`);

if (bak) {
  const antes = carregarDATA(bak);
  const cuesAntes = new Map(antes.ex.map(x => [x.id, x.cues.join('|')]));
  const mudou = ex.filter(x => cuesAntes.has(x.id) && cuesAntes.get(x.id) !== x.cues.join('|'));
  ok(mudou.length === 0, `cues alterados em: ${mudou.map(x => x.id).join(', ')}`);
  const sumiram = [...cuesAntes.keys()].filter(id => !ex.some(x => x.id === id));
  ok(sumiram.length === 0, `exercícios sumiram: ${sumiram.join(', ')}`);
} else {
  ok(false, `backup ${BAK} não encontrado, não dá para comparar cues`);
}

/* ---- 3. Coerência dos trechos ---- */
const durs = fs.existsSync('test/duracoes.json')
  ? JSON.parse(fs.readFileSync('test/duracoes.json', 'utf8')) : null;

const comT = ex.filter(x => x.t);
for (const x of comT) {
  const { start: s, end: e } = x.t;
  ok(Number.isInteger(s) && Number.isInteger(e), `${x.id}: start/end não são inteiros`);
  ok(s < e, `${x.id}: start ${s} >= end ${e}`);
  ok(e - s >= 8, `${x.id}: trecho de ${e - s}s é curto demais (mínimo 8s)`);
  ok(e - s <= 40, `${x.id}: trecho de ${e - s}s passa de 40s`);
  if (durs && durs[x.video] != null)
    ok(e <= durs[x.video], `${x.id}: end ${e}s passa da duração do vídeo (${durs[x.video]}s)`);
}
// regra real: vídeo longo obriga recorte; vídeo curto (≤45s) já é só execução
if (durs) {
  const devemTer = ex.filter(x => (durs[x.video] || 0) > 45);
  const semTrecho = devemTer.filter(x => !x.t);
  ok(semTrecho.length === 0,
     `exercício com vídeo longo e sem trecho: ${semTrecho.map(x => `${x.id}(${durs[x.video]}s)`).join(', ')}`);
  // recortar vídeo curto é legítimo (ex: b-lombar, 44s, troca de câmera aos 23s);
  // só é inútil se o trecho cobre o vídeo quase inteiro
  const inutil = comT.filter(x => durs[x.video] != null &&
                                  (x.t.end - x.t.start) >= 0.95 * durs[x.video]);
  ok(inutil.length === 0,
     `recorte cobre o vídeo inteiro, não serve para nada: ${inutil.map(x => x.id).join(', ')}`);
  ok(ex.every(x => durs[x.video] != null),
     `vídeo sem duração conhecida: ${ex.filter(x => durs[x.video] == null).map(x => x.id).join(', ')}`);
} else {
  ok(false, 'test/duracoes.json não encontrado');
}

// vídeo usado por mais de um exercício precisa de trechos diferentes
const porVideo = {};
comT.forEach(x => (porVideo[x.video] = porVideo[x.video] || []).push(x));
for (const [v, us] of Object.entries(porVideo)) {
  if (us.length < 2) continue;
  const janelas = new Set(us.map(x => `${x.t.start}-${x.t.end}`));
  const nomes = us.map(x => x.nome.toLowerCase());
  const mesmoExercicio = new Set(nomes.map(n => n.replace(/\(.*\)/, '').trim())).size === 1;
  ok(janelas.size > 1 || mesmoExercicio,
     `${v}: ${us.length} exercícios diferentes compartilham o mesmo trecho ${[...janelas][0]}`);
}

/* ---- 4. Player com recorte e loop ---- */
ok(/iframe_api/.test(src), 'IFrame Player API não foi incluída');
ok(/onStateChange/.test(src), 'loop por onStateChange ausente');
ok(/PlayerState\.ENDED/.test(src), 'tratamento de ENDED ausente');
ok(/getCurrentTime\(\)/.test(src), 'cão-de-guarda do fim do trecho ausente');
ok(/function\s+iframeSimples/.test(src), 'fallback de iframe simples ausente');
ok(/data-start=/.test(src), 'data-start não é publicado no DOM');
ok(/&t=\$\{t\}s|&t=/.test(src), 'link do YouTube não leva ao timestamp');

console.log(`${checks - falhas.length}/${checks} checagens passaram  ` +
            `(${ex.length} exercícios, ${comT.length} com trecho, ` +
            `${alt.filter(a => a.t).length}/${alt.length} alternativos com trecho)`);
if (falhas.length) { falhas.forEach(f => console.log('  FALHA: ' + f)); process.exit(1); }

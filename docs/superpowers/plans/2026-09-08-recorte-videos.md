# Recorte de vídeos no minuto certo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer cada exercício do app abrir num trecho de 12 a 40 segundos que mostra só a execução do movimento, em loop.

**Architecture:** Um pipeline de descoberta (capítulos → transcrição → mosaico de quadros verificado visualmente) produz um JSON de timestamps por exercício. Esse JSON é aplicado ao objeto `DATA` dentro do HTML como campo opcional `t:{start,end}`. O iframe simples vira IFrame Player API com loop no trecho, com fallback para iframe recortado se a API não carregar.

**Tech Stack:** HTML/CSS/JS de arquivo único sem build. Python 3.12 + `yt-dlp` + `ffmpeg` (via `imageio-ffmpeg`) para a descoberta. Node 22 para os testes de validação.

**Caminhos absolutos usados neste plano:**

- App: `C:\Users\rafae\OneDrive\Desktop\Canastra Inteligencia\Agentes AI\Treino Rafael\treino-rafael.html`
- Trabalho: `C:\Users\rafae\AppData\Local\Temp\claude\C--Users-rafae-OneDrive-Desktop-Canastra-Inteligencia-Agentes-AI-Treino-Rafael\eea6f273-1855-4ed6-8d64-876a69d518f1\scratchpad`

Neste plano o diretório de trabalho é referido como `$W`.

Já existem em `$W`, prontos: `meta.json` (duração/título/capítulos dos 46 IDs),
`inventario.json` (exercícios, alternativos, mapa vídeo→usos), `worklist.json`
(os 34 vídeos a analisar), `ids.txt`, `sheet.py` (protótipo do mosaico).

---

### Task 0: Rede de segurança

**Files:**
- Create: `treino-rafael.html.bak`
- Create: `.gitignore`

- [ ] **Step 1: Copiar o arquivo original**

```bash
cd "/c/Users/rafae/OneDrive/Desktop/Canastra Inteligencia/Agentes AI/Treino Rafael"
cp treino-rafael.html treino-rafael.html.bak
```

- [ ] **Step 2: Iniciar git para ter rollback real**

O diretório não é um repositório. Sem isso não há como desfazer 43 edições.

```bash
cd "/c/Users/rafae/OneDrive/Desktop/Canastra Inteligencia/Agentes AI/Treino Rafael"
printf '*.bak\nnode_modules/\n' > .gitignore
git init
git add -A
git commit -m "chore: estado inicial do app antes do recorte de vídeos"
```

Expected: `git log --oneline` mostra 1 commit.

---

### Task 1: Ferramenta de descoberta

Um CLI único que os agentes de descoberta chamam. Três subcomandos: `sheet`, `zoom`, `sub`.

**Files:**
- Create: `$W/tool.py`

- [ ] **Step 1: Escrever a ferramenta**

```python
# $W/tool.py
import subprocess, sys, os, json, glob, imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
PY = sys.executable
W  = os.path.dirname(os.path.abspath(__file__))

def _run(cmd, timeout=900):
    return subprocess.run(cmd, capture_output=True, text=True,
                          encoding='utf-8', errors='replace', timeout=timeout)

def stream_url(vid):
    r = _run([PY,'-m','yt_dlp','--no-warnings','--js-runtimes','node','-g','-f',
              'worstvideo[height>=240][ext=mp4]/worstvideo[ext=mp4]/worst[ext=mp4]/worst',
              f'https://youtu.be/{vid}'], timeout=240)
    if r.returncode != 0:
        raise SystemExit("ERRO url: " + (r.stderr or '')[-300:])
    return r.stdout.strip().splitlines()[0]

def montar(vid, ini, fim, passo, cols, out):
    u = stream_url(vid)
    dur = max(1, fim - ini)
    vf = (f"fps=1/{passo},scale=320:-2,"
          f"drawtext=fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6:"
          f"x=4:y=4:text='%{{eif\\:trunc({ini}+n*{passo})\\:d}}s',tile={cols}x{cols}")
    cmd = [FF,'-y','-loglevel','error','-ss',str(ini),'-i',u,'-t',str(dur),
           '-vf',vf,'-frames:v','1','-q:v','4',out]
    r = _run(cmd)
    if r.returncode != 0:
        raise SystemExit("ERRO ffmpeg: " + (r.stderr or '')[-400:])
    return out

def cmd_sheet(vid, dur):
    dur = int(dur)
    passo = max(1, round(dur/30))
    out = os.path.join(W,'sheets',f'{vid}_geral.jpg')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    montar(vid, 0, dur, passo, 6, out)
    print(out); print(f"passo={passo}s cobre 0..{dur}s")

def cmd_zoom(vid, ini, fim):
    ini, fim = int(ini), int(fim)
    out = os.path.join(W,'sheets',f'{vid}_{ini}_{fim}.jpg')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    passo = max(1, round((fim-ini)/25))
    montar(vid, ini, fim, passo, 5, out)
    print(out); print(f"passo={passo}s cobre {ini}..{fim}s")

def cmd_sub(vid):
    d = os.path.join(W,'subs'); os.makedirs(d, exist_ok=True)
    r = _run([PY,'-m','yt_dlp','--skip-download','--no-warnings','--js-runtimes','node',
              '--write-auto-sub','--sub-lang','pt','--convert-subs','vtt',
              '-o', os.path.join(d, vid), f'https://youtu.be/{vid}'], timeout=240)
    f = glob.glob(os.path.join(d, vid + '*.vtt'))
    if not f:
        print("SEM TRANSCRICAO"); return
    print(open(f[0], encoding='utf-8', errors='replace').read()[:20000])

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: raise SystemExit("uso: tool.py sheet VID DUR | zoom VID INI FIM | sub VID")
    {'sheet':cmd_sheet,'zoom':cmd_zoom,'sub':cmd_sub}[a[0]](*a[1:])
```

- [ ] **Step 2: Verificar que roda**

```bash
cd "$W" && PYTHONIOENCODING=utf-8 python tool.py sheet RTxAFDK1OMw 113
```

Expected: imprime o caminho de `sheets/RTxAFDK1OMw_geral.jpg` e `passo=4s cobre 0..113s`.

---

### Task 2: Descoberta dos 43 trechos

Fan-out de subagentes, **um agente por vídeo**, 34 agentes. Vídeo compartilhado por
vários exercícios é resolvido pelo mesmo agente, que devolve uma janela por uso.

**Files:**
- Create: `$W/achados/<videoId>.json` (um por vídeo)

- [ ] **Step 1: Instruções dadas a cada agente**

Cada agente recebe: `videoId`, duração, título, capítulos (se houver) e a lista de usos
(`ex` + nome do exercício). Roteiro:

1. Rodar `python tool.py sheet <VID> <DUR>` e **ler a imagem** com a ferramenta Read.
2. Mapear a estrutura: onde é vinheta, onde é fala, onde é execução, onde é encerramento.
3. Se precisar, `python tool.py sub <VID>` para confirmar onde a teoria termina.
4. Para cada uso, escolher a janela e rodar `python tool.py zoom <VID> <INI> <FIM>`
   com folga de alguns segundos, e ler a imagem para conferir os cinco critérios.
5. Escrever o JSON de saída.

- [ ] **Step 2: Formato de saída obrigatório**

```json
{
  "video": "RTxAFDK1OMw",
  "dur": 113,
  "usos": [
    {"ex":"c-prancha","start":38,"end":46,"conf":"alta",
     "porque":"prono sobre antebraços, sustentação limpa; fala volta em 48s"},
    {"ex":"a-prancha-lat","start":60,"end":92,"conf":"alta",
     "porque":"decúbito lateral em apoio; overlay do Instagram só aparece em 88s"}
  ],
  "substituir": false,
  "nota": ""
}
```

Se nenhum trecho servir: `"substituir": true` e `"usos": []`, com o motivo em `nota`.

- [ ] **Step 3: Regras que o agente não pode quebrar**

- `12 <= end-start <= 40`. Isométrico pode ter 12s desde que mostre 5s de sustentação.
- Não começar em quadro de pessoa falando para a câmera, vinheta ou banner.
- Não terminar dentro de uma repetição.
- `end <= dur`.
- Nunca inventar timestamp sem ter olhado a imagem.

- [ ] **Step 4: Consolidar**

```bash
cd "$W" && PYTHONIOENCODING=utf-8 python -c "
import json,glob
out={}
for f in glob.glob('achados/*.json'):
    d=json.load(open(f,encoding='utf-8'))
    for u in d.get('usos',[]): out[u['ex']]={'start':u['start'],'end':u['end'],'video':d['video'],'conf':u.get('conf'),'porque':u.get('porque')}
json.dump(out,open('timestamps.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('exercicios com t:',len(out))
"
```

Expected: `exercicios com t: 43` (menos os marcados para substituir).

---

### Task 3: Substituições

**Files:**
- Modify: `$W/timestamps.json`
- Create: `$W/substituicoes.json`

- [ ] **Step 1: Casos conhecidos**

- `b-lombar` — `kLcjscPyLqI` está fora do ar. Buscar "extensão lombar banco romano execução".
- `at-bike` — `nfT-wE0SjLk` é remo indoor, exercício errado. Buscar "aquecimento bike ergométrica" ou "esteira caminhada leve aquecimento".
- Mais qualquer vídeo que a Task 2 marcou `"substituir": true`.

- [ ] **Step 2: Validar cada candidato antes de aceitar**

```bash
cd "$W" && PYTHONIOENCODING=utf-8 python -m yt_dlp --skip-download --no-warnings \
  --js-runtimes node --print "%(duration)s | %(title)s" "https://youtu.be/NOVO_ID"
```

Expected: responde com duração e título, e o título corresponde ao exercício certo.

- [ ] **Step 3: Passar o substituto pelo pipeline da Task 2**

Mesmo roteiro: `sheet`, ler imagem, `zoom`, ler imagem, gravar `start`/`end`.

- [ ] **Step 4: Registrar**

```json
[{"ex":"b-lombar","de":"kLcjscPyLqI","para":"NOVO_ID","motivo":"fora do ar",
  "titulo":"...","start":0,"end":0}]
```

---

### Task 4: Teste de validação (escrever antes de tocar no HTML)

**Files:**
- Create: `test/validate.js`

- [ ] **Step 1: Escrever o teste**

Node puro, sem dependências. Extrai `DATA` do HTML e checa invariantes.

```js
// test/validate.js
const fs = require('fs');
const path = process.argv[2] || 'treino-rafael.html';
const src = fs.readFileSync(path, 'utf8');
let falhas = [], checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) falhas.push(msg); };

// 1. Invariantes que não podem ser quebradas
ok(!/localStorage/.test(src), 'localStorage apareceu no arquivo');
ok(/window\.storage/.test(src), 'window.storage sumiu');
ok(/fisioterapeuta|médico/i.test(src), 'aviso médico sumiu');
ok(!/<script[^>]+src=["'](?!https:\/\/www\.youtube\.com\/iframe_api)/.test(src),
   'dependência externa inesperada');

// 2. Contagens estruturais
const ex = src.match(/\be\('/g) || [];
ok(ex.length === 46, `esperado 46 exercícios, achei ${ex.length}`);
const cues = src.match(/^\s{10,}'/gm) || [];
ok(cues.length > 100, `cues parecem ter sumido (${cues.length})`);

// 3. Todo t precisa ser coerente
const ts = [...src.matchAll(/t:\s*\{start:\s*(\d+),\s*end:\s*(\d+)\}/g)];
const durs = JSON.parse(fs.readFileSync(process.argv[3] || 'meta.dur.json', 'utf8'));
for (const m of ts) {
  const s = +m[1], e = +m[2], d = e - s;
  ok(s < e, `start>=end em ${m[0]}`);
  ok(d >= 12 && d <= 40, `duração ${d}s fora de 12-40 em ${m[0]}`);
}
ok(ts.length >= 40, `poucos timestamps aplicados: ${ts.length}`);

// 4. Player
ok(/iframe_api/.test(src), 'IFrame API não foi incluída');
ok(/onStateChange/.test(src), 'loop por onStateChange ausente');
ok(/ENDED/.test(src), 'tratamento de ENDED ausente');
ok(/setInterval/.test(src), 'cão-de-guarda ausente');

console.log(`${checks - falhas.length}/${checks} checagens passaram`);
if (falhas.length) { falhas.forEach(f => console.log('  FALHA: ' + f)); process.exit(1); }
```

- [ ] **Step 2: Rodar contra o arquivo atual e ver falhar**

```bash
cd "/c/Users/rafae/OneDrive/Desktop/Canastra Inteligencia/Agentes AI/Treino Rafael"
node test/validate.js treino-rafael.html
```

Expected: FALHA — "poucos timestamps aplicados: 0", "IFrame API não foi incluída",
"loop por onStateChange ausente". Isso confirma que o teste mede a mudança.

- [ ] **Step 3: Commit**

```bash
git add test/validate.js && git commit -m "test: validação de invariantes do app"
```

---

### Task 5: Aplicar os timestamps ao DATA

**Files:**
- Modify: `treino-rafael.html` (bloco `const DATA`, linhas 260-553)
- Create: `$W/aplicar.py`

- [ ] **Step 1: Script de aplicação**

Edição por script, não à mão: são 43 pontos e erro de digitação é garantido.

```python
# $W/aplicar.py
import json, re, sys, io
APP = sys.argv[1]
ts  = json.load(open('timestamps.json', encoding='utf-8'))
src = open(APP, encoding='utf-8').read()
orig = src
aplicados, faltando = 0, []

for ex, t in ts.items():
    if ex.startswith('alt|'): continue
    # localiza o bloco do exercício: de e('<ex>' até o próximo e(' ou fim do bloco
    m = re.search(r"e\('" + re.escape(ex) + r"',", src)
    if not m: faltando.append(ex); continue
    ini = m.start()
    prox = re.search(r"\n\s*e\('", src[ini+3:])
    fim = ini + 3 + (prox.start() if prox else len(src) - ini - 3)
    bloco = src[ini:fim]
    if re.search(r"\bt:\s*\{", bloco): continue  # já tem
    novo_t = "{start:%d, end:%d}" % (t['start'], t['end'])
    if re.search(r"\{busca:", bloco):
        bloco2 = re.sub(r"\{busca:", "{t: %s, busca:" % novo_t, bloco, count=1)
    elif re.search(r"\{uni:\s*true", bloco):
        bloco2 = re.sub(r"\{uni:\s*true", "{uni:true, t: %s" % novo_t, bloco, count=1)
    else:
        # sem opts: fecha antes do parêntese final da chamada
        bloco2 = re.sub(r"\]\)\s*$", "], {t: %s})" % novo_t, bloco.rstrip()) + "\n"
    if bloco2 == bloco: faltando.append(ex); continue
    src = src[:ini] + bloco2 + src[fim:]
    aplicados += 1

open(APP, 'w', encoding='utf-8').write(src)
print("aplicados:", aplicados, "| faltando:", faltando)
```

- [ ] **Step 2: Rodar**

```bash
cd "$W" && PYTHONIOENCODING=utf-8 python aplicar.py "/c/Users/rafae/OneDrive/Desktop/Canastra Inteligencia/Agentes AI/Treino Rafael/treino-rafael.html"
```

Expected: `aplicados: 34+ | faltando: []`

- [ ] **Step 3: Conferir que o JS ainda parseia**

```bash
cd "/c/Users/rafae/OneDrive/Desktop/Canastra Inteligencia/Agentes AI/Treino Rafael"
node -e "
const s=require('fs').readFileSync('treino-rafael.html','utf8');
const js=s.split('<script>')[1].split('</script>')[0];
new Function(js.replace(/document\.|window\./g,'void 0&&\$&'));
console.log('JS parseia');
" 2>&1 | tail -3
```

Expected: sem SyntaxError. Se der erro de referência a `document`, é aceitável —
só SyntaxError reprova.

- [ ] **Step 4: Commit**

```bash
git add treino-rafael.html && git commit -m "feat: timestamps de execução por exercício"
```

---

### Task 6: Player com recorte e loop

**Files:**
- Modify: `treino-rafael.html:254` (helper `YT`)
- Modify: `treino-rafael.html:580-611` (`exHTML`)
- Modify: `treino-rafael.html:771-774` (handler de clique)

- [ ] **Step 1: `YT` aceita timestamp**

Trocar a linha 254:

```js
const YT = (id, t) => `https://www.youtube.com/watch?v=${id}${t?`&t=${t}s`:''}`;
```

- [ ] **Step 2: `exHTML` publica o trecho no DOM**

Na linha 594, trocar a abertura da div de vídeo:

```js
      <div class="video" data-video="${x.video}"${x.t?` data-start="${x.t.start}" data-end="${x.t.end}"`:''}>
```

Na linha 600, o link principal leva ao minuto certo:

```js
        <a href="${YT(x.video, x.t && x.t.start)}" target="_blank" rel="noopener">Abrir no YouTube</a>
```

Na linha 582, os alternativos também:

```js
  const alts = (x.alt||[]).map(a=>`<a href="${YT(a.v, a.t && a.t.start)}" target="_blank" rel="noopener">${esc(a.n)}</a>`).join('');
```

- [ ] **Step 3: Módulo do player**

Inserir antes do handler de clique (linha 751):

```js
/* ============================================================
   PLAYER COM RECORTE  (IFrame API, com fallback)
   ============================================================ */
let ytPronto = false, ytFalhou = false;
const players = [];

(function carregarAPI(){
  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  s.onerror = () => { ytFalhou = true; };
  document.head.appendChild(s);
  setTimeout(() => { if(!ytPronto) ytFalhou = true; }, 3000);
})();
window.onYouTubeIframeAPIReady = () => { ytPronto = true; };

function pausarOutros(atual){
  players.forEach(p => {
    if(p !== atual && p && typeof p.pauseVideo === 'function'){
      try{ p.pauseVideo(); }catch(_){}
    }
  });
}

function iframeSimples(el, id, ini, fim){
  const q = ['rel=0','modestbranding=1','playsinline=1','autoplay=1'];
  if(ini != null) q.push('start=' + ini);
  if(fim != null) q.push('end=' + fim);
  el.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?${q.join('&')}" allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture" allowfullscreen title="Execução do exercício"></iframe>`;
}

function criarPlayer(el, id, ini, fim){
  const host = document.createElement('div');
  el.innerHTML = ''; el.appendChild(host);
  const vars = {rel:0, modestbranding:1, playsinline:1, autoplay:1};
  if(ini != null) vars.start = ini;
  if(fim != null) vars.end   = fim;
  const p = new YT.Player(host, {
    videoId: id, playerVars: vars,
    events: {
      onReady: ev => { pausarOutros(p); try{ ev.target.playVideo(); }catch(_){} },
      onStateChange: ev => {
        if(ev.data === YT.PlayerState.ENDED && ini != null){
          try{ ev.target.seekTo(ini, true); ev.target.playVideo(); }catch(_){}
        }
      },
      onError: () => iframeSimples(el, id, ini, fim)
    }
  });
  players.push(p);
  if(ini != null && fim != null){
    setInterval(() => {
      try{
        if(typeof p.getCurrentTime !== 'function') return;
        if(p.getCurrentTime() >= fim + 0.4){ p.seekTo(ini, true); p.playVideo(); }
      }catch(_){}
    }, 500);
  }
}

function abrirVideo(el){
  const id  = el.dataset.video;
  const ini = el.dataset.start ? +el.dataset.start : null;
  const fim = el.dataset.end   ? +el.dataset.end   : null;
  if(ytPronto && window.YT && window.YT.Player) return criarPlayer(el, id, ini, fim);
  if(ytFalhou) return iframeSimples(el, id, ini, fim);
  const t0 = Date.now();
  const iv = setInterval(() => {
    if(ytPronto && window.YT && window.YT.Player){ clearInterval(iv); criarPlayer(el, id, ini, fim); }
    else if(ytFalhou || Date.now() - t0 > 3000){ clearInterval(iv); iframeSimples(el, id, ini, fim); }
  }, 100);
}
```

- [ ] **Step 4: Handler de clique usa o módulo**

Trocar as linhas 771-774 por:

```js
  if(vid && !vid.dataset.on){
    vid.dataset.on = '1';
    abrirVideo(vid);
    return;
  }
```

- [ ] **Step 5: Rodar a validação**

```bash
cd "/c/Users/rafae/OneDrive/Desktop/Canastra Inteligencia/Agentes AI/Treino Rafael"
node test/validate.js treino-rafael.html
```

Expected: todas as checagens passam, saída `N/N checagens passaram`.

- [ ] **Step 6: Commit**

```bash
git add treino-rafael.html && git commit -m "feat: player com recorte e loop no trecho de execução"
```

---

### Task 7: Verificação final

**Files:**
- Create: `$W/relatorio.md`

- [ ] **Step 1: Nenhum cue perdido**

```bash
cd "/c/Users/rafae/OneDrive/Desktop/Canastra Inteligencia/Agentes AI/Treino Rafael"
diff <(grep -o "'[A-ZÀ-Ú][^']\{25,\}'" treino-rafael.html.bak | sort) \
     <(grep -o "'[A-ZÀ-Ú][^']\{25,\}'" treino-rafael.html | sort) | head -20
```

Expected: só linhas novas (`>`), nenhuma removida (`<`) entre os cues.

- [ ] **Step 2: Todos os IDs finais respondem**

```bash
cd "$W" && PYTHONIOENCODING=utf-8 python -c "
import re,subprocess,sys,json
src=open(r'C:\Users\rafae\OneDrive\Desktop\Canastra Inteligencia\Agentes AI\Treino Rafael\treino-rafael.html',encoding='utf-8').read()
ids=sorted(set(re.findall(r\"'([A-Za-z0-9_-]{11})'\",src)))
print(len(ids),'ids')
" </dev/null
```

Depois rodar `meta.py` novamente sobre a lista e conferir zero erros.

- [ ] **Step 3: Abrir no navegador e conferir na mão**

Abrir `treino-rafael.html` e testar um exercício de cada aba: Aquecer, Força A,
Força B, Força A', Circuito. Conferir que o vídeo começa na execução e volta ao
início ao terminar.

- [ ] **Step 4: Escrever o relatório**

Tabela final: exercício, vídeo, `start`–`end`, confiança, e a lista de pendências
(inclusive o vídeo de corrida, que ficou fora de escopo).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "docs: relatório do recorte de vídeos"
```

---

## Self-Review

**Cobertura do spec:** triagem → Task 2; modelo de dados → Task 5; player com três
camadas e fallback → Task 6; descoberta em quatro passos → Tasks 1 e 2; substituições
→ Task 3; critérios de aceite → Task 2 Step 3; verificação → Tasks 4 e 7; restrições
preservadas → Task 4 Step 1 e Task 7 Step 1. Fora de escopo (vídeo de corrida) está
registrado na Task 7 Step 4.

**Placeholders:** nenhum. Todo passo que muda código mostra o código.

**Consistência de nomes:** `abrirVideo`, `criarPlayer`, `iframeSimples`, `pausarOutros`,
`ytPronto`, `ytFalhou`, `players` — usados igual nas Tasks 6 Steps 3 e 4. O campo é
`t:{start,end}` no DATA e vira `data-start`/`data-end` no DOM, lido como `ini`/`fim`
no JS. `timestamps.json` é escrito na Task 2 Step 4 e lido na Task 5 Step 1.

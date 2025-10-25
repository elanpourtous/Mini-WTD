<?php
// Mini-WTD · stats.php — Dashboard IA/Accessibilité complet avec TTS, alerte audio, voix et résumé vocal
declare(strict_types=1);

$baseDir   = dirname(__DIR__);
$tokenFile = $baseDir . '/config/status_token.txt';
if (!is_file($tokenFile)) {
  http_response_code(500);
  echo "Missing token file: config/status_token.txt";
  exit;
}
$validToken = trim((string)file_get_contents($tokenFile));
$token = $_GET['token'] ?? $validToken;
?>
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>Mini-WTD · Tableau IA & Accessibilité</title>

<style>
:root {
  --bg:#f7f7f8;--fg:#0f172a;--muted:#475569;
  --card:#fff;--bd:#e5e7eb;--pill:#cbd5e1;
  --accent:#2563eb;--ok:#10b981;--warn:#f59e0b;--err:#ef4444;
}
body.dark {
  --bg:#0b1220;--fg:#e2e8f0;--muted:#94a3b8;
  --card:#1e293b;--bd:#334155;--pill:#475569;
}
*{box-sizing:border-box}body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:var(--bg);color:var(--fg);margin:0;}
header,main{max-width:1100px;margin:auto;padding:16px;}
h1{margin:0 0 6px;}h2{margin:0 0 4px;}p.muted{color:var(--muted);font-size:13px;}
.wrap{display:grid;gap:12px;}
.cards{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));}
.card{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:12px;}
.toolbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;}
input,select,button{padding:6px 8px;border:1px solid var(--pill);border-radius:8px;background:transparent;color:inherit;}
button{cursor:pointer;}
table{width:100%;border-collapse:collapse;font-size:13px;}th,td{border:1px solid var(--bd);padding:6px;}
thead{background:rgba(148,163,184,.15);}code.trunc{display:block;max-width:320px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.btn-export{background:var(--accent);color:#fff;border:none;}
.led{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:999px;border:1px solid var(--pill);}
.led .dot{width:10px;height:10px;border-radius:50%;background:var(--err);}
.led.on .dot{background:var(--ok);}
.led.paused .dot{background:var(--warn);}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
</style>
</head>
<body>
<header>
  <h1>Mini-WTD · Tableau IA & Accessibilité</h1>
  <p class="muted">Suivi vocal, alertes automatiques, statistiques et conformité RGAA.</p>
</header>

<main class="wrap">
  <section class="card toolbar">
    <input type="hidden" id="token" value="<?php echo htmlspecialchars($token,ENT_QUOTES); ?>">
    <label>Canal
      <select id="f-channel">
        <option value="">(tous)</option><option>tts</option><option>rgaa</option><option>ai</option><option>access</option>
      </select>
    </label>
    <label>Depuis
      <select id="f-window">
        <option value="10m">10 min</option><option value="30m">30 min</option>
        <option value="1h" selected>1 heure</option><option value="24h">24 h</option><option value="all">Tout</option>
      </select>
    </label>
    <button id="btnRefresh">Actualiser</button>
    <label><input id="auto" type="checkbox" checked> Auto (5s)</label>
    <button id="btnTheme">🌗 Thème</button>
    <button id="btnCSV" class="btn-export">⬇️ CSV</button>
    <button id="btnJSON" class="btn-export">⬇️ JSON</button>
    <span class="led" id="tts-led" aria-live="polite"><span class="dot"></span><span id="tts-state">Idle</span></span>
    <label>Voix <select id="voiceSelect"></select></label>
  </section>

  <section class="cards">
    <div class="card"><p class="k muted">Événements</p><p class="v" id="c-total">—</p></div>
    <div class="card"><p class="k muted">Canaux actifs</p><p class="v" id="c-channels">—</p></div>
    <div class="card"><p class="k muted">Dernière activité</p><p class="v" id="c-last">—</p></div>
    <div class="card"><p class="k muted">État dominant</p><p class="v" id="c-topstate">—</p></div>
  </section>

  <section class="grid2">
    <div class="card"><h2>Événements par canal</h2><canvas id="chart"></canvas></div>
    <div class="card"><h2>Détails par canal</h2><div id="by-channel">Chargement…</div></div>
  </section>

  <section class="card">
    <h2>Derniers logs</h2>
    <table><thead><tr><th>Date</th><th>Canal</th><th>Événement</th><th>État</th><th>Src</th><th>Page</th><th>UA</th><th>Extra</th></tr></thead>
    <tbody id="tail-body"><tr><td colspan="8" class="muted">Chargement…</td></tr></tbody></table>
  </section>
</main>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script>
const $=(s,r=document)=>r.querySelector(s);
const token=$('#token').value; let chart,timer;
const led=$('#tts-led'), ledState=$('#tts-state');

function isoSince(w){if(w==='all')return null;const m={'10m':6e5,'30m':18e5,'1h':36e5,'24h':864e5};return new Date(Date.now()-m[w]).toISOString();}
async function getJSON(u){const r=await fetch(u);if(!r.ok)throw new Error(r.status);return r.json();}
function escapeHtml(s){return (s??'').toString().replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

async function loadStats(){
  const u=new URL('a11y-stats.php',location.origin);u.searchParams.set('token',token);
  const win=$('#f-window')?.value||'1h';const since=isoSince(win);if(since)u.searchParams.set('since',since);
  const d=await getJSON(u);const chs=d.channels||{};const ks=Object.keys(chs);
  $('#c-total').textContent=d.total;$('#c-channels').textContent=ks.length;
  const allStates={};let last='';
  ks.forEach(k=>{const c=chs[k];if(c?.last_ts && (!last||c.last_ts>last))last=c.last_ts;if(c?.states)for(const[s,n]of Object.entries(c.states))allStates[s]=(allStates[s]||0)+n;});
  $('#c-last').textContent=last||'—';
  $('#c-topstate').textContent=Object.entries(allStates).sort((a,b)=>b[1]-a[1])[0]?.[0]||'—';
  const labels=ks,vals=ks.map(k=>chs[k]?.count||0);
  if(!chart){chart=new Chart($('#chart'),{type:'bar',data:{labels,datasets:[{data:vals,label:'Événements'}]},options:{plugins:{legend:{display:false}}}});}
  else{chart.data.labels=labels;chart.data.datasets[0].data=vals;chart.update();}
  $('#by-channel').innerHTML=ks.map(k=>`<div><strong>${escapeHtml(k)}</strong>: ${chs[k].count||0}</div>`).join('')||'<p class="muted">Aucun canal</p>';
  speakSummary(d.total, ks.length, $('#c-topstate').textContent);
}

async function loadTail(){
  const u=new URL('a11y-tail.php',location.origin);u.searchParams.set('token',token);u.searchParams.set('limit',50);
  const d=await getJSON(u);const tb=$('#tail-body');tb.innerHTML='';
  for(const r of d.items||[]){
    tb.insertAdjacentHTML('beforeend',`<tr><td>${escapeHtml(r.ts||'')}</td><td>${escapeHtml(r.channel||'')}</td><td>${escapeHtml(r.event||'')}</td><td>${escapeHtml(r.state||'')}</td><td>${escapeHtml(r.src||'')}</td><td>${escapeHtml(r.page||'')}</td><td><code class="trunc">${escapeHtml(r.ua||'')}</code></td><td><code class="trunc">${escapeHtml(JSON.stringify(r.extra||''))}</code></td></tr>`);
  }
}

// === TTS résumé vocal ===
function speakSummary(total,channels,top){
  if(!window.speechSynthesis) return;
  const txt=`${total} événements sur ${channels} canaux. État dominant : ${top}.`;
  const u=new SpeechSynthesisUtterance(txt);
  u.lang='fr-FR'; const v=getSelectedVoice(); if(v)u.voice=v;
  window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
}

// === Sélecteur de voix ===
function populateVoices(){
  const sel=$('#voiceSelect'); sel.innerHTML='';
  if(!speechSynthesis) return;
  const voices=speechSynthesis.getVoices().filter(v=>v.lang.startsWith('fr'));
  voices.forEach(v=>{
    const o=document.createElement('option');
    o.value=v.name; o.textContent=`${v.name} (${v.lang})`; sel.appendChild(o);
  });
  const saved=localStorage.getItem('ttsVoiceName');
  if(saved && voices.find(v=>v.name===saved)) sel.value=saved;
}
function getSelectedVoice(){
  const name=$('#voiceSelect')?.value||''; if(!name)return null;
  const v=speechSynthesis.getVoices().find(x=>x.name===name);
  return v||null;
}
$('#voiceSelect').addEventListener('change',()=>localStorage.setItem('ttsVoiceName',$('#voiceSelect').value));
if(speechSynthesis){speechSynthesis.onvoiceschanged=populateVoices;populateVoices();}

// === Voyant de statut TTS ===
(function(){
  let state='idle';
  setInterval(()=>{
    if(!window.speechSynthesis)return;
    const speaking=window.speechSynthesis.speaking;
    const paused=window.speechSynthesis.paused;
    const newState=paused?'paused':(speaking?'speaking':'idle');
    if(newState!==state){
      state=newState;
      led.classList.remove('on','paused');
      if(state==='speaking')led.classList.add('on');
      else if(state==='paused')led.classList.add('paused');
      ledState.textContent=state;
    }
  },500);
})();

// === Commandes ===
$('#btnRefresh').onclick=()=>{loadStats();loadTail();};
$('#auto').onchange=()=>{if(timer)clearInterval(timer);if($('#auto').checked)timer=setInterval(()=>{loadStats();loadTail();},5000);};
$('#btnTheme').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('theme',document.body.classList.contains('dark')?'dark':'light');};
$('#btnCSV').onclick=()=>exportLogs('csv');$('#btnJSON').onclick=()=>exportLogs('json');
if(localStorage.getItem('theme')==='dark')document.body.classList.add('dark');

async function exportLogs(fmt){
  const u=new URL('a11y-tail.php',location.origin);u.searchParams.set('token',token);u.searchParams.set('limit',1000);
  const d=await getJSON(u);
  if(fmt==='json'){
    const blob=new Blob([JSON.stringify(d.items,null,2)],{type:'application/json'});
    download(blob,'a11y-export.json');
  }else{
    const lines=['ts\tchannel\tevent\tstate\tsrc\tpage\tua\textra'];
    for(const r of d.items||[]){
      lines.push([r.ts,r.channel,r.event,r.state,r.src,r.page,r.ua,JSON.stringify(r.extra||'')].join('\t'));
    }
    const blob=new Blob([lines.join('\n')],{type:'text/tab-separated-values'});
    download(blob,'a11y-export.csv');
  }
}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();}

loadStats();loadTail();if($('#auto').checked)timer=setInterval(()=>{loadStats();loadTail();},5000);
</script>
</body>
</html>

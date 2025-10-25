<?php
// Mini-WTD · status.php — État en direct + test TTS + alerte audio (RGAA)
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
<title>Mini-WTD · État & Test TTS</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<style>
:root{--bg:#f7f7f8;--fg:#0f172a;--muted:#475569;--card:#fff;--bd:#e5e7eb;--pill:#cbd5e1;--ok:#10b981;--warn:#f59e0b;--err:#ef4444;--accent:#2563eb;}
body.dark{--bg:#0b1220;--fg:#e2e8f0;--muted:#94a3b8;--card:#0f172a;--bd:#263043;--pill:#394a66;}
*{box-sizing:border-box} body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:var(--bg);color:var(--fg);}
header,main{max-width:960px;margin:auto;padding:16px;}
h1{margin:0 0 6px;} .muted{color:var(--muted)}
.card{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:12px;margin:12px 0;}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.row>*{flex:1 1 auto}
label{display:block;margin:.4rem 0 .2rem}
textarea,input,select,button{width:100%;max-width:100%;padding:8px;border:1px solid var(--pill);border-radius:8px;background:transparent;color:inherit}
button{cursor:pointer}
.btn-primary{background:var(--accent);border:none;color:#fff}
.led{display:inline-flex;align-items:center;gap:6px;padding:2px 8px;border:1px solid var(--pill);border-radius:999px}
.led .dot{width:10px;height:10px;border-radius:50%;background:var(--err)}
.led.on .dot{background:var(--ok)} .led.paused .dot{background:var(--warn)}
.log{font-family:ui-monospace,Consolas,monospace;font-size:12px;max-height:220px;overflow:auto;background:rgba(148,163,184,.08);padding:8px;border-radius:8px;border:1px solid var(--bd)}
.kbd{padding:1px 4px;border:1px solid var(--pill);border-radius:4px;background:transparent}
.small{font-size:12px}
.toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
label.inline{display:inline-flex;gap:6px;align-items:center;margin:0}
</style>
</head>
<body>
<header>
  <h1>Mini-WTD · État & Test TTS</h1>
  <p class="muted">Lecture vocale accessible, voyant d’état, alertes automatiques, conforme RGAA.</p>
</header>

<main aria-live="polite">
  <section class="card toolbar">
    <input type="hidden" id="token" value="<?php echo htmlspecialchars($token,ENT_QUOTES); ?>">
    <label class="inline"><input id="alertAudio" type="checkbox" checked> Alerte audio</label>
    <label class="inline">Mode
      <select id="alertMode">
        <option value="voice" selected>Voix</option>
        <option value="beep">Bip</option>
      </select>
    </label>
    <label class="inline">Volume
      <input id="alertVol" type="range" min="0" max="1" step="0.05" value="0.8" style="width:140px">
    </label>
    <span id="tts-led" class="led" role="status" aria-atomic="true" title="Statut synthèse">
      <span class="dot" aria-hidden="true"></span>
      <span id="tts-led-txt">🔴 Inactive</span>
    </span>
  </section>

  <section class="card" aria-labelledby="h-tts">
    <h2 id="h-tts">Test rapide — Lecture vocale (TTS)</h2>
    <label for="ttsText">Texte à lire</label>
    <textarea id="ttsText" rows="4">Bonjour ! Ceci est un test rapide de la synthèse vocale accessible Mini-WTD.</textarea>

    <div class="row" role="group" aria-label="Paramètres de lecture">
      <label>Voix
        <select id="voiceSelect" aria-label="Sélection de la voix"></select>
      </label>
      <label>Vitesse <span id="rateVal" aria-live="polite" class="small">1.0×</span>
        <input id="ttsRate" type="range" min="0.5" max="2" step="0.1" value="1.0" aria-label="Vitesse de lecture">
      </label>
    </div>

    <div class="row" role="group" aria-label="Contrôles de lecture">
      <button class="btn-primary" id="btnSpeak" type="button">🔊 Lire</button>
      <button id="btnPause"  type="button">⏸️ Pause</button>
      <button id="btnResume" type="button">▶️ Reprendre</button>
      <button id="btnStop"   type="button">🔇 Couper</button>
    </div>

    <p class="small muted">Astuce : <span class="kbd">Ctrl</span> + <span class="kbd">Entrée</span> pour lancer la lecture.</p>
  </section>

  <section class="card" aria-labelledby="h-log">
    <h2 id="h-log">Journal</h2>
    <div id="log" class="log" role="status" aria-live="polite">Prêt.</div>
  </section>
</main>

<script>
const TOKEN = <?php echo json_encode($token, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE); ?>;

const $ = (s,r=document)=>r.querySelector(s);
const logBox = $('#log'); function log(m){const t=new Date().toLocaleTimeString();logBox.innerText+=`\\n[${t}] ${m}`;logBox.scrollTop=logBox.scrollHeight;}

const ttsText = $('#ttsText'), rate = $('#ttsRate'), rateVal = $('#rateVal');
const voiceSelect = $('#voiceSelect');
const led = $('#tts-led'), ledTxt = $('#tts-led-txt');

function setLed(state){
  led.classList.remove('on','paused');
  if(state==='speaking'){ led.classList.add('on'); ledTxt.textContent='🟢 Active'; }
  else if(state==='paused'){ led.classList.add('paused'); ledTxt.textContent='🟡 En pause'; }
  else { ledTxt.textContent='🔴 Inactive'; }
}

// === Synthèse vocale (TTS) ===
function populateVoices(){
  if(!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML='';
  const fr = voices.filter(v=> (v.lang||'').toLowerCase().startsWith('fr'));
  (fr.length?fr:voices).forEach(v=>{
    const o=document.createElement('option');
    o.value=v.name; o.textContent=`${v.name} (${v.lang})`; voiceSelect.appendChild(o);
  });
  const saved=localStorage.getItem('ttsVoiceName');
  if(saved && [...voiceSelect.options].some(o=>o.value===saved)) voiceSelect.value=saved;
}
if('speechSynthesis' in window){ speechSynthesis.onvoiceschanged=populateVoices; populateVoices(); }

rate.addEventListener('input', ()=>{ rateVal.textContent = `${parseFloat(rate.value).toFixed(1)}×`; localStorage.setItem('ttsRate',rate.value); });
document.addEventListener('keydown',(e)=>{ if(e.ctrlKey && e.key==='Enter'){ e.preventDefault(); speakText(ttsText.value); }});
voiceSelect.addEventListener('change',()=> localStorage.setItem('ttsVoiceName', voiceSelect.value));

function getSelectedVoice(){
  const name = voiceSelect.value||localStorage.getItem('ttsVoiceName')||'';
  const vs = speechSynthesis.getVoices();
  return vs.find(v=>v.name===name) || vs.find(v=> (v.lang||'').toLowerCase().startsWith('fr')) || vs[0] || null;
}

function speakText(txt){
  if(!('speechSynthesis' in window)){ log('❌ TTS non supporté.'); return; }
  const u = new SpeechSynthesisUtterance(txt||'');
  u.rate = Math.min(2, Math.max(0.5, parseFloat(localStorage.getItem('ttsRate')||rate.value||'1')));
  const v = getSelectedVoice(); if(v) u.voice=v; u.lang=(v?.lang)||'fr-FR';

  u.onstart = ()=>{ setLed('speaking'); log('▶️ Lecture démarrée'); sendEvent('tts_state','speaking','tts','status'); };
  u.onpause = ()=>{ setLed('paused');   log('⏸️ Lecture en pause'); sendEvent('tts_state','paused','tts','status'); };
  u.onresume= ()=>{ setLed('speaking'); log('▶️ Lecture reprise');  sendEvent('tts_state','speaking','tts','status'); };
  u.onend   = ()=>{ setLed('idle');     log('⏹️ Lecture terminée'); sendEvent('tts_state','idle','tts','status'); };
  u.onerror = ()=>{ setLed('idle');     log('⚠️ Erreur lecture');   sendEvent('tts_state','error','tts','status'); };

  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

$('#btnSpeak').onclick = ()=> speakText(ttsText.value);
$('#btnPause').onclick = ()=> { if(speechSynthesis.speaking){ speechSynthesis.pause(); } };
$('#btnResume').onclick= ()=> { if(speechSynthesis.paused){ speechSynthesis.resume(); } };
$('#btnStop').onclick  = ()=> { if('speechSynthesis' in window){ speechSynthesis.cancel(); setLed('idle'); sendEvent('tts_state','idle','tts','status'); } };

// === Envoi d’événements vers a11y-log.php ===
async function sendEvent(event, state, channel='generic', page='status'){
  try{
    const body = new URLSearchParams({ token:TOKEN, event, state, channel, src:'ui', page, ts:new Date().toISOString() });
    const r = await fetch('a11y-log.php', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body });
    if(!r.ok) throw new Error('HTTP '+r.status);
  }catch(e){ /* silence en démo */ }
}

// === Alerte audio "speaking trop long" (via a11y-tail.php) ===
(function(){
  const tokenEl = document.getElementById('token');
  if (!tokenEl) return;

  const elOn   = document.getElementById('alertAudio');
  const elMode = document.getElementById('alertMode');
  const elVol  = document.getElementById('alertVol');

  const LS={on:'alert_on',mode:'alert_mode',vol:'alert_vol'};
  if (elOn)   elOn.checked = (localStorage.getItem(LS.on) ?? '1') === '1';
  if (elMode) elMode.value = localStorage.getItem(LS.mode) || 'voice';
  if (elVol)  elVol.value  = localStorage.getItem(LS.vol)  || '0.8';
  elOn?.addEventListener('change', ()=> localStorage.setItem(LS.on, elOn.checked?'1':'0'));
  elMode?.addEventListener('change', ()=> localStorage.setItem(LS.mode, elMode.value));
  elVol?.addEventListener('change', ()=> localStorage.setItem(LS.vol,  elVol.value));

  async function playBeep(vol=0.8){
    try{
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const dur=0.45;
      for(let i=0;i<3;i++){
        const o=ctx.createOscillator(), g=ctx.createGain();
        o.type='sine'; o.frequency.value=880; g.gain.value=vol;
        o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime+dur);
        await new Promise(r=>setTimeout(r,(dur+0.15)*1000));
      }
      ctx.close?.();
    }catch(e){ console.warn('Beep error',e); }
  }
  function speakAlert(text, vol=0.8){
    if(!('speechSynthesis' in window)) return playBeep(vol);
    const u=new SpeechSynthesisUtterance(text);
    u.lang='fr-FR'; u.rate=1.0; u.volume=Math.max(0,Math.min(1,vol));
    const wanted=localStorage.getItem('ttsVoiceName')||'';
    const vs=speechSynthesis.getVoices();
    const voice=vs.find(v=>v.name===wanted)||vs.find(v=>v.lang?.toLowerCase().startsWith('fr'))||vs[0];
    if(voice) u.voice=voice;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }

  let lastAlertTs=''; let lastHash='';
  const INTERVAL_MS=3000;

  async function pollAlert(){
    try{
      if(!elOn?.checked) return;
      const u=new URL('a11y-tail.php', location.origin);
      u.searchParams.set('token', tokenEl.value);
      u.searchParams.set('since', 'lines:200');
      u.searchParams.set('limit', '50');

      const r=await fetch(u, { headers:{'Accept':'application/json'} });
      if(!r.ok) throw new Error('HTTP '+r.status);
      const data=await r.json(); const items=data.items||[];

      for(let i=items.length-1;i>=0;i--){
        const raw=(items[i]._raw||'')+'';
        if(raw.includes('ALERTE\tTTS')){
          const ts=items[i].ts||''; const h=raw.slice(-64);
          if(ts!==lastAlertTs || h!==lastHash){
            lastAlertTs=ts; lastHash=h;
            const mode=elMode?.value||'voice';
            const vol =parseFloat(elVol?.value||'0.8');
            if(mode==='beep') playBeep(vol);
            else speakAlert("Attention : la lecture vocale est active depuis trop longtemps.", vol);
          }
          break;
        }
      }
    }catch{/* silencieux */}
  }
  pollAlert();
  setInterval(pollAlert, INTERVAL_MS);
})();

// === Voyant lié à l’API Web Speech (local) pour confort utilisateur ===
(function(){
  let state='idle';
  setInterval(()=>{
    if(!window.speechSynthesis) return;
    const speaking=window.speechSynthesis.speaking;
    const paused=window.speechSynthesis.paused;
    const newState=paused?'paused':(speaking?'speaking':'idle');
    if(newState!==state){
      state=newState; setLed(state);
    }
  },500);
})();

// === Thème auto sombre si préférence OS ===
if(window.matchMedia?.('(prefers-color-scheme: dark)').matches) document.body.classList.add('dark');
</script>
</body>
</html>

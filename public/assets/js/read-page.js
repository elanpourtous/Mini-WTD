// Mini-WTD — Lecture de page (TTS global) avec vitesse sélectionnable
(() => {
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  if (!synth) { console.warn('TTS non supporté'); return; }

  const $ = (s, ctx=document)=>ctx.querySelector(s);
  const btnStart  = $('#readPageStart');
  const btnPause  = $('#readPagePause');
  const btnResume = $('#readPageResume');
  const btnStop   = $('#readPageStop');
  const speedSel  = $('#readSpeed');

  if (!btnStart || !btnPause || !btnResume || !btnStop || !speedSel) return;

  const key = (k) => 'miniwtd_tts_' + k;
  const getPref = (k, def) => localStorage.getItem(key(k)) ?? def;

  let utter = null;
  let voices = [];
  const loadVoices = () => { voices = synth.getVoices(); };
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;

  function chooseVoice() {
    const idx = +getPref('voiceIndex', 0);
    return voices[idx] || null;
  }

  const setState = (s) => {
    btnStart.disabled  = s !== 'idle';
    btnPause.disabled  = s !== 'speaking';
    btnResume.disabled = s !== 'paused';
    btnStop.disabled   = s === 'idle';
  };

  function getPageText() {
    const main = $('#main') || $('main') || document.body;
    return (main.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function start() {
    try { synth.cancel(); } catch {}
    const text = getPageText();
    if (!text) { alert('Aucun contenu à lire.'); return; }

    const voice = chooseVoice();
    const rate  = parseFloat(speedSel.value || getPref('rate', '1'));
    const pitch = parseFloat(getPref('pitch', '1'));
    const vol   = parseFloat(getPref('volume', '1'));

    utter = new SpeechSynthesisUtterance(text);
    if (voice) utter.voice = voice;
    utter.rate = rate; utter.pitch = pitch; utter.volume = vol;

    utter.onstart = () => setState('speaking');
    utter.onpause = () => setState('paused');
    utter.onresume= () => setState('speaking');
    utter.onend   = () => setState('idle');
    utter.onerror = () => setState('idle');

    synth.speak(utter);
    localStorage.setItem(key('rate'), rate); // persiste la vitesse
  }

  const pause  = () => { if (synth.speaking && !synth.paused) synth.pause(); };
  const resume = () => { if (synth.paused) synth.resume(); };
  const stop   = () => { try { synth.cancel(); } finally { setState('idle'); }; };

  btnStart.addEventListener('click', start);
  btnPause.addEventListener('click', pause);
  btnResume.addEventListener('click', resume);
  btnStop.addEventListener('click', stop);

  // Persistance de la vitesse
  const savedSpeed = getPref('rate', '1');
  if (speedSel) speedSel.value = savedSpeed;
  speedSel.addEventListener('change', () => {
    localStorage.setItem(key('rate'), speedSel.value);
  });

  // Raccourcis Alt+L/P/R/S
  document.addEventListener('keydown', (e) => {
    if (!e.altKey) return;
    if (e.key.toLowerCase() === 'l') { e.preventDefault(); start(); }
    if (e.key.toLowerCase() === 'p') { e.preventDefault(); pause(); }
    if (e.key.toLowerCase() === 'r') { e.preventDefault(); resume(); }
    if (e.key.toLowerCase() === 's') { e.preventDefault(); stop(); }
  });

  setState('idle');
  window.addEventListener('beforeunload', () => { try { synth.cancel(); } catch {} });
})();


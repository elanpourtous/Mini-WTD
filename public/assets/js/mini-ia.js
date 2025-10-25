/* Mini-WTD — mini-ia.js
   TTS (SpeechSynthesis) + STT (webkitSpeechRecognition)
   - Persistance des réglages TTS (localStorage)
   - Raccourci Ctrl+Entrée -> Lire
   - Zones live ARIA + messages clairs
*/
(() => {
  // ===== UTIL =====
  const $ = (s) => document.querySelector(s);
  const log = (msg, cls = 'alert alert--info') => { const L = $('#log'); if (!L) return; L.className = cls; L.textContent = msg; };
  const ttsLive = (msg, ok = true) => { const n = $('#ttsLive'); if (!n) return; n.className = 'alert ' + (ok ? 'alert--success' : 'alert--warning'); n.textContent = msg; };
  const sttLive = (msg, ok = true) => { const n = $('#sttLive'); if (!n) return; n.className = 'alert ' + (ok ? 'alert--success' : 'alert--warning'); n.textContent = msg; };

  // ===== TTS =====
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  const key = (k) => 'miniwtd_tts_' + k;
  const els = {
    text: $('#ttsText'), voice: $('#voiceSelect'),
    rate: $('#rate'), pitch: $('#pitch'), volume: $('#volume'),
    rateVal: $('#rateVal'), pitchVal: $('#pitchVal'), volVal: $('#volVal'),
    btnSpeak: $('#btnSpeak'), btnPause: $('#btnPause'), btnResume: $('#btnResume'), btnStop: $('#btnStop'),
    chkAutoFocus: $('#chkAutoFocus')
  };

  let voices = [];
  let currentUtterance = null;

  function populateVoices() {
    if (!synth) return;
    voices = synth.getVoices().filter(v => v.lang?.startsWith('fr') || v.lang?.startsWith('en') || v.lang?.startsWith('es') || v.lang?.startsWith('de'));
    els.voice.innerHTML = voices.map((v, i) =>
      `<option value="${i}">${v.name} — ${v.lang}${v.default ? ' (par défaut)' : ''}</option>`
    ).join('') || `<option value="">Aucune voix disponible</option>`;

    // Restaure choix
    const savedIndex = +localStorage.getItem(key('voiceIndex')) || 0;
    if (voices[savedIndex]) els.voice.value = String(savedIndex);
  }

  function updateLabels() {
    els.rateVal.textContent = (+els.rate.value).toFixed(1);
    els.pitchVal.textContent = (+els.pitch.value).toFixed(1);
    els.volVal.textContent = (+els.volume.value).toFixed(2);
  }

  function persistSettings() {
    localStorage.setItem(key('voiceIndex'), els.voice.value || '0');
    localStorage.setItem(key('rate'), els.rate.value);
    localStorage.setItem(key('pitch'), els.pitch.value);
    localStorage.setItem(key('volume'), els.volume.value);
    localStorage.setItem(key('autoFocus'), els.chkAutoFocus.checked ? '1' : '0');
  }

  function restoreSettings() {
    if (localStorage.getItem(key('rate'))) els.rate.value = localStorage.getItem(key('rate'));
    if (localStorage.getItem(key('pitch'))) els.pitch.value = localStorage.getItem(key('pitch'));
    if (localStorage.getItem(key('volume'))) els.volume.value = localStorage.getItem(key('volume'));
    els.chkAutoFocus.checked = localStorage.getItem(key('autoFocus')) === '1';
    updateLabels();
  }

  function setTtsButtons(state /* idle|speaking|paused */) {
    const S = { idle: ['btnSpeak'], speaking: ['btnPause','btnStop'], paused: ['btnResume','btnStop'] };
    ['btnSpeak','btnPause','btnResume','btnStop'].forEach(id => els[id].disabled = true);
    (S[state] || []).forEach(id => els[id].disabled = false);
  }

  function speak() {
    if (!synth) { ttsLive('TTS non supporté par ce navigateur.', false); log('TTS non supporté.', 'alert alert--warning'); return; }
    const text = (els.text.value || '').trim();
    if (!text) { ttsLive('Aucun texte à lire.', false); return; }

    // Stop en cours
    try { synth.cancel(); } catch {}

    const utter = new SpeechSynthesisUtterance(text);
    const idx = +els.voice.value || 0;
    if (voices[idx]) utter.voice = voices[idx];
    utter.rate = +els.rate.value || 1;
    utter.pitch = +els.pitch.value || 1;
    utter.volume = +els.volume.value || 1;

    utter.onstart = () => { currentUtterance = utter; setTtsButtons('speaking'); ttsLive('Lecture en cours…'); };
    utter.onend   = () => { currentUtterance = null; setTtsButtons('idle'); ttsLive('Lecture terminée.'); if (els.chkAutoFocus.checked) els.text.focus(); };
    utter.onerror = (e) => { currentUtterance = null; setTtsButtons('idle'); ttsLive('Erreur TTS : ' + (e.error||'inconnue'), false); };

    synth.speak(utter);
    persistSettings();
  }

  function pause()  { if (synth?.speaking && !synth.paused){ synth.pause(); setTtsButtons('paused'); ttsLive('Lecture en pause.'); } }
  function resume() { if (synth?.paused){ synth.resume(); setTtsButtons('speaking'); ttsLive('Lecture reprise.'); } }
  function stop()   { if (synth){ synth.cancel(); setTtsButtons('idle'); ttsLive('Lecture stoppée.'); } }

  // Events TTS
  if (synth) {
    populateVoices();
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.onvoiceschanged = populateVoices;
    }
  }
  restoreSettings();
  updateLabels();
  ['rate','pitch','volume'].forEach(id => els[id].addEventListener('input', () => { updateLabels(); persistSettings(); }));
  els.voice.addEventListener('change', persistSettings);
  els.btnSpeak.addEventListener('click', speak);
  els.btnPause.addEventListener('click', pause);
  els.btnResume.addEventListener('click', resume);
  els.btnStop.addEventListener('click', stop);
  document.addEventListener('keydown', (e) => { if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); speak(); } });

  // ===== STT =====
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const stt = {
    btnStart: $('#btnRec'), btnStop: $('#btnRecStop'),
    out: $('#sttOut'), chkCont: $('#chkContinuous'), chkInterim: $('#chkInterim'), lang: $('#langSelect')
  };

  let rec = null;
  let interim = '';

  function sttSupported(){ return !!Rec; }

  function sttStart() {
    if (!sttSupported()) { sttLive('STT non supporté par ce navigateur.', false); log('STT non supporté.', 'alert alert--warning'); return; }
    try { rec?.stop(); } catch {}
    rec = new Rec();
    rec.lang = stt.lang.value || 'fr-FR';
    rec.continuous = stt.chkCont.checked;
    rec.interimResults = stt.chkInterim.checked;

    stt.btnStart.disabled = true;
    stt.btnStop.disabled = false;
    sttLive('Dictée démarrée…');

    rec.onresult = (e) => {
      let final = '';
      interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t + ' ';
        else interim += t;
      }
      stt.out.value = (stt.out.value + ' ' + final + interim).trim();
      stt.out.scrollTop = stt.out.scrollHeight;
    };
    rec.onerror = (e) => { sttLive('Erreur STT : ' + (e.error || 'inconnue'), false); };
    rec.onend = () => { stt.btnStart.disabled = false; stt.btnStop.disabled = true; sttLive('Dictée arrêtée.'); };

    rec.start();
  }

  function sttStop() {
    try { rec?.stop(); } catch {}
  }

  stt.btnStart.addEventListener('click', sttStart);
  stt.btnStop.addEventListener('click', sttStop);
  stt.lang.addEventListener('change', () => sttLive('Langue STT : ' + stt.lang.value));

  // ===== INIT LOG =====
  log('TTS ' + (synth ? 'OK' : 'NOK') + ' · STT ' + (sttSupported() ? 'OK' : 'NOK'));
})();

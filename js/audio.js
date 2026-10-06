'use strict';
HCC.audio = (() => {
  const DEFAULTS = { master: .55, sfx: .5, voice: .38, muted: false };
  const VOICE_PRESETS = Object.freeze({
    unknown: { pitch: 285, variation: .07, duration: .065, interval: .095, characters: 3, wave: 'triangle', filter: 950 },
    protagonist: { pitch: 390, variation: .09, duration: .075, interval: .11, characters: 3, wave: 'sine', filter: 1800 },
    scammer: { pitch: 195, variation: .08, duration: .075, interval: .11, characters: 3, wave: 'sawtooth', filter: 700 },
    promo: { pitch: 510, variation: .15, duration: .055, interval: .075, characters: 2, wave: 'triangle', filter: 2200 },
    official: { pitch: 300, variation: .035, duration: .09, interval: .14, characters: 4, wave: 'sine', filter: 1300 },
    supervisor: { pitch: 225, variation: .035, duration: .105, interval: .17, characters: 4, wave: 'triangle', filter: 1000 },
    clone: { pitch: 330, variation: .13, duration: .075, interval: .115, characters: 3, wave: 'triangle', filter: 1500 }
  });
  // Original short motifs. [frequency Hz, delay seconds, duration seconds].
  const SFX = {
    incomingCall:[[520,0,.12],[650,.16,.12],[520,.42,.12],[780,.58,.16]],
    incomingMessage:[[720,0,.06],[980,.055,.09]], incomingEmail:[[490,0,.12],[660,.16,.15]],
    uiHover:[[620,0,.025]], uiClick:[[440,0,.045]], uiConfirm:[[550,0,.06],[740,.07,.09]], uiBack:[[470,0,.05],[360,.06,.07]],
    openPhoneTool:[[610,0,.06],[810,.08,.08]], openComputerTool:[[330,0,.06],[500,.07,.06],[670,.14,.07]],
    openNotebookTool:[[420,0,.035],[460,.06,.035]], openIndependentChannel:[[430,0,.09],[640,.12,.1]],
    evidenceFound:[[820,.2,.065],[1040,.28,.085]], timeExpired:[[430,0,.12],[320,.15,.18]],
    resolvedSfx:[[520,0,.3],[650,.04,.28],[780,.08,.3]], partialSfx:[[470,0,.13],[530,.17,.18]], riskSfx:[[440,0,.12],[330,.14,.2]],
    revealSfx:[[380,0,.07],[650,.07,.08],[990,.15,.16]], triviaCorrect:[[660,0,.08],[880,.1,.15]],
    triviaIncorrect:[[470,0,.1],[420,.13,.13]], triviaComplete:[[520,0,.13],[650,.15,.13],[780,.3,.15],[1040,.5,.3]],
    shiftComplete:[[390,0,.18],[520,.2,.18],[650,.4,.18],[780,.62,.2],[650,.86,.16],[1040,1.08,.42]]
  };
  let settings={...DEFAULTS};try { const saved=JSON.parse(sessionStorage.getItem('hcc-audio')||'{}');for(const k of ['master','sfx','voice'])if(Number.isFinite(saved[k]))settings[k]=Math.max(0,Math.min(1,saved[k]));if(typeof saved.muted==='boolean')settings.muted=saved.muted; }catch{}
  let ctx,master,sfx,voice,speaker=null,lastChar=0,lastTime=-1,hoverTime=0;const active=new Set();
  function unlock(){try {if(!ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=new AC();master=ctx.createGain();sfx=ctx.createGain();voice=ctx.createGain();sfx.connect(master);voice.connect(master);master.connect(ctx.destination);apply();}if(ctx.state==='suspended')ctx.resume().catch(()=>{});}catch{}}
  function apply(){if(master){master.gain.setValueAtTime(settings.muted?0:settings.master,ctx.currentTime);sfx.gain.setValueAtTime(settings.sfx,ctx.currentTime);voice.gain.setValueAtTime(settings.voice,ctx.currentTime);}const button=document.getElementById('audio-mute');if(button){button.textContent=settings.muted?'🔇':'🔊';button.setAttribute('aria-label',settings.muted?'Activar sonido':'Silenciar sonido');button.setAttribute('aria-pressed',String(settings.muted));}for(const k of ['master','sfx','voice']){const el=document.getElementById('audio-'+k);if(el)el.value=Math.round(settings[k]*100);}}
  function configure(values){for(const k of ['master','sfx','voice'])if(Number.isFinite(values[k]))settings[k]=Math.max(0,Math.min(1,values[k]));if(typeof values.muted==='boolean')settings.muted=values.muted;if(settings.muted)stopAll();apply();try{sessionStorage.setItem('hcc-audio',JSON.stringify(settings));}catch{}}
  function tone(freq,delay,duration,bus='sfx',wave='sine',filter=2800,amplitude=.12){if(!ctx||settings.muted||ctx.state==='closed')return;const o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();const t=ctx.currentTime+delay;o.type=wave;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(freq*.94,t+duration);f.type='lowpass';f.frequency.value=filter;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(amplitude,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(f);f.connect(g);g.connect(bus==='voice'?voice:sfx);const item={o,g,f,bus};active.add(item);o.onended=()=>{active.delete(item);o.disconnect();g.disconnect();f.disconnect();};o.start(t);o.stop(t+duration+.015);}
  function stop(bus){for(const a of [...active])if(!bus||a.bus===bus){try{a.g.gain.cancelScheduledValues(ctx.currentTime);a.g.gain.setValueAtTime(0,ctx.currentTime);a.o.stop();}catch{}active.delete(a);}}
  function stopAll(){stop();speaker=null;lastChar=0;lastTime=-1;}
  function playSfx(name,context={}){const aliases={incomingMail:'incomingEmail',success:'resolvedSfx',partial:'partialSfx',risk:'riskSfx',reveal:'revealSfx'};if(name==='button'){const clickName=['intro-back','close-clue','summary'].includes(context.action)?'uiBack':['choose','trivia-answer','post-turn'].includes(context.action)?'uiConfirm':'uiClick';queueMicrotask(()=>playSfx(clickName));return;}if(name==='toolOpen')name=({app:'openPhoneTool',computer:'openComputerTool',notebook:'openNotebookTool',independent:'openIndependentChannel'})[context.toolId];name=aliases[name]||name;if(name==='timerWarning'){const n=context.level==='final'?3:context.level==='urgent'?2:1;for(let i=0;i<n;i++)tone(480+n*80,i*.16,.055);return;}for(const [f,d,l] of SFX[name]||[])tone(f,d,l,'sfx','sine',2800,name==='uiHover'?.035:.12);window.dispatchEvent(new CustomEvent('hcc:audio-play',{detail:{kind:'sfx',name}}));}
  function safeSpeaker(key){if(HCC.state?.view==='game'&&!['reveal','education'].includes(HCC.state.phase))return 'unknown';return VOICE_PRESETS[key]?key:'unknown';}
  function syllable(key){key=safeSpeaker(key);const p=VOICE_PRESETS[key];tone(p.pitch*(1+(Math.random()*2-1)*p.variation),0,p.duration*(.85+Math.random()*.3),'voice',p.wave,p.filter,.16);window.dispatchEvent(new CustomEvent('hcc:audio-play',{detail:{kind:'voice',speaker:key}}));}
  function playVoice(key,event='start'){if(event==='stop'){stop('voice');speaker=null;return;}speaker=safeSpeaker(key);lastChar=0;lastTime=-1;}
  window.addEventListener('hcc:dialogue-progress',e=>{if(!speaker||!ctx)return;const p=VOICE_PRESETS[speaker];if(e.detail.shown-lastChar>=p.characters&&ctx.currentTime-lastTime>=p.interval){lastChar=e.detail.shown;lastTime=ctx.currentTime;syllable(speaker);}});
  window.addEventListener('hcc:dialogue-complete',()=>playVoice('unknown','stop'));
  window.addEventListener('hcc:screen-enter',()=>{const s=HCC.state;if(s.view==='game'){if(s.phase==='clue')playSfx('evidenceFound');if(s.phase==='timeout')playSfx('timeExpired');if(s.phase==='reveal')syllable(['scammer','promo','official','supervisor','clone'][HCC.game.data().character]);}if(s.view==='intro'&&s.intro===5)syllable('protagonist');if(s.view==='summary')playSfx('shiftComplete');if(s.view==='trivia-question'&&s.triviaAnswers[s.triviaIndex])playSfx(s.triviaAnswers[s.triviaIndex].correct?'triviaCorrect':'triviaIncorrect');if(s.view==='trivia-result')playSfx('triviaComplete');});
  document.addEventListener('pointerdown',unlock,{capture:true});document.addEventListener('keydown',e=>{if(e.isTrusted)unlock();},{capture:true});
  document.addEventListener('pointerover',e=>{if(e.target.closest('button:not(:disabled)')&&performance.now()-hoverTime>160){hoverTime=performance.now();playSfx('uiHover');}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAll();if(ctx)ctx.suspend().catch(()=>{});}else if(ctx)ctx.resume().catch(()=>{});});window.addEventListener('pagehide',stopAll);
  document.addEventListener('DOMContentLoaded',()=>{apply();document.getElementById('audio-mute').addEventListener('click',()=>{unlock();configure({muted:!settings.muted});});for(const k of ['master','sfx','voice'])document.getElementById('audio-'+k).addEventListener('input',e=>configure({[k]:Number(e.target.value)/100}));});
  return {playSfx,playVoice,stopAll,unlock,configure,VOICE_PRESETS,SFX,DEFAULTS,get settings(){return {...settings};},get status(){return {state:ctx?.state||'uninitialized',active:active.size,speaker};}};
})();

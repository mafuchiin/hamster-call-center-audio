'use strict';
HCC.ui = (() => {
  const e = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const asset = key => HCC.assets.markup(key);
  const toolAsset = id => asset(HCC.assets.tools[id]);
  const channelAsset = data => asset(HCC.assets.channels[data.channel] || data.channelIcon);
  const button = (label, action, extra = '', secondary = false) => `<button class="${secondary ? 'secondary' : 'primary'}" data-action="${action}" ${extra}>${label}<span aria-hidden="true">${secondary ? '' : ' →'}</span></button>`;
  const character = (index, className = '') => `<div class="character char-${index} ${className}" role="img" aria-label="${e(HCC.characters[index].name)}"><img src="assets/characters/hamis.png" alt="" draggable="false"></div>`;
  const group = () => '<img class="cast-image" src="assets/characters/hamis.png" alt="Los cinco personajes de Hamster Call Center" draggable="false">';
  const heading = (eyebrow, title, text = '') => `<div class="screen-heading"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${text ? `<p class="lead">${text}</p>` : ''}</div>`;
  const tiles = items => `<div class="tiles tiles-${items.length}">${items.map(([icon, title, text, color], index) => `<article class="tile ${color || ['blue','pink','green','yellow'][index]}"><span class="tile-icon" aria-hidden="true">${HCC.assets[icon] ? asset(icon) : icon}</span><h2>${title}</h2>${text ? `<p>${text}</p>` : ''}</article>`).join('')}</div>`;
  const introFooter = label => `<div class="intro-controls">${HCC.state.intro ? '<button class="back-button" data-action="intro-back">← Atrás</button>' : '<span></span>'}<div class="step-dots" aria-label="Pantalla ${HCC.state.intro + 1} de 9">${Array.from({length:9},(_,i)=>`<span class="${i === HCC.state.intro ? 'active' : ''}"></span>`).join('')}</div>${button(label, 'intro-next')}</div>`;
  const toolSamples = () => `<div class="tool-samples">${HCC.tools.map(t => `<span class="${t.color}"><b aria-hidden="true">${toolAsset(t.id)}</b>${t.label}</span>`).join('')}</div>`;
  function intro() {
    const s = HCC.state.intro;
    let content, label = 'Siguiente';
    if (s === 0) { label = 'Comenzar'; content = `<div class="cover-title"><p class="eyebrow">BIENVENIDOS AL PRIMER TURNO</p><h1>Hamster<br><span>Call Center</span><i aria-hidden="true">${asset("communication/llamadas")}</i></h1><p class="cover-tagline">Antes de confiar, verifica.</p></div>${group()}<p class="cover-caption">Observen. Investiguen. Decidan juntos.</p>`; }
    if (s === 1) content = heading('EL MUNDO DIGITAL', 'Vivimos conectados', 'Usamos estos canales todos los días.<br>Pero también pueden utilizarse para engañarnos.') + tiles([['communication/llamadas','Llamadas','','green'],['communication/mensajes','Mensajes','','blue'],['communication/correo','Correo','','yellow'],['communication/web','Web','','purple'],['communication/apps','Aplicaciones','','pink']]);
    if (s === 2) content = heading('MIREMOS MÁS DE CERCA', '¿Qué es un fraude digital?', 'Es cuando alguien intenta engañarte mediante medios digitales para obtener dinero, información o acceso a tus cuentas.') + tiles([['fraud-types/llamada-falsa','Llamada falsa','','pink'],['fraud-types/mensaje-enganoso','Mensaje engañoso','','blue'],['fraud-types/correo-pagina-falsa','Correo o página falsa','','purple'],['fraud-types/solicitud-datos-codigos','Solicitud de datos o códigos','','yellow']]);
    if (s === 3) content = heading('LO QUE NOS HACE REACCIONAR', '¿Por qué funcionan?') + tiles([['psychology/urgencia','URGENCIA','Te hacen actuar rápido.','pink'],['psychology/confianza','CONFIANZA','Parecen venir de alguien real.','blue'],['psychology/miedo-premio','MIEDO / PREMIO','Te asustan o te emocionan.','purple']]);
    if (s === 4) { label = 'Continuar'; content = `<div class="objective">${heading('UNA IDEA PARA LLEVARSE', 'Antes de confiar,<br><em>verifica.</em>', 'Hoy vamos a practicar cómo tomar decisiones ante mensajes, llamadas y correos sospechosos.')}<div class="objective-seal" aria-hidden="true">✓</div></div>`; }
    if (s === 5) content = heading('HAMSTER CALL CENTER', 'Primer turno') + `<div class="story-layout"><div class="protagonist"><div class="neutral-character"><img src="assets/characters/hamster_protagonista_neutro.png" alt="Tu hámster protagonista, sin identidad bancaria"></div><span class="story-badge">${asset("communication/llamadas")}${asset("communication/mensajes")}${asset("communication/correo")}</span></div><article class="paper"><span class="tape" aria-hidden="true"></span><h2>Nuestro hámster acaba de independizarse.</h2><p>Ahora tiene celular, una cuenta, una tarjeta y muchas notificaciones que debe resolver por su cuenta.</p></article></div>`;
    if (s === 6) { label = 'Cómo jugar'; content = heading('LA MISIÓN ESTÁ EN SUS MANOS', 'Ustedes deciden por él', '<strong class="pill">No todo será fraude</strong>') + `<div class="mission"><div class="unknown-avatar small" aria-hidden="true"><img src="assets/characters/silueta_hamster_desconocido.png" alt=""></div><p>Algunas situaciones serán reales<br>y otras intentarán engañarlo.</p></div>`; }
    if (s === 7) content = heading('CUATRO PASOS, UNA BUENA DECISIÓN', 'Cómo se juega') + tiles([['1','Observa','Lee la situación y los detalles.','blue'],['2','Investiga','Usa herramientas para buscar y verificar información.','pink'],['3','Decide','Analiza lo que encontraste y elige una acción.','green'],['4','Descubre','Observa qué ocurrió y aprende del caso.','yellow']]) + `<div class="how-tools">${toolSamples()}<p><strong>Verificaciones <span class="checks-preview">● ●</span></strong> · Hasta dos por caso.<br>No todas las herramientas sirven igual en todos los casos.</p></div>`;
    if (s === 8) { label = 'Iniciar turno'; content = heading('CADA DECISIÓN TIENE UNA CONSECUENCIA', 'Resultados', 'Importa qué investigaste y qué hiciste después.') + tiles([['✓','Resuelto','Evidencia suficiente y una acción adecuada.','green'],['−','A salvo, pero incompleto','Evitas el daño, pero falta verificar o resolver la situación.','yellow'],['!','Riesgo / daño','La acción puede comprometer dinero, información o acceso.','pink']]); }
    return `<section class="screen intro-screen intro-${s}">${content}${introFooter(label)}</section>`;
  }
  function hud() {
    return `<div class="hud"><div class="case-marker"><span class="hud-case-icon" aria-hidden="true">${asset("tools/libreta")}</span> Caso ${HCC.state.caseIndex + 1} <small>de 5</small></div><div class="hud-stats"><div><span>Puntos</span><strong id="hud-points">0</strong></div><div id="timer-box"><span id="timer-label">Tiempo</span><strong id="hud-time" role="timer" aria-label="Tiempo restante"></strong></div><div><span>Verificaciones</span><strong id="hud-checks" class="check-dots"></strong></div></div></div>`;
  }
  const textControl = () => `<button id="text-control" class="text-control" data-action="text-speed">Mostrar texto completo</button>`;
  const unknown = () => `<div class="unknown-avatar" role="img" aria-label="Silueta de hámster: identidad por verificar"><img src="assets/characters/silueta_hamster_desconocido.png" alt=""></div>`;
  const toolLabel = id => HCC.game.data().toolLabels?.[id] || HCC.tools.find(tool => tool.id === id).label;
  const transcript = data => `<div class="transcript">${data.dialogue.map(line => `<p>«${e(line)}»</p>`).join('')}</div>`;
  const eventMessage = data => `<div class="code-message"><span>SMS · AHORA</span><strong>${e(data.event.lines[0])}</strong><b>${e(data.event.lines[1])}</b></div>`;
  const witness = data => data.witness ? `<aside class="witness-card"><span class="witness-avatar" aria-hidden="true">M</span><div><strong>${e(data.witness.name)}</strong><small>${e(data.witness.channel)}</small><p>«${e(data.witness.quote)}»</p></div></aside>` : '';
  function evidence() {
    const s = HCC.state, data = HCC.game.data();
    if (!s.checks.length) return '<p class="empty-evidence">Todavía no consultaron una herramienta.</p>';
    return `<ul class="evidence-list">${s.checks.map(id => `<li><strong>${e(toolLabel(id))}</strong><span>${e(data.clues[id])}</span></li>`).join('')}</ul>`;
  }
  function contact(data) {
    const compact = HCC.state.phase === 'investigate';
    const message = compact ? `<p>${e(data.summary)}</p>` : transcript(data);
    const request = data.mailButton ? `<button class="email-cta" data-action="decide" aria-label="Ver acciones sobre Actualizar seguridad">${e(data.request)}</button>` : data.link ? `<button class="simulated-link" data-action="decide" aria-label="Ver acciones sobre el enlace del premio">${e(data.link)}</button>` : `<div class="request">${e(data.request)}</div>`;
    return `<article class="contact-panel ${data.channel === 'Correo' ? 'mail-panel' : ''}"><div class="contact-top"><span class="mini-avatar" aria-hidden="true"><img src="assets/characters/silueta_hamster_desconocido.png" alt=""></span><div><strong>${e(data.sender)}</strong><span>${e(data.channel)} · contacto por verificar</span></div><span class="channel-symbol" aria-hidden="true">${channelAsset(data)}</span></div><div class="contact-body">${data.subject && !compact ? `<div class="mail-meta"><strong>${e(data.subject)}</strong><span>${e(data.recipient)}</span></div>` : '<span class="message-date">AHORA</span>'}${message}${request}${data.link || data.mailButton ? '<small class="simulation-hint">Este control abre las opciones del juego.</small>' : ''}${compact ? `<details class="replay"><summary>Releer conversación</summary>${transcript(data)}</details>` : ''}</div></article>`;
  }
  function tools() {
    const s = HCC.state;
    return `<div class="tools-panel"><div class="tools-heading"><h2>Herramientas de investigación</h2><span>${HCC.config.maxChecks - s.checks.length} disponibles</span></div><div class="tools-grid">${HCC.tools.map((t,i) => `<button class="tool ${t.color}" data-action="tool" data-id="${t.id}" ${s.checks.includes(t.id) || s.checks.length >= HCC.config.maxChecks || s.expired ? 'disabled' : ''}><kbd>${i+1}</kbd><span class="tool-icon" aria-hidden="true">${toolAsset(t.id)}</span><strong>${e(toolLabel(t.id))}</strong><small>${s.checks.includes(t.id) ? 'Consultada ✓' : 'Investigar'}</small></button>`).join('')}</div></div>`;
  }
  function game() {
    const s = HCC.state, data = HCC.game.data();
    let content = '', bottom = '';
    if (s.phase === 'incoming') {
      content = `<div class="incoming"><div class="incoming-symbol channel-${data.channel === 'Correo' ? 'mail' : data.channel === 'Llamada' ? 'call' : 'message'}" aria-hidden="true">${channelAsset(data)}</div><p class="eyebrow">CONTACTO ENTRANTE</p><h1>${e(data.incomingContent)}</h1><p>Escuchen la situación antes de decidir.</p>${button('Ver contacto', 'advance')}</div>`;
    } else if (s.phase === 'unknown') {
      content = `<div class="incoming"><span class="channel-dock" aria-hidden="true">${channelAsset(data)}</span>${unknown()}<p class="eyebrow">IDENTIDAD POR VERIFICAR</p><h1>${e(data.sender)}</h1><p>La identidad se revelará después de su decisión.</p>${button('Conocer la situación', 'advance')}</div>`;
    } else if (s.phase === 'event') {
      content = `<div class="event-layout"><article class="event-card"><p class="eyebrow">MIENTRAS SIGUE LA LLAMADA</p><h1>${e(data.event.title)}</h1>${eventMessage(data)}<div class="caller-request"><span>El interlocutor dice:</span><p>«${e(data.event.reply)}»</p></div></article></div>`;
      bottom = `<div class="case-actions centered">${textControl()}${button('Ver herramientas', 'advance', '', true)}${button('Tomar decisión', 'decide')}</div>`;
    } else if (['dialogue','investigate'].includes(s.phase)) {
      content = `<div class="case-layout">${contact(data)}<aside class="case-note"><span class="eyebrow">OBSERVEN LOS DETALLES</span><h2>${e(data.displayTitle)}</h2><p>¿Qué necesitamos comprobar antes de actuar?</p>${s.checks.length ? `<details><summary>Evidencia reunida (${s.checks.length})</summary>${evidence()}</details>` : `<div class="note-hint">${data.event && s.phase === 'investigate' ? eventMessage(data) : e(data.context)}</div>`}</aside></div>`;
      if (s.phase === 'dialogue') bottom = `<div class="case-actions">${textControl()}${button(data.event ? 'Continuar la llamada' : 'Ver herramientas', 'advance', '', true)}${button('Tomar decisión', 'decide')}</div>`;
      else bottom = `${tools()}<div class="case-actions"><span>${s.checks.length === 2 ? 'Ya usaron las dos verificaciones.' : 'Elijan una herramienta o pasen a decidir.'}</span>${button('Tomar decisión', 'decide')}</div>`;
    } else if (s.phase === 'clue') {
      const tool = HCC.tools.find(t => t.id === s.clue);
      content = `<div class="clue-layout"><div class="clue-card tool-surface tool-${tool.id} ${tool.color}"><div class="device-bar"><span aria-hidden="true">${toolAsset(tool.id)}</span><span>${tool.id === 'independent' ? 'CANAL VERIFICADO · LLAMADA CONECTADA' : tool.id === 'notebook' ? 'MIS APUNTES' : 'CONSULTA ABIERTA'}</span><i aria-hidden="true">● ● ●</i></div><p class="eyebrow">${e(toolLabel(tool.id))} · INVESTIGACIÓN ${s.checks.length} DE 2</p><h1>Esto encontraron</h1><p class="clue-text">${e(data.clues[s.clue])}</p><p class="clue-caption">Un hecho para interpretar. ¿Qué nos permite comprobar?</p></div></div>`;
      bottom = `<div class="case-actions centered">${button(s.checks.length < 2 ? 'Otra investigación' : 'Volver al caso', 'close-clue', '', true)}${button('Tomar decisión', 'decide')}</div>`;
    } else if (s.phase === 'timeout') {
      content = `<div class="timeout-card">${asset('psychology/urgencia')}<h1>TIEMPO AGOTADO</h1><p>Toca decidir con la información que reuniste.</p></div>`;
      bottom = `<div class="case-actions centered">${button('Tomar decisión', 'timeout-decision')}</div>`;
    } else if (s.phase === 'decision') {
      content = `<div class="decision-header"><p class="eyebrow">DECIDAN JUNTOS</p><h1>¿Qué debería hacer?</h1><p>${s.expired ? 'El tiempo terminó. Revisen la situación y voten con la evidencia disponible.' : 'Escuchen al grupo y elijan una acción.'}</p></div><div class="decision-layout"><div class="decisions">${data.decisions.map((d,i)=>`<button class="decision" data-action="choose" data-id="${d.id}"><span class="option-letter">${'ABC'[i]}</span><span>${e(d.text)}</span><span class="option-arrow" aria-hidden="true">↗</span></button>`).join('')}</div><aside class="evidence-panel"><h2>Su evidencia</h2>${evidence()}<details class="decision-context"><summary>Releer situación</summary><p>${e(data.context)}</p>${transcript(data)}${data.event ? eventMessage(data) + `<p>«${e(data.event.reply)}»</p>` : `<p>${e(data.request)}</p>`}${data.link ? `<p class="domain">${e(data.link)}</p>` : ''}</details><p class="evidence-footnote">Elegir una acción no añade investigaciones.</p></aside></div>`;
    } else if (s.phase === 'outcome') {
      const o = s.outcome;
      content = `<div class="outcome-layout"><div class="result-card ${o.status.toLowerCase()}"><div class="result-symbol" aria-hidden="true">${{RESOLVED:'✓',PARTIAL:'−',RISK:'!'}[o.status]}</div><p class="eyebrow">CONSECUENCIA DE SU DECISIÓN</p><h1>${HCC.scoring.labels[o.status]}</h1><p>${e(o.consequence)}</p><div class="result-reason">${e(o.reason)}</div><div class="score-chip">+${o.points} puntos</div></div></div>`;
      bottom = `<div class="case-actions centered">${button('Descubrir al personaje', 'advance')}</div>`;
    } else if (s.phase === 'reveal') {
      content = `<div class="reveal-layout"><div class="reveal-art ${HCC.characters[data.character].color}"><div class="reveal-mask" aria-hidden="true"><img src="assets/characters/silueta_hamster_desconocido.png" alt=""></div>${character(data.character)}</div><div class="reveal-copy"><p class="eyebrow">${e(HCC.scoring.labels[s.outcome.status])} · +${s.outcome.points} PUNTOS</p><h1>${e(HCC.characters[data.character].name)}</h1><span class="type-pill">${e(data.fraudType)}</span><p class="reveal-quote">«${e(data.reveal)}»</p>${witness(data)}</div></div>`;
      bottom = `<div class="case-actions centered">${button('Lo que aprendimos', 'advance')}</div>`;
    } else if (s.phase === 'education') {
      content = `<div class="education-layout"><div class="education-character">${character(data.character)}</div><article class="lesson-paper"><p class="eyebrow">EL APRENDIZAJE DEL CASO ${s.caseIndex + 1}</p><h1>${e(HCC.characters[data.character].name)}</h1><span class="type-pill">${e(data.fraudType)}</span><div class="lesson-row"><span aria-hidden="true">${asset("psychology/urgencia")}</span><div><h2>Señal clave</h2><p>${e(data.lesson)}</p></div></div><div class="lesson-row"><span aria-hidden="true">✓</span><div><h2>Cómo verificar / prevenir</h2><p>${e(data.prevention)}</p></div></div><blockquote>«${e(data.quote)}»</blockquote><details class="evidence-review"><summary>Qué demostraban sus pistas (${s.checks.length})</summary>${s.checks.length ? `<ul>${s.checks.map(id => `<li><strong>${e(toolLabel(id))}:</strong> ${e(data.evidenceReview[id])}</li>`).join('')}</ul>` : '<p>No consultaron herramientas. Elegir una ruta segura sin comprobar no permite obtener el resultado máximo.</p>'}</details></article></div>`;
      bottom = `<div class="case-actions centered">${button(s.caseIndex === 4 ? 'Completar turno' : 'Siguiente caso', 'next-case')}</div>`;
    }
    const phaseNames = {incoming:'Observa',unknown:'Observa',dialogue:'Observa',event:'Observa',investigate:'Investiga',clue:'Investiga',decision:'Decide',timeout:'Decide',outcome:'Descubre',reveal:'Descubre',education:'Descubre'};
    return `<section class="screen game-screen phase-${s.phase}"><div class="game-top"><div class="phase-track">${['Observa','Investiga','Decide','Descubre'].map((name,i)=>`<span class="${phaseNames[s.phase]===name?'current':''}"><b>${i+1}</b>${name}</span>`).join('')}</div>${hud()}</div><div class="game-content">${content}</div>${bottom}</section>`;
  }
  function summary() {
    const totals = HCC.scoring.summarize(HCC.state.results);
    return `<section class="screen summary-screen">${heading('CINCO CASOS. MUCHAS COSAS POR DESCUBRIR.', '¡Turno completado!')}<div class="summary-score"><strong>${totals.total}</strong><span>DE ${HCC.cases.length * HCC.config.points.RESOLVED} PUNTOS</span></div><div class="summary-counts">${['RESOLVED','PARTIAL','RISK'].map(status=>`<div class="${status.toLowerCase()}"><b>${totals[status]}</b><span>${status === 'PARTIAL' ? 'A salvo' : status === 'RISK' ? 'Riesgo' : 'Resueltos'}</span></div>`).join('')}</div><div class="discovered"><span>PERSONAJES DESCUBIERTOS · ${HCC.state.results.length} / 5</span>${group()}</div><h2 class="final-motto">Antes de confiar, verifica.</h2><p class="closing-rule">Detente <span>→</span> Revisa <span>→</span> Verifica <span>→</span> Actúa</p><div class="case-actions centered">${button('Ver personajes', 'characters', '', true)}${button('Comprobar lo aprendido', 'post-turn')}</div></section>`;
  }
  function gallery() {
    return `<section class="screen gallery-screen">${heading('LO QUE DESCUBRIERON EN ESTE TURNO', 'Los cinco personajes')}<div class="character-gallery">${HCC.cases.map((data,index)=>`<article class="character-card ${HCC.characters[index].color}">${character(index)}<h2>${e(HCC.characters[index].name)}</h2><span>${e(data.fraudType)}</span><p>«${e(data.quote)}»</p></article>`).join('')}</div><div class="case-actions centered">${button('Volver al resumen', 'summary')}</div></section>`;
  }
  function evaluation() {
    return `<section class="screen evaluation-screen">${heading('', 'Queremos escucharte', 'Escanea el QR y cuéntanos qué te pareció Hamster Call Center.')}<div class="qr-card"><img src="assets/ui/qr-forms.png" alt="Código QR para responder la evaluación de Hamster Call Center" width="1127" height="1127"><p>5 preguntas · menos de 2 minutos</p></div><div class="case-actions centered">${button('Finalizar', 'finish')}</div></section>`;
  }
  function closing() {
    return `<section class="screen closing-screen">${heading('', '¡Gracias por participar!', 'Antes de confiar, verifica.')}<div class="closing-cast">${group()}</div><p class="closing-rule">Detente <span>→</span> Revisa <span>→</span> Verifica <span>→</span> Actúa</p><div class="case-actions centered">${button('Volver al QR', 'evaluation', '', true)}${button('Reiniciar', 'reset')}</div></section>`;
  }
  return {
    render() {
      const snapshot = HCC.motion.beforeRender();
      document.getElementById('app').innerHTML = HCC.state.view === 'intro' ? intro() : HCC.state.view === 'game' ? game() : HCC.state.view.startsWith('trivia-') ? HCC.trivia.render({e,button,heading}) : HCC.state.view === 'characters' ? gallery() : HCC.state.view === 'evaluation' ? evaluation() : HCC.state.view === 'closing' ? closing() : summary();
      this.updateHud();
      document.getElementById('app').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
      HCC.viewport.fit();
      HCC.motion.afterRender(snapshot);
      if (HCC.state.view === 'trivia-question') document.getElementById('keyboard-hint').textContent = HCC.state.triviaAnswers.length > HCC.state.triviaIndex ? 'Espacio / Enter · Siguiente' : 'A / B / C · Elegir respuesta';
      if (HCC.state.view === 'closing') document.getElementById('keyboard-hint').textContent = 'Tab · Elegir botón   |   Enter · Confirmar';
    },
    updateHud() {
      const clock = document.getElementById('hud-time');
      if (!clock) return;
      const s = HCC.state;
      clock.textContent = HCC.timer.format(s.remaining);
      document.getElementById('hud-points').textContent = HCC.scoring.summarize(s.results).total;
      const checks = document.getElementById('hud-checks');
      if (checks.dataset.count !== String(s.checks.length)) checks.innerHTML = Array.from({length:HCC.config.maxChecks},(_,i)=>`<span class="${i < HCC.config.maxChecks - s.checks.length ? 'available' : 'used'}" aria-hidden="true">${i < HCC.config.maxChecks - s.checks.length ? '●' : '○'}</span>`).join(' ');
      checks.dataset.count = String(s.checks.length);
      checks.setAttribute('aria-label', `${HCC.config.maxChecks - s.checks.length} verificaciones disponibles`);
      const timer = document.getElementById('timer-box');
      const level = s.outcome ? '' : s.remaining <= HCC.config.finalSeconds ? 'final' : s.remaining <= HCC.config.urgentSeconds ? 'urgent' : s.remaining <= HCC.config.warningSeconds ? 'warning' : '';
      if (!level) document.getElementById('timer-label').textContent = s.clockStarted ? 'Tiempo' : 'En espera';
      if (timer.dataset.level !== level) {
        timer.dataset.level = level;
        timer.className = level ? `timer-${level}` : '';
        document.getElementById('timer-label').textContent = ({warning:'Atención', urgent:'Poco tiempo', final:'Últimos segundos'})[level] || (s.clockStarted ? 'Tiempo' : 'En espera');
        if (level) { HCC.audio.playSfx('timerWarning', { level }); this.announce(`${s.remaining} segundos restantes`); }
      }
    },
    announce(text) { document.getElementById('announcer').textContent = text; }
  };
})();

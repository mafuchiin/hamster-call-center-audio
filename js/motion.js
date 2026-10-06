'use strict';
HCC.motion = (() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const activeAnimations = new Set();
  let last = null, writer = null, frame = 0, ghost = null;
  const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));
  const animate = (element, frames, options) => {
    if (!element || preference.matches || !element.animate) return;
    const animation = element.animate(frames, { duration: 280, easing: 'cubic-bezier(.2,.7,.25,1)', ...options });
    activeAnimations.add(animation);
    animation.finished.then(() => activeAnimations.delete(animation)).catch(() => {});
    return animation;
  };
  function finishText(skipped = false) {
    if (!writer) return false;
    cancelAnimationFrame(frame);
    const current = writer;
    current.lines.forEach(line => { line.display.textContent = line.text; });
    writer = null;
    const control = document.getElementById('text-control');
    if (control) { if (document.activeElement === control) document.getElementById('app').focus({ preventScroll: true }); control.hidden = true; }
    document.querySelectorAll('.typing').forEach(element => element.classList.remove('typing'));
    HCC.audio.playVoice('unknown', 'stop', { caseId: current.caseId });
    emit('hcc:dialogue-complete', { caseId: current.caseId, skipped });
    HCC.game.onDialogueReady();
    return true;
  }
  function cancelText() {
    cancelAnimationFrame(frame);
    if (writer) HCC.audio.playVoice('unknown', 'stop', { caseId: writer.caseId, cancelled: true });
    writer = null;
  }
  function typeText() {
    const nodes = Array.from(document.querySelectorAll('.phase-dialogue .transcript p, .phase-event .code-message strong, .phase-event .code-message b, .phase-event .caller-request p'));
    const control = document.getElementById('text-control');
    if (!nodes.length || preference.matches) { if (control) control.hidden = true; if (nodes.length) HCC.game.onDialogueReady(); return; }
    const lines = nodes.map(node => {
      const text = node.textContent;
      node.textContent = ''; node.classList.add('type-line');
      const reserve = document.createElement('span'); reserve.className = 'type-reserve'; reserve.setAttribute('aria-hidden', 'true'); reserve.textContent = text;
      const display = document.createElement('span'); display.className = 'type-display'; display.setAttribute('aria-hidden', 'true');
      const accessible = document.createElement('span'); accessible.className = 'sr-only'; accessible.textContent = text;
      node.append(reserve, display, accessible);
      return { text, display, characters: Array.from(text) };
    });
    const total = lines.reduce((sum, line) => sum + line.characters.length, 0);
    writer = { lines, total, count: 0, speed: 1, previous: performance.now(), progress: 0, duration: Math.min(4000, Math.max(1100, total * 22)), caseId: HCC.game.data().id };
    nodes[0].closest('.contact-body, .event-card').classList.add('typing');
    if (control) { control.hidden = false; control.textContent = 'Mostrar texto completo'; }
    HCC.audio.playVoice('unknown', 'start', { caseId: writer.caseId });
    emit('hcc:dialogue-start', { caseId: writer.caseId, characters: total });
    const tick = now => {
      if (!writer) return;
      writer.progress += (now - writer.previous) * writer.speed; writer.previous = now;
      const count = Math.min(total, Math.floor(writer.progress / writer.duration * total));
      if (count !== writer.count) {
        writer.count = count; let remaining = count;
        lines.forEach(line => { line.display.textContent = line.characters.slice(0, Math.max(0, remaining)).join(''); remaining -= line.characters.length; });
        emit('hcc:dialogue-progress', { caseId: writer.caseId, shown: count, total });
      }
      if (count >= total) finishText(); else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  }
  function accelerate() {
    if (!writer) return false;
    if (writer.speed > 1) return finishText(true);
    writer.speed = 4;
    const control = document.getElementById('text-control');
    if (control) control.textContent = 'Mostrar todo ✓';
    emit('hcc:dialogue-speed', { caseId: writer.caseId, multiplier: 4 });
    return true;
  }
  function beforeRender() {
    HCC.audio.stopAll();
    const source = document.querySelector('.incoming-symbol');
    const snapshot = { last, rect: source?.getBoundingClientRect(), icon: source?.querySelector(".asset-icon")?.cloneNode(true) };
    cancelText(); activeAnimations.forEach(animation => animation.cancel()); activeAnimations.clear();
    if (ghost) { ghost.remove(); ghost = null; }
    return snapshot;
  }
  function afterRender(snapshot = {}) {
    const s = HCC.state;
    const current = { view: s.view, phase: s.phase, caseIndex: s.caseIndex, checks: s.checks.length, total: HCC.scoring.summarize(s.results).total };
    const old = snapshot.last;
    if (s.view === 'game') {
      if (s.phase === 'incoming') HCC.audio.playSfx(HCC.game.data().channel === 'Llamada' ? 'incomingCall' : HCC.game.data().channel === 'Correo' ? 'incomingMail' : 'incomingMessage');
      if (s.phase === 'clue') HCC.audio.playSfx('toolOpen', { toolId: s.clue });
      if (s.phase === 'outcome') HCC.audio.playSfx({ RESOLVED: 'success', PARTIAL: 'partial', RISK: 'risk' }[s.outcome.status]);
      if (s.phase === 'reveal') HCC.audio.playSfx('reveal');
      if (old?.caseIndex === s.caseIndex && s.checks.length > old.checks) document.querySelector('#hud-checks .used')?.classList.add('check-spent');
      if (old && current.total !== old.total) document.getElementById('hud-points')?.classList.add('points-pop');
      if (old?.phase === 'incoming' && s.phase === 'unknown' && snapshot.rect && !preference.matches) {
        const target = document.querySelector('.channel-dock'), rect = target?.getBoundingClientRect(), from = snapshot.rect;
        if (rect) {
          ghost = document.createElement('div'); ghost.className = 'incoming-flight'; if (snapshot.icon) ghost.append(snapshot.icon); ghost.setAttribute('aria-hidden', 'true');
          Object.assign(ghost.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
          document.body.append(ghost); const flying = ghost;
          animate(flying, [{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${rect.left - from.left}px,${rect.top - from.top}px) scale(${rect.width / from.width})`, opacity: 0.2 }], { duration: 550 })?.finished.then(() => { flying.remove(); if (ghost === flying) ghost = null; }).catch(() => {});
        }
      }
    }
    const hint = document.getElementById('keyboard-hint');
    if (hint) hint.textContent = s.view === 'game' && s.phase === 'decision' ? 'A / B / C o 1–3 · Decidir' : s.view === 'game' && s.phase === 'investigate' ? '1–4 · Herramientas   |   Espacio · Decidir' : s.view === 'game' && s.phase === 'clue' ? 'Esc · Volver   |   Espacio · Decidir' : 'Espacio / Enter · Avanzar';
    last = current; typeText();
    emit('hcc:screen-enter', { view: s.view, phase: s.view === 'game' ? s.phase : null });
  }
  preference.addEventListener('change', () => {
    if (preference.matches) { finishText(true); activeAnimations.forEach(animation => animation.cancel()); activeAnimations.clear(); if (ghost) { ghost.remove(); ghost = null; } }
  });
  window.addEventListener('pagehide', () => { cancelText(); activeAnimations.forEach(animation => animation.cancel()); });
  return { beforeRender, afterRender, completeText: () => finishText(true), accelerate, isTyping: () => !!writer, reduced: () => preference.matches };
})();

'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const actions = {
    'intro-next': () => HCC.navigation.introNext(), 'intro-back': () => HCC.navigation.introBack(),
    advance: () => HCC.game.advance(), tool: id => HCC.game.investigate(id), 'close-clue': () => HCC.game.closeClue(),
    decide: () => HCC.game.decide(), choose: id => HCC.game.choose(id), 'next-case': () => HCC.game.nextCase(),
    'text-speed': () => HCC.motion.completeText(),
    'timeout-decision': () => HCC.game.finishTimeout(),
    'trivia-begin': () => HCC.trivia.begin(), 'trivia-answer': id => HCC.trivia.answer(id), 'trivia-next': () => HCC.trivia.next(), 'trivia-complete': () => HCC.trivia.complete(),
    'post-turn': () => HCC.navigation.postTurn(), evaluation: () => HCC.navigation.evaluation(), finish: () => HCC.navigation.finish(),
    reset: () => HCC.game.reset(), characters: () => HCC.navigation.characters(), summary: () => HCC.navigation.summary()
  };
  document.getElementById('app').addEventListener('click', event => {
    const control = event.target.closest('button[data-action]');
    if (control && !control.disabled && actions[control.dataset.action]) {
      if (control.dataset.action === 'advance' && HCC.motion.completeText()) return;
      if (control.dataset.action !== 'text-speed') HCC.motion.completeText();
      HCC.audio.playSfx('button', { action: control.dataset.action });
      actions[control.dataset.action](control.dataset.id);
    } else if (!control && event.target.closest('.typing')) HCC.motion.completeText();
  });
  document.addEventListener('keydown', event => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    const s = HCC.state, key = event.key.toLowerCase();
    const click = selector => { const el = document.querySelector(selector); if (el && !el.disabled && !el.hidden) { event.preventDefault(); el.click(); return true; } return false; };
    if (key === 'escape') {
      const details = document.querySelector('#app details[open]');
      if (details) { event.preventDefault(); details.open = false; details.querySelector('summary').focus(); }
      else if (s.phase === 'clue' && s.view === 'game') click('[data-action="close-clue"]');
      else if (s.view === 'intro') click('[data-action="intro-back"]');
      else if (s.view === 'characters') click('[data-action="summary"]');
      return;
    }
    if (s.view === 'trivia-question' && /^[abc1-3]$/.test(key)) { const index = /^[abc]$/.test(key) ? 'abc'.indexOf(key) : Number(key)-1; click(`[data-action="trivia-answer"][data-id="${index}"]`); return; }
    if (s.view === 'game' && s.phase === 'investigate' && /^[1-4]$/.test(key)) { click(`[data-action="tool"][data-id="${HCC.tools[Number(key)-1].id}"]`); return; }
    if (s.view === 'game' && s.phase === 'decision' && /^[abc1-3]$/.test(key)) { const index = /^[abc]$/.test(key) ? 'abc'.indexOf(key) : Number(key)-1; click(`[data-action="choose"][data-id="${HCC.game.data().decisions[index].id}"]`); return; }
    if (key !== ' ' && key !== 'enter') return;
    if (HCC.motion.isTyping()) { event.preventDefault(); HCC.motion.completeText(); return; }
    if (event.target.closest('button,summary,a')) return;
    const action = s.view === 'intro' ? 'intro-next' : s.view === 'characters' ? 'summary' : s.view === 'summary' ? 'post-turn' : s.view === 'evaluation' ? 'finish' : s.view === 'closing' ? null : s.view === 'trivia-intro' ? 'trivia-begin' : s.view === 'trivia-question' ? (s.triviaAnswers.length > s.triviaIndex ? 'trivia-next' : null) : s.view === 'trivia-result' ? 'trivia-complete' : s.phase === 'timeout' ? 'timeout-decision' : ['investigate','clue'].includes(s.phase) ? 'decide' : s.phase === 'education' ? 'next-case' : s.phase === 'decision' ? null : 'advance';
    if (action) click(`[data-action="${action}"]`);
  });
  const fullscreen = document.getElementById('fullscreen');
  if (!document.fullscreenEnabled) fullscreen.hidden = true;
  fullscreen.addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { HCC.ui.announce('La pantalla completa no está disponible en este navegador.'); }
  });
  document.addEventListener('fullscreenchange', () => { fullscreen.setAttribute('aria-label', document.fullscreenElement ? 'Salir de pantalla completa' : 'Activar pantalla completa'); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) HCC.timer.sync(); });
  HCC.ui.render();
  // Optional browser integration. Shares the exact same visible, enabled controls.
  const context = document.modelContext;
  if (context?.registerTool) {
    const lifecycle = new AbortController();
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
    const snapshot = () => ({ screen: HCC.state.view, phase: HCC.state.view === 'game' ? HCC.state.phase : null, text: document.getElementById('app').innerText, controls: Array.from(document.querySelectorAll('#app button[data-action]:not(:disabled)')).map(el => ({ action: el.dataset.action, id: el.dataset.id || '', label: el.textContent.trim() })) });
    const registry = [
      { name: 'read_hamster_screen', description: 'Read only the visible game screen, evidence and enabled controls. Hidden identities are not exposed.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: snapshot },
      { name: 'activate_hamster_control', description: 'Activate an enabled on-screen control. choose commits the group decision; reset restarts the completed workshop. Use read_hamster_screen to obtain a visible action and id.', inputSchema: { type: 'object', properties: { action: { type: 'string', enum: Object.keys(actions) }, id: { type: 'string' } }, required: ['action'], additionalProperties: false }, annotations: { readOnlyHint: false }, execute(input) {
        if (!input || typeof input.action !== 'string' || (input.id !== undefined && typeof input.id !== 'string') || Object.keys(input).some(key => !['action','id'].includes(key))) throw new Error('Entrada inválida');
        const control = Array.from(document.querySelectorAll('#app button[data-action]:not(:disabled)')).find(el => el.dataset.action === input.action && (el.dataset.id || '') === (input.id || ''));
        if (!control) throw new Error('Acción no disponible en esta pantalla');
        control.click(); return snapshot();
      } }
    ];
    registry.forEach(tool => { try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch {} });
  }
});

'use strict';
HCC.state = { view: 'intro', intro: 0, caseIndex: 0, phase: 'incoming', checks: [], results: [], remaining: HCC.config.caseSeconds, clue: null, expired: false, outcome: null, clockStarted: false };
HCC.game = {
  timeoutHandle: null,
  clearTransition() { clearTimeout(this.timeoutHandle); this.timeoutHandle = null; },
  data() { return HCC.cases[HCC.state.caseIndex]; },
  startCase(index) {
    HCC.timer.stop(); this.clearTransition();
    Object.assign(HCC.state, { view: 'game', caseIndex: index, phase: 'incoming', checks: [], remaining: HCC.config.caseSeconds, clue: null, expired: false, outcome: null, clockStarted: false });
    HCC.ui.render();
  },
  onDialogueReady() {
    const s = HCC.state;
    if (s.view !== 'game') return;
    if (s.phase === 'event' || s.phase === 'dialogue' && !this.data().event) this.beginTimer();
  },
  beginTimer() {
    const s = HCC.state;
    if (s.view !== 'game' || s.clockStarted || s.expired || s.outcome || ['incoming','unknown'].includes(s.phase)) return;
    s.clockStarted = true;
    HCC.timer.start(HCC.config.caseSeconds, seconds => { s.remaining = seconds; HCC.ui.updateHud(); }, () => {
      if (s.view !== 'game' || s.outcome) return;
      Object.assign(s, { phase: 'timeout', expired: true, clue: null });
      HCC.ui.render(); HCC.ui.announce('Tiempo agotado. Toca decidir con la información que reuniste.');
      this.timeoutHandle = setTimeout(() => this.finishTimeout(), HCC.config.timeoutTransitionMs);
    });
  },
  finishTimeout() {
    if (HCC.state.view !== 'game' || HCC.state.phase !== 'timeout') return;
    this.clearTransition(); HCC.state.phase = 'decision'; HCC.ui.render();
  },
  advance() {
    HCC.timer.sync();
    if (HCC.state.view !== 'game') return;
    const next = { incoming: 'unknown', unknown: 'dialogue', dialogue: this.data().event ? 'event' : 'investigate', event: 'investigate', outcome: 'reveal', reveal: 'education' }[HCC.state.phase];
    if (next) { HCC.state.phase = next; HCC.ui.render(); if (next === 'investigate') this.beginTimer(); }
  },
  investigate(toolId) {
    HCC.timer.sync();
    const s = HCC.state;
    if (s.view !== 'game' || s.phase !== 'investigate' || s.expired || s.checks.includes(toolId) || s.checks.length >= HCC.config.maxChecks || !Object.hasOwn(this.data().clues, toolId)) return;
    s.checks.push(toolId); s.clue = toolId; s.phase = 'clue'; HCC.ui.render();
  },
  closeClue() {
    if (HCC.state.phase !== 'clue') return;
    HCC.state.clue = null; HCC.state.phase = 'investigate'; HCC.ui.render();
  },
  decide() {
    HCC.timer.sync();
    if (HCC.state.view !== 'game' || !['dialogue', 'event', 'investigate', 'clue'].includes(HCC.state.phase)) return;
    HCC.state.phase = 'decision'; HCC.state.clue = null; HCC.ui.render(); this.beginTimer();
  },
  choose(decisionId) {
    const s = HCC.state;
    if (s.view !== 'game' || s.phase !== 'decision' || s.outcome || !this.data().decisions.some(d => d.id === decisionId)) return;
    HCC.timer.sync();
    if (s.phase !== 'decision') return;
    HCC.timer.stop(); this.clearTransition();
    const outcome = HCC.scoring.evaluate(this.data(), s.checks, decisionId);
    s.outcome = { ...outcome, caseId: this.data().id, checks: [...s.checks], remaining: s.remaining, character: this.data().character };
    s.results.push(s.outcome); s.phase = 'outcome'; HCC.ui.render();
  },
  nextCase() {
    if (HCC.state.phase !== 'education') return;
    if (HCC.state.caseIndex + 1 < HCC.cases.length) this.startCase(HCC.state.caseIndex + 1);
    else { HCC.state.view = 'summary'; HCC.ui.render(); }
  },
  reset() {
    HCC.timer.stop(); this.clearTransition();
    Object.assign(HCC.state, { view: 'intro', intro: 0, caseIndex: 0, phase: 'incoming', checks: [], results: [], remaining: HCC.config.caseSeconds, clue: null, expired: false, outcome: null, clockStarted: false });
    HCC.trivia?.reset();
    HCC.ui.render();
  }
};

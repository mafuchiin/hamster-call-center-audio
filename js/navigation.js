'use strict';
HCC.navigation = {
  // An optional future trivia module can provide start({ onComplete }).
  // Call onComplete only after showing its results. No trivia is created here.
  postTurn() {
    if (HCC.state.view !== 'summary') return;
    if (typeof HCC.trivia?.start === 'function') HCC.trivia.start({ onComplete: () => this.afterTrivia() });
    else { HCC.state.view = 'evaluation'; HCC.ui.render(); }
  },
  afterTrivia() {
    if (!['trivia-result','summary'].includes(HCC.state.view)) return;
    HCC.state.view = 'evaluation'; HCC.ui.render();
  },
  evaluation() { if (HCC.state.view === 'closing') { HCC.state.view = 'evaluation'; HCC.ui.render(); } },
  finish() { if (HCC.state.view === 'evaluation') { HCC.state.view = 'closing'; HCC.ui.render(); } },
  introNext() { if (HCC.state.view !== 'intro') return; if (HCC.state.intro < 8) { HCC.state.intro++; HCC.ui.render(); } else HCC.game.startCase(0); },
  introBack() { if (HCC.state.view === 'intro' && HCC.state.intro > 0) { HCC.state.intro--; HCC.ui.render(); } },
  characters() { if (HCC.state.view === 'summary') { HCC.state.view = 'characters'; HCC.ui.render(); } },
  summary() { if (HCC.state.view === 'characters') { HCC.state.view = 'summary'; HCC.ui.render(); } }
};

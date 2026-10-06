'use strict';
HCC.viewport = (() => {
  let pending = 0;
  function fit() {
    const shell = document.querySelector('.app-shell');
    if (!shell) return;
    const width = document.documentElement.clientWidth;
    const height = window.visualViewport?.height || window.innerHeight;
    // Keep a readable presentation composition on narrow windows, then fit it whole.
    const designWidth = Math.max(1280, width);
    const designHeight = Math.max(720, height);
    shell.style.setProperty('--stage-width', `${designWidth}px`);
    shell.style.setProperty('--stage-height', `${designHeight}px`);
    shell.style.transform = 'none'; shell.style.left = '0px'; shell.style.top = '0px';
    const bounds = shell.getBoundingClientRect();
    let right = Math.max(designWidth, shell.scrollWidth), bottom = Math.max(designHeight, shell.scrollHeight);
    // Include visible controls and text, excluding intentional sprite source overflow.
    shell.querySelectorAll('button,h1,h2,p,summary,.hud,.app-footer').forEach(el => {
      if (!el.getClientRects().length || el.closest('details:not([open])') && el.tagName !== 'SUMMARY') return;
      const r = el.getBoundingClientRect();
      right = Math.max(right, r.right - bounds.left); bottom = Math.max(bottom, r.bottom - bounds.top);
    });
    const scale = Math.min(1, width / right, height / bottom);
    shell.style.transform = `scale(${scale})`;
    shell.style.left = `${Math.max(0,(width - right * scale)/2)}px`;
    shell.style.top = `${Math.max(0,(height - bottom * scale)/2)}px`;
    shell.dataset.scale = String(scale);
  }
  function schedule() { cancelAnimationFrame(pending); pending = requestAnimationFrame(fit); }
  window.addEventListener('resize', schedule);
  window.visualViewport?.addEventListener('resize', schedule);
  document.addEventListener('toggle', schedule, true);
  document.addEventListener('load', event => { if (event.target.tagName === 'IMG') schedule(); }, true);
  document.fonts?.ready.then(schedule);
  return { fit };
})();

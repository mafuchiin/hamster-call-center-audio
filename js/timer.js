'use strict';
HCC.timer = (() => {
  let interval = null, deadline = 0, active = false, tick, expire;
  const stop = () => { active = false; clearInterval(interval); interval = null; };
  const update = () => {
    if (!active) return;
    const remaining = Math.max(0, Math.ceil((deadline - performance.now()) / 1000));
    tick(remaining);
    if (remaining === 0) { stop(); expire(); }
  };
  return {
    start(seconds, onTick, onExpire) {
      stop(); deadline = performance.now() + seconds * 1000; tick = onTick; expire = onExpire; active = true;
      interval = setInterval(update, 200); update();
    },
    sync: update, stop,
    format(seconds) { return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`; }
  };
})();

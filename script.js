/* ----------------------------
   CONFIG: allowMultiple
   true  => both dropdowns can stay open
   false => opening one closes the other
----------------------------- */

const allowMultiple = true;

document.documentElement.classList.add('preload');
document.documentElement.style.overflowY = 'scroll';
window.addEventListener('load', () => {
  setTimeout(() => {
    document.documentElement.classList.remove('preload');
    document.documentElement.classList.add('ready');
  }, 80);
});
// Add/remove .scrolled on nav when user scrolls
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const THRESHOLD = 8; // px scrolled before applying scrolled state
  let ticking = false;

  function update(scrollY) {
    if (scrollY > THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update(scrollY);
        ticking = false;
      });
      ticking = true;
    }
  }

  // init on load (in case page is loaded already scrolled)
  update(window.scrollY || window.pageYOffset);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => update(window.scrollY || window.pageYOffset), { passive: true });
})();

/* ----------------------------
   HAMBURGER MENU TOGGLE
----------------------------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');

    if (mobileMenu.classList.contains('active')) {
      if (hamburgerIcon) hamburgerIcon.style.display = 'none';
      if (closeIcon) closeIcon.style.display = 'block';
    } else {
      if (hamburgerIcon) hamburgerIcon.style.display = 'block';
      if (closeIcon) closeIcon.style.display = 'none';

      // Reset dropdowns when menu closes
      document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.mobile-dropdown-content').forEach(drop => drop.classList.remove('show'));
    }
  });
}

/* ----------------------------
   MOBILE DROPDOWN LOGIC
----------------------------- */
const supportToggle = document.getElementById('supportToggle');
const supportDropdown = document.getElementById('supportDropdown');
const moreToggle = document.getElementById('moreToggle');
const moreDropdown = document.getElementById('moreDropdown');

function toggleDropdown(toggleBtn, dropdown) {
  const isOpen = dropdown.classList.contains('show');
  if (isOpen) {
    dropdown.classList.remove('show');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
  } else {
    dropdown.classList.add('show');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }
}

function closeOtherDropdowns(exceptBtnId) {
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
    if (btn.id !== exceptBtnId) btn.classList.remove('active');
  });

  document.querySelectorAll('.mobile-dropdown-content').forEach(drop => {
    if (
      (exceptBtnId === 'supportToggle' && drop.id !== 'supportDropdown') ||
      (exceptBtnId === 'moreToggle' && drop.id !== 'moreDropdown')
    ) {
      drop.classList.remove('show');
    }
  });
}

/* Attach listeners - will respect allowMultiple setting */
if (supportToggle && supportDropdown) {
  supportToggle.addEventListener('click', e => {
    e.preventDefault();
    console.log('Support toggle clicked. allowMultiple:', allowMultiple);
    if (!allowMultiple) closeOtherDropdowns('supportToggle');
    toggleDropdown(supportToggle, supportDropdown);
  });

  // close dropdown when clicking a link (optional)
  supportDropdown.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      supportDropdown.classList.remove('show');
      supportToggle.classList.remove('active');
    });
  });
}

if (moreToggle && moreDropdown) {
  moreToggle.addEventListener('click', e => {
    e.preventDefault();
    console.log('More toggle clicked. allowMultiple:', allowMultiple);
    if (!allowMultiple) closeOtherDropdowns('moreToggle');
    toggleDropdown(moreToggle, moreDropdown);
  });

  moreDropdown.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      moreDropdown.classList.remove('show');
      moreToggle.classList.remove('active');
    });
  });
}

/* Accessibility init */
[supportToggle, moreToggle].forEach(btn => {
  if (btn && !btn.hasAttribute('aria-expanded')) btn.setAttribute('aria-expanded', 'false');
});

/* -----------------------------
     PARALLAX BACKGROUND
----------------------------- */
(function parallaxBg() {
  const bg = document.querySelector('.parallax-bg');
  if (!bg) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bg.style.willChange = 'auto';
    return;
  }

  const isMobile = ('ontouchstart' in window) || navigator.maxTouchPoints > 1 || /Mobi|Android/i.test(navigator.userAgent);
  const speed = 0.22;
  let lastY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    lastY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const y = Math.round(-lastY * speed);
        bg.style.transform = `translate3d(0, ${y}px, 0)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (isMobile) {
    // tweak effect for mobile if needed (kept for future opts)
  }
  
  /* -----------------------------
       TYPEWRITER EFFECT
  ----------------------------- */
  (function () {
    // Words to rotate through
    const words = ["VPS", "Game"];
    const el = document.querySelector(".changing.text");

    if (!el) return;

    let wordIndex = 0;
    let charIndex = 0;
    let mode = "typing"; // can be "typing" or "deleting"
    const typingSpeed = 90;     // ms per character while typing
    const deletingSpeed = 50;   // ms per character while deleting
    const holdAfterTyping = 1200; // hold the full word before deleting
    const holdAfterDeleting = 200; // pause after deleting before typing next
    const wait = (ms) => new Promise((res) => setTimeout(res, ms));

    // Prevent layout jump by reserving width equal to longest word
    const maxLen = words.reduce((a, b) => a.length > b.length ? a : b).length;
    el.style.minWidth = maxLen + "ch";

    async function loop() {
      while (true) {
        const currentWord = words[wordIndex];

        if (mode === "typing") {
          charIndex++;
          el.textContent = currentWord.slice(0, charIndex);
          if (charIndex >= currentWord.length) {
            mode = "holding";
            await wait(holdAfterTyping);
            mode = "deleting";
          } else {
            await wait(typingSpeed);
          }
        } else if (mode === "deleting") {
          charIndex--;
          el.textContent = currentWord.slice(0, charIndex);
          if (charIndex <= 0) {
            wordIndex = (wordIndex + 1) % words.length;
            mode = "typing";
            await wait(holdAfterDeleting);
          } else {
            await wait(deletingSpeed);
          }
        }
      }
    }

    // Initialize the first word and start animation
    el.textContent = words[0];
    charIndex = words[0].length;
    setTimeout(loop, 900);
  })(); // End of typewriter IIFE
  
})(); // ✅ Properly closed parallaxBg IIFE
(function(){
  // Animate circle gauge + count ups.
  // Configuration: change targets here or set data attributes.
  const gaugePercent = 11; // numeric percent (0-100) for the ring; you can update dynamically
  const gaugeRing = document.querySelector('.gauge-ring');
  const gaugeText = document.querySelector('.gauge-value');

  // Count-up function (upgraded: supports suffix & decimals)
  function animateCount(el, target, duration = 1200, opts = {}) {
    const suffix = opts.suffix || '';
    const decimals = Number.isFinite(opts.decimals) ? opts.decimals : 0;
    const start = Number(el.textContent.replace(/[^\d.-]/g, '')) || 0;
    const end = Number(target);
    const startTime = performance.now();
    function tick(now){
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic-ish
      const current = start + (end - start) * eased;
      el.textContent = current.toFixed(decimals) + suffix;
      if(t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Animate ring by stroke-dashoffset (circle circumference = 2πr)
  function animateGauge(percent, duration = 1200) {
    if(!gaugeRing || !gaugeText) return;
    const r = gaugeRing.r.baseVal.value;
    const c = 2 * Math.PI * r;
    gaugeRing.style.strokeDasharray = c.toFixed(2);
    // from full offset (hidden) to offset representing (100 - percent)
    const startOffset = c;
    const endOffset = c * (1 - (percent / 100));
    const startTime = performance.now();
    function step(now){
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const offset = startOffset + (endOffset - startOffset) * eased;
      gaugeRing.style.strokeDashoffset = offset.toFixed(2);
      gaugeText.textContent = Math.round(percent * eased) + '%';
      if(t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Kick off on viewport visible — use IntersectionObserver for nice perf
  function onVisible(entries, obs){
    entries.forEach(entry=>{
      if(entry.isIntersecting) {
        // trigger animations
        animateGauge(gaugePercent, 1200);

        document.querySelectorAll('.stat-number').forEach(el=>{
          const target = el.dataset.target || el.getAttribute('data-target') || el.textContent;
          // plain numbers (no %)
          animateCount(el, target, 1100);
        });

        document.querySelectorAll('.highlight-number').forEach(el=>{
          // animate percent — show % during the whole count
          const target = parseFloat(el.dataset.target || 100);
          animateCount(el, target, 1100, { suffix: '%' });
        });

        obs.unobserve(entry.target);
      }
    });
  }

  const obs = new IntersectionObserver(onVisible, {threshold: 0.15});
  const statsSection = document.getElementById('server-stats');
  if(statsSection) obs.observe(statsSection);

  // Optional: allow external updates (e.g. from WebSocket)
  window.lumoxStats = {
    setGauge(p) {
      const clamped = Math.max(0, Math.min(100, Number(p)));
      // apply instantly
      if(gaugeRing){
        const r = gaugeRing.r.baseVal.value;
        const c = 2 * Math.PI * r;
        gaugeRing.style.strokeDasharray = c.toFixed(2);
        gaugeRing.style.strokeDashoffset = (c * (1 - (clamped/100))).toFixed(2);
        if(gaugeText) gaugeText.textContent = clamped + '%';
      }
    },
    setPlayers(n){ document.querySelectorAll('.stat-number')[0].textContent = Number(n); },
    setServers(n){ document.querySelectorAll('.stat-number')[1].textContent = Number(n); },
    setHighlight(n){ const el = document.querySelector('.highlight-number'); if(el){ el.textContent = n + '%'; } }
  };
})();

// ENTRY ANIMATIONS + bar-fill via IntersectionObserver
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Gracefully skip animations if user prefers reduced motion
  if (prefersReduced) {
    ['topline','hero','bigCard','rightStack','tallCard'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('show');
      el?.querySelectorAll('.bar').forEach(bar => {
        const fill = bar.getAttribute('data-fill') || 60;
        bar.style.width = fill + '%';
      });
    });
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const tgt = entry.target;
        tgt.classList.add('show');

        // animate bars once
        tgt.querySelectorAll('.bar').forEach(bar => {
          const fill = Number(bar.getAttribute('data-fill')) || 60;
          // ensure starting width for CSS transitions
          if (!bar.dataset.init) {
            bar.style.width = '0%';
            bar.dataset.init = '1';
          }
          setTimeout(() => (bar.style.width = fill + '%'), 120);
        });

        // We only need to animate once
        obs.unobserve(tgt);
      }
    });
  }, {
    threshold: 0.18,
    root: null,
    rootMargin: '0px 0px -5% 0px' // nudge for earlier trigger on smaller screens
  });

  // Observe major parts if present
  ['topline','hero','bigCard','rightStack','tallCard'].forEach(id => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });

  // Fallback: animate hero/topline shortly after load (if already in view)
  window.addEventListener('load', () => {
    const hero = document.getElementById('hero');
    const tline = document.getElementById('topline');
    if (hero) setTimeout(() => hero.classList.add('show'), 220);
    if (tline) setTimeout(() => tline.classList.add('show'), 120);
  });
})();

// MOD STRIP: infinite-seeming horizontal marquee
(function () {
  const strip = document.getElementById('modStrip');
  const track = document.getElementById('modTrack');
  if (!strip || !track) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let speed = 40;           // px/s (will be adjusted on resize)
  let paused = false;
  let pos = 0;
  let lastTs = null;
  let loopWidth = 0;
  let rafId = null;

  // Duplicate children until we have at least 2x strip width for seamless loop
  function buildLoop() {
    // reset (in case of resize)
    const items = Array.from(track.children).filter(n => !n.classList?.contains('__clone'));
    track.innerHTML = '';
    items.forEach(n => track.appendChild(n)); // original pass

    // Keep cloning until width is >= 2x container
    const base = items.map(n => n.cloneNode(true));
    // First clone pass
    base.forEach(cl => { cl.classList.add('__clone'); track.appendChild(cl); });

    // Measure and, if still short, keep cloning
    let guard = 0;
    while (track.scrollWidth < strip.clientWidth * 2 && guard < 8) {
      const more = items.map(n => {
        const c = n.cloneNode(true);
        c.classList.add('__clone');
        return c;
      });
      more.forEach(c => track.appendChild(c));
      guard++;
    }

    // compute the repeat segment (half of total if we cloned at least once)
    loopWidth = Math.floor(track.scrollWidth / 2);
  }

  function start() {
    if (rafId) cancelAnimationFrame(rafId);
    lastTs = null;
    rafId = requestAnimationFrame(step);
  }

  function step(ts) {
    if (lastTs === null) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    if (!paused) {
      pos -= speed * dt;
      // wrap precisely at loopWidth so first half seamlessly follows the second
      if (loopWidth > 0 && Math.abs(pos) >= loopWidth) pos += loopWidth;
      track.style.transform = 'translate3d(' + pos + 'px,0,0)';
    }
    rafId = requestAnimationFrame(step);
  }

  // Pause on hover / touch
  strip.addEventListener('mouseenter', () => (paused = true));
  strip.addEventListener('mouseleave', () => (paused = false));
  strip.addEventListener('touchstart', () => (paused = true), { passive: true });
  strip.addEventListener('touchend', () => (paused = false));

  // Responsive speed & rebuild on resize (debounced)
  let resizeTo;
  function onResize() {
    clearTimeout(resizeTo);
    resizeTo = setTimeout(() => {
      speed = Math.max(30, Math.min(90, window.innerWidth / 14));
      const currentWasPaused = paused;
      paused = true;            // freeze while rebuilding
      pos = 0;
      track.style.transform = 'translate3d(0,0,0)';
      buildLoop();
      paused = currentWasPaused;
    }, 120);
  }
  window.addEventListener('resize', onResize);

  // If images inside track affect width, rebuild after they load
  function waitImagesThenBuild() {
    const imgs = track.querySelectorAll('img');
    let pending = imgs.length;
    if (!pending) {
      buildLoop();
      if (!prefersReduced) start();
      return;
    }
    imgs.forEach(img => {
      if (img.complete) {
        if (--pending === 0) {
          buildLoop();
          if (!prefersReduced) start();
        }
      } else {
        img.addEventListener('load', () => {
          if (--pending === 0) {
            buildLoop();
            if (!prefersReduced) start();
          }
        }, { once: true });
        img.addEventListener('error', () => {
          if (--pending === 0) {
            buildLoop();
            if (!prefersReduced) start();
          }
        }, { once: true });
      }
    });
  }

  // Kickoff
  // Hint: add CSS: #modTrack { will-change: transform; }
  speed = Math.max(30, Math.min(90, window.innerWidth / 14));
  if (prefersReduced) {
    // No animation; ensure layout still looks fine
    buildLoop();
    track.style.transform = 'translate3d(0,0,0)';
  } else {
    waitImagesThenBuild();
  }
})();

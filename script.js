/* ----------------------------
   CONFIG: allowMultiple
   true  => both dropdowns can stay open
   false => opening one closes the other
----------------------------- */
const allowMultiple = true;

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
  })();




/* main.js — consolidated site scripts (parallax, reveals, navbar, carousel, features toggle, cubes, radar, pro game selector) */
(function () {
  'use strict';

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
      // tweak effect for mobile if needed
    }
  })();


  /* -----------------------------
     SCROLL REVEALS
     ----------------------------- */
  (function scrollReveals() {
    const reveals = document.querySelectorAll('.reveal, .fade-in, .fade-up, .slide-left, .slide-right, .zoom-in');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14 });

      reveals.forEach(el => obs.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('active'));
    }
  })();


  /* -----------------------------
     NAVBAR SCROLLED STATE
     ----------------------------- */
  (function navScrollToggle() {
    const nav = document.getElementById('siteNav');
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();


  /* -----------------------------
     PLANS CAROUSEL
     ----------------------------- */
  (function plansCarousel() {
    const plans = [
      { id:'basic', title:'Dirt', price:'$5/mo', meta:'Perfect for small projects', img:'assets/Dirt_plan.png', badge:'Basic' },
      { id:'pro1', title:'Stone', price:'$9/mo', meta:'Popular', img:'assets/iron_plan.png', badge:'Popular' },
      { id:'pro2', title:'Iron', price:'$12/mo', meta:'Great for growing businesses', img:'assets/stone_plan.png', badge:'Best Value' },
      { id:'ent1', title:'Gold', price:'$20/mo', meta:'High performance', img:'assets/gold_plan.png', badge:'Enterprise' },
      { id:'ent2', title:'Enterprise B', price:'$25/mo', meta:'Advanced support', img:'assets/enterprise.png', badge:'Enterprise' },
      { id:'edu', title:'Student', price:'$3/mo', meta:'Discounted', img:'assets/student.png', badge:'Discount' },
      { id:'trial', title:'Trial', price:'Free', meta:'Try free', img:'assets/trial.png', badge:'Trial' },
      { id:'custom', title:'Custom', price:'Contact', meta:'Tailored', img:'assets/custom.png', badge:'Custom' }
    ];

    const track = document.getElementById('carouselTrack');
    const thumbRow = document.getElementById('thumbRow');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!track || !thumbRow || !prevBtn || !nextBtn) return;

    let activeIndex = 2;

    function buildCarousel(){
      track.innerHTML = '';
      thumbRow.innerHTML = '';
      plans.forEach((p,i)=>{
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.dataset.index = i;
        item.innerHTML = `
          <div class="pricing-card-mini" data-plan="${p.id}">
            <span class="badge">${p.badge}</span>
            <img src="${p.img}" class="plan-illustration" alt="${p.title}">
            <h3>${p.title}</h3>
            <div class="price">${p.price}</div>
            <div class="meta">${p.meta}</div>
            <a class="order-small" href="#order">Order</a>
          </div>
        `;
        item.addEventListener('click', ()=> jumpTo(i));
        track.appendChild(item);

        const t = document.createElement('div');
        t.className = 'thumb';
        t.dataset.index = i;
        t.innerHTML = `<img src="${p.img}" alt="${p.title}">`;
        t.addEventListener('click', (e)=> { e.stopPropagation(); jumpTo(i); });
        thumbRow.appendChild(t);
      });

      requestAnimationFrame(() => update());
    }

    function update(){
      const items = Array.from(track.children);
      if (!items.length) return;

      const containerW = track.parentElement.clientWidth;
      const gap = parseFloat(getComputedStyle(track).gap) || 28;
      const cardW = items[0].getBoundingClientRect().width;
      const centerOffset = (containerW - cardW) / 2;
      const translateX = - (activeIndex * (cardW + gap)) + centerOffset;

      track.style.transform = `translateX(${translateX}px)`;

      items.forEach(it => {
        it.classList.toggle('active', Number(it.dataset.index) === activeIndex);
      });
      document.querySelectorAll('.thumb').forEach(t =>
        t.classList.toggle('active', Number(t.dataset.index) === activeIndex)
      );
    }

    function next(){ activeIndex = (activeIndex + 1) % plans.length; update(); }
    function prev(){ activeIndex = (activeIndex - 1 + plans.length) % plans.length; update(); }
    function jumpTo(i){ activeIndex = i % plans.length; update(); }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    window.addEventListener('keydown', e => {
      if(e.key === 'ArrowLeft') prev();
      if(e.key === 'ArrowRight') next();
    });
    window.addEventListener('resize', ()=> requestAnimationFrame(update));

    buildCarousel();
  })();

})(); // end top-level IIFE


/* -----------------------------
   FLOATING MINECRAFT-STYLE CUBES
   ----------------------------- */
(function(){
  const canvas = document.getElementById("cubeCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = 400;
  canvas.height = 400;

  // Minecraft block colors
  const cubeColors = {
    top: "#6baa3b",   // grass
    left: "#8b5a2b",  // dark dirt
    right: "#a0522d", // lighter dirt
  };

  function drawCube(x, y, size, color, floatOffset) {
    const h = size / 2;

    // top
    ctx.fillStyle = color.top;
    ctx.beginPath();
    ctx.moveTo(x, y - floatOffset);
    ctx.lineTo(x + size, y - h - floatOffset);
    ctx.lineTo(x + 2 * size, y - floatOffset);
    ctx.lineTo(x + size, y + h - floatOffset);
    ctx.closePath();
    ctx.fill();

    // left
    ctx.fillStyle = color.left;
    ctx.beginPath();
    ctx.moveTo(x, y - floatOffset);
    ctx.lineTo(x, y + size - floatOffset);
    ctx.lineTo(x + size, y + h + size - floatOffset);
    ctx.lineTo(x + size, y + h - floatOffset);
    ctx.closePath();
    ctx.fill();

    // right
    ctx.fillStyle = color.right;
    ctx.beginPath();
    ctx.moveTo(x + 2 * size, y - floatOffset);
    ctx.lineTo(x + 2 * size, y + size - floatOffset);
    ctx.lineTo(x + size, y + h + size - floatOffset);
    ctx.lineTo(x + size, y + h - floatOffset);
    ctx.closePath();
    ctx.fill();
  }

  let t = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw floating cubes
    for (let i = 0; i < 3; i++) {
      const offset = Math.sin(t / 20 + i) * 10;
      drawCube(100 + i * 80, 150 + i * 20, 40, cubeColors, offset);
    }

    t++;
    requestAnimationFrame(animate);
  }

  animate();
})();


/* -----------------------------
   Ping Radar — script (unchanged logic preserved)
   ----------------------------- */

/* ========== CONFIG: servers ========== */
const SERVERS = [
  { id:'eu', name:'EU — London', region:'eu-west-2', baseline:28 },
  { id:'us', name:'US — Virginia', region:'us-east-1', baseline:42 },
  { id:'in', name:'Asia — Mumbai', region:'ap-south-1', baseline:72 },
  { id:'au', name:'Oceania — Sydney', region:'ap-southeast-2', baseline:118 },
  { id:'sa', name:'SA — São Paulo', region:'sa-east-1', baseline:160 }
];
/* ======================================= */

const radarCanvas = document.getElementById('radar');
const listEl = document.getElementById('list');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');

let running = false;
const state = {};
let raf = null;

/* setup UI list and state */
function buildUI(){
  if (!listEl) return;
  listEl.innerHTML = '';
  SERVERS.forEach((s,i)=>{
    const el = document.createElement('div');
    el.className = 'srv';
    el.id = 'srv-'+s.id;
    el.innerHTML = `
      <div class="logo" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="#00b8ff" stroke-width="1.6" stroke-linecap="round"/></svg></div>
      <div class="info">
        <div class="name">${s.name}</div>
        <div class="region">${s.region}</div>
        <canvas class="spark" id="spark-${s.id}"></canvas>
      </div>
      <div class="val" id="val-${s.id}">--</div>
    `;
    listEl.appendChild(el);

    const spark = document.getElementById('spark-'+s.id);
    // handle case where spark may not be present yet
    if (!spark) {
      state[s.id] = {
        cfg: s,
        x: 0, y:0,
        valEl: document.getElementById('val-'+s.id),
        sparkCtx: null,
        sparkEl: null,
        history: Array(28).fill(null),
        ripples: []
      };
      return;
    }

    spark.width = spark.clientWidth * (window.devicePixelRatio || 1);
    spark.height = spark.clientHeight * (window.devicePixelRatio || 1);
    const sctx = spark.getContext('2d');
    sctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    state[s.id] = {
      cfg: s,
      x: 0, y:0, // radar coords set later
      valEl: document.getElementById('val-'+s.id),
      sparkCtx: sctx,
      sparkEl: spark,
      history: Array(28).fill(null),
      ripples: []
    };
  });
}

/* radar sizing & compute server positions around circle */
function resizeRadar(){
  if (!radarCanvas) return;
  const rect = radarCanvas.getBoundingClientRect();
  radarCanvas.width = rect.width * (window.devicePixelRatio || 1);
  radarCanvas.height = rect.height * (window.devicePixelRatio || 1);
  radarCanvas.style.width = rect.width+'px';
  radarCanvas.style.height = rect.height+'px';
  const ctx = radarCanvas.getContext('2d');
  if (ctx) ctx.setTransform(1,0,0,1,0,0); // reset
  if (ctx) ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

  const cx = rect.width/2, cy = rect.height/2;
  const radius = Math.min(rect.width, rect.height) * 0.35;
  SERVERS.forEach((s,i)=>{
    if (!state[s.id]) return;
    const angle = (i / SERVERS.length) * Math.PI * 2 - Math.PI/2;
    state[s.id].x = cx + Math.cos(angle) * radius;
    state[s.id].y = cy + Math.sin(angle) * radius;
  });
}

/* draw radar base + active ripples */
function drawRadar(now){
  if (!radarCanvas) return;
  const ctx = radarCanvas.getContext('2d');
  if (!ctx) return;
  const w = radarCanvas.clientWidth;
  const h = radarCanvas.clientHeight;
  ctx.clearRect(0,0,w,h);

  const cx = w/2, cy = h/2;
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  for(let r=1;r<=4;r++){
    ctx.beginPath();
    ctx.arc(cx,cy, (Math.min(w,h)*0.08)*r, 0, Math.PI*2);
    ctx.stroke();
  }

  for(const id in state){
    const st = state[id];
    if (!st) continue;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.arc(st.x, st.y, 5, 0, Math.PI*2);
    ctx.fill();

    st.ripples = st.ripples.filter(rip => {
      const t = (now - rip.t0) / 1000;
      if(t > rip.duration) return false;
      const progress = t / rip.duration;
      const radius = 8 + progress * rip.maxRadius;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = rip.color.replace('ALPHA', String(1 - progress));
      ctx.globalAlpha = 1;
      ctx.arc(st.x, st.y, radius, 0, Math.PI*2);
      ctx.stroke();
      return true;
    });
  }
}

/* create ripple for server on ping event */
function emitRipple(id, ping){
  const st = state[id];
  if (!st) return;
  const quality = ping === 999 ? 'bad' : (ping < 60 ? 'good' : ping < 150 ? 'warn' : 'bad');
  const color = quality === 'good' ? 'rgba(32,209,138,ALPHA)' : quality === 'warn' ? 'rgba(245,194,66,ALPHA)' : 'rgba(255,95,95,ALPHA)';
  st.ripples.push({
    t0: performance.now(),
    duration: 1.2 + Math.random()*0.6,
    maxRadius: Math.min(radarCanvas.clientWidth || 300, radarCanvas.clientHeight || 300) * 0.45,
    color
  });
}

/* update per-server UI sparkline & numeric */
function updateServerUI(id, ping){
  const st = state[id];
  if (!st) return;
  st.history.push(ping === 999 ? 999 : ping);
  if(st.history.length > 28) st.history.shift();
  if (st.valEl) st.valEl.textContent = (ping===999 ? '--' : ping+'ms');
  drawSpark(id);
}

/* draw small sparkline for a server */
function drawSpark(id){
  const st = state[id];
  if (!st || !st.sparkCtx || !st.sparkEl) return;
  const ctx = st.sparkCtx;
  const w = st.sparkEl.clientWidth;
  const h = st.sparkEl.clientHeight;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  ctx.fillRect(0,0,w,h);

  const data = st.history.filter(v=>v!==null && v!==undefined);
  if(!data.length) return;
  const valid = data.filter(v=>v!==999);
  const max = Math.max(200, ...(valid.length ? valid : [200]));
  const min = Math.min(0, ...(valid.length ? valid : [0]));

  ctx.beginPath();
  data.forEach((v,i)=>{
    const x = (i/(data.length-1 || 1))*w;
    const y = (v===999) ? h : h - ((v - min) / (max - min)) * h;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
  ctx.fillStyle = 'rgba(0,200,230,0.03)';
  ctx.fill();
}

/* simulate a ping measurement (keeps occasional packet loss) */
function simulatePing(st){
  const base = st.cfg.baseline;
  const variance = 20;
  const a = (Math.random()-0.5) + (Math.random()-0.5);
  const delta = Math.round(a * variance * 1.2);
  const ping = clamp(Math.round(base + delta + (Math.random()-0.5)*10), 2, 2000);
  const lossChance = clamp(0.02 + Math.abs(delta)/600, 0.01, 0.35);
  const lost = Math.random() < lossChance;
  return { ping: lost ? 999 : ping, lost };
}

function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

/* main loop: schedule updates ~1s each with slight jitter and animate radar ripples */
function loop(now){
  for(const id in state){
    const st = state[id];
    if(!st) continue;
    if(!st.nextTick) st.nextTick = now + 900 + Math.random()*200 + (Math.random()*200);
    if(now >= st.nextTick){
      const res = simulatePing(st);
      updateServerUI(id, res.ping);
      emitRipple(id, res.ping);
      st.nextTick = now + 900 + Math.random()*260;
    }
  }
  drawRadar(now);
  raf = requestAnimationFrame(loop);
}

/* controls */
if (startBtn) startBtn.addEventListener('click', ()=>{ 
  if(running) return;
  running = true;
  startBtn.disabled = true;
  if (stopBtn) stopBtn.disabled = false;
  raf = requestAnimationFrame(loop);
});
if (stopBtn) stopBtn.addEventListener('click', ()=>{ 
  running = false;
  if (startBtn) startBtn.disabled = false;
  if (stopBtn) stopBtn.disabled = true;
  if(raf) cancelAnimationFrame(raf);
});

/* init everything */
function initRadar(){
  buildUI();
  resizeRadar();
  window.addEventListener('resize', resizeRadar);
  // seed history
  for(const id in state){
    const st = state[id];
    if (!st) continue;
    for(let i=0;i<6;i++){
      const r = simulatePing(st);
      st.history.push(r.ping===999?999:r.ping);
    }
    drawSpark(id);
  }
  if (stopBtn) stopBtn.disabled = true;
}

initRadar();

/* helpers: expose update function so you could feed real pings later */
window.updatePingFor = function(id, ping){
  if(!state[id]) return;
  updateServerUI(id, ping);
  emitRipple(id, ping);
};


/* -----------------------------
   Pro Game Selector with animations (fully organized & fixed)
   ----------------------------- */
(function(){
  'use strict';

  const panel = document.querySelector('.pgs-panel');
  if(!panel) return;

  /* SVG icons used inside plan cards */
  const ICONS = {
    players: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#9AA6C1" d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a4 4 0 014-4h8a4 4 0 014 4v1H4v-1z"/></svg>`,
    ram: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="7" width="18" height="10" rx="2" fill="#9AA6C1"/><rect x="6" y="9" width="12" height="6" fill="#051023"/></svg>`,
    days: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="#9AA6C1"/><path d="M7 3v4M17 3v4" stroke="#051023" stroke-width="1.2"/></svg>`
  };

  /* Data: edit paths/prices as needed */
const GAME_DATA = [
  {
    key: 'minecraft',
    name: 'Minecraft',
    hero: 'assets/minecraft-card.png',
    thumb: 'assets/thumb-minecraft.jpg',
    popout: 'assets/steve_alexcard.png',
    desc: 'High-performance dedicated servers with automated backups and a mod manager. Perfect for larger groups and modded gameplay.',
    plans: [
      { id:'double', name:'Sapling', slots:'5–10', ram:'2GB', period:'30d', old:'₹342', price:'₹171', badge:'Popular', icon: 'assets/double.png' },
      { id:'quadro', name:'Stronghold', slots:'20+', ram:'4GB', period:'30d', old:'₹513', price:'₹342', badge:'', icon: 'assets/quadro.png' },
      { id:'ultra', name:'Overlord', slots:'30+', ram:'6GB', period:'30d', old:'₹684', price:'₹513', badge:'BestValue', icon: 'assets/ultra.png' }
    ]
  },
  {
    key: 'rust',
    name: 'Rust',
    hero: 'assets/rust-card.jpg',
    thumb: 'assets/thumb-rust.jpg',
    popout: 'assets/rust_pop.png',
    desc: 'PvP survival servers, hardened for large groups with mod & plugin support.',
    plans: [
      { id:'r-basic', name:'Outpost', slots:'20', ram:'4GB', period:'30d', old:'$9.99', price:'₹342', badge:'', icon: 'assets/rust-basic.png' },
      { id:'r-pro', name:'Warlord', slots:'50', ram:'8GB', period:'30d', old:'$24.99', price:'₹684', badge:'Popular', icon: 'assets/rust-pro.png' }
    ]
  },
  {
    key: 'valheim',
    name: 'Valheim',
    hero: 'assets/valheim-card.jpg',
    thumb: 'assets/thumb-valheim.jpg',
    popout: 'assets/valheim-art.png',
    desc: 'Fast, mod-friendly hosting with automatic snapshots and backups.',
    plans: [
      { id:'v-double', name:'Drakkar', slots:'10–20', ram:'4GB', period:'30d', old:'$8.99', price:'$6.99', badge:'', icon: 'assets/valheim-double.png' },
      { id:'v-ultra', name:'Yggdrasil', slots:'30+', ram:'8GB', period:'30d', old:'$18.99', price:'$14.99', badge:'Popular', icon: 'assets/valheim-ultra.png' }
    ]
  },
  {
    key: 'ark',
    name: 'ARK',
    hero: 'assets/ark-card.jpg',
    thumb: 'assets/thumb-ark.jpg',
    popout: 'assets/ark-dino.png',
    desc: 'Large maps and mod support with high-performance storage.',
    plans: [
      { id:'a-tribe', name:'Tribe', slots:'20', ram:'6GB', period:'30d', old:'$14.99', price:'$12.49', badge:'', icon: 'assets/ark-tribe.png' },
      { id:'a-alpha', name:'Alpha', slots:'50', ram:'12GB', period:'30d', old:'$39.99', price:'$29.99', badge:'Power', icon: 'assets/ark-alpha.png' }
    ]
  },
  {
    key: 'palworld',
    name: 'Palworld',
    hero: 'assets/palworld-card.jpg',
    thumb: 'assets/thumb-palworld.jpg',
    popout: 'assets/palworld-art.png',
    desc: 'Easy crossplay setup and low-latency regions worldwide.',
    plans: [
      { id:'p-basic', name:'Nestling', slots:'10', ram:'3GB', period:'30d', old:'$9.99', price:'$7.99', badge:'', icon: 'assets/nestling.png' },
      { id:'p-pro', name:'Alphabeast', slots:'25', ram:'6GB', period:'30d', old:'$19.99', price:'$15.99', badge:'Popular', icon: 'assets/alphabeast.png' }
    ]
  }
];


  /* DOM refs (scoped inside panel) */
  const plansColumn = panel.querySelector('#pgs-plansColumn');
  const mainImage = panel.querySelector('#pgs-mainImage');
  const mainTitle = panel.querySelector('#pgs-mainTitle');
  const mainText = panel.querySelector('#pgs-mainText');
  const thumbContainer = panel.querySelector('#pgs-thumbContainer');
  const thumbPrev = panel.querySelector('#pgs-thumbPrev');
  const thumbNext = panel.querySelector('#pgs-thumbNext');

  // Unified plans container for animation helper
  // If you prefer .pgs-plans as the container, ensure your markup matches.
  const plansContainerAlias = plansColumn;

  let currentIndex = 0;

  function buildThumbs(){
    if (!thumbContainer) return;
    thumbContainer.innerHTML = '';
    GAME_DATA.forEach((g, idx) => {
      const btn = document.createElement('button');
      btn.className = 'pgs-thumb';
      btn.setAttribute('aria-label', g.name);
      btn.dataset.idx = idx;
      btn.type = 'button';
      btn.innerHTML = `<img src="${g.thumb}" alt="${g.name}">`;
      if(idx === currentIndex) btn.classList.add('pgs-active');

      btn.addEventListener('click', () => setGame(idx));
      btn.addEventListener('keydown', e => {
        if(e.key === 'Enter' || e.key===' ') {
          e.preventDefault(); setGame(idx);
        }
      });

      thumbContainer.appendChild(btn);
    });
  }

  // UPDATED: renderPlans returns an array of DOM elements (does not append to DOM)
  function renderPlans(game) {
    const nodes = [];

    // preserve any heading/sub that were inside the column if needed by consumer (animation inserter will reattach)
    // We'll allow showPlansWithStagger to re-add them after clearing if needed.
    game.plans.forEach((p) => {
      const el = document.createElement('div');
      el.className = 'pgs-plan-card';
      el.tabIndex = 0;

      el.innerHTML = `
        <div class="pgs-plan-left">
          <div class="pgs-plan-icon" aria-hidden="true">
            ${p.icon ? `<img src="${p.icon}" alt="${p.name} icon" loading="lazy">` : p.name.charAt(0)}
          </div>
          <div style="min-width:0">
            <div class="pgs-plan-title">${p.name} ${p.badge ? `<span class="pgs-badge">${p.badge}</span>` : ''}</div>
            <div class="pgs-plan-meta">
              <div class="pgs-spec-row" aria-hidden="true">
                <div class="pgs-spec-item" title="${p.slots} players">${ICONS.players}<span>${p.slots} players</span></div>
                <div class="pgs-spec-item" title="${p.ram} RAM">${ICONS.ram}<span>${p.ram}</span></div>
                <div class="pgs-spec-item" title="${p.period} billing">${ICONS.days}<span>${p.period}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pgs-price-wrap">
          <div class="pgs-old-price">${p.old}</div>
          <div class="pgs-new-price">${p.price}</div>
        </div>
      `;

      el.addEventListener('click', ()=> {
        // note: when using showPlansWithStagger, the container will be plansContainerAlias
        const parent = plansContainerAlias || document;
        parent.querySelectorAll && parent.querySelectorAll('.pgs-plan-card').forEach(c=>c.classList.remove('pgs-active'));
        el.classList.add('pgs-active');
      });
      el.addEventListener('keydown', e=> { 
        if(e.key==='Enter' || e.key===' ') { e.preventDefault(); el.click(); } 
      });

      nodes.push(el);
    });

    return nodes;
  }
function updatePopoutForGame(game) {
  if (!panel) return;

  // create wrapper if missing
  let artWrap = panel.querySelector('.pgs-art-wrap');
  if (!artWrap) {
    artWrap = document.createElement('div');
    artWrap.className = 'pgs-art-wrap';
    panel.appendChild(artWrap);
  }

  // create pop image if missing
  let popImg = artWrap.querySelector('.pgs-popout');
  if (!popImg) {
    popImg = document.createElement('img');
    popImg.className = 'pgs-popout';
    popImg.loading = 'lazy';
    popImg.style.pointerEvents = 'none';
    artWrap.appendChild(popImg);
  }

  // clear old game-specific classes but keep base class
  artWrap.className = 'pgs-art-wrap';

  if (game && game.key) {
    const safeKey = String(game.key).replace(/[^a-z0-9\-_]/gi, '').toLowerCase();
    artWrap.classList.add(safeKey);
  }

  // show/hide image
  if (game && game.popout) {
    popImg.src = game.popout;
    popImg.alt = game.name + ' artwork';
    popImg.style.display = '';
    popImg.style.opacity = '1';
  } else {
    popImg.style.display = 'none';
    popImg.style.opacity = '0';
  }

  // small-screen guard
  const panelRect = panel.getBoundingClientRect();
  if (panelRect.width < 700 || window.innerWidth < 900) {
    artWrap.style.display = 'none';
    return;
  } else {
    artWrap.style.display = '';
  }

  // Per-game offset configuration (tweak these numbers visually)
  // right: px offset from panel's right (negative pushes further outside)
  // topPercent: vertical anchor in percent of panel height
  // width: wrapper width in px
  // translateX: % horizontal nudge for the image inside wrapper
  // scale: uniform scale (0.0 - 1.0+)
  // flip: boolean - true mirrors horizontally
  const offsets = {
    minecraft: { right: 1200,  topPercent: 100, width: 480, translateX: 6,  scale: 0.35, flip: false },
    ark:       { right: 600, topPercent: 50, width: 620, translateX: 12, scale: 0.95, flip: false },
    rust:      { right: 1240,  topPercent: 100, width: 420, translateX: 6,  scale: 0.35, flip: false },
    valheim:   { right: 950,  topPercent: 107, width: 520, translateX: 6, scale: 0.35, flip: false },
    palworld:  { right: -60,  topPercent: 50, width: 520, translateX: 10, scale: 0.7,  flip: false }
  };

  const key = game && game.key ? String(game.key).toLowerCase() : null;
  const cfg = offsets[key] || { right: -72, topPercent: 50, width: 520, translateX: 10, scale: 1, flip: false };

  // Apply wrapper geometry inline (keeps it robust across layouts)
  artWrap.style.position = 'absolute';
  artWrap.style.right = cfg.right + 'px';
  artWrap.style.top = cfg.topPercent + '%';
  artWrap.style.transform = 'translateY(-50%)';
  artWrap.style.width = cfg.width + 'px';
  artWrap.style.pointerEvents = 'none';
  artWrap.style.overflow = 'visible';
  artWrap.style.zIndex = 20;

  // Ensure image is positioned relative to wrapper so translate/scale behave predictably
  popImg.style.position = 'relative';
  popImg.style.top = '50%';
  popImg.style.left = '0';
  popImg.style.transformOrigin = 'center center';
  popImg.style.display = 'block';
  popImg.style.maxWidth = 'none'; // avoid browser shrinking the image unexpectedly

  // Apply per-game transform directly to the image (individual scale + translate + flip)
  // translateX: nudge along X (percent); translateY -50% centers vertically relative to wrapper
  // scale: per-game cfg.scale (unique for each game)
  // flip: optional horizontal mirror
  const tx = (typeof cfg.translateX !== 'undefined') ? cfg.translateX : 0;
  const s = (typeof cfg.scale !== 'undefined') ? cfg.scale : 1;
  const flipStr = cfg.flip ? ' scaleX(-1)' : '';
  popImg.style.transform = `translate(${tx}%, -50%) scale(${s})${flipStr}`;

}


// UPDATED: setGame builds plan nodes and calls showPlansWithStagger
function setGame(idx){
  const g = GAME_DATA[idx];
  if(!g) return;
  currentIndex = idx;

  // update preview
  if (mainImage) {
    mainImage.src = g.hero;
    mainImage.alt = g.name + " preview";
  }
  if (mainTitle) mainTitle.textContent = g.name + (g.key === 'minecraft' ? ' — Featured' : '');
  if (mainText) mainText.textContent = g.desc;

  // update pop-out art for this game
  updatePopoutForGame(g);

  // build plan nodes and animate them into the plans container
  const nodes = renderPlans(g);
  showPlansWithStagger(nodes);

    // update active thumb
    panel.querySelectorAll('.pgs-thumb').forEach(t => 
      t.classList.toggle('pgs-active', Number(t.dataset.idx) === idx)
    );

    // scroll only horizontally, prevent vertical jump
    const activeThumb = panel.querySelector(`.pgs-thumb[data-idx="${idx}"]`);
    if(activeThumb) {
      activeThumb.scrollIntoView({
        behavior:'smooth',
        inline:'center',
        block:'nearest'  // no vertical scroll
      });
    }

    // focus first plan (keyboard users) without scrolling the page
    // wait a tick so the plans are appended
    setTimeout(() => {
      const firstPlan = plansContainerAlias && plansContainerAlias.querySelector ? plansContainerAlias.querySelector('.pgs-plan-card') : null;
      if(firstPlan) {
        try { 
          firstPlan.focus({ preventScroll: true });
        } catch (err) {
          const x = window.scrollX, y = window.scrollY;
          firstPlan.focus();
          window.scrollTo(x, y);
        }
      }
    }, 260); // matches animation timing so focus doesn't interrupt the effect
  }

  function scrollThumbs(dir='right'){
    const amount = 140;
    if (!thumbContainer) return;
    if(dir === 'left') thumbContainer.scrollBy({ left: -amount, behavior:'smooth'});
    else thumbContainer.scrollBy({ left: amount, behavior:'smooth'});
  }

  /* init */
  buildThumbs();
  setGame(0);

  // Left/Right buttons change game instead of just scrolling
  thumbPrev && thumbPrev.addEventListener('click', () => {
    setGame(Math.max(currentIndex - 1, 0));
  });
  thumbNext && thumbNext.addEventListener('click', () => {
    setGame(Math.min(currentIndex + 1, GAME_DATA.length - 1));
  });

  thumbPrev && thumbPrev.addEventListener('keydown', e => { 
    if(e.key==='Enter' || e.key===' ') { 
      e.preventDefault();
      setGame(Math.max(currentIndex - 1, 0));
    } 
  });
  thumbNext && thumbNext.addEventListener('keydown', e => { 
    if(e.key==='Enter' || e.key===' ') { 
      e.preventDefault();
      setGame(Math.min(currentIndex + 1, GAME_DATA.length - 1));
    } 
  });

  /* keyboard navigation scoped to panel (won't interfere with page-level handlers) */
  panel.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight') {
      setGame(Math.min(currentIndex + 1, GAME_DATA.length - 1));
    } else if(e.key === 'ArrowLeft') {
      setGame(Math.max(currentIndex - 1, 0));
    }
  });

  /* small UX: focus panel when pointer enters so arrow keys work on hover */
  panel.addEventListener('mouseenter', () => {
    try { panel.focus({ preventScroll: true }); } catch (e) { panel.focus(); }
  });

  /* HEADER RYZEN 9 FEATURES */
  document.addEventListener('DOMContentLoaded', function () {
    // Reveal containers immediately if IntersectionObserver wasn't added
    const revealTargets = document.querySelectorAll('.ctas-augment, .hero-augment, #hero');
    revealTargets.forEach(el => {
      // add the in-view class so CSS reveal runs
      el.classList.add('in-view');

      // also set a small CSS var so stagger delays still work
      el.style.setProperty('--st', '60ms');

      // pulse the ryzen pill if present
      const pill = el.querySelector('.ryzen-pill');
      if (pill) setTimeout(() => pill.classList.add('pulse'), 300);
    });

    // OPTIONAL: add simple mouse parallax to float icons if present
    const floats = document.querySelectorAll('.float-icons img.float');
    if (floats.length) {
      window.addEventListener('mousemove', e => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        floats.forEach((el, i) => {
          const depth = 6 + i * 4;
          el.style.transform = `translate3d(${dx * depth}px, ${dy * depth}px, 0)`;
        });
      });
    }
  });

  /* ========== Animation helper: showPlansWithStagger ========== */
  function showPlansWithStagger(planNodes) {
    const container = plansContainerAlias;
    if (!container) return;

    // Optional: preserve heading/sub elements at top if they exist
    const heading = container.querySelector('h3');
    const sub = container.querySelector('.pgs-sub');

    // 1) Fade out existing plans quickly (add class which CSS can target)
    container.classList.add('pgs-fade-out');

    // allow fadeOut to run then remove content
    setTimeout(() => {
      // clear but preserve heading/sub if present (we'll reattach them)
      container.innerHTML = '';
      if (heading) container.appendChild(heading);
      if (sub) container.appendChild(sub);
      container.classList.remove('pgs-fade-out');

      // 2) Insert new nodes (ensure they have class .pgs-plan-card)
      planNodes.forEach((el, i) => {
        if (!el) return;
        if (!el.classList.contains('pgs-plan-card')) el.classList.add('pgs-plan-card');
        // set the stagger index (used by CSS animation-delay)
        el.style.setProperty('--i', i.toString());
        // start hidden (in case other styles interfere)
        el.style.opacity = '0';
        container.appendChild(el);
      });

      // 3) Force reflow then add animate class to run animations
      requestAnimationFrame(() => {
        container.classList.remove('pgs-animate');
        // small timeout to guarantee reflow then add class so CSS animation runs
        setTimeout(() => container.classList.add('pgs-animate'), 20);
      });

    }, 180); // 180ms fade out (matches CSS fade out expectation)
  }
})(); // <-- FIX: properly close Pro Game Selector IIFE here


(function(){
  function makeMetaHtml(players, ram, days){
    return `
      <div class="plan-meta" aria-hidden="false">
        <span class="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11z"/><path d="M2 20c0-2.667 2.667-4 6-4s6 1.333 6 4"/>
          </svg>${players}
        </span>
        <span class="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01"/>
          </svg>${ram}
        </span>
        <span class="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>
          </svg>${days}
        </span>
      </div>`
  }

  // Find all plan card containers — adjust selector if needed
var cards = document.querySelectorAll('.pgs-plan-card');

  cards.forEach(card => {
    if (card.querySelector('.plan-meta')) return;

    var text = card.innerText || '';
    var playersMatch = text.match(/(\d+\+? *-? *\d*)\s*players/i);
    var ramMatch = text.match(/(\d+\s*GB|GB\s*\d+)/i);
    var daysMatch = text.match(/(\d+\s*d|30d|\d+\s*days)/i);

    var players = playersMatch ? playersMatch[1].trim() + ' players' : '5–10 players';
    var ram = ramMatch ? ramMatch[1].replace(/\s+/g,' ') : '4 GB RAM';
    var days = daysMatch ? daysMatch[1].replace(/\s+/g,'') : '30d';

    card.insertAdjacentHTML('afterbegin', makeMetaHtml(players, ram, days));
  }); // ✅ close forEach properly

})(); // ✅ now close the icon-injector IIFE


/* End of main.js */

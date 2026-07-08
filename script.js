const app = { mouse: { x: 0, y: 0 }, particles: null, ticking: false };

const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, a), ms); }; };

/* ===== CURSOR ===== */
function initCursor() {
  const g = document.getElementById('cursor-glow'), d = document.getElementById('cursor-dot');
  if (!g || !d) return;
  if (window.matchMedia('(pointer: fine)').matches) { g.style.display = 'block'; d.style.display = 'block'; }
  const move = e => { app.mouse.x = e.clientX; app.mouse.y = e.clientY; g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px'; };
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseleave', () => { g.style.opacity = '0'; d.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { g.style.opacity = '1'; d.style.opacity = '1'; });
}

/* ===== LOADING ===== */
function initLoading() {
  const term = document.getElementById('termLine');
  const st = document.getElementById('loadingStatus');
  const trials = ['admin', '123456', 'root', 'test2024', 'ETHIOPIA'];
  let ti = 0, ci = 0;

  function typePwd(pwd, cb) {
    ci = 0;
    term.textContent = '> ';
    function tick() {
      if (ci < pwd.length) {
        term.textContent = '> ' + pwd.substring(0, ci + 1);
        ci++;
        setTimeout(tick, 60 + Math.random() * 50);
      } else { if (cb) cb(); }
    }
    tick();
  }

  function showStatus(msg, cls, delay, cb) {
    st.textContent = msg;
    st.className = 'loading-status ' + cls;
    st.style.opacity = '1';
    setTimeout(() => {
      if (cb) cb();
    }, delay);
  }

  function clearStatus(cb) {
    st.style.opacity = '0';
    setTimeout(() => { st.textContent = ''; if (cb) cb(); }, 200);
  }

  function nextTrial() {
    if (ti >= trials.length) return;
    const pwd = trials[ti];
    const isLast = (ti === trials.length - 1);
    typePwd(pwd, () => {
      showStatus(isLast ? '> ACCESS GRANTED' : '> ACCESS DENIED', isLast ? 'granted' : 'denied', 700, () => {
        if (isLast) {
          setTimeout(() => {
            const s = document.getElementById('loading-screen');
            if (s) s.classList.add('hidden');
          }, 500);
        } else {
          clearStatus(() => {
            ti++;
            setTimeout(nextTrial, 200);
          });
        }
      });
    });
  }

  setTimeout(nextTrial, 600);
}

/* ===== PARTICLES ===== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas || app.particles) return;
  const parent = canvas.parentElement, w = parent.clientWidth, h = parent.clientHeight;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const count = Math.min(60, Math.floor(w * h / 12000));
  const pts = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 2 + 0.5, a: Math.random() * 0.4 + 0.1 }));
  let id;
  function draw() { ctx.clearRect(0, 0, w, h); pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(192,192,192,${p.a})`; ctx.fill(); }); id = requestAnimationFrame(draw); }
  draw();
  const rh = debounce(() => { canvas.width = parent.clientWidth; canvas.height = parent.clientHeight; }, 200);
  window.addEventListener('resize', rh);
  app.particles = { draw, rh };
}

/* ===== CYBER GRID ===== */
function initGrid() {
  const g = document.getElementById('cyber-grid');
  if (!g) return;
  g.classList.add('cyber-grid');
  let o = 0, run = true;
  (function anim() { if (!run) return; o -= 0.3; g.style.backgroundPosition = `0 ${o}px`; requestAnimationFrame(anim); })();
}

/* ===== TYPED TEXT ===== */
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const words = ['Embedded Systems Engineer', 'Security Engineer', 'System Architect', 'CS Graduate'];
  let wi = 0, ci = 0, dir = 1, running = true;
  function tick() {
    if (!running) return;
    const word = words[wi];
    el.textContent = word.substring(0, ci);
    if (dir === 1) { ci++; if (ci > word.length) { dir = -1; setTimeout(tick, 1500); return; } }
    else { ci--; if (ci < 0) { dir = 1; wi = (wi + 1) % words.length; } }
    setTimeout(tick, dir === 1 ? 70 : 25);
  }
  setTimeout(tick, 2800);
}

/* ===== LETTER SWING ===== */
function initHeroLetters() {
  document.querySelectorAll('.hl').forEach((l, i) => setTimeout(() => l.classList.add('animate'), 2200 + i * 100));
}

/* ===== PARALLAX ===== */
function initParallax() {
  const sects = document.querySelectorAll('.section-bg');
  if (!sects.length) return;
  window.addEventListener('scroll', () => {
    if (!app.ticking) { requestAnimationFrame(() => { sects.forEach(s => { const r = s.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) { const sp = (r.top * 0.15); s.style.backgroundPositionY = `calc(50% + ${sp}px)`; } }); app.ticking = false; }); app.ticking = true; }
  }, { passive: true });
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const els = document.querySelectorAll('.scroll-reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }); }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ===== SKILL BARS ===== */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { const w = e.target.dataset.width; e.target.style.width = w + '%'; obs.unobserve(e.target); } }); }, { threshold: 0.4 });
  fills.forEach(f => obs.observe(f));
}

/* ===== COUNTERS ===== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { counters.forEach(c => { const t = parseInt(c.dataset.count); let v = 0; const s = Math.max(1, Math.floor(t / 50)); const iv = setInterval(() => { v += s; if (v >= t) { v = t; clearInterval(iv); } c.textContent = v + (t === 100 ? '%' : ''); }, 25); }); obs.unobserve(e.target); } });
  }, { threshold: 0.3 });
  obs.observe(counters[0].closest('.about-stats') || counters[0].parentElement);
}

/* ===== PROJECT TILT ===== */
function initProjectTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ===== NAV ===== */
function initNav() {
  const toggle = document.getElementById('nav-toggle'), menu = document.getElementById('nav-menu');
  if (toggle && menu) { toggle.addEventListener('click', () => menu.classList.toggle('open')); menu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => menu.classList.remove('open'))); }
  const links = document.querySelectorAll('.nav-link'), sections = document.querySelectorAll('.section-full, .section-scroll'), bar = document.getElementById('nav-scroll-bar');
  window.addEventListener('scroll', () => {
    const st = window.scrollY, dh = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (dh > 0 ? (st / dh) * 100 : 0) + '%';
    let active = 'hero';
    sections.forEach(s => { const t = s.offsetTop - 250, b = t + s.offsetHeight; if (st >= t && st < b) active = s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + active));
  }, { passive: true });
}

/* ===== CONTACT ===== */
function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const msg = document.getElementById('form-message').value.trim();
    if (!name || !email || !subject || !msg) { showNotif('ERROR: All fields required'); return; }
    window.location.href = `mailto:henokaregaa@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg)}`;
    form.reset(); showNotif('TRANSMISSION SENT');
  });
}

function showNotif(msg) {
  let n = document.getElementById('mini-notif');
  if (!n) { n = document.createElement('div'); n.id = 'mini-notif'; n.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.9);z-index:200000;background:#000;border:1px solid #C0C0C0;padding:20px 28px;max-width:340px;width:90%;opacity:0;visibility:hidden;transition:all 0.3s ease;text-align:center;pointer-events:none;'; n.innerHTML = '<div style="font-family:\'Courier New\',monospace;font-size:0.65rem;color:#C0C0C0;letter-spacing:2px;"></div>'; document.body.appendChild(n); }
  n.querySelector('div').textContent = msg; n.style.opacity = '1'; n.style.visibility = 'visible'; n.style.transform = 'translate(-50%,-50%) scale(1)';
  clearTimeout(n._timer); n._timer = setTimeout(() => { n.style.opacity = '0'; n.style.visibility = 'hidden'; n.style.transform = 'translate(-50%,-50%) scale(0.9)'; }, 2000);
}

/* ===== ROADMAP COUNTDOWN + LED ===== */
function initRoadmap() {
  const TARGET = new Date('2028-07-28T00:00:00');
  const START = new Date('2025-01-01T00:00:00');
  const totalMs = TARGET.getTime() - START.getTime();

  function pad(n) { return String(n).padStart(2, '0'); }
  function update() {
    const now = new Date();
    const diff = Math.max(0, TARGET.getTime() - now.getTime());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const dEl = document.getElementById('cdDays');
    const hEl = document.getElementById('cdHours');
    const mEl = document.getElementById('cdMins');
    const sEl = document.getElementById('cdSecs');
    if (dEl && hEl && mEl && sEl) {
      dEl.textContent = pad(days);
      hEl.textContent = pad(hours);
      mEl.textContent = pad(mins);
      sEl.textContent = pad(secs);
    }
    const pct = Math.min(100, Math.max(0, ((now.getTime() - START.getTime()) / totalMs) * 100));
    const bar = document.getElementById('ledBarFill');
    if (bar) bar.style.width = pct + '%';
    const digits = document.querySelectorAll('.led-digit');
    if (digits.length === 3) {
      const str = String(Math.floor(pct)).padStart(3, '0');
      digits[0].textContent = str[0];
      digits[1].textContent = str[1];
      digits[2].textContent = str[2];
    }
  }
  update();
  setInterval(update, 1000);
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initCursor();
  initParticles();
  initGrid();
  initHeroLetters();
  initTyped();
  initParallax();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initProjectTilt();
  initNav();
  initContact();
  initRoadmap();
});

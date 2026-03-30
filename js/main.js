/* ============================================================
   LightsOn International — Main JS
   ============================================================ */
'use strict';

// ── Nav scroll ──────────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ── Mobile toggle ────────────────────────────────────────────
const toggle = document.querySelector('.nav__toggle');
const links  = document.querySelector('.nav__links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(4.5px,4.5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4.5px,-4.5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    document.body.style.overflow = '';
    toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));
}

// ── Active link ──────────────────────────────────────────────
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// ── Fade-in on scroll ────────────────────────────────────────
const fis = document.querySelectorAll('.fi');
if (fis.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseFloat(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay * 1000);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  fis.forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = (i % 5) * 0.08;
    io.observe(el);
  });
}

// ── Counter animation ────────────────────────────────────────
function counter(el, target, suffix) {
  const t0 = performance.now();
  const dur = 1600;
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = (target < 10 ? (e * target).toFixed(1) : Math.floor(e * target)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

document.querySelectorAll('[data-count]').forEach(el => {
  const io2 = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      counter(el, parseFloat(el.dataset.count), el.dataset.suffix || '');
      io2.disconnect();
    }
  }, { threshold: 0.5 });
  io2.observe(el);
});

// ── Contact form ─────────────────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Message Received';
    btn.style.cssText = 'background:rgba(61,214,140,0.15);color:#3DD68C;border:1px solid rgba(61,214,140,0.3);cursor:default;';
    btn.disabled = true;
    setTimeout(() => { btn.innerHTML = orig; btn.style.cssText = ''; btn.disabled = false; form.reset(); }, 4500);
  });
}

// ── Smooth anchor scroll ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (el) {
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

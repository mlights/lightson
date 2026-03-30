/* ============================================================
   LightsOn International — Main JavaScript
   ============================================================ */

'use strict';

// ── Navigation ──────────────────────────────────────────────
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    navToggle.querySelectorAll('span').forEach((s, i) => {
      s.style.transform = isOpen
        ? (i === 0 ? 'rotate(45deg) translate(4.5px, 4.5px)' : i === 2 ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'scaleX(0)')
        : '';
      s.style.opacity = isOpen && i === 1 ? '0' : '';
    });
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      navToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });
}

// Set active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ── Scroll Fade-In ───────────────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');

if (fadeEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0) * 1000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = (i % 4) * 0.1;
    observer.observe(el);
  });
}

// ── Counter Animation ────────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  const start = performance.now();
  const duration = 1800;

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statEls = document.querySelectorAll('[data-count]');
if (statEls.length > 0) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.count), el.dataset.suffix || '');
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => countObserver.observe(el));
}

// ── Contact Form ─────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Message Sent';
    btn.disabled = true;
    btn.style.background = 'rgba(72,199,142,0.2)';
    btn.style.color = '#48c78e';
    btn.style.border = '1px solid rgba(72,199,142,0.3)';

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style = '';
      contactForm.reset();
    }, 4000);
  });
}

// ── Smooth anchor scroll ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

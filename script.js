(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile nav toggle */
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    navList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Scroll-spy: highlight active nav link (only for sections with a nav entry;
     sections without one, e.g. hero/positioning/orgs/ledger, clear the active state) */
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-list a'));
  const navHrefs = new Set(navLinks.map((link) => link.getAttribute('href')));

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const href = `#${entry.target.getAttribute('id')}`;
          navLinks.forEach((link) => {
            link.classList.toggle('active', navHrefs.has(href) && link.getAttribute('href') === href);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* Back to top */
  const backToTop = document.getElementById('backToTop');
  const heroSection = document.getElementById('hero');

  if (backToTop) {
    backToTop.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  if (backToTop && heroSection) {
    if ('IntersectionObserver' in window) {
      const topWatcher = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            backToTop.classList.toggle('is-visible', !entry.isIntersecting);
          });
        },
        { threshold: 0 }
      );
      topWatcher.observe(heroSection);
    } else {
      window.addEventListener('scroll', () => {
        backToTop.classList.toggle('is-visible', window.scrollY > heroSection.offsetHeight);
      });
    }
  }

  /* Scroll reveal */
  const revealEls = Array.from(document.querySelectorAll('.reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in-view'));
  } else {
    const revealer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => revealer.observe(el));
  }
})();

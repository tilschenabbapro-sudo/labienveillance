document.addEventListener('DOMContentLoaded', () => {

  /* ---- Thème clair / sombre ---- */
  const THEME_KEY = 'labienveillance-theme';
  const themeRoot = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');

  const setTheme = theme => {
    if (theme === 'dark') {
      themeRoot.setAttribute('data-theme', 'dark');
    } else {
      themeRoot.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) { /* ignore */ }
    if (themeBtn) {
      const dark = theme === 'dark';
      themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      themeBtn.setAttribute(
        'aria-label',
        dark ? 'Activer le thème clair' : 'Activer le thème sombre'
      );
    }
  };

  if (themeBtn) {
    const initial = themeRoot.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(initial);
    themeBtn.addEventListener('click', () => {
      const next = themeRoot.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  const navMobileMq = window.matchMedia('(max-width: 768px)');

  const closeNavSubmenus = () => {
    document.querySelectorAll('.menu-item-has-children.is-open').forEach(li => {
      li.classList.remove('is-open');
      const btn = li.querySelector(':scope > .nav__dropdown-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      const parentLink = li.querySelector(':scope > a');
      if (parentLink && parentLink.getAttribute('aria-expanded')) {
        parentLink.setAttribute('aria-expanded', 'false');
      }
    });
  };

  /* ---- Mobile menu ---- */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    const setMenuOpen = open => {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('open');
      const open = nav.classList.contains('open');
      setMenuOpen(open);
      if (!open) closeNavSubmenus();
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a, button[data-devis-modal]').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        nav.classList.remove('open');
        setMenuOpen(false);
        document.body.style.overflow = '';
        closeNavSubmenus();
      });
    });
  }

  /* ---- Sous-menu « Nos services » (mobile : ouverture au tap ; parent # en WP) ---- */
  document.querySelectorAll('.menu-item-has-children').forEach(li => {
    const trigger = li.querySelector(':scope > .nav__dropdown-toggle, :scope > a');
    const submenu = li.querySelector(':scope > .sub-menu');
    if (!trigger || !submenu) return;

    trigger.addEventListener('click', e => {
      const href = trigger.getAttribute('href');
      const isHashParent =
        trigger.tagName === 'A' &&
        (href === '#' || href === '#!' || href === '' || href === '/#');

      if (!navMobileMq.matches) {
        if (isHashParent) e.preventDefault();
        return;
      }

      e.preventDefault();
      const opening = !li.classList.contains('is-open');
      document.querySelectorAll('.menu-item-has-children.is-open').forEach(other => {
        if (other !== li) {
          other.classList.remove('is-open');
          const b = other.querySelector(':scope > .nav__dropdown-toggle');
          if (b) b.setAttribute('aria-expanded', 'false');
          const a = other.querySelector(':scope > a');
          if (a && a.getAttribute('aria-expanded')) a.setAttribute('aria-expanded', 'false');
        }
      });
      li.classList.toggle('is-open', opening);
      if (trigger.classList.contains('nav__dropdown-toggle')) {
        trigger.setAttribute('aria-expanded', opening ? 'true' : 'false');
      }
      if (trigger.tagName === 'A' && isHashParent) {
        trigger.setAttribute('aria-expanded', opening ? 'true' : 'false');
      }
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNavSubmenus();
  });

  /* ---- Sticky header shadow ---- */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Scroll animations ---- */
  const faders = document.querySelectorAll('.fade-in');
  if (faders.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    faders.forEach(el => obs.observe(el));
  } else {
    faders.forEach(el => el.classList.add('visible'));
  }

  /* ---- Active nav link ---- */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav a').forEach(link => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === currentPath || (currentPath.includes(href) && href !== '/')) {
      link.classList.add('active');
    }
    if (currentPath === '/' && (href === '/' || href === 'index.html')) {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('.nav .sub-menu a.active').forEach(link => {
    link.closest('.menu-item-has-children')?.classList.add('active-trail');
  });

  /* ---- Contact form : démo sans backend, ou soumission réelle (Formspree / Netlify) ---- */
  const form = document.querySelector('#contact-form');
  const thanks = document.getElementById('contact-form-thanks');
  const formCard = form?.closest('.form-card');

  if (thanks && formCard) {
    document.getElementById('contact-form-reset')?.addEventListener('click', () => {
      thanks.hidden = true;
      form.hidden = false;
      formCard.querySelector('h2')?.removeAttribute('hidden');
      form.querySelector('input, select, textarea')?.focus?.();
    });
  }

  if (form) {
    form.addEventListener('submit', e => {
      const action = (form.getAttribute('action') || '').trim();
      const forwardsToBackend =
        form.hasAttribute('data-netlify') ||
        /^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(action);
      if (forwardsToBackend) return;

      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Envoi en cours…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
        if (thanks && formCard) {
          form.hidden = true;
          thanks.hidden = false;
          formCard.querySelector('h2')?.setAttribute('hidden', '');
          document.getElementById('contact-form-reset')?.focus?.();
        }
      }, 1200);
    });
  }

  /* Fermer le menu mobile si ouverture de la modale devis depuis le hero */
  document.querySelectorAll('[data-devis-modal]').forEach(el => {
    el.addEventListener('click', () => {
      const t = document.querySelector('.menu-toggle');
      const n = document.querySelector('.nav');
      if (t && n && n.classList.contains('open')) {
        t.classList.remove('active');
        n.classList.remove('open');
        t.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        closeNavSubmenus();
      }
    });
  });
});

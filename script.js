(() => {
  const doc = document;
  const body = doc.body;
  const menuToggle = doc.querySelector('.menu-toggle');
  const nav = doc.querySelector('.nav');
  const navLinks = doc.querySelectorAll('.nav a');
  const faqItems = doc.querySelectorAll('.faq-item');
  const currentYear = doc.getElementById('current-year');
  const revealElements = doc.querySelectorAll('.reveal');
  const contactSection = doc.getElementById('contato');
  const rdFormHost = doc.getElementById('glaf-formulario-lp-outsourcing-de-expansao-v3-a2aebef3c204423f9671');

  const RD_FORM_SCRIPT = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';
  const RD_FORM_ID = 'glaf-formulario-lp-outsourcing-de-expansao-v3-a2aebef3c204423f9671';
  const RD_FORM_TOKEN = 'UA-112198284-1';
  const GOOGLE_TAG_ID = 'AW-11189519620';
  const META_PIXEL_ID = '844692459537508';
  const CLARITY_ID = 'v0g4igmsql';

  const state = {
    analyticsLoaded: false,
    metaLoaded: false,
    clarityLoaded: false,
    formLoaded: false,
    formRequested: false
  };

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      body.classList.toggle('menu-open', isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('menu-open');
      });
    });
  }

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach((faq) => {
        faq.classList.remove('is-open');
        const faqButton = faq.querySelector('.faq-question');
        if (faqButton) faqButton.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  setupRevealObserver();
  setupTrackingLoad();
  setupRdForm();

  function setupRevealObserver() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -24px 0px' }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  function setupTrackingLoad() {
    const startTracking = once(() => {
      runWhenIdle(() => {
        initGoogleTag();
        window.setTimeout(initMetaPixel, 600);
        window.setTimeout(initClarity, 1200);
      }, 2000);
    });

    ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach((eventName) => {
      window.addEventListener(eventName, startTracking, { once: true, passive: true });
    });

    window.addEventListener('load', () => {
      window.setTimeout(startTracking, 1800);
    }, { once: true });
  }

  function initGoogleTag() {
    if (state.analyticsLoaded) return;
    state.analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`)
      .then(() => {
        window.gtag('js', new Date());
        window.gtag('config', GOOGLE_TAG_ID);
      })
      .catch((error) => {
        console.error('Falha ao carregar Google tag:', error);
      });
  }

  function initMetaPixel() {
    if (state.metaLoaded) return;
    state.metaLoaded = true;

    const fbq = function fbqProxy() {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    };

    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.push = fbq;

    window.fbq = window.fbq || fbq;
    window._fbq = window._fbq || fbq;

    loadScript('https://connect.facebook.net/en_US/fbevents.js')
      .then(() => {
        window.fbq('init', META_PIXEL_ID);
        window.fbq('track', 'PageView');
      })
      .catch((error) => {
        console.error('Falha ao carregar Meta Pixel:', error);
      });
  }

  function initClarity() {
    if (state.clarityLoaded) return;
    state.clarityLoaded = true;

    window.clarity = window.clarity || function clarity() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };

    loadScript(`https://www.clarity.ms/tag/${CLARITY_ID}`)
      .catch((error) => {
        console.error('Falha ao carregar Clarity:', error);
      });
  }

  function setupRdForm() {
    if (!rdFormHost || !contactSection) return;

    const requestFormLoad = once(() => {
      loadRdForm();
    });

    doc.querySelectorAll('a[href="#contato"]').forEach((link) => {
      link.addEventListener('click', requestFormLoad, { passive: true });
    });

    if (window.location.hash === '#contato') {
      requestFormLoad();
      return;
    }

    if (!('IntersectionObserver' in window)) {
      window.setTimeout(requestFormLoad, 800);
      return;
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry || !entry.isIntersecting) return;
        sectionObserver.disconnect();
        requestFormLoad();
      },
      { rootMargin: '450px 0px' }
    );

    sectionObserver.observe(contactSection);
  }

  function loadRdForm() {
    if (state.formLoaded || state.formRequested) return;
    state.formRequested = true;

    preconnect('https://d335luupugsy2.cloudfront.net');

    const formMountObserver = new MutationObserver(() => {
      const hasInteractiveField = rdFormHost.querySelector('form, input, select, textarea, button');
      if (!hasInteractiveField) return;

      formMountObserver.disconnect();
      state.formLoaded = true;
      applyGlafUtmParams();
    });

    formMountObserver.observe(rdFormHost, { childList: true, subtree: true });

    loadScript(RD_FORM_SCRIPT)
      .then(() => {
        if (!window.RDStationForms) return;
        rdFormHost.innerHTML = '';
        new window.RDStationForms(RD_FORM_ID, RD_FORM_TOKEN).createForm();
        window.setTimeout(() => {
          applyGlafUtmParams();
          formMountObserver.disconnect();
        }, 3500);
      })
      .catch((error) => {
        console.error('Falha ao carregar formulario RD Station:', error);
        rdFormHost.innerHTML = '<div class="form-placeholder"><strong>Formulario indisponivel no momento</strong><p>Recarregue a pagina ou tente novamente em alguns instantes.</p></div>';
      });
  }

  function applyGlafUtmParams() {
    const params = new URLSearchParams(window.location.search);
    const utmParams = {
      'rd-text_field-mg9tvx3y': params.get('utm_source'),
      'rd-text_field-mg9tvx3z': params.get('utm_medium'),
      'rd-text_field-mg9tvx40': params.get('utm_campaign'),
      'rd-text_field-mg9tvx41': params.get('utm_term'),
      'rd-text_field-mg9tvx42': params.get('utm_content')
    };

    const hasAnyValue = Object.values(utmParams).some(Boolean);
    if (!hasAnyValue) return;

    let attempts = 0;
    const maxAttempts = 24;

    const fillFields = () => {
      attempts += 1;
      let missing = 0;

      Object.entries(utmParams).forEach(([id, value]) => {
        const inputElement = doc.getElementById(id);
        if (!inputElement) {
          missing += 1;
          return;
        }

        inputElement.value = value || '';
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
      });

      if (missing > 0 && attempts < maxAttempts) {
        window.setTimeout(fillFields, 250);
      }
    };

    fillFields();
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = doc.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          resolve(existing);
          return;
        }
        existing.addEventListener('load', () => resolve(existing), { once: true });
        existing.addEventListener('error', () => reject(new Error(`Falha ao carregar script: ${src}`)), { once: true });
        return;
      }

      const script = doc.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.loaded = 'false';
      script.onload = () => {
        script.dataset.loaded = 'true';
        resolve(script);
      };
      script.onerror = () => reject(new Error(`Falha ao carregar script: ${src}`));
      doc.head.appendChild(script);
    });
  }

  function preconnect(href) {
    if (doc.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;
    const link = doc.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    link.crossOrigin = 'anonymous';
    doc.head.appendChild(link);
  }

  function runWhenIdle(callback, timeout) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: timeout || 2000 });
      return;
    }
    window.setTimeout(callback, timeout || 1500);
  }

  function once(fn) {
    let called = false;
    return (...args) => {
      if (called) return;
      called = true;
      fn(...args);
    };
  }
})();

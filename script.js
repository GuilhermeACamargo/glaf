const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');
const faqItems = document.querySelectorAll('.faq-item');
const currentYear = document.getElementById('current-year');
const rdFormHost = document.getElementById('glaf-formulario-lp-outsourcing-de-expansao-v3-a2aebef3c204423f9671');
const revealElements = document.querySelectorAll('.reveal');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);

    const lines = menuToggle.querySelectorAll('span');
    if (lines.length === 3) {
      lines[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
      lines[1].style.opacity = isOpen ? '0' : '1';
      lines[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      const lines = menuToggle.querySelectorAll('span');
      if (lines.length === 3) {
        lines[0].style.transform = '';
        lines[1].style.opacity = '1';
        lines[2].style.transform = '';
      }
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

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -30px 0px' }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

function getUTMParams() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  return {
    'rd-text_field-m7cj88to': params.get('utm_source') ?? '',
    'rd-text_field-m7cj88tp': params.get('utm_medium') ?? '',
    'rd-text_field-m7cj88tq': params.get('utm_campaign') ?? '',
    'rd-text_field-m7cj88tr': params.get('utm_term') ?? '',
    'rd-text_field-m7cj88ts': params.get('utm_content') ?? ''
  };
}

function fillRDUTMFields() {
  const utmParams = getUTMParams();

  const intervalId = setInterval(() => {
    let allElementsExist = true;

    for (const id in utmParams) {
      const inputElement = document.getElementById(id);

      if (inputElement) {
        inputElement.value = utmParams[id];
      } else {
        allElementsExist = false;
      }
    }

    if (allElementsExist) {
      clearInterval(intervalId);
    }
  }, 500);

  setTimeout(() => clearInterval(intervalId), 10000);
}

window.addEventListener('load', () => {
  if (!window.RDStationForms || !rdFormHost) return;

  try {
    new RDStationForms(
      'glaf-formulario-lp-outsourcing-de-expansao-v3-a2aebef3c204423f9671',
      'UA-112198284-1'
    ).createForm();

    fillRDUTMFields();
  } catch (error) {
    console.error('Falha ao carregar formulário RD Station:', error);
  }
});

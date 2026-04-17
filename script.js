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

const RD_FORM_SCRIPT = "https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js";
const RD_FORM_ID = "glaf-formulario-lp-outsourcing-de-expansao-v3-a2aebef3c204423f9671";
const RD_FORM_TOKEN = "UA-112198284-1";

document.addEventListener("DOMContentLoaded", () => {
  setupGlafRdForm();
});

function setupGlafRdForm() {
  const container = document.getElementById(RD_FORM_ID);
  if (!container) return;

  let hasLoaded = false;

  const loadForm = async () => {
    if (hasLoaded) return;
    hasLoaded = true;

    try {
      const observer = new MutationObserver(() => {
        const hasInteractiveField = container.querySelector("form, input, select, textarea, button");
        if (!hasInteractiveField) return;

        observer.disconnect();
        applyGlafUtmParams();
      });

      observer.observe(container, { childList: true, subtree: true });

      await loadScript(RD_FORM_SCRIPT);

      if (window.RDStationForms) {
        container.innerHTML = "";
        new window.RDStationForms(RD_FORM_ID, RD_FORM_TOKEN).createForm();

        window.setTimeout(() => {
          applyGlafUtmParams();
          observer.disconnect();
        }, 4000);
      }
    } catch (error) {
      console.error("Falha ao carregar formulário RD Station:", error);
    }
  };

  loadForm();
}

function applyGlafUtmParams() {
  const params = new URLSearchParams(window.location.search);

  const utmParams = {
    "rd-text_field-m7cj88to": params.get("utm_source"),
    "rd-text_field-m7cj88tp": params.get("utm_medium"),
    "rd-text_field-m7cj88tq": params.get("utm_campaign"),
    "rd-text_field-m7cj88tr": params.get("utm_term"),
    "rd-text_field-m7cj88ts": params.get("utm_content")
  };

  let attempts = 0;
  const maxAttempts = 40;

  const fillFields = () => {
    attempts += 1;
    let missing = 0;

    Object.entries(utmParams).forEach(([id, value]) => {
      const inputElement = document.getElementById(id);

      if (inputElement) {
        inputElement.value = value ?? "";
        inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        inputElement.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        missing += 1;
      }
    });

    if (missing > 0 && attempts < maxAttempts) {
      window.setTimeout(fillFields, 250);
    }
  };

  fillFields();
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve(existing);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Falha ao carregar script: ${src}`));
    document.head.appendChild(script);
  });
}

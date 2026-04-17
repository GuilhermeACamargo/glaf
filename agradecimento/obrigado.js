const currentYear = document.getElementById('current-year');
const revealElements = document.querySelectorAll('.reveal');
const whatsappButton = document.getElementById('whatsapp-cta');

const WHATSAPP_NUMBER = '5511999580211';
const WHATSAPP_MESSAGE = 'Ola! Acabei de preencher o formulario da GLAF e gostaria de adiantar a conversa sobre expansao.';

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (whatsappButton) {
  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
  whatsappButton.href = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

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
    { threshold: 0.14, rootMargin: '0px 0px -20px 0px' }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

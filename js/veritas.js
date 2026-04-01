// Translations
const translations = {
  es: {
    'hero.title': 'Veritas',
    'header.home': 'Inicio',
    'hero.subtitle': 'Sí, es otro intento de hacer una app con IA. Este va con cariño.',
    'hero.description': 'Con Rubén Romera nos propusimos algo simple: un diario para ponerle palabras a lo que sientes, con IA útil y sin postureo terapéutico.',
    'hero.features': 'Ver lo que construimos',
    'hero.demo': 'Ver cómo piensa la app',
    'features.title': 'Lo que construimos',
    'features.subtitle': 'Un producto pequeño, con decisiones muy concretas: utilidad real, tono humano y cero drama técnico innecesario.',
    'features.personal': 'Espacio personal',
    'features.journal': 'Flujo de diario',
    'features.peopleevents': 'Contexto de personas y eventos',
    'features.vera': 'Vera integrada con tono cercano',
    'features.cards': 'Sistema de cards y recomendaciones',
    'premium.title': 'Lo técnico, sin vender humo',
    'premium.subtitle': 'Aquí va el resumen real de arquitectura: wrapper, contexto psicológico y privacidad total en móvil.',
    'premium.vera': 'Wrapper propio sobre DeepSeek para controlar prompts, tono y consistencia',
    'premium.evaluations': 'Contexto de perfil psicológico para respuestas más útiles y menos genéricas',
    'premium.report': 'Nada de guardar tu vida en nuestra BBDD: datos y diario viven en tu móvil',
    'premium.insights': 'No somos terapia: es autoayuda escrita para entenderte mejor',
    'demo.title': 'Qué intenta hacer Veritas (y qué no)',
    'demo.description': 'Intenta ayudarte a ordenar emociones y pensamientos. No intenta diagnosticarte ni sustituir ayuda profesional.',
    'demo.powered': 'Powered by AI',
    'how.title': 'Cómo lo estamos construyendo',
    'how.step1.title': 'Primero escuchar',
    'how.step1.desc': 'Partimos de casos reales: días buenos, días raros y días reguleros.',
    'how.step2.title': 'Luego iterar',
    'how.step2.desc': 'Ajustamos prompts y UX hasta que la app acompañe sin estorbar.',
    'how.step3.title': 'Privacidad por defecto',
    'how.step3.desc': 'Sin guardar datos personales en nuestra base de datos, todo queda en el teléfono.',
    'how.step4.title': 'Honestidad de producto',
    'how.step4.desc': 'No terapia, no milagros: solo escritura guiada para autoayuda.',
    'faq.title': 'Preguntas que nos hacemos nosotros',
    'faq.q1': '¿De verdad es "otro intento" de app con IA?',
    'faq.a1': 'Sí, totalmente. Pero este intento está hecho con cariño, con límites claros y con foco en utilidad de verdad.',
    'faq.q2': '¿Qué pinta DeepSeek aquí?',
    'faq.a2': 'Usamos un wrapper propio para controlar mejor contexto, estilo y seguridad de las respuestas.',
    'faq.q3': '¿Guardáis algo en vuestra BBDD?',
    'faq.a3': 'No. El diario y el contexto del usuario se quedan en el móvil. Punto.',
    'faq.q4': '¿Esto es una herramienta terapéutica?',
    'faq.a4': 'No. Es una herramienta de autoayuda en formato diario para poner palabras a los sentimientos.',
    'cta.title': 'Veritas, con los pies en la tierra',
    'cta.subtitle': 'Si te apetece probarlo, aquí tienes la versión publicada en iOS',
    'cta.download': 'Abrir en App Store',
    'cta.partner': 'Portfolio de Rubén Romera',
    'cta.contact': 'Contactar'
  },
  en: {
    'hero.title': 'Veritas',
    'hero.subtitle': 'Yes, this is another AI app attempt. This one is built with care.',
    'header.home': 'Home',
    'hero.description': 'Together with Ruben Romera, we built a journal app to help people put words to feelings, with useful AI and no fake therapeutic claims.',
    'hero.features': 'See what we built',
    'hero.demo': 'See how the app thinks',
    'features.title': 'What we built',
    'features.subtitle': 'A small product with very intentional decisions: real utility, human tone, and no unnecessary technical drama.',
    'features.personal': 'Personal space',
    'features.journal': 'Journal flow',
    'features.peopleevents': 'People and events context',
    'features.vera': 'Vera integrated with a close tone',
    'features.cards': 'Cards and recommendation system',
    'premium.title': 'Technical side, no hype',
    'premium.subtitle': 'A real architecture snapshot: DeepSeek wrapper, psychological profile context, and full on-device privacy.',
    'premium.vera': 'Custom wrapper on top of DeepSeek to control prompts, tone, and consistency',
    'premium.evaluations': 'Psychological profile context to generate less generic and more useful responses',
    'premium.report': 'We do not store your life in our DB: journal data stays on your phone',
    'premium.insights': 'Not a therapy tool: a self-help journal to understand yourself better',
    'demo.title': 'What Veritas tries to do (and what it does not)',
    'demo.description': 'It helps you organize feelings and thoughts. It does not diagnose or replace professional support.',
    'demo.powered': 'Powered by AI',
    'how.title': 'How we are building it',
    'how.step1.title': 'Listen first',
    'how.step1.desc': 'We started from real cases: good days, messy days, and weird days.',
    'how.step2.title': 'Then iterate',
    'how.step2.desc': 'We tuned prompts and UX until the app supports you without getting in your way.',
    'how.step3.title': 'Privacy by default',
    'how.step3.desc': 'No personal data stored in our database, everything stays on device.',
    'how.step4.title': 'Product honesty',
    'how.step4.desc': 'No therapy claims, no miracles: guided journaling for self-help.',
    'faq.title': 'Questions we ask ourselves',
    'faq.q1': 'Is this really "another AI app attempt"?',
    'faq.a1': 'Yes, absolutely. But this attempt is built with care, clear limits, and practical value in mind.',
    'faq.q2': 'Why DeepSeek here?',
    'faq.a2': 'We use a custom wrapper to better control context, style, and response safety.',
    'faq.q3': 'Do you store user data in your DB?',
    'faq.a3': 'No. Journal data and user context stay on the phone. Full stop.',
    'faq.q4': 'Is this a therapeutic tool?',
    'faq.a4': 'No. It is a self-help journaling tool to put words to feelings.',
    'cta.title': 'Veritas, with feet on the ground',
    'cta.subtitle': 'If you want to try it, here is the published iOS version',
    'cta.download': 'Open in App Store',
    'cta.partner': 'Ruben Romera portfolio',
    'cta.contact': 'Contact'
  }
};

let currentLang = 'es';

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
  const logoImg = document.getElementById('logoImg');
  if (logoImg) {
    logoImg.src = 'img/Veritas/veritas-logo-dark.webp';
  }
}

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  //logo en modo oscuro
  const logoImg = document.getElementById('logoImg');
  if (isDark) {
    logoImg.src = 'img/Veritas/veritas-logo-dark.webp';
  } else {
    logoImg.src = 'img/Veritas/veritas-logo.webp';
  }
});

// Language Toggle
const langToggle = document.getElementById('langToggle');
const langText = document.getElementById('langText');

function updateLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
  langText.textContent = currentLang === 'es' ? 'EN' : 'ES';
  document.documentElement.setAttribute('lang', currentLang);
}

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  updateLanguage();
});

// Scroll Animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 600) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

updateLanguage();

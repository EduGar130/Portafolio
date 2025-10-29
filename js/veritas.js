// Translations
const translations = {
  es: {
    'hero.title': 'Veritas',
    'header.home': 'Inicio',
    'hero.subtitle': 'Diario con IA, claridad sin ruido',
    'hero.description': 'Tu espacio personal para reflexionar, crecer y entender tus emociones con la ayuda de inteligencia artificial.',
    'hero.features': 'Ver funciones',
    'hero.demo': 'Ver demo',
    'features.title': 'Funciones principales',
    'features.subtitle': 'Cada elemento diseñado para ayudarte a entender mejor tus emociones y experiencias',
    'features.personal': 'Panel personal',
    'features.journal': 'Diario',
    'features.peopleevents': 'Personas y eventos',
    'features.vera': 'Vera (asistente emocional)',
    'features.cards': 'Cards inteligentes',
    'premium.title': 'Funciones Premium',
    'premium.subtitle': 'Desbloquea todo el potencial de Veritas',
    'premium.vera': 'Vera - Asistente emocional con IA avanzada',
    'premium.evaluations': 'Evaluaciones más frecuentes y detalladas',
    'premium.report': 'Reporte semanal completo incluido',
    'premium.insights': 'Insights profundos de patrones emocionales',
    'demo.title': 'Evaluación inteligente',
    'demo.description': 'Cada entrada se evalúa automáticamente con feedback práctico. Vera analiza tus emociones y te ofrece perspectivas valiosas para tu crecimiento personal.',
    'demo.powered': 'Powered by AI',
    'how.title': 'Cómo funciona',
    'how.step1.title': 'Escribe sin filtros',
    'how.step1.desc': 'Expresa tus pensamientos libremente',
    'how.step2.title': 'Etiqueta con @ y #',
    'how.step2.desc': 'Organiza personas y momentos',
    'how.step3.title': 'Habla con Vera',
    'how.step3.desc': 'Tu asistente emocional siempre disponible',
    'how.step4.title': 'Recibe insights',
    'how.step4.desc': 'Análisis personalizado continuo',
    'faq.title': 'Preguntas frecuentes',
    'faq.q1': '¿Es privado mi diario?',
    'faq.a1': 'Sí, tu privacidad es nuestra prioridad. Todos los datos están encriptados y solo tú tienes acceso a tu contenido. Usamos IA de forma local cuando es posible.',
    'faq.q2': '¿Funciona sin internet?',
    'faq.a2': 'La escritura funciona offline y se sincroniza cuando vuelves a estar online. Las funciones de IA requieren conexión.',
    'faq.q3': '¿Qué incluye el plan Premium?',
    'faq.a3': 'Acceso completo a Vera, evaluaciones más frecuentes y detalladas, reporte semanal automático con análisis profundo de patrones emocionales y sugerencias personalizadas.',
    'faq.q4': '¿Puedo exportar mis datos?',
    'faq.a4': 'Sí, puedes exportar todo tu diario en formato PDF o JSON en cualquier momento.',
    'cta.title': 'Comienza tu viaje de autoconocimiento',
    'cta.subtitle': 'Únete a personas que ya están transformando su bienestar emocional con Veritas',
    'cta.download': 'Descargar en App Store',
    'cta.contact': 'Contactar'
  },
  en: {
    'hero.title': 'Veritas',
    'hero.subtitle': 'AI-powered journal, clarity without noise',
    'header.home': 'Home',
    'hero.description': 'Your personal space to reflect, grow and understand your emotions with the help of artificial intelligence.',
    'hero.features': 'View features',
    'hero.demo': 'View demo',
    'features.title': 'Main Features',
    'features.subtitle': 'Every element designed to help you better understand your emotions and experiences',
    'features.personal': 'Personal Dashboard',
    'features.journal': 'Journal',
    'features.peopleevents': 'People & Events',
    'features.vera': 'Vera (emotional assistant)',
    'features.cards': 'Smart Cards',
    'premium.title': 'Premium Features',
    'premium.subtitle': "Unlock Veritas' full potential",
    'premium.vera': 'Vera - Emotional assistant with advanced AI',
    'premium.evaluations': 'More frequent and detailed evaluations',
    'premium.report': 'Complete weekly report included',
    'premium.insights': 'Deep insights into emotional patterns',
    'demo.title': 'Smart Evaluation',
    'demo.description': 'Every entry is automatically evaluated with practical feedback. Vera analyzes your emotions and offers valuable insights for your personal growth.',
    'demo.powered': 'Powered by AI',
    'how.title': 'How it Works',
    'how.step1.title': 'Write without filters',
    'how.step1.desc': 'Express your thoughts freely',
    'how.step2.title': 'Tag with @ and #',
    'how.step2.desc': 'Organize people and moments',
    'how.step3.title': 'Talk to Vera',
    'how.step3.desc': 'Your emotional assistant always available',
    'how.step4.title': 'Receive insights',
    'how.step4.desc': 'Continuous personalized analysis',
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'Is my journal private?',
    'faq.a1': 'Yes, your privacy is our priority. All data is encrypted and only you have access to your content. We use AI locally when possible.',
    'faq.q2': 'Does it work offline?',
    'faq.a2': "Writing works offline and syncs when you're back online. AI features require connection.",
    'faq.q3': 'What does the Premium plan include?',
    'faq.a3': 'Full access to Vera, more frequent and detailed evaluations, automatic weekly report with deep analysis of emotional patterns and personalized suggestions.',
    'faq.q4': 'Can I export my data?',
    'faq.a4': 'Yes, you can export your entire journal in PDF or JSON format at any time.',
    'cta.title': 'Begin Your Self-Discovery Journey',
    'cta.subtitle': 'Join people who are already transforming their emotional wellbeing with Veritas',
    'cta.download': 'Download on App Store',
    'cta.contact': 'Contact'
  }
};

let currentLang = 'es';

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  //logo en modo oscuro
  const logoImg = document.getElementById('logoImg');
  if (isDark) {
    logoImg.src = './img/veritas/veritas-logo-dark.webp';
  } else {
    logoImg.src = './img/veritas/veritas-logo.webp';
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
  langText.textContent = currentLang === 'es' ? 'ES' : 'EN';
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

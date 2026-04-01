(function () {
  const CONTENT = {
    es: {
      back: 'Volver al portafolio',
      locationLabel: 'Ubicacion',
      modeLabel: 'Modalidad',
      tenureLabel: 'Tiempo en esta empresa',
      achievementsTitle: 'Impacto y logros',
      timelineTitle: 'Cronograma',
      stacksTitle: 'Tecnologias utilizadas',
      units: { y: ['ano', 'anos'], m: ['mes', 'meses'] },
      minsait: {
        role: 'Ingeniero de software',
        company: 'Minsait',
        period: 'ene. 2024 - actualidad',
        location: 'Valencia',
        mode: 'En remoto',
        start: '2024-01-01T00:00:00Z',
        end: null,
        achievements: [
          'Detecte y solucione vulnerabilidades internas, reforzando la seguridad de los servicios.',
          'Optimice consultas complejas reduciendo su ejecucion de 3 minutos a 10 segundos mediante concurrencia y optimizacion SQL.',
          'Desarrolle desde cero una interfaz de pago integrando una API externa.',
          'Reestructure y finalice un proyecto bloqueado durante 6 meses, entregandolo en solo 2 semanas.',
          'Disene e implemente interfaces dinamicas con Angular y Angular Material.',
          'Formo a nuevas incorporaciones para acelerar su adaptacion tecnica y buenas practicas del equipo.',
          'Continuo en desarrollo activo de nuevas funcionalidades y mejora constante de la plataforma.'
        ],
        timeline: [
          { period: '2024 Q1', text: 'Onboarding tecnico y analisis de componentes criticos de la plataforma.' },
          { period: '2024 Q2', text: 'Correccion de vulnerabilidades internas y refuerzo de seguridad.' },
          { period: '2024 Q3', text: 'Reduccion de tiempos de consultas de minutos a segundos.' },
          { period: '2024 Q4', text: 'Diseno e integracion de nueva pasarela de pago con API externa.' },
          { period: '2025', text: 'Rescate de proyecto bloqueado y entrega acelerada en 2 semanas.' },
          { period: '2026', text: 'Evolucion continua de interfaces y arquitectura frontend con Angular Material.' }
        ],
        stack: ['Java', 'Spring Boot', 'Angular', 'Angular Material', 'SQL', 'TypeScript', 'REST API', 'Git']
      },
      balearia: {
        role: 'Becario de desarrollo',
        company: 'Balearia',
        period: 'nov. 2023 - ene. 2024',
        location: 'Denia',
        mode: 'Presencial',
        start: '2023-11-01T00:00:00Z',
        end: '2024-01-31T23:59:59Z',
        achievements: [
          'Apoyo en el desarrollo de funcionalidades internas para sistemas de gestion.',
          'Uso de tecnologias web modernas bajo supervision de senior developers.',
          'Aprendizaje intensivo de buenas practicas de desarrollo y colaboracion en entornos reales.'
        ],
        timeline: [
          { period: 'nov. 2023', text: 'Incorporacion al equipo y participacion en tareas de soporte funcional.' },
          { period: 'dic. 2023', text: 'Implementacion de mejoras internas en modulos de gestion.' },
          { period: 'ene. 2024', text: 'Consolidacion de buenas practicas y cierre de ciclo de practicas.' }
        ],
        stack: ['JavaScript', 'Angular', 'Java', 'Spring Boot', 'MySQL', 'PostgreSQL', 'Git', 'GitLab']
      }
    },
    en: {
      back: 'Back to portfolio',
      locationLabel: 'Location',
      modeLabel: 'Work mode',
      tenureLabel: 'Time in this company',
      achievementsTitle: 'Impact and achievements',
      timelineTitle: 'Timeline',
      stacksTitle: 'Technologies used',
      units: { y: ['year', 'years'], m: ['month', 'months'] },
      minsait: {
        role: 'Software Engineer',
        company: 'Minsait',
        period: 'Jan 2024 - Present',
        location: 'Valencia',
        mode: 'Remote',
        start: '2024-01-01T00:00:00Z',
        end: null,
        achievements: [
          'Detected and fixed internal vulnerabilities, strengthening service security.',
          'Optimized complex queries from 3 minutes down to 10 seconds through concurrency and SQL tuning.',
          'Built a payment interface from scratch by integrating an external API.',
          'Restructured and completed a blocked project in just 2 weeks after 6 months stalled.',
          'Designed and implemented dynamic interfaces with Angular and Angular Material.',
          'I mentor new hires, helping them ramp up quickly on team standards and workflows.',
          'I continue in active development, delivering new features and iterative improvements.'
        ],
        timeline: [
          { period: '2024 Q1', text: 'Technical onboarding and analysis of critical platform components.' },
          { period: '2024 Q2', text: 'Internal vulnerability fixes and security hardening.' },
          { period: '2024 Q3', text: 'Query performance optimization from minutes to seconds.' },
          { period: '2024 Q4', text: 'Design and integration of a new payment flow with external API.' },
          { period: '2025', text: 'Recovery of blocked project and fast delivery in two weeks.' },
          { period: '2026', text: 'Continuous evolution of UI and frontend architecture with Angular Material.' }
        ],
        stack: ['Java', 'Spring Boot', 'Angular', 'Angular Material', 'SQL', 'TypeScript', 'REST API', 'Git']
      },
      balearia: {
        role: 'Development Intern',
        company: 'Balearia',
        period: 'Nov 2023 - Jan 2024',
        location: 'Denia',
        mode: 'On-site',
        start: '2023-11-01T00:00:00Z',
        end: '2024-01-31T23:59:59Z',
        achievements: [
          'Supported development of internal features for management systems.',
          'Used modern web technologies under senior developer supervision.',
          'Intensive learning of development best practices and team collaboration in real environments.'
        ],
        timeline: [
          { period: 'Nov 2023', text: 'Joined the team and contributed to functional support tasks.' },
          { period: 'Dec 2023', text: 'Implemented internal improvements in management modules.' },
          { period: 'Jan 2024', text: 'Consolidated best practices and closed internship cycle.' }
        ],
        stack: ['JavaScript', 'Angular', 'Java', 'Spring Boot', 'MySQL', 'PostgreSQL', 'Git', 'GitLab']
      }
    }
  };

  const $ = (id) => document.getElementById(id);

  function plural(value, unit) {
    return `${value} ${value === 1 ? unit[0] : unit[1]}`;
  }

  function getCalendarDiff(startDate, endDate) {
    let years = endDate.getUTCFullYear() - startDate.getUTCFullYear();
    let months = endDate.getUTCMonth() - startDate.getUTCMonth();
    if (endDate.getUTCDate() < startDate.getUTCDate()) {
      months -= 1;
    }

    if (months < 0) { months += 12; years -= 1; }

    return { years, months };
  }

  function formatCounter(diff, langPack) {
    return `${plural(diff.years, langPack.units.y)} ${plural(diff.months, langPack.units.m)}`;
  }

  function init() {
    const company = document.body.dataset.company;
    if (!company) return;

    const preferredLang = (localStorage.getItem('preferredLang') || 'es').toLowerCase();
    const lang = preferredLang.startsWith('en') ? 'en' : 'es';

    const storedTheme = localStorage.getItem('preferredTheme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }

    const langPack = CONTENT[lang];
    const data = langPack[company];
    if (!data) return;

    document.documentElement.setAttribute('lang', lang);
    document.title = `${data.role} - ${data.company} | Eduardo Garcia Romera`;

    const logoEl = $('company-logo');
    if (logoEl) {
      logoEl.src = company === 'minsait' ? 'img/minsait.webp' : 'img/balearia.webp';
      logoEl.alt = `${data.company} logo`;
    }

    $('back-link').textContent = langPack.back;
    $('detail-role').textContent = data.role;
    $('detail-company').textContent = data.company;
    $('detail-period').textContent = data.period;
    $('detail-location').textContent = `${langPack.locationLabel}: ${data.location}`;
    $('detail-mode').textContent = `${langPack.modeLabel}: ${data.mode}`;
    $('tenure-label').textContent = langPack.tenureLabel;
    $('achievements-title').textContent = langPack.achievementsTitle;
    $('timeline-title').textContent = langPack.timelineTitle;
    $('stack-title').textContent = langPack.stacksTitle;

    const achievementsList = $('achievements-list');
    achievementsList.innerHTML = data.achievements.map((item) => `<li>${item}</li>`).join('');

    const timelineList = $('timeline-list');
    timelineList.innerHTML = data.timeline
      .map((item) => `<li><p class="timeline-period">${item.period}</p><p class="timeline-text">${item.text}</p></li>`)
      .join('');

    const stackList = $('stack-list');
    stackList.innerHTML = data.stack.map((item) => `<span>${item}</span>`).join('');

    const start = new Date(data.start);
    const end = data.end ? new Date(data.end) : null;

    const tick = () => {
      const now = end || new Date();
      const diff = getCalendarDiff(start, now);
      $('tenure-counter').textContent = formatCounter(diff, langPack);
    };

    tick();
    if (!end) {
      setInterval(tick, 60000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

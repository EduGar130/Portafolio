let modalOpened = false;
let activeSectionId = 0;


function init(){
  const enlaceCV = document.getElementById('cv-link');

  // Preferencia guardada en localStorage > navegador
  const storedLang = (localStorage.getItem('preferredLang') || '').toLowerCase();
  const navigatorLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  const initialLang = storedLang || (navigatorLang.startsWith('es') ? 'es' : 'en');

  // Helper para aplicar idioma y persistir elección
  function setLanguage(lang) {
    lang = (lang || 'en').toLowerCase();
    localStorage.setItem('preferredLang', lang);
    if (enlaceCV) enlaceCV.href = (lang === 'es') ? 'assets/CV_Eduardo.pdf' : 'assets/CV_Eduardo_en.pdf';
    // update lang wheel visual state
    const langWheel = document.getElementById('langWheel');
    if (langWheel) {
      if (lang === 'en') langWheel.parentElement.classList.add('rotated');
      else langWheel.parentElement.classList.remove('rotated');
    }
    loadLanguage(lang);
  }

  // Inicializar idioma
  setLanguage(initialLang);
  if(initialLang === 'en'){
    degreeLang += 180;
    const langWheel = document.getElementById('langWheel');
    if (langWheel.style) langWheel.style.transform = `rotate(${degreeLang}deg)`;
  }

  // Añadir listener al lang wheel para alternar entre 'es' y 'en'
  const langWheel = document.getElementById('langWheel');
  if (langWheel) {
    langWheel.addEventListener('click', () => {
      const current = (localStorage.getItem('preferredLang') || initialLang).toLowerCase();
      const next = current === 'es' ? 'en' : 'es';
      setLanguage(next);
      degreeLang += 180;
      // proteger acceso a style
      if (langWheel.style) langWheel.style.transform = `rotate(${degreeLang}deg)`;
    });
  }

  // mode wheel: manejo independiente de rotación y modo oscuro
  const modeWheel = document.getElementById('modeWheel');
  if (modeWheel) {
    modeWheel.addEventListener('click', () => {
      if (darkMode) {
        document.documentElement.classList.remove('dark-mode');
      } else {
        document.documentElement.classList.add('dark-mode');
      }
      degree += 180;
      // proteger acceso a style
      if (modeWheel.style) modeWheel.style.transform = `rotate(${degree}deg)`;
      darkMode = !darkMode;
    });
  }

  if (verifyMax768pxWidth()) {
    horizontalMovement();
  } else {
    verticalMovement();
  }
  
  // Si la URL tiene hash al cargar, navegar a esa sección
  if (location.hash) {
    const targetId = location.hash.slice(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        updateSEOForSection(targetId);
      }, 50);
    }
  }

  // Añadir listeners a los enlaces del sidebar para actualizar SEO al hacer click
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    const links = sidebar.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const id = href.replace('#', '');
        setTimeout(() => updateSEOForSection(id), 50);
      });
    });
  }

  /* Sincronizar #sidebar2 li con el movimiento de las secciones: cada li sube/ baja con su sección
     y desaparece cuando la sección no está en viewport. Implementación eficiente con rAF. */
  const sidebar2 = document.getElementById('sidebar2');
  if (sidebar2) {
    const items = Array.from(sidebar2.querySelectorAll('li'));
    const sections = Array.from(document.querySelectorAll('main > section'));

    // Guardar posiciones iniciales de secciones y elementos para respetar la posición definida en CSS
    const sectionBaseTops = [];
    let ticking = false;

    function captureBasePositions() {
      sectionBaseTops.length = 0;
      sections.forEach(section => {
        const r = section.getBoundingClientRect();
        // baseTop relativo a la ventana en el momento de inicialización
        sectionBaseTops.push(r.top);
      });

      // Asegurar que todos los items estén visibles inicialmente (tal como pediste)
      items.forEach(li => {
        li.style.opacity = '1';
        li.style.pointerEvents = 'auto';
        // limpiar transform para partir desde la posición definida por CSS
        li.style.transform = 'translateY(0px)';
      });
    }

    function updateSidebar2Positions() {
      // Para cada par sección - li, movemos el li exactamente en la cantidad en px
      // que la sección se ha desplazado verticalmente desde el momento de captura.
      sections.forEach((section, idx) => {
        const li = items[idx];
        if (!li || !section) return;
        const rect = section.getBoundingClientRect();
        const baseTop = sectionBaseTops[idx] || 0;

        // delta positivo => sección se desplazó hacia abajo desde la base; negativo => hacia arriba
        const delta = Math.round(rect.top - baseTop);

        // Aplicar el mismo desplazamiento vertical al li desde su posición CSS original
        //li.style.transform = `translateY(${delta}px)`;

        // Visibilidad: inicialmente todos visibles; ocultar sólo cuando la sección
        // ha sido completamente abandonada por arriba (rect.bottom <= 0)
        const isAbandonedAbove = rect.bottom <= 0;
        if (isAbandonedAbove) {
          li.style.opacity = '0';
          li.style.pointerEvents = 'none';
        } else {
          li.style.opacity = '1';
          li.style.pointerEvents = 'auto';
        }
      });
    }

    function onScrollOrResize() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateSidebar2Positions();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Inicializar bases y positions
    // Capturamos después de un pequeño delay para que el layout esté estable
    setTimeout(() => {
      captureBasePositions();
      updateSidebar2Positions();
    }, 50);

    // Recalcular bases en resize (y si cambias layout dinámicamente puedes forzarlo)
    window.addEventListener('resize', () => {
      captureBasePositions();
      onScrollOrResize();
    });

    // Actualizar al hacer scroll
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
  }

  // Swipe indicator: click to go to next section (if any)
  const swipeRight = document.getElementById('swipeRight');
  if (swipeRight) {
    swipeRight.addEventListener('click', () => {
      try {
        const sections = Array.from(document.querySelectorAll('section'));
        const currentSection = swipeRight.closest('section');
        if (!sections.length) return;
        if (!currentSection) {
          // fallback: go to second section if exists
          if (sections.length > 1) {
            sections[1].scrollIntoView({ behavior: 'smooth' });
            updateSEOForSection(sections[1].id);
            history.replaceState(null, '', '#' + (sections[1].id || ''));
          }
          return;
        }
        const idx = sections.indexOf(currentSection);
        if (idx >= 0 && idx < sections.length - 1) {
          const next = sections[idx + 1];
          next.scrollIntoView({ behavior: 'smooth' });
          updateSEOForSection(next.id);
          history.replaceState(null, '', '#' + (next.id || ''));
          // Update sidebar/navbar active link and svg color if present
          try {
            const sidebarLinks = document.querySelectorAll('#sidebar a[href^="#"]');
            if (sidebarLinks && sidebarLinks.length) {
              sidebarLinks.forEach(link => {
                const linkId = (link.getAttribute('href') || '').replace('#','');
                const svg = link.querySelector('svg');
                if (linkId === next.id) {
                  link.classList.add('active-section');
                  if (svg) svg.style.fill = 'var(--icons-hover)';
                } else {
                  link.classList.remove('active-section');
                  if (svg) svg.style.fill = 'var(--icons-color)';
                }
              });
            }
          } catch (e) {
            console.warn('Error updating sidebar active state', e);
          }
        }
      } catch (e) {
        console.warn('swipeRight click handler error', e);
      }
    });
  }
  window.addEventListener("resize", function(){
    if (verifyMax768pxWidth()) {
      horizontalMovement();
    } else {
      verticalMovement();
    }
  });
}

function verifyMax768pxWidth() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function verticalMovement(){
  let currentSectionIndex = 0;
  let touchStartY = 0;
  const sections = document.querySelectorAll("section");
  const sidebarLinks = document.querySelectorAll("#sidebar a");
  let isScrolling = false;

  function updateActiveSection() {
    if (modalOpened) {
      return;
    }
    const scrollPosition = window.scrollY;

    sections.forEach((section, index) => {
      const { offsetTop: sectionTop, clientHeight: sectionHeight } = section;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionIndex = index;
        const sectionId = section.getAttribute("id");

        sidebarLinks.forEach(link => {
          const linkId = link.getAttribute("href").slice(1);
          const svg = link.querySelector("svg");

          if (linkId === sectionId) {
            link.classList.add("active-section");
          } else {
            link.classList.remove("active-section");
          }
        });
          // Actualizar SEO para la sección activa
          updateSEOForSection(sectionId);
          activeSectionId = sectionId;
          console.log("Active section updated to:", sectionId);
      }
    });
  }

  updateActiveSection();

  window.addEventListener("scroll", updateActiveSection);

  window.addEventListener("wheel", function(event) {
    event.preventDefault();
    if (!isScrolling && !modalOpened) {
      isScrolling = true;
      setTimeout(() => { isScrolling = false; }, 500);

      if (event.deltaY > 0 && currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
      } else if (event.deltaY < 0 && currentSectionIndex > 0) {
        currentSectionIndex--;
      }
      sections[currentSectionIndex].scrollIntoView({ behavior: "smooth" });
    }
  }, { passive: false });

  window.addEventListener("touchstart", function(event) {
    touchStartY = event.touches[0].clientY;
  });
}

function horizontalMovement(){
  let currentSectionIndex = 0;
  const sections = document.querySelectorAll("section");
  const sidebarLinks = document.querySelectorAll("#sidebar a");
  let isScrolling = false;
  let touchStartX = 0;


  sidebarLinks.forEach((link, index) => {
    link.addEventListener("click", function() {
      currentSectionIndex = index;
      updateActiveSection();
    });
  });

  function updateActiveSection() {
    if (modalOpened) {
      return;
    }
    const scrollPosition = window.scrollX;
    let i = 0;

    sections.forEach((section, index) => {
      const { offsetLeft: sectionLeft, clientWidth: sectionWidth } = section;
      if (i === currentSectionIndex) {
        const sectionId = section.getAttribute("id");

        sidebarLinks.forEach(link => {
          const linkId = link.getAttribute("href").slice(1);
          const svg = link.querySelector("svg");

          if (linkId === sectionId) {
            link.classList.add("active-section");
            if (svg) {
              svg.style.fill = "var(--icons-hover)";
            }
          } else {
            link.classList.remove("active-section");
            if (svg) {
              svg.style.fill = "var(--icons-color)";
            }
          }
        });
  // Actualizar SEO para la sección activa
  updateSEOForSection(sectionId);
      }
      i++;
    });
  }

  updateActiveSection();

  window.addEventListener("wheel", function(event) {
    event.preventDefault();
    console.log(modalOpened);
    if (!isScrolling && !modalOpened) {
      isScrolling = true;
      setTimeout(() => { isScrolling = false; }, 500);

      if (event.deltaY > 0 && currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
      } else if (event.deltaY < 0 && currentSectionIndex > 0) {
        currentSectionIndex--;
      }
      sections[currentSectionIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      updateActiveSection();
    }
  }, { passive: false });

  window.addEventListener("touchstart", function(event) {
    touchStartX = event.touches[0].clientX;
  });

  window.addEventListener("touchmove", function(event) {
    const touchEndX = event.touches[0].clientX;
    const touchMoveDiff = touchEndX - touchStartX;
  
    if (!isScrolling) {
      if (touchMoveDiff > 50 && currentSectionIndex > 0) {
        isScrolling = true;
        setTimeout(() => { isScrolling = false; }, 500);
        currentSectionIndex--;
        updateActiveSection();
        sections[currentSectionIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      } else if (touchMoveDiff < -50 && currentSectionIndex < sections.length - 1) {
        isScrolling = true;
        setTimeout(() => { isScrolling = false; }, 500);
        currentSectionIndex++;
        updateActiveSection();
        sections[currentSectionIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      }
    }
  });
}


let darkMode = false;
let degree = 0;
let degreeLang = 0;
 

function loadLanguage(lang) {
  console.log(lang);
  fetch(`assets/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      applyTranslations(data);
    }).catch(error => {
      console.error('Error loading the language file:', error);
    });
}

function applyTranslations(data) {
  console.log(data);
  document.querySelector('#welcome-section h1').textContent = data.welcome.title;
  document.querySelector('#welcome-section p').textContent = data.welcome.description;
  document.getElementById('cv_text').textContent = data.welcome.cv;

  document.querySelector('#about h2').textContent = data.about.title;
  document.querySelector('#about p').textContent = data.about.description;

  document.querySelector('#skills h2').textContent = data.skills.title;
  document.querySelector('#skills p').textContent = data.skills.description;

  document.querySelector('#projects h3').textContent = data.projects.title;
  document.getElementById('tfg').textContent = data.projects.inventory;
  document.getElementById('portafolio').textContent = data.projects.portfolio;
  document.getElementById('compilador').textContent = data.projects.compiler;

  document.getElementById('certificates-title').textContent = data.certificates.title;
  document.getElementById('ef-set').textContent = data.certificates.efset;
  document.getElementById('responsive-web-design').textContent = data.certificates.responsive;
  document.getElementById('arquitectura-frontend').textContent = data.certificates.frontend;
  // i18n for C1 modal
  if (data.certificates.c1ModalTitle) {
    const c1TitleEl = document.getElementById('c1-modal-title');
    if (c1TitleEl) c1TitleEl.textContent = data.certificates.c1ModalTitle;
  }
  if (data.certificates.c1ModalDesc) {
    const c1DescEl = document.getElementById('c1-modal-desc');
    if (c1DescEl) c1DescEl.textContent = data.certificates.c1ModalDesc;
  }
  if (data.certificates.c1Download) {
    const c1DownloadEl = document.getElementById('c1-download-link');
    if (c1DownloadEl) c1DownloadEl.textContent = data.certificates.c1Download;
  }

  document.getElementById('experience-title').textContent = data.experience.title;
  document.getElementById('minsait-title').textContent = data.experience.minsait.title;
  document.getElementById('minsait-title-modal').textContent = data.experience.minsait.title;
  document.getElementById('minsait-period-text').textContent = data.experience.minsait.period;  
  document.getElementById('minsait-period').textContent = data.experience.minsait.periodtitle;
  document.getElementById('minsait-location-text').textContent = data.experience.minsait.location;
  document.getElementById('minsait-location').textContent = data.experience.minsait.locationtitle;
  document.getElementById('minsait-responsibilities').textContent = data.experience.minsait.responsibilities.title;
  document.getElementById('responsabilidad-minsait1').textContent = data.experience.minsait.responsibilities.items[0];
  document.getElementById('responsabilidad-minsait2').textContent = data.experience.minsait.responsibilities.items[1];
  document.getElementById('responsabilidad-minsait3').textContent = data.experience.minsait.responsibilities.items[2];
  document.getElementById('responsabilidad-minsait4').textContent = data.experience.minsait.responsibilities.items[3];
  document.getElementById('minsait-technologies').textContent = data.experience.minsait.technologies.title;
  document.getElementById('balearia-title').textContent = data.experience.balearia.title;
  document.getElementById('balearia-title-modal').textContent = data.experience.balearia.title;
  document.getElementById('balearia-period-text').textContent = data.experience.balearia.period;
  document.getElementById('balearia-period').textContent = data.experience.minsait.periodtitle;
  document.getElementById('balearia-location-text').textContent = data.experience.balearia.location;
  document.getElementById('balearia-location').textContent = data.experience.minsait.locationtitle;
  document.getElementById('agile-methodologies').textContent = data.experience.minsait.technologies.agile;
  document.getElementById('balearia-responsibilities').textContent = data.experience.balearia.responsibilities.title;
  document.getElementById('responsabilidad-balearia1').textContent = data.experience.balearia.responsibilities.items[0];
  document.getElementById('responsabilidad-balearia2').textContent = data.experience.balearia.responsibilities.items[1];
  document.getElementById('responsabilidad-balearia3').textContent = data.experience.balearia.responsibilities.items[2];
  document.getElementById('responsabilidad-balearia4').textContent = data.experience.balearia.responsibilities.items[3];
  document.getElementById('responsabilidad-balearia5').textContent = data.experience.balearia.responsibilities.items[4];
  document.getElementById('responsabilidad-balearia6').textContent = data.experience.balearia.responsibilities.items[5];
  document.getElementById('balearia-technologies').textContent = data.experience.balearia.technologies.title;
  console.log(data.experience.minsait.technologies.agile);

  document.querySelector('#contact h2').textContent = data.contact.title;
  document.querySelector('#contact p').textContent = data.contact.description;
  document.getElementById('phone-text').textContent = data.contact.call;
  document.getElementById('whatsapp-text').textContent = data.contact.whatsapp;
  document.getElementById('email-text').textContent = data.contact.email;
  document.getElementById('linkedin-text').textContent = data.contact.linkedin;

}

// Funciones para controlar los modals
function openModal(modalId) {
  modalOpened = true;
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
  }
}

function closeModal(modalId) {
  modalOpened = false;
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Cerrar modal con la tecla Escape
window.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }
});

// Safe fallback to avoid errors if not provided elsewhere.
function updateSEOForSection(sectionId) {
  if (!sectionId) return;
  try {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const titleEl = section.querySelector('h1, h2, h3');
    if (titleEl) {
      document.title = titleEl.textContent + ' | Eduardo García Romera';
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && section.querySelector('p')) {
      metaDesc.setAttribute('content', section.querySelector('p').textContent.slice(0, 150));
    }
  } catch (e) {
    // no-op: don't break the page
    console.warn('updateSEOForSection error', e);
  }
}

// Init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
  
let modalOpened = false;
let activeSectionId = 0;
let activeMovementCleanup = null;
let experienceCounterInterval = null;
const THEME_STORAGE_KEY = 'preferredTheme';
const THEME_ANIMATION_MS = 760;
let isThemeAnimating = false;

function getInitialThemePreference() {
  let storedTheme = null;
  try {
    storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  } catch (e) {
    storedTheme = null;
  }

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function applyThemeState(isDark, persist) {
  document.documentElement.classList.toggle('dark-mode', isDark);
  if (document.body) {
    document.body.classList.toggle('dark', isDark);
  }

  if (persist !== false) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch (e) {
      // no-op if storage is unavailable
    }
  }
}

function resolveThemeOverlayColor(targetDarkMode) {
  const rootStyle = getComputedStyle(document.documentElement);
  const fallback = targetDarkMode ? '#01579B' : '#03a9f4';
  const cssValue = rootStyle.getPropertyValue(targetDarkMode ? '--bg-dark' : '--bg-light');
  return (cssValue || '').trim() || fallback;
}

function getRevealRadius(x, y) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const farthestX = Math.max(x, width - x);
  const farthestY = Math.max(y, height - y);
  return Math.hypot(farthestX, farthestY);
}

function applySidebarWaveRhythm() {
  const docEl = document.documentElement;
  const primaryButtons = Array.from(document.querySelectorAll('#sidebar li'));
  const secondaryButtons = Array.from(document.querySelectorAll('#sidebar2 li'));
  const sequenceLength = primaryButtons.length || 7;
  const stepMs = 30;

  docEl.classList.add('theme-wave-sidebar');

  primaryButtons.forEach((item, index) => {
    const delay = (sequenceLength - 1 - index) * stepMs;
    item.style.setProperty('--wave-delay', `${delay}ms`);
    const icon = item.querySelector('i');
    if (icon) icon.style.setProperty('--wave-delay', `${delay}ms`);
  });

  secondaryButtons.forEach((item, index) => {
    const logicalIndex = index % sequenceLength;
    const delay = (sequenceLength - 1 - logicalIndex) * stepMs;
    item.style.setProperty('--wave-delay', `${delay}ms`);
    const icon = item.querySelector('i');
    if (icon) icon.style.setProperty('--wave-delay', `${delay}ms`);
  });
}

function clearSidebarWaveRhythm() {
  document.documentElement.classList.remove('theme-wave-sidebar');

  const waveTargets = document.querySelectorAll('#sidebar li, #sidebar2 li, #sidebar a i, #sidebar2 a i');
  waveTargets.forEach((target) => {
    target.style.removeProperty('--wave-delay');
  });
}

function animateThemeRadial(event, targetDarkMode, onThemeMidpoint) {
  const x = typeof event?.clientX === 'number' ? event.clientX : window.innerWidth / 2;
  const y = typeof event?.clientY === 'number' ? event.clientY : window.innerHeight / 2;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasClipPathSupport = window.CSS && CSS.supports('clip-path', 'circle(12px at 10px 10px)');

  if (reducedMotion || !hasClipPathSupport) {
    applySidebarWaveRhythm();
    applyThemeState(targetDarkMode);
    if (typeof onThemeMidpoint === 'function') onThemeMidpoint();
    clearSidebarWaveRhythm();
    isThemeAnimating = false;
    return;
  }

  const overlay = document.createElement('div');
  const revealColor = resolveThemeOverlayColor(targetDarkMode);
  applySidebarWaveRhythm();
  overlay.className = 'theme-radial-overlay';
  overlay.style.setProperty('--reveal-x', `${x}px`);
  overlay.style.setProperty('--reveal-y', `${y}px`);
  overlay.style.setProperty('--theme-reveal-color', revealColor);
  overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
  document.body.appendChild(overlay);

  const maxRadius = getRevealRadius(x, y);
  let midApplied = false;
  let cleaned = false;

  requestAnimationFrame(() => {
    overlay.style.clipPath = `circle(${maxRadius}px at ${x}px ${y}px)`;
  });

  const midpointTimer = setTimeout(() => {
    if (!midApplied) {
      applyThemeState(targetDarkMode);
      if (typeof onThemeMidpoint === 'function') onThemeMidpoint();
      midApplied = true;
    }
  }, THEME_ANIMATION_MS / 2);

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    clearTimeout(midpointTimer);
    if (!midApplied) {
      applyThemeState(targetDarkMode);
      if (typeof onThemeMidpoint === 'function') onThemeMidpoint();
      midApplied = true;
    }
    overlay.remove();
    clearSidebarWaveRhythm();
    isThemeAnimating = false;
  };

  overlay.addEventListener('transitionend', cleanup, { once: true });
  setTimeout(cleanup, THEME_ANIMATION_MS + 120);
}

function toggleThemeWithRadial(event, targetDarkMode, onThemeMidpoint) {
  if (isThemeAnimating) return;
  isThemeAnimating = true;
  animateThemeRadial(event, targetDarkMode, onThemeMidpoint);
}

function activateMovementMode() {
  if (activeMovementCleanup) {
    activeMovementCleanup();
    activeMovementCleanup = null;
  }

  // En ambos modos usamos paginación vertical por secciones,
  // evitando animaciones laterales de desaparición.
  activeMovementCleanup = verticalMovement();
}


function init(){
  const enlaceCV = document.querySelector('#cv-link .cv-link') || document.querySelector('a.cv-link[download]');
  const initialTheme = getInitialThemePreference();
  applyThemeState(initialTheme === 'dark', false);

  function updateVeritasProjectLogo() {
    const logoImg = document.getElementById('veritasProjectLogo');
    if (!logoImg) return;
    const isDark = document.documentElement.classList.contains('dark-mode');
    logoImg.src = isDark ? 'img/Veritas/veritas-logo-dark.webp' : 'img/Veritas/veritas-logo.webp';
  }

  // Preferencia guardada en localStorage > navegador
  const storedLang = (localStorage.getItem('preferredLang') || '').toLowerCase();
  const navigatorLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  const initialLang = storedLang || (navigatorLang.startsWith('es') ? 'es' : 'en');

  // Helper para aplicar idioma y persistir elección
  function setLanguage(lang) {
    lang = (lang || 'en').toLowerCase();
    localStorage.setItem('preferredLang', lang);
    document.documentElement.setAttribute('lang', lang);
    if (enlaceCV) {
      if (lang === 'es') {
        enlaceCV.href = 'assets/CV_Eduardo.pdf';
        enlaceCV.setAttribute('download', 'cv_eduardo.pdf');
      } else {
        enlaceCV.href = 'assets/CV_Eduardo_En.pdf';
        enlaceCV.setAttribute('download', 'cv_eduardo_en.pdf');
      }
    }
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
    darkMode = document.documentElement.classList.contains('dark-mode');
    if (darkMode) {
      degree = 180;
      if (modeWheel.style) modeWheel.style.transform = `rotate(${degree}deg)`;
    }

    modeWheel.addEventListener('click', (event) => {
      if (isThemeAnimating) return;
      const targetDarkMode = !darkMode;
      degree += 180;
      // proteger acceso a style
      if (modeWheel.style) modeWheel.style.transform = `rotate(${degree}deg)`;
      toggleThemeWithRadial(event, targetDarkMode, () => {
        darkMode = targetDarkMode;
        updateVeritasProjectLogo();
      });
    });
  }

  updateVeritasProjectLogo();

  initExperienceCounter();

  activateMovementMode();
  
  // Manejador para reiniciar posiciones del sidebar y volver a welcome al redimensionar (debounced)
  let resizeResetTimer;
  function resetSidebarAndGoWelcome() {
    // Resetear sidebar2 items (si existe)
    try {
      const sidebar2El = document.getElementById('sidebar2');
      if (sidebar2El) {
        const items = sidebar2El.querySelectorAll('li');
        items.forEach(li => {
          li.style.transform = 'translateY(0px)';
          li.style.opacity = '1';
          li.style.pointerEvents = 'auto';
        });
      }

      // Resetear enlaces del sidebar (quitar active de todos)
      const sidebarLinksAll = document.querySelectorAll('#sidebar a[href^="#"]');
      sidebarLinksAll.forEach(link => {
        link.classList.remove('active-section');
        const svg = link.querySelector('svg');
        if (svg) svg.style.fill = '';
      });

      // Activar explicitamente el enlace welcome si existe
      const welcomeLink = document.querySelector('#sidebar a[href="#welcome-section"], #sidebar a[href="#welcome"]');
      if (welcomeLink) {
        welcomeLink.classList.add('active-section');
        const svg = welcomeLink.querySelector('svg');
        if (svg) svg.style.fill = 'var(--icons-hover)';
      }

      // Hacer scroll a la sección welcome y actualizar SEO/hash
      const welcome = document.getElementById('welcome-section') || document.getElementById('welcome');
      if (welcome) {
        welcome.scrollIntoView({ behavior: 'smooth' });
        try { updateSEOForSection(welcome.id || 'welcome-section'); } catch(e) {}
        try { history.replaceState(null, '', '#' + (welcome.id || 'welcome-section')); } catch(e) {}
        // mantener referencia del id activo
        activeSectionId = welcome.id || 'welcome-section';
      }
    } catch (e) {
      console.warn('resetSidebarAndGoWelcome error', e);
    }
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

  // Garantizar que los .certificate-tile con onclick llamen a openModal incluso si el inline handler falla
  try {
    const certTiles = document.querySelectorAll('.certificate-tile[onclick]');
    certTiles.forEach(tile => {
      // evitar agregar múltiples listeners si init se ejecuta varias veces
      if (tile.dataset.modalListenerAttached) return;
      const onclick = tile.getAttribute('onclick') || '';
      const match = onclick.match(/openModal\(['"]([^'\"]+)['"]\)/);
      if (match && match[1]) {
        const modalId = match[1];
        tile.addEventListener('click', (e) => {
          e.preventDefault();
          try { openModal(modalId); } catch(err) { console.warn('openModal call failed', err); }
        });
        tile.dataset.modalListenerAttached = '1';
      }
    });
  } catch (e) {
    console.warn('certificate tile binding error', e);
  }

  // Hace clicables los iconos de welcome sin usar <a> para no alterar estilos.
  try {
    const welcomeIconItems = document.querySelectorAll('#welcome-section .welcome-icons li[data-url]');
    welcomeIconItems.forEach(item => {
      if (item.dataset.linkListenerAttached) return;
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        const url = item.dataset.url;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      });
      item.dataset.linkListenerAttached = '1';
    });
  } catch (e) {
    console.warn('welcome icon link binding error', e);
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

      items.forEach(li => {
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
          li.style.pointerEvents = 'none';
          moveOutOfView(li, delta);
        } else {
          li.style.opacity = '1';
          moveInView(li);
          li.style.pointerEvents = 'auto';
        }
      });
    }

    moveOutOfView = (element, delta) => {
      const offset = 50;
      element.style.transform = `translateY(${delta - offset}px)`;
    };

    moveInView = (element) => {
      element.style.transform = `translateY(0px)`;
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
  if (swipeRight && !verifyMax768pxWidth()) {
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
    activateMovementMode();

    setTimeout(() => {
      captureBasePositions();
      updateSidebar2Positions();
    }, 50);
    // Debounce para evitar ejecuciones repetidas al redimensionar
    if (!verifyMax768pxWidth()) {
      if (resizeResetTimer) clearTimeout(resizeResetTimer);
      resizeResetTimer = setTimeout(() => {
        resetSidebarAndGoWelcome();
      }, 160);
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
  const sidebarLinks = document.querySelectorAll("#sidebar a[href^='#']");
  let isScrolling = false;
  let touchStartX = 0;
  const isMobile = verifyMax768pxWidth();

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
      }
    });
  }

  function goToSection(targetIndex) {
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    currentSectionIndex = targetIndex;
    const targetSection = sections[currentSectionIndex];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      const sectionId = targetSection.getAttribute("id");
      if (sectionId) {
        try { history.replaceState(null, "", `#${sectionId}`); } catch (e) {}
      }
    }
    updateActiveSection();
  }

  updateActiveSection();

  const onScroll = () => updateActiveSection();
  const onWheel = (event) => {
    if (isMobile) return;
    event.preventDefault();
    if (!isScrolling && !modalOpened) {
      isScrolling = true;
      setTimeout(() => { isScrolling = false; }, 500);

      if (event.deltaY > 0 && currentSectionIndex < sections.length - 1) {
        goToSection(currentSectionIndex + 1);
      } else if (event.deltaY < 0 && currentSectionIndex > 0) {
        goToSection(currentSectionIndex - 1);
      }
    }
  };

  const onTouchStart = (event) => {
    touchStartY = event.touches[0].clientY;
    touchStartX = event.touches[0].clientX;
  };

  const onTouchMove = (event) => {
    if (isMobile) return;
    if (isScrolling || modalOpened) return;
    const touchEndY = event.touches[0].clientY;
    const touchEndX = event.touches[0].clientX;
    const diffY = touchEndY - touchStartY;
    const diffX = touchEndX - touchStartX;

    // En mobile priorizamos swipe vertical para navegar secciones.
    if (Math.abs(diffY) < 50 || Math.abs(diffY) < Math.abs(diffX)) return;

    isScrolling = true;
    setTimeout(() => { isScrolling = false; }, 500);

    if (diffY < 0 && currentSectionIndex < sections.length - 1) {
      goToSection(currentSectionIndex + 1);
    } else if (diffY > 0 && currentSectionIndex > 0) {
      goToSection(currentSectionIndex - 1);
    }
  };

  const onSidebarClick = (event) => {
    if (isMobile) return;
    const href = event.currentTarget.getAttribute("href") || "";
    const id = href.startsWith("#") ? href.slice(1) : "";
    const idx = Array.from(sections).findIndex(section => section.id === id);
    if (idx >= 0) {
      event.preventDefault();
      goToSection(idx);
    }
  };

  window.addEventListener("scroll", onScroll);
  if (!isMobile) {
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    sidebarLinks.forEach(link => link.addEventListener("click", onSidebarClick));
  }

  return function cleanupVerticalMovement() {
    window.removeEventListener("scroll", onScroll);
    if (!isMobile) {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      sidebarLinks.forEach(link => link.removeEventListener("click", onSidebarClick));
    }
  };
}

function horizontalMovement(){
  let currentSectionIndex = 0;
  const sections = document.querySelectorAll("section");
  const sidebarLinks = document.querySelectorAll("#sidebar a[href^='#']");
  const sidebar2Tabs = Array.from(document.querySelectorAll("#sidebar2 li")).slice(0, sections.length);
  let isScrolling = false;

  function updateActiveSection() {
    if (modalOpened) {
      return;
    }
    const activeSection = sections[currentSectionIndex];
    if (!activeSection) return;
    const sectionId = activeSection.getAttribute("id");

    sidebarLinks.forEach(link => {
      const linkId = (link.getAttribute("href") || "").slice(1);
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

    if (sectionId) {
      updateSEOForSection(sectionId);
      activeSectionId = sectionId;
      try { history.replaceState(null, "", `#${sectionId}`); } catch (e) {}
    }
  }

  function animateDirectionalClasses(fromElement, toElement, forward) {
    if (!fromElement || !toElement) return;

    const outClass = forward ? "section-slide-out-right" : "section-slide-out-left";
    const inClass = forward ? "section-slide-in-right" : "section-slide-in-left";

    fromElement.classList.add(outClass);
    toElement.classList.add(inClass);

    setTimeout(() => {
      fromElement.classList.remove(outClass);
      toElement.classList.remove(inClass);
    }, 360);
  }

  function animateMarkerTransition(fromIndex, toIndex, forward) {
    const outClass = forward ? "marker-slide-out-right" : "marker-slide-out-left";
    const inClass = forward ? "marker-slide-in-right" : "marker-slide-in-left";

    const fromLink = sidebarLinks[fromIndex];
    const toLink = sidebarLinks[toIndex];
    const fromTab = sidebar2Tabs[fromIndex];
    const toTab = sidebar2Tabs[toIndex];

    [fromLink, fromTab].forEach(el => el && el.classList.add(outClass));
    [toLink, toTab].forEach(el => el && el.classList.add(inClass));

    setTimeout(() => {
      [fromLink, fromTab].forEach(el => el && el.classList.remove(outClass));
      [toLink, toTab].forEach(el => el && el.classList.remove(inClass));
    }, 320);
  }

  function goToSection(targetIndex) {
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    if (targetIndex === currentSectionIndex) return;

    const previousIndex = currentSectionIndex;
    const previousSection = sections[previousIndex];
    const nextSection = sections[targetIndex];
    const forward = targetIndex > previousIndex;

    currentSectionIndex = targetIndex;
    animateDirectionalClasses(previousSection, nextSection, forward);
    animateMarkerTransition(previousIndex, targetIndex, forward);
    nextSection.scrollIntoView({ behavior: "auto", block: "start" });
    updateActiveSection();
  }

  updateActiveSection();

  const onWheel = (event) => {
    event.preventDefault();
    if (!isScrolling && !modalOpened) {
      isScrolling = true;
      setTimeout(() => { isScrolling = false; }, 500);

      if (event.deltaY > 0 && currentSectionIndex < sections.length - 1) {
        goToSection(currentSectionIndex + 1);
      } else if (event.deltaY < 0 && currentSectionIndex > 0) {
        goToSection(currentSectionIndex - 1);
      }
    }
  };

  const onSidebarClick = (event) => {
    const href = event.currentTarget.getAttribute("href") || "";
    const id = href.startsWith("#") ? href.slice(1) : "";
    const idx = Array.from(sections).findIndex(section => section.id === id);
    if (idx >= 0) {
      event.preventDefault();
      goToSection(idx);
    }
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  sidebarLinks.forEach(link => link.addEventListener("click", onSidebarClick));

  return function cleanupHorizontalMovement() {
    window.removeEventListener("wheel", onWheel);
    sidebarLinks.forEach(link => link.removeEventListener("click", onSidebarClick));
  };
}


let darkMode = false;
let degree = 0;
let degreeLang = 0;

const FALLBACK_TRANSLATIONS = {
  es: {
    about: {
      title: "Sobre Mí",
      description: "Soy ingeniero de software full-stack con experiencia en el desarrollo de aplicaciones empresariales usando Java, Spring Boot, Angular y microservicios, contribuyendo actualmente a la transformación digital del sector educativo en la Generalitat Valenciana a través de Minsait."
    },
    certificates: {
      title: "Mis Certificados",
      efset: "Inglés C1",
      responsive: "Responsive Web Design",
      frontend: "Arquitectura Frontend",
      degree: "Ingeniería Informática - UNED",
      c1ModalTitle: "Certificado Inglés C1",
      c1ModalDesc: "Por privacidad no puedo exponer en internet mi certificado de Inglés C1. En un proceso avanzado de entrevista estaré encantado de adjuntarlo.",
      c1ModalDismiss: "Entendido",
      degreeModalTitle: "Título de Ingeniería Informática",
      degreeModalDesc: "Por privacidad no puedo exponer en internet mi título de Ingeniería Informática. En un proceso avanzado de entrevista estaré encantado de adjuntarlo.",
      degreeModalDismiss: "Entendido"
    },
    contact: {
      title: "Contacto",
      call: "Llamarme: 634 437 545",
      whatsapp: "Enviarme un WhatsApp",
      email: "edugar130@gmail.com",
      linkedin: "Mi perfil en LinkedIn"
    },
    experience: {
      title: "Experiencia laboral",
      liveLabel: "Experiencia total en el sector",
      timelineTitle: "Cronograma profesional",
      detailsCta: "Ver detalle",
      minsait: {
        title: "Ingeniero de Software - Minsait",
        period: "ene. 2024 - actualidad"
      },
      balearia: {
        title: "Becario Full-Stack - Baleària",
        period: "nov. 2023 - ene. 2024"
      }
    },
    projects: {
      title: "Proyectos destacados",
      inventory: "Gestor de Inventario Web",
      compiler: "Compilador ADA",
      veritas: "Veritas - Descubre tu Verdad",
      vosvil: "Vosvil - Concierge de lujo"
    },
    skills: {
      title: "Habilidades",
      description: "Experiencia en Java, Spring Boot, Angular, SQL, JavaScript, TypeScript, CSS, y HTML. Competente en React.js, Bootstrap, Redux y desarrollo de APIs RESTful. Familiarizado con Docker, Git, metodologías ágiles y herramientas como Jira y Slack."
    },
    welcome: {
      title: "Bienvenid@ a mi Portafolio",
      description: "¡Hola! Soy Eduardo García Romera, ingeniero informático y apasionado por la tecnología. Aquí encontrarás una muestra de mis proyectos y habilidades.",
      cv: "Descargar mi CV"
    }
  },
  en: {
    about: {
      title: "About Me",
      description: "I am a full-stack software engineer with experience developing enterprise applications using Java, Spring Boot, Angular, and microservices. I am currently contributing to the digital transformation of the education sector in the public sector of Valencia through Minsait."
    },
    certificates: {
      title: "My Certificates",
      efset: "Advanced English C1",
      responsive: "Responsive Web Design",
      frontend: "Frontend Architecture",
      degree: "Computer Engineering - UNED",
      c1ModalTitle: "English Certificate — C1",
      c1ModalDesc: "For privacy reasons, I cannot publish my C1 English certificate online. In an advanced interview stage, I will be happy to provide it.",
      c1ModalDismiss: "Dismiss",
      degreeModalTitle: "Computer Engineering Degree",
      degreeModalDesc: "For privacy reasons, I cannot publish my engineering degree online. In an advanced interview stage, I will be happy to provide it.",
      degreeModalDismiss: "Dismiss"
    },
    contact: {
      title: "Contact",
      description: "Let’s talk! You can reach me through the following channels:",
      call: "Call me: 634 437 545",
      whatsapp: "Send me a WhatsApp",
      email: "edugar130@gmail.com",
      linkedin: "My LinkedIn profile"
    },
    experience: {
      title: "Work Experience",
      liveLabel: "Total experience in the sector",
      timelineTitle: "Professional timeline",
      detailsCta: "View details",
      minsait: {
        title: "Software Engineer - Minsait",
        period: "Jan 2024 - Present"
      },
      balearia: {
        title: "Full-Stack Intern - Baleària",
        period: "Nov 2023 - Jan 2024"
      }
    },
    projects: {
      title: "Featured Projects",
      inventory: "Inventory Manager",
      compiler: "ADA Compiler",
      veritas: "Veritas Discover Your Truth",
      vosvil: "Vosvil Luxury Concierge"
    },
    skills: {
      title: "Skills",
      description: "Experience with Java, Spring Boot, Angular, SQL, JavaScript, TypeScript, CSS, and HTML. Proficient in React.js, Bootstrap, Redux, and RESTful API development. Familiar with Docker, Git, agile methodologies, and tools like Jira and Slack."
    },
    welcome: {
      title: "Welcome to My Portfolio",
      description: "Hi! I'm Eduardo García Romera, a computer engineer passionate about technology. Here you'll find a showcase of my projects and skills.",
      cv: "Download My CV"
    }
  }
};
 

function loadLanguage(lang) {
  console.log(`Loading language: ${lang}`);
  fetch(`assets/${lang}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load language file: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      applyTranslations(data);
    })
    .catch(error => {
      console.warn('Falling back to embedded translations:', error);
      const fallback = FALLBACK_TRANSLATIONS[lang] || FALLBACK_TRANSLATIONS.es;
      applyTranslations(fallback);
    });
}

function applyTranslations(data) {
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && typeof value === 'string') {
      el.textContent = value;
    }
  };

  document.querySelector('#welcome-section h1').textContent = data.welcome.title;
  document.querySelector('#welcome-section p').textContent = data.welcome.description;
  setText('cv_text', data.welcome.cv);

  document.querySelector('#about h2').textContent = data.about.title;
  document.querySelector('#about p').textContent = data.about.description;

  document.querySelector('#skills h2').textContent = data.skills.title;
  document.querySelector('#skills p').textContent = data.skills.description;

  document.querySelector('#projects h2').textContent = data.projects.title;
  setText('tfg', data.projects.inventory);
  setText('compilador', data.projects.compiler);
  setText('veritas', data.projects.veritas);
  setText('vosvil', data.projects.vosvil);

  setText('certificates-title', data.certificates.title);
  setText('ef-set', data.certificates.efset);
  setText('responsive-web-design', data.certificates.responsive);
  setText('arquitectura-frontend', data.certificates.frontend);
  setText('degree-uned', data.certificates.degree);
  // i18n for C1 modal
  if (data.certificates.c1ModalTitle) {
    const c1TitleEl = document.getElementById('c1-modal-title');
    if (c1TitleEl) c1TitleEl.textContent = data.certificates.c1ModalTitle;
  }
  if (data.certificates.c1ModalDesc) {
    const c1DescEl = document.getElementById('c1-modal-desc');
    if (c1DescEl) c1DescEl.textContent = data.certificates.c1ModalDesc;
  }
  if (data.certificates.c1ModalDismiss) {
    const c1DismissEl = document.getElementById('c1-modal-dismiss');
    if (c1DismissEl) c1DismissEl.textContent = data.certificates.c1ModalDismiss;
  }
  if (data.certificates.degreeModalTitle) {
    const degreeTitleEl = document.getElementById('degree-modal-title');
    if (degreeTitleEl) degreeTitleEl.textContent = data.certificates.degreeModalTitle;
  }
  if (data.certificates.degreeModalDesc) {
    const degreeDescEl = document.getElementById('degree-modal-desc');
    if (degreeDescEl) degreeDescEl.textContent = data.certificates.degreeModalDesc;
  }
  if (data.certificates.degreeModalDismiss) {
    const degreeDismissEl = document.getElementById('degree-modal-dismiss');
    if (degreeDismissEl) degreeDismissEl.textContent = data.certificates.degreeModalDismiss;
  }

  setText('experience-title', data.experience.title);
  setText('experience-live-label', data.experience.liveLabel);
  setText('experience-timeline-title', data.experience.timelineTitle);
  setText('minsait-title', data.experience.minsait.title);
  setText('minsait-link-title', data.experience.minsait.title);
  setText('balearia-title', data.experience.balearia.title);
  setText('balearia-link-title', data.experience.balearia.title);
  setText('timeline-minsait-period', data.experience.minsait.period);
  setText('timeline-balearia-period', data.experience.balearia.period);
  setText('minsait-link-cta', data.experience.detailsCta);
  setText('balearia-link-cta', data.experience.detailsCta);

  document.querySelector('#contact h2').textContent = data.contact.title;
  setText('phone-text', data.contact.call);
  setText('whatsapp-text', data.contact.whatsapp);
  setText('email-text', data.contact.email);
  setText('linkedin-text', data.contact.linkedin);

  updateExperienceCounter();

}

function daysInMonthUTC(year, monthIndex) {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function getCalendarDiff(startDate, endDate) {
  let years = endDate.getUTCFullYear() - startDate.getUTCFullYear();
  let months = endDate.getUTCMonth() - startDate.getUTCMonth();
  let days = endDate.getUTCDate() - startDate.getUTCDate();
  let hours = endDate.getUTCHours() - startDate.getUTCHours();
  let minutes = endDate.getUTCMinutes() - startDate.getUTCMinutes();
  let seconds = endDate.getUTCSeconds() - startDate.getUTCSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }

  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }

  if (days < 0) {
    const previousMonth = (endDate.getUTCMonth() - 1 + 12) % 12;
    const previousMonthYear = previousMonth === 11 ? endDate.getUTCFullYear() - 1 : endDate.getUTCFullYear();
    days += daysInMonthUTC(previousMonthYear, previousMonth);
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}

function pluralize(value, singular, plural) {
  return `${value} ${value === 1 ? singular : plural}`;
}

function formatExperienceCounter(diff, lang) {
  if (lang === 'en') {
    return `${pluralize(diff.years, 'year', 'years')} ${pluralize(diff.months, 'month', 'months')}`;
  }

  return `${pluralize(diff.years, 'año', 'años')} ${pluralize(diff.months, 'mes', 'meses')}`;
}

function updateExperienceCounter() {
  const counterEl = document.getElementById('experience-live-counter');
  if (!counterEl) return;

  const startText = counterEl.dataset.sectorStart;
  if (!startText) return;

  const startDate = new Date(startText);
  const now = new Date();
  const lang = (localStorage.getItem('preferredLang') || document.documentElement.lang || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';

  if (Number.isNaN(startDate.getTime())) return;

  const diff = getCalendarDiff(startDate, now);
  counterEl.textContent = formatExperienceCounter(diff, lang);
}

function initExperienceCounter() {
  if (!document.getElementById('experience-live-counter')) return;
  if (experienceCounterInterval) {
    clearInterval(experienceCounterInterval);
  }
  updateExperienceCounter();
  experienceCounterInterval = setInterval(updateExperienceCounter, 1000);
}

// Funciones para controlar los modals
function openModal(modalId) {
  modalOpened = true;
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
    // Evitar scroll del body mientras el modal está abierto
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
    // Foco accesible en el modal
    try {
      const focusable = modal.querySelector('button, a, [tabindex]');
      if (focusable) focusable.focus();
    } catch (e) {}
  } else {
    console.warn('openModal: modal not found', modalId);
  }
}

function closeModal(modalId) {
  modalOpened = false;
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
  // restaurar scroll del body
  try { document.body.style.overflow = 'auto'; } catch (e) {}
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
  
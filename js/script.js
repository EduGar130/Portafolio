let modalOpened = false;

function init(){
  const idiomaPreferido = navigator.language;
  const enlaceCV = document.getElementById('cv-link');

  if(idiomaPreferido === "es-ES"){
    enlaceCV.href = 'assets/CV_Eduardo.pdf';
    loadLanguage("es");
  }else{
    enlaceCV.href = 'assets/CV_Eduardo_En.pdf';
    loadLanguage("en");
  }

  if (verifyMax768pxWidth()) {
    horizontalMovement();
  } else {
    verticalMovement();
  }
  
  window.addEventListener("resize", function(){
    if (verifyMax768pxWidth()) {
      horizontalMovement();
    } else {
      verticalMovement();
    }
  });
}

document.addEventListener('sectionsLoaded', init);

function verifyMax768pxWidth() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function verticalMovement(){
  let currentSectionIndex = 0;
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
const modeWheel = document.getElementById("modeWheel");

document.getElementById("modeWheel").addEventListener("click", function() {
  if (darkMode) {
    document.documentElement.classList.remove("dark-mode");
  } else {
    document.documentElement.classList.add("dark-mode");
  }
  degree += 180;
  modeWheel.style.transform = `rotate(${degree}deg)`;
  darkMode = !darkMode;
});

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
  
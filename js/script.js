function init(){
  const idiomaPreferido = navigator.language;
  const enlaceCV = document.getElementById('cvLink');

  // if(idiomaPreferido === "es-ES"){
  //   enlaceCV.href = 'assets/CV_Eduardo.pdf';
  //   loadLanguage("es");
  // }else{
  //   enlaceCV.href = 'assets/CV_Eduardo_En.pdf';
  //   loadLanguage("en");
  // }

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
    if (!isScrolling) {
      console.log(currentSectionIndex);
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
    if (!isScrolling) {
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
  fetch(`assets/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      applyTranslations(data);
    }).catch(error => {
      console.error('Error loading the language file:', error);
    });
}

function applyTranslations(data) {
  document.querySelector('#welcome-section h1').textContent = data.welcome_section;
  document.querySelector('#welcome-section p').textContent = data.hello;
  document.querySelector('#cv_text').textContent = data.download_cv;
  document.querySelector('#about h2').textContent = data.about_title;
  document.querySelector('#about p').textContent = data.about_content;
  document.querySelector('#skills h2').textContent = data.skills_title;
  document.querySelector('#skills p').innerHTML = data.skills_content;
  document.querySelectorAll('#projects .tile h3')[0].textContent = data.personal_portfolio_title;
  document.querySelectorAll('#projects .tile p')[0].textContent = data.personal_portfolio;
  document.querySelectorAll('#projects .tile h3')[1].textContent = data.coming_soon_title;
  document.querySelectorAll('#projects .tile p')[1].textContent = data.coming_soon;
  document.querySelector('#certificates .certificate-title h3').textContent = data.certificates_title;
  document.querySelector('#certificate-1 h3').textContent = data.js;
  document.querySelector('#certificate-2 h3').textContent = data.seo;
  document.querySelector('#certificate-3 h3').textContent = data.sql;
  document.querySelector('#certificate-4 h3').textContent = data.smm;
  document.querySelector('#certificate-5 h3').textContent = data.rwd;
  document.querySelector('#certificate-6 h3').textContent = data.jsfbc;
  document.querySelector('#certificate-7 h3').textContent = data.english;
  document.querySelector('#certificate-8 h3').textContent = data.frontend;
  document.querySelector('#certificate-9 h3').textContent = data.git;
  document.querySelector('#experience h2').textContent = data.work_experience_title;
  document.querySelectorAll('#experience .tile h3')[0].textContent = data.internship_title;
  document.querySelectorAll('#experience .tile p')[0].textContent = data.internship;
  document.querySelectorAll('#experience .tile a')[0].textContent = data.internship_link;
  document.querySelectorAll('#experience .tile h3')[1].textContent = data.sales_representative_title;
  document.querySelectorAll('#experience .tile p')[1].textContent = data.sales_representative;
  document.querySelectorAll('#experience .tile h3')[2].textContent = data.store_clerk_title;
  document.querySelectorAll('#experience .tile p')[2].textContent = data.store_clerk;
  document.querySelector('#contact h2').textContent = data.contact_title;
  document.querySelector('#contact p').textContent = data.contact_content;
  document.querySelector('#too-small h3').textContent = data.too_small;
}

  
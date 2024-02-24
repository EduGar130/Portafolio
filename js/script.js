document.addEventListener("DOMContentLoaded", function() {
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
});

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
    });
  }

  updateActiveSection();

  window.addEventListener("scroll", updateActiveSection);

  window.addEventListener("wheel", function(event) {
    event.preventDefault();
    if (!isScrolling) {
      isScrolling = true;
      setTimeout(() => { isScrolling = false; }, 1000);

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
    console.log("man llamao")
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
  const twitter = document.getElementById("twitter");
  const cvImage = document.getElementById("cvImage");
  
  document.getElementById("modeWheel").addEventListener("click", function() {
    if (darkMode) {
      document.documentElement.classList.remove("dark-mode");
      twitter.src = "img/png/X.png"
      cvImage.src = "img/svg/pdfLight.svg"
    } else {
      document.documentElement.classList.add("dark-mode");
      twitter.src = "img/png/X_DarkMode.png"
      cvImage.src = "img/svg/pdfDark.svg"
    }
    degree += 180;
    modeWheel.style.transform = `rotate(${degree}deg)`;
    darkMode = !darkMode;
  });
  
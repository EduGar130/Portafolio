document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll("section");
    const sidebarLinks = document.querySelectorAll("#sidebar a");

    let currentSectionIndex = 0;
    let isScrolling = false;
    let touchStartY = 0;

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
    });

    window.addEventListener("touchstart", function(event) {
      touchStartY = event.touches[0].clientY;
    });

    window.addEventListener("touchmove", function(event) {
      const touchEndY = event.touches[0].clientY;
      const touchMoveDiff = touchEndY - touchStartY;

      if (!isScrolling) {
        if (touchMoveDiff > 50 && currentSectionIndex > 0) {
          isScrolling = true;
          setTimeout(() => { isScrolling = false; }, 500);
          currentSectionIndex--;
          sections[currentSectionIndex].scrollIntoView({ behavior: "smooth" });
        } else if (touchMoveDiff < -50 && currentSectionIndex < sections.length - 1) {
          isScrolling = true;
          setTimeout(() => { isScrolling = false; }, 500);
          currentSectionIndex++;
          sections[currentSectionIndex].scrollIntoView({ behavior: "smooth" });
        }
      }
    });

  });
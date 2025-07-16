const sections = [
  { id: 'sidebar-s', file: 'sections/sidebar.html' },
  { id: 'welcome-s', file: 'sections/welcome.html' },
  { id: 'about-s', file: 'sections/about.html' },
  { id: 'skills-s', file: 'sections/skills.html' },
  { id: 'projects-s', file: 'sections/projects.html' },
  { id: 'certificates-s', file: 'sections/certificates.html' },
  { id: 'experience-s', file: 'sections/experience.html' },
  { id: 'contact-s', file: 'sections/contact.html' }
];

const loadPromises = sections.map(section => {
  return fetch(section.file)
    .then(response => response.text())
    .then(html => {
      document.getElementById(section.id).innerHTML = html;
    })
    .catch(error => console.error(`Error loading ${section.file}:`, error));
});

Promise.all(loadPromises).then(() => {
  document.dispatchEvent(new Event('sectionsLoaded'));
});

// !Select all the navigation links and sections
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const sections = [
  document.querySelector('#about'),
  document.querySelector('#resume'),
  document.querySelector('#contact'),
  document.querySelector('#projects'),
];

// Function to show the selected section and hide others
function showSection(targetId) {
  sections.forEach(section => {
    if (section) {
      section.style.display = section.id === targetId ? 'block' : 'none';
    }
  });

  // Update the hash in the URL without scrolling
  window.history.replaceState(null, null, `#${targetId}`);
}

// Add event listeners to the navigation links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove 'active' class from all links
    navLinks.forEach(nav => nav.classList.remove('active'));

    // Add 'active' class to the clicked link
    link.classList.add('active');

    // Get the target section from the link's href or ID
    const targetId = link.getAttribute('id')?.replace('-link', '');

    // Show the selected section
    if (targetId) {
      showSection(targetId);
    }
  });
});

// Initial setup: Check the hash in the URL and display the corresponding section
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.substring(1); // Remove the '#' symbol
  const defaultSection = 'about';

  // Show the section based on the hash or the default section
  const targetId = hash || defaultSection;
  showSection(targetId);

  // Highlight the correct navigation link
  navLinks.forEach(link => {
    if (link.getAttribute('id') === `${targetId}-link`) {
      link.classList.add('active');
    }
  });
});

// !Fetch and load projects from data.json
fetch('data.json')
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById('projects-container');

    // Loop through each category and create cards for projects
    for (const category in data.projects) {
      data.projects[category].forEach((project) => {
        const cardCol = createProjectCard(project, category);
        container.appendChild(cardCol);
      });
    }
  })
  .catch((error) => console.error('Error loading data:', error));

// !Function to create a project card
function createProjectCard(project, category) {
  const cardCol = document.createElement('div');
  cardCol.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-4', 'project');
  cardCol.setAttribute('data-category', category);

  const card = document.createElement('div');
  card.classList.add('card', 'text-bg-dark');

  const img = document.createElement('img');
  img.src = project.Image || 'default-image.png'; 
  img.classList.add('card-img');
  img.alt = project.title;

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-img-overlay');

  const title = document.createElement('h3');
  title.classList.add('card-title');
  title.textContent = project.title;

  const description = document.createElement('h3');
  description.classList.add('card-text');
  description.textContent = project.description;

  const tech = document.createElement('h4');
  tech.classList.add('card-text');
  tech.textContent = `Technologies: ${project.technologies.join(', ')}`;

  const link = document.createElement('a');
  link.classList.add('card-text');
  link.href = project.link;
  link.target = '_blank';
  link.textContent = 'View Project';

  // Append elements to the card
  cardBody.appendChild(title);
  cardBody.appendChild(description);
  cardBody.appendChild(tech);
  cardBody.appendChild(link);
  card.appendChild(img);
  card.appendChild(cardBody);
  cardCol.appendChild(card);

  return cardCol;
}

// !Function to filter projects by category
function filterProjects(category, clickedElement) {
  const projects = document.querySelectorAll('.project');
  const links = document.querySelectorAll('.project-filter-link');

  // Filter projects by category
  projects.forEach((project) => {
    if (category === 'all' || project.getAttribute('data-category') === category) {
      project.style.display = 'block';
    } else {
      project.style.display = 'none';
    }
  });

  // Remove 'actives' class from all links
  links.forEach((link) => link.classList.remove('actives'));

  // Add 'actives' class to the clicked link
  clickedElement.classList.add('actives');
}

// !Contact form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const successMessage = document.getElementById('success-message');
  const loader = document.getElementById('loader'); 

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset error messages
    nameError.style.display = 'none';
    emailError.style.display = 'none';
    messageError.style.display = 'none';

    let isValid = true;

    // Validate name
    if (nameInput.value.trim() === '') {
      nameError.textContent = 'Name is required.';
      nameError.style.display = 'block';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '') {
      emailError.textContent = 'Email is required.';
      emailError.style.display = 'block';
      isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
      emailError.textContent = 'Enter a valid email.';
      emailError.style.display = 'block';
      isValid = false;
    }

    // Validate message
    if (messageInput.value.trim() === '') {
      messageError.textContent = 'Message is required.';
      messageError.style.display = 'block';
      isValid = false;
    }

    if (isValid) {
      loader.style.display = 'grid';
      // Prepare form data
      const formData = new FormData(form);

      // Send form data to Web3Forms API using fetch
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          // Display success message
          successMessage.style.display = 'block';

          // Clear input fields
          nameInput.value = '';
          emailInput.value = '';
          messageInput.value = '';

          // Hide success message after a delay
          setTimeout(() => {
            successMessage.style.display = 'none';
          }, 3000);
        } else {
          console.error('Submission error:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
      finally {
        // Hide the loader after the form submission is complete
        loader.style.display = 'none';
      }
    }
  });
});

//! Change theme
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme__toggle");
  const savedTheme = localStorage.getItem("theme");

  // Apply the saved theme on page load
  if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
      themeToggle.checked = true; 
  } else {
      document.body.classList.remove("dark-theme");
      themeToggle.checked = false; 
  }

  // Add event listener to toggle theme
  themeToggle.addEventListener("change", () => {
      if (themeToggle.checked) {
          document.body.classList.add("dark-theme");
          localStorage.setItem("theme", "dark"); // Save theme state
      } else {
          document.body.classList.remove("dark-theme");
          localStorage.setItem("theme", "light"); // Save theme state
      }
  });
});

// Owl Carousel for Courses
$('.owl-carousel').owlCarousel({
  loop:true,
  margin:10,
  nav:true,
  autoplay: true, 
  autoplayTimeout: 3000, 
  autoplayHoverPause: true,
  responsive:{
      0:{
          items:1
      },
      600:{
          items:2
      },
      1000:{
          items:2
      }
  }
})

// certificate
const certificatesContainer = document.querySelector('.certificates'); 
fetch('data.json')
  .then((response) => response.json())
  .then((data) => {
    data.certifications.forEach((certificate) => {
      const certificateDiv = document.createElement("div");
      certificateDiv.classList.add("col-lg-3", "col-md-6", "col-sm-6", "mb-4", "certificate-card");
      certificateDiv.innerHTML = `
        <a href="${certificate.link}" target="_blank" rel="noopener noreferrer">
          <img src="${certificate.Image}" alt="${certificate.title}" class="img-fluid card-img-top">
        </a>`;
      
      certificatesContainer.appendChild(certificateDiv);
    });
  })
  .catch((error) => console.error('Error fetching data:', error));


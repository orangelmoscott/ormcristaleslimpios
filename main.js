// Initialize Lucide Icons
lucide.createIcons();

// --- Navbar Scroll Effect & Mobile Menu ---
const navbar = document.getElementById("navbar");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

// Close mobile menu when a link is clicked
const mobileLinks = mobileMenu.querySelectorAll("a");
mobileLinks.forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
});


// --- Intersection Observer for Scroll Animations ---
// We replace ScrollReveal with a native robust API for better performance and SEO

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Stop observing once animated
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const elementsToAnimate = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right, .slide-in-up');

elementsToAnimate.forEach(el => {
  observer.observe(el);
});


// --- Contact Form Submission ---
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formFeedback = document.getElementById('form-feedback');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const telefono = document.getElementById('telefono').value;
  const message = document.getElementById('message').value;

  // Change button state
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>Enviando... <i data-lucide="loader" class="icon-sm spin"></i></span>';
  submitBtn.disabled = true;
  lucide.createIcons(); // render the loader icon

  // Setup timeout for the fetch request (15 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('https://serverormcristales.onrender.com/cliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, telefono, message }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Check if the response is actually ok (e.g. not a 502/504 error)
    if (!response.ok) {
      throw new Error(`HTTP Error status: ${response.status}`);
    }

    const result = await response.json();

    // Show success
    formFeedback.classList.remove('hidden');
    formFeedback.textContent = result.message || "Mensaje enviado exitosamente.";
    formFeedback.style.backgroundColor = '#dcfce7';
    formFeedback.style.color = '#166534';

    // Clear form
    form.reset();

  } catch (error) {
    clearTimeout(timeoutId);

    // Show error
    formFeedback.classList.remove('hidden');

    // Provide a specific message if it was a timeout
    if (error.name === 'AbortError') {
      formFeedback.textContent = "El servidor parece estar dormido o tardando mucho en responder. Por favor, intenta usar el botón de WhatsApp temporalmente.";
    } else {
      formFeedback.textContent = "Hubo un error al enviar el mensaje. Por favor intenta de nuevo más tarde o contáctanos por WhatsApp.";
    }

    formFeedback.style.backgroundColor = '#fee2e2';
    formFeedback.style.color = '#991b1b';
  } finally {
    // Reset button state
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
    lucide.createIcons(); // re-render the send icon

    // Hide feedback after 5 seconds
    setTimeout(() => {
      formFeedback.classList.add('hidden');
    }, 5000);
  }
});

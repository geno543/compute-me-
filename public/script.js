// HAMBURGER MENU LOGIC
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// PARTICLES / MATRIX BACKGROUND (OPTIONAL)
const particles = document.getElementById('particles');
if (particles) {
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particles.appendChild(particle);

    particle.addEventListener('animationend', () => {
      particle.remove();
      createParticle();
    });
  }
  for (let i = 0; i < 30; i++) {
    setTimeout(() => createParticle(), Math.random() * 2000);
  }
}

// HERO TYPING ANIMATION
const typingText = document.querySelector('.typing-text');
if (typingText) {
  const textToType = "HackaScience";
  typingText.textContent = '';
  let i = 0;

  function typeWriter() {
    if (i < textToType.length) {
      typingText.textContent += textToType.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  }
  typeWriter();
}

// COUNTER ANIMATION FOR STATS
const stats = document.querySelectorAll('.stat-number');
const observerOptions = { threshold: 0.5 };
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      console.log(entry);
      const target = entry.target
      console.log();

      const count = parseInt(entry.target.getAttribute('data-count') == 150 ? await fetch("/api/hackers").then(res => res.json()).then(data => data.hackers) : entry.target.getAttribute('data-count'));
      let current = 0;
      const increment = 0.5;
      function updateCount() {
        if (current < count) {
          current += increment;
          target.textContent = Math.round(current);
          requestAnimationFrame(updateCount);
        } else {
          target.textContent = count;
        }
      }
      updateCount();
      statsObserver.unobserve(target);
    }
  });
}, observerOptions);

stats.forEach(stat => {
  statsObserver.observe(stat);
});

// REGISTRATION FORM LOGIC
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registration-form');
  if (!form) return;

  const sections = Array.from(form.getElementsByClassName('form-section'));
  const progressBar = form.querySelector('.progress-fill');
  let currentStep = 0;

  updateFormState();

  form.addEventListener('click', function (e) {
    if (e.target.classList.contains('next-button')) {
      if (validateSection(currentStep)) {
        currentStep = Math.min(currentStep + 1, sections.length - 1);
        updateFormState();
      }
    } else if (e.target.classList.contains('prev-button')) {
      currentStep = Math.max(currentStep - 1, 0);
      updateFormState();
    }
  });

  form.addEventListener('submit', handleSubmit);

  function updateFormState() {
    sections.forEach((section, index) => {
      section.classList.remove('active');
      if (index === currentStep) section.classList.add('active');
    });
    const progress = ((currentStep + 1) / sections.length) * 100;
    progressBar.style.width = `${progress}%`;

    const prevButton = form.querySelector('.prev-button');
    const nextButton = form.querySelector('.next-button');
    if (prevButton) {
      prevButton.style.display = currentStep === 0 ? 'none' : 'block';
    }
    if (nextButton) {
      if (currentStep === sections.length - 1) {
        nextButton.textContent = 'Submit';
        nextButton.type = 'submit';
      } else {
        nextButton.textContent = 'Next';
        nextButton.type = 'button';
      }
    }
    const progressText = form.querySelector('.progress-text');
    if (progressText) {
      progressText.textContent = `Step ${currentStep + 1} of ${sections.length}`;
    }
  }

  function validateSection(stepIndex) {
    const currentSection = sections[stepIndex];
    const inputs = currentSection.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
      const errorElement = input.parentElement.querySelector('.error-message');
      if (errorElement) errorElement.textContent = '';

      if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        if (errorElement) {
          errorElement.textContent = 'This field is required';
        }
      }
      if (input.type === 'email' && input.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value)) {
          isValid = false;
          if (errorElement) {
            errorElement.textContent = 'Please enter a valid email address';
          }
        }
      }
      if (input.type === 'tel' && input.value.trim()) {
        const phonePattern = /^\+?[\d\s-]+$/;
        if (!phonePattern.test(input.value)) {
          isValid = false;
          if (errorElement) {
            errorElement.textContent = 'Please enter a valid phone number';
          }
        }
      }
    });
    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateSection(currentStep)) return;

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    }
    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      console.log(JSON.stringify(data));

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      // Show success
      form.innerHTML = `
        <div class="success-message">
          <i class="fas fa-check-circle"></i>
          <h3>Registration Successful!</h3>
          <p>Thank you for registering for the HackaScience.</p>
          <div class="success-details">
            <p><strong>Name:</strong> ${data.fullName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Track:</strong> ${data.track}</p>
            <p><strong>Status:</strong> Pending Review</p>
          </div>
          <p>We'll review your application and get back to you soon!</p>
        </div>
      `;
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        ${error.message || 'An error occurred. Please try again.'}
      `;
      const existingError = form.querySelector('.error-message');
      if (existingError) {
        existingError.remove();
      }

      form.insertBefore(errorDiv, form.firstChild);

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
      }
      errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// FAQ FILTER
function initFAQ() {
  const filterBtns = document.querySelectorAll('.faq-filters .filter-btn');
  const faqItems = document.querySelectorAll('.faq-item');

  // Show all FAQ items initially
  faqItems.forEach(item => {
    item.style.display = 'block';
    item.style.opacity = '1';
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.textContent.toLowerCase().trim();
      faqItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; }, 50);
        } else {
          item.style.opacity = '0';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initFAQ);

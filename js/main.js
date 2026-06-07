// ===============================
// Utility: Smooth scroll (enhanced behavior)
// ===============================

/**
 * Handles smooth scrolling for internal links with hash (#) targets.
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const offset = 70; // header height
    const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
    const scrollPosition = elementPosition - offset;

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });

    // Close mobile menu after click
    const navList = document.querySelector(".nav-list");
    const navToggle = document.getElementById("navToggle");
    if (navList && navList.classList.contains("open")) {
      navList.classList.remove("open");
      navToggle.classList.remove("active");
    }
  });
});

// ===============================
// Mobile navigation toggle
// ===============================

const navToggle = document.getElementById("navToggle");
const navList = document.querySelector(".nav-list");

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navList.classList.toggle("open");
  });
}

// ===============================
// Animate skill bars on scroll
// ===============================

/**
 * Uses Intersection Observer to animate the width of skill bars
 * when the skills section enters the viewport.
 */
const skillBars = document.querySelectorAll(".skill-bar-fill");

if ("IntersectionObserver" in window && skillBars.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetPercent = el.getAttribute("data-skill");
          if (targetPercent) {
            el.style.width = `${targetPercent}%`;
          }
          obs.unobserve(el);
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  skillBars.forEach((bar) => observer.observe(bar));
} else {
  // Fallback: immediately set width if IntersectionObserver not supported
  skillBars.forEach((bar) => {
    const targetPercent = bar.getAttribute("data-skill");
    if (targetPercent) {
      bar.style.width = `${targetPercent}%`;
    }
  });
}

// ===============================
// Contact form handler (frontend-only demo)
// ===============================

/**
 * NOTE: This is a frontend-only demo.
 * To actually send emails, connect this form to a backend
 * or a service like EmailJS, Formspree, etc.
 */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Simple client-side validation feedback
    const formData = new FormData(contactForm);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const subject = formData.get("subject")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!name || !email || !subject || !message) {
      formStatus.textContent = "Please fill out all required fields.";
      formStatus.style.color = "#f97316"; // orange
      return;
    }

    // Simulate successful submission
    formStatus.textContent =
      "Thank you for reaching out! I'll get back to you soon.";
    formStatus.style.color = "#22c55e"; // green

    // Clear form fields
    contactForm.reset();
  });
}

// ===============================
// Footer year
// ===============================

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

// ===============================
// Reveal-on-scroll for elements with .reveal
// ===============================
const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealEls = document.querySelectorAll('.reveal');
if (prefersReduced) {
  // Immediately show elements for reduced-motion users
  revealEls.forEach(el => el.classList.add('visible'));
} else if ('IntersectionObserver' in window && revealEls.length) {
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealEls.forEach(el => revObs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// ===============================
// Typing effect for hero-subtitle (cycles through words)
// ===============================
const typeEl = document.querySelector('.hero-subtitle');
if (typeEl && !prefersReduced) {
  const words = ['AI Engineer', 'Machine Learning', 'Deep Learning', 'Computer Vision'];
  let wIndex = 0;
  let cIndex = 0;
  let typing = true;

  function tick() {
    const word = words[wIndex];
    if (typing) {
      cIndex++;
      typeEl.textContent = word.slice(0, cIndex);
      if (cIndex === word.length) {
        typing = false;
        setTimeout(tick, 700);
        return;
      }
    } else {
      cIndex--;
      typeEl.textContent = word.slice(0, cIndex);
      if (cIndex === 0) {
        typing = true;
        wIndex = (wIndex + 1) % words.length;
      }
    }
    setTimeout(tick, typing ? 70 : 36);
  }

  // start after small delay
  setTimeout(tick, 520);
}

// ===============================
// Parallax for hero image on mouse move
// ===============================
const heroWrapper = document.querySelector('.hero-image-wrapper');
if (heroWrapper) {
  heroWrapper.classList.add('parallax');
  if (!prefersReduced) {
    heroWrapper.addEventListener('mousemove', (e) => {
      const rect = heroWrapper.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const translateX = dx * 8; // px
      const translateY = dy * 8; // px
      heroWrapper.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });
    heroWrapper.addEventListener('mouseleave', () => {
      heroWrapper.style.transform = '';
    });
  }
}

// ===============================
// Cursor follower
// ===============================
if (!prefersReduced) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-follower';
  cursor.style.opacity = '0.95';
  document.body.appendChild(cursor);
  window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // small interactions: scale cursor when hovering buttons/links
  document.querySelectorAll('a, button, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(1.6)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
  });
}

// Add decorative blob behind hero image
const heroImageCircle = document.querySelector('.hero-image-wrapper');
if (heroImageCircle) {
  const blob = document.createElement('div');
  blob.className = 'hero-blob';
  heroImageCircle.insertBefore(blob, heroImageCircle.firstChild);
  if (prefersReduced) blob.style.display = 'none';
}



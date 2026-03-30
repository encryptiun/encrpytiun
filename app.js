/* ========================================
   Encryptiun — App JavaScript
   ======================================== */

(function () {
  'use strict';

  // ---------- Theme Management ----------
  let currentTheme = 'dark';

  function getPreferredTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  // Listen for system preference changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      setTheme(e.matches ? 'light' : 'dark');
    });
  }

  // ---------- DOM Ready ----------
  document.addEventListener('DOMContentLoaded', () => {

    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    // ---------- Mobile Navigation ----------
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileNav() {
      hamburger.classList.add('active');
      mobileNav.classList.add('open');
      mobileNavOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      mobileNavOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        if (mobileNav.classList.contains('open')) {
          closeMobileNav();
        } else {
          openMobileNav();
        }
      });
    }

    if (mobileNavOverlay) {
      mobileNavOverlay.addEventListener('click', closeMobileNav);
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
        closeMobileNav();
      }
    });

    // ---------- Active Nav State ----------
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html') || (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    // ---------- Service Accordions (services.html) ----------
    const serviceDetails = document.querySelectorAll('.service-detail');
    serviceDetails.forEach(detail => {
      const header = detail.querySelector('.service-detail-header');
      if (header) {
        header.addEventListener('click', () => {
          const isOpen = detail.classList.contains('open');
          // Close all others
          serviceDetails.forEach(d => d.classList.remove('open'));
          // Toggle current
          if (!isOpen) {
            detail.classList.add('open');
          }
        });

        // Keyboard support
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
          }
        });
      }
    });

    // Open accordion from hash
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetAccordion = document.getElementById(targetId);
      if (targetAccordion && targetAccordion.classList.contains('service-detail')) {
        targetAccordion.classList.add('open');
        setTimeout(() => {
          targetAccordion.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }

    // ---------- Contact Form ----------
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        const requiredFields = contactForm.querySelectorAll('[required]');
        let valid = true;
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = 'var(--color-error)';
          } else {
            field.style.borderColor = '';
          }
        });
        if (!valid) {
          e.preventDefault();
        }
      });
    }

    // ---------- Smooth anchor scrolling for same-page links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // ---------- Canvas Particle Network ----------
    const canvas = document.getElementById('quantum-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let width, height;
      let particles = [];
      const mouse = { x: -1000, y: -1000 };
      let primaryRgb = '15, 98, 254';

      function updateColors() {
        const style = getComputedStyle(document.documentElement);
        primaryRgb = style.getPropertyValue('--color-primary-rgb').trim() || '15, 98, 254';
      }
      updateColors();

      function resize() {
        width = canvas.width = window.innerWidth;
        const hero = document.querySelector('.hero');
        height = canvas.height = hero ? hero.offsetHeight : window.innerHeight;
        initParticles();
      }

      window.addEventListener('resize', resize);

      class Particle {
        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.8;
          this.vy = (Math.random() - 0.5) * 0.8;
          this.radius = Math.random() * 1.5 + 0.5;
        }

        update() {
          this.x += this.vx;
          this.y += this.vy;

          if (this.x < 0 || this.x > width) this.vx *= -1;
          if (this.y < 0 || this.y > height) this.vy *= -1;

          // Mouse interaction (repel slightly or attract slightly, let's do soft repel)
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            this.x -= dx * 0.02;
            this.y -= dy * 0.02;
          }
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${primaryRgb}, 0.6)`;
          ctx.fill();
        }
      }

      function initParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor((width * height) / 12000), 120);
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle());
        }
      }

      function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();

          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;

            if (distSq < 15000) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              const opacity = 0.2 - (distSq / 75000);
              ctx.strokeStyle = `rgba(${primaryRgb}, ${opacity})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(animate);
      }

      const hero = document.querySelector('.hero');
      if (hero) {
        hero.addEventListener('mousemove', (e) => {
          const rect = canvas.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
        });
        hero.addEventListener('mouseleave', () => {
          mouse.x = -1000;
          mouse.y = -1000;
        });
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
            updateColors();
          }
        });
      });
      observer.observe(document.documentElement, { attributes: true });

      resize();
      animate();
    }

  });
})();

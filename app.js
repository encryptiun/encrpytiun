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

  });
})();

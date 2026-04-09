// app.js - Main entry point ES Module
// Imports demonstrate ES Modules structure

import { setLastModified, updateCopyright, initMobileMenu, initLazyLoading } from './utils.js';
import { fetchTours, renderTours, initModal, initFilters, setToursCache } from './tours.js';
import { loadTestimonials } from './testimonials.js';
import { initContactForm } from './contact.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Common setup on all pages
  setLastModified();
  updateCopyright();
  initMobileMenu();
  initLazyLoading();

  // ── Home page ──────────────────────────────────────────────────────────
  if (document.querySelector('.hero')) {
    // Load testimonials
    if (document.querySelector('.testimonials-slider')) {
      loadTestimonials();
    }

    // Load featured tours dynamically
    const featuredContainer = document.getElementById('featuredTours');
    if (featuredContainer) {
      try {
        const tours = await fetchTours();
        const featured = tours.filter(t => t.featured);
        renderTours(featured, 'featuredTours');
        setToursCache(tours);
        initModal();
      } catch (err) {
        console.error('Could not load featured tours:', err);
      }
    }
  }

  // ── Packages page ─────────────────────────────────────────────────────
  if (document.getElementById('allTours')) {
    try {
      const tours = await fetchTours();
      setToursCache(tours);
      initModal();
      initFilters(tours);
    } catch (err) {
      console.error('Could not load tours:', err);
      document.getElementById('allTours').innerHTML =
        `<p class="no-results">Unable to load tours. Please try again later.</p>`;
    }
  }

  // ── Contact page ──────────────────────────────────────────────────────
  if (document.getElementById('contactForm')) {
    initContactForm();
  }
});

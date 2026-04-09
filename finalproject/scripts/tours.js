// tours.js - Tours data fetching and display ES Module

import { saveToLocalStorage, getFromLocalStorage } from './utils.js';

// ─── Fetch Tours Data ──────────────────────────────────────────────────────
export async function fetchTours() {
  try {
    const response = await fetch('data/tours.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const tours = await response.json();
    return tours;
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

// ─── Render Tour Card ──────────────────────────────────────────────────────
export function renderTourCard(tour) {
  const stars = '★'.repeat(Math.floor(tour.rating)) + (tour.rating % 1 >= 0.5 ? '☆' : '');
  const includesHtml = tour.includes
    .map(item => `<span class="include-tag">${item}</span>`)
    .join('');

  return `
    <div class="tour-card" data-type="${tour.type}" data-id="${tour.id}" data-price="${tour.price}" data-duration="${parseInt(tour.duration)}">
      <div class="tour-img">
        <img src="${tour.image}" alt="${tour.name}" loading="lazy" onerror="this.src='images/placeholder-tikal.jpg'">
        <span class="tour-type-badge">${tour.type}</span>
      </div>
      <div class="tour-info">
        <h3>${tour.name}</h3>
        <p class="tour-location">📍 ${tour.location}</p>
        <p>${tour.description}</p>
        <div class="tour-meta">
          <span>⏱ ${tour.duration}</span>
          <span>👥 ${tour.groupSize}</span>
          <span>🥾 ${tour.difficulty}</span>
        </div>
        <div class="tour-rating">
          <span class="stars">${stars}</span>
          <span class="rating-value">${tour.rating}</span>
          <span class="reviews">(${tour.reviews} reviews)</span>
        </div>
        <div class="tour-includes">${includesHtml}</div>
        <div class="tour-price">$${tour.price} <span>per person</span></div>
        <div class="tour-actions">
          <button class="btn btn-detail" data-id="${tour.id}" aria-label="View details for ${tour.name}">Details</button>
          <a href="contact.html?tour=${tour.id}" class="btn">Book Now</a>
        </div>
      </div>
    </div>
  `;
}

// ─── Render All Tours ──────────────────────────────────────────────────────
export function renderTours(tours, containerId = 'allTours') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (tours.length === 0) {
    container.innerHTML = `<p class="no-results">No tours found for this filter. Try another category.</p>`;
    return;
  }

  container.innerHTML = tours.map(tour => renderTourCard(tour)).join('');

  // Attach detail button listeners after rendering
  container.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      openTourModal(id);
    });
  });
}

// ─── Filter & Sort ─────────────────────────────────────────────────────────
export function filterAndSort(tours, filter, sortValue) {
  // Filter
  let filtered = filter === 'all'
    ? [...tours]
    : tours.filter(t => t.type === filter);

  // Sort using array method
  filtered.sort((a, b) => {
    switch (sortValue) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'duration-asc': return parseInt(a.duration) - parseInt(b.duration);
      case 'duration-desc': return parseInt(b.duration) - parseInt(a.duration);
      case 'rating-desc': return b.rating - a.rating;
      default: return a.id - b.id;
    }
  });

  return filtered;
}

// ─── Modal Dialog ──────────────────────────────────────────────────────────
let allToursCache = [];

export function setToursCache(tours) {
  allToursCache = tours;
}

export function openTourModal(tourId) {
  const tour = allToursCache.find(t => t.id === tourId);
  if (!tour) return;

  const modal = document.getElementById('tourModal');
  const modalBody = document.getElementById('modalBody');
  if (!modal || !modalBody) return;

  const includesList = tour.includes.map(i => `<li>${i}</li>`).join('');
  const stars = '★'.repeat(Math.floor(tour.rating)) + (tour.rating % 1 >= 0.5 ? '☆' : '');

  modalBody.innerHTML = `
    <div class="modal-tour-img">
      <img src="${tour.image}" alt="${tour.name}" onerror="this.src='images/placeholder-tikal.jpg'">
      <span class="tour-type-badge">${tour.type}</span>
    </div>
    <div class="modal-tour-details">
      <h2>${tour.name}</h2>
      <p class="tour-location">📍 ${tour.location}</p>
      <div class="modal-meta">
        <div class="meta-item"><strong>Duration</strong><span>⏱ ${tour.duration}</span></div>
        <div class="meta-item"><strong>Group Size</strong><span>👥 ${tour.groupSize}</span></div>
        <div class="meta-item"><strong>Difficulty</strong><span>🥾 ${tour.difficulty}</span></div>
        <div class="meta-item"><strong>Rating</strong><span>${stars} ${tour.rating} (${tour.reviews} reviews)</span></div>
      </div>
      <p class="modal-description">${tour.description}</p>
      <h4>What's Included</h4>
      <ul class="modal-includes">${includesList}</ul>
      <div class="modal-price-row">
        <span class="tour-price">$${tour.price} <small>per person</small></span>
        <a href="contact.html?tour=${tour.id}" class="btn">Book This Tour</a>
      </div>
    </div>
  `;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Save last viewed tour to localStorage
  saveToLocalStorage('lastViewedTour', { id: tour.id, name: tour.name, price: tour.price });
}

export function closeTourModal() {
  const modal = document.getElementById('tourModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

export function initModal() {
  // Create modal if it doesn't exist
  if (!document.getElementById('tourModal')) {
    const modal = document.createElement('div');
    modal.id = 'tourModal';
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-label', 'Tour Details');
    modal.innerHTML = `
      <div class="modal-content" role="document">
        <button class="modal-close" aria-label="Close modal" id="modalClose">✕</button>
        <div id="modalBody"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById('modalClose')?.addEventListener('click', closeTourModal);

  document.getElementById('tourModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'tourModal') closeTourModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTourModal();
  });
}

// ─── Filter Buttons Init ───────────────────────────────────────────────────
export function initFilters(tours) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort');

  // Restore user's last filter preference from localStorage
  const savedFilter = getFromLocalStorage('tourFilter', 'all');
  const savedSort = getFromLocalStorage('tourSort', 'price-asc');

  // Apply saved preferences
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === savedFilter);
  });
  if (sortSelect) sortSelect.value = savedSort;

  const update = () => {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const sortValue = sortSelect?.value || 'price-asc';

    saveToLocalStorage('tourFilter', activeFilter);
    saveToLocalStorage('tourSort', sortValue);

    const result = filterAndSort(tours, activeFilter, sortValue);
    renderTours(result, 'allTours');
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      update();
    });
  });

  sortSelect?.addEventListener('change', update);

  // Initial render with saved preferences
  const initial = filterAndSort(tours, savedFilter, savedSort);
  renderTours(initial, 'allTours');
}

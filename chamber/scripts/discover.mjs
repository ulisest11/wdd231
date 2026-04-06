/**
 * discover.mjs
 * Panajachel Chamber of Commerce — Discover Page
 * Handles: nav toggle, visitor message (localStorage), card rendering
 */

import { attractions } from '../data/attractions.mjs';

// ─── Footer ────────────────────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent =
    `Last Modification: ${document.lastModified}`;

// ─── Nav Toggle (mobile) ───────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const mainNav   = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// ─── Visitor Message (localStorage) ───────────────────────────────────────
function handleVisitorMessage() {
    const msgEl      = document.getElementById('visitorMessage');
    const lastVisit  = localStorage.getItem('discoverLastVisit');
    const now        = Date.now();

    let message = '';

    if (!lastVisit) {
        message = 'Welcome! Let us know if you have any questions.';
    } else {
        const diffMs   = now - Number(lastVisit);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
            message = 'Back so soon! Awesome!';
        } else if (diffDays === 1) {
            message = 'You last visited 1 day ago.';
        } else {
            message = `You last visited ${diffDays} days ago.`;
        }
    }

    localStorage.setItem('discoverLastVisit', String(now));
    msgEl.textContent = message;
}

// ─── Build & Inject Cards ──────────────────────────────────────────────────
function buildCards() {
    const grid = document.getElementById('attractionsGrid');
    grid.innerHTML = '';

    attractions.forEach((place, index) => {
        const card = document.createElement('article');
        card.classList.add('attract-card');
        card.style.animationDelay = `${index * 0.08}s`;
        // Named grid area based on position (area1 … area8)
        card.style.gridArea = `area${index + 1}`;

        card.innerHTML = `
            <figure class="attract-figure">
                <img
                    src="${place.image}"
                    alt="${place.name}"
                    loading="${index < 2 ? 'eager' : 'lazy'}"
                    width="300"
                    height="200"
                    onerror="this.src='images/placeholder.jpg'; this.onerror=null;"
                />
            </figure>
            <div class="attract-body">
                <h2 class="attract-title">${place.name}</h2>
                <address class="attract-address">${place.address}</address>
                <p class="attract-desc">${place.description}</p>
                <button class="learn-more-btn" aria-label="Learn more about ${place.name}">Learn More</button>
            </div>`;

        grid.appendChild(card);
    });
}

// ─── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    handleVisitorMessage();
    buildCards();
});

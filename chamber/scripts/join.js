/**
 * join.js
 * Panajachel Chamber of Commerce — Join page
 * Handles: nav toggle, timestamp, modal open/close, footer
 */

// ─── Footer ────────────────────────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const modEl = document.getElementById('last-modified');
if (modEl) modEl.textContent = `Last Modification: ${document.lastModified}`;
document.getElementById('last-modified').textContent =
    `Last Modification: ${document.lastModified}`;

// ─── Nav Toggle (mobile) ───────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

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

// ─── Hidden Timestamp ─────────────────────────────────────────────────────
document.getElementById('timestamp').value = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
});

// ─── Membership Level Modals ──────────────────────────────────────────────
document.querySelectorAll('.learn-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) modal.showModal();
    });
});

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('dialog');
        if (modal) modal.close();
    });
});

// Close modal when clicking the backdrop
document.querySelectorAll('.membership-modal').forEach(modal => {
    modal.addEventListener('click', e => {
        const rect = modal.getBoundingClientRect();
        const clickedOutside = (
            e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top || e.clientY > rect.bottom
        );
        if (clickedOutside) modal.close();
    });
});

// ─── "Select This Level" buttons inside modals ────────────────────────────
document.querySelectorAll('.modal-apply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const level = btn.getAttribute('data-level');
        const modalId = btn.getAttribute('data-modal');
        const select = document.getElementById('membershipLevel');
        const modal = document.getElementById(modalId);
        if (select && level) select.value = level;
        if (modal) modal.close();
    });
});

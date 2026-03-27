/**
 * thankyou.js
 * Panajachel Chamber of Commerce — Thank You page
 * Reads form data from URL query parameters and displays it.
 */

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

// ─── Membership Level Labels ──────────────────────────────────────────────
const LEVEL_LABELS = {
    np:     'NP Membership (Non-Profit · No Fee)',
    bronze: 'Bronze Membership',
    silver: 'Silver Membership',
    gold:   'Gold Membership'
};

// ─── Populate Summary from URL Params ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    const set = (id, key, transform) => {
        const el  = document.getElementById(id);
        if (!el) return;
        const val = params.get(key);
        el.textContent = val ? (transform ? transform(val) : val) : '—';
    };

    set('sum-firstName',       'firstName');
    set('sum-lastName',        'lastName');
    set('sum-email',           'email');
    set('sum-phone',           'phone');
    set('sum-orgName',         'orgName');
    set('sum-membershipLevel', 'membershipLevel', v => LEVEL_LABELS[v] || v);
    set('sum-timestamp',       'timestamp');
});

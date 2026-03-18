/**
 * directory.js
 * Panajachel Chamber of Commerce — Directory Page
 * Handles: data fetch, card rendering, grid/list toggle, nav, footer
 */

// ─── DOM References ────────────────────────────────────────────────────────
const membersContainer = document.getElementById('membersContainer');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

// ─── Footer: Year & Last Modified ─────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent =
    `Last Modification: ${document.lastModified}`;

// ─── Navigation Toggle (mobile) ────────────────────────────────────────────
navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close nav when a link is clicked (mobile UX)
mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// ─── Membership Level Helpers ──────────────────────────────────────────────
function getMembershipLabel(level) {
    if (level === 3) return { label: 'Gold', cls: 'badge-gold' };
    if (level === 2) return { label: 'Silver', cls: 'badge-silver' };
    return { label: 'Member', cls: 'badge-member' };
}

// ─── Build Grid Card ───────────────────────────────────────────────────────
function buildCard(member, index) {
    const { label, cls } = getMembershipLabel(member.membershipLevel);
    const card = document.createElement('article');
    card.classList.add('member-card');
    card.style.animationDelay = `${index * 0.07}s`;

    // Placeholder if image not found
    const imgSrc = `images/${member.image}`;

    card.innerHTML = `
    <div class="card-img-wrap">
      <img
        src="${imgSrc}"
        alt="${member.name}"
        loading="lazy"
        onerror="this.src='images/placeholder.jpg'; this.onerror=null;"
      />
    </div>
    <div class="card-body">
      <h2 class="card-name">${member.name}</h2>
      <p class="card-tagline">${member.tagline}</p>
      <div class="card-info">
        <span>&#128231; <a href="mailto:${member.email}">${member.email}</a></span>
        <span>&#128222; ${member.phone}</span>
        <span>&#128205; ${member.address}</span>
      </div>
      <div class="card-footer">
        <span class="badge ${cls}">${label}</span>
        <a
          class="card-website-link"
          href="${member.website}"
          target="_blank"
          rel="noopener"
        aria-label="Visit ${member.name} website"
        >Visit site →</a>
      </div>
    </div>
  `;

    return card;
}

// ─── Build List Item ───────────────────────────────────────────────────────
function buildListItem(member, index) {
    const { label, cls } = getMembershipLabel(member.membershipLevel);
    const li = document.createElement('div');
    li.classList.add('member-list-item');
    li.style.animationDelay = `${index * 0.04}s`;
    li.setAttribute('role', 'listitem');

    li.innerHTML = `
    <span class="badge ${cls}" aria-label="Nivel ${label}">${label}</span>
    <span class="list-item-name">${member.name}</span>
    <span class="list-item-address">${member.address}</span>
    <span class="list-item-phone">${member.phone}</span>
  `;

    return li;
}

// ─── Render Members ────────────────────────────────────────────────────────
let membersData = [];
let currentView = 'grid';

function renderMembers(view) {
    currentView = view;
    membersContainer.innerHTML = '';

    // ARIA role for list mode
    if (view === 'list') {
        membersContainer.setAttribute('role', 'list');
    } else {
        membersContainer.removeAttribute('role');
    }

    membersData.forEach((member, index) => {
        const el = view === 'grid'
            ? buildCard(member, index)
            : buildListItem(member, index);
        membersContainer.appendChild(el);
    });
}

// ─── Fetch Members from JSON ───────────────────────────────────────────────
async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        membersData = await response.json();
        renderMembers(currentView);
    } catch (error) {
        membersContainer.innerHTML = `
      <p class="loading-message" role="alert">
        ⚠️ Could not load the directory. Please reload the page.<br>
        <small>${error.message}</small>
      </p>`;
        console.error('Error loading members:', error);
    }
}

// ─── Toggle Handlers ───────────────────────────────────────────────────────
gridBtn.addEventListener('click', () => {
    if (currentView === 'grid') return;
    membersContainer.classList.replace('list-view', 'grid-view');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
    gridBtn.setAttribute('aria-pressed', 'true');
    listBtn.setAttribute('aria-pressed', 'false');
    renderMembers('grid');
});

listBtn.addEventListener('click', () => {
    if (currentView === 'list') return;
    membersContainer.classList.replace('grid-view', 'list-view');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
    listBtn.setAttribute('aria-pressed', 'true');
    gridBtn.setAttribute('aria-pressed', 'false');
    renderMembers('list');
});

// ─── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadMembers);
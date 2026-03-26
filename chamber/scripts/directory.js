/**
 * directory.js
 * Panajachel Chamber of Commerce
 * Handles: nav, weather API, wind chill, forecast, featured businesses, members grid/list, footer
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

// ─── Wind Chill ────────────────────────────────────────────────────────────
function calculateWindChill(temp, wind) {
    return (13.12 + 0.6215 * temp - 11.37 * Math.pow(wind, 0.16) + 0.3965 * temp * Math.pow(wind, 0.16)).toFixed(1);
}

function updateWindChill(temp, wind) {
    const el = document.getElementById('windChill');
    if (temp <= 10 && wind > 4.8) {
        el.textContent = `${calculateWindChill(temp, wind)} °C`;
    } else {
        el.textContent = 'N/A';
    }
}

// ─── Weather API (Open-Meteo — no key needed) ──────────────────────────────
// Panajachel, Sololá: 14.7460°N, 91.1548°W
const WMO = {
    0:'Clear Sky', 1:'Mainly Clear', 2:'Partly Cloudy', 3:'Overcast',
    45:'Foggy', 48:'Icy Fog', 51:'Light Drizzle', 53:'Drizzle', 55:'Heavy Drizzle',
    61:'Light Rain', 63:'Rain', 65:'Heavy Rain', 71:'Light Snow', 73:'Snow',
    75:'Heavy Snow', 80:'Showers', 81:'Rain Showers', 82:'Violent Showers',
    95:'Thunderstorm', 96:'Thunderstorm w/ Hail', 99:'Severe Thunderstorm'
};

async function loadWeather() {
    const url = 'https://api.open-meteo.com/v1/forecast' +
        '?latitude=14.7460&longitude=-91.1548' +
        '&current=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m' +
        '&daily=weathercode,temperature_2m_max,temperature_2m_min' +
        '&timezone=America%2FGuatemala&forecast_days=4';
    try {
        const res  = await fetch(url);
        if (!res.ok) throw new Error(`Weather API: ${res.status}`);
        const data = await res.json();

        const temp = Math.round(data.current.temperature_2m);
        const wind = Math.round(data.current.windspeed_10m);

        document.getElementById('temperature').textContent = temp;
        document.getElementById('windSpeed').textContent   = wind;
        document.getElementById('humidity').textContent    = data.current.relative_humidity_2m;
        document.getElementById('conditions').textContent  = WMO[data.current.weathercode] ?? 'Unknown';
        updateWindChill(temp, wind);

        // Forecast — next 3 days
        const list = document.getElementById('forecastList');
        list.innerHTML = '';
        for (let i = 1; i <= 3; i++) {
            const day  = new Date(data.daily.time[i] + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });
            const max  = Math.round(data.daily.temperature_2m_max[i]);
            const min  = Math.round(data.daily.temperature_2m_min[i]);
            const desc = WMO[data.daily.weathercode[i]] ?? '';
            const li   = document.createElement('li');
            li.innerHTML = `<span class="forecast-day">${day}</span><span>${desc}</span><span class="forecast-temp">${max}°/${min}°C</span>`;
            list.appendChild(li);
        }
    } catch (err) {
        console.error('Weather failed:', err);
        document.getElementById('conditions').textContent = 'Unavailable';
        document.getElementById('forecastList').innerHTML = '<li>Forecast unavailable</li>';
    }
}

// ─── Membership Badge ──────────────────────────────────────────────────────
function getMembershipLabel(level) {
    if (level === 3) return { label: 'Gold',   cls: 'badge-gold'   };
    if (level === 2) return { label: 'Silver', cls: 'badge-silver' };
    return                  { label: 'Member', cls: 'badge-member' };
}

// ─── Featured Businesses (top 3 by membership level) ──────────────────────
async function loadFeaturedBusinesses() {
    try {
        const res = await fetch('data/members.json');
        if (!res.ok) throw new Error('Could not load members');
        const members = await res.json();

        // Filter to Gold (3) and Silver (2) only
        const eligible = members.filter(m => m.membershipLevel >= 2);

        // Randomly shuffle (Fisher-Yates)
        for (let i = eligible.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
        }

        // Take 2 or 3 randomly
        const featured = eligible.slice(0, 3);
        const grid = document.getElementById('featuredBusinesses');
        grid.innerHTML = '';

        featured.forEach(biz => {
            const { label, cls } = getMembershipLabel(biz.membershipLevel);
            const card = document.createElement('article');
            card.classList.add('biz-card');
            card.innerHTML = `
                <div class="biz-card-header">
                    <h3 class="biz-card-name">${biz.name}</h3>
                    <p class="biz-card-tagline">${biz.tagline}</p>
                </div>
                <div class="biz-card-body">
                    <img src="images/${biz.image}" alt="${biz.name}" class="biz-card-img" loading="lazy"
                        onerror="this.src='images/placeholder.jpg'; this.onerror=null;" />
                    <div class="biz-card-details">
                        <span><strong>ADDRESS:</strong> ${biz.address}</span>
                        <span><strong>PHONE:</strong> ${biz.phone}</span>
                        <span><strong>URL:</strong> <a href="${biz.website}" target="_blank" rel="noopener">${biz.website.replace('https://', '')}</a></span>
                        <span class="badge ${cls}" style="margin-top:0.25rem">${label} Member</span>
                    </div>
                </div>`;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error('Featured businesses failed:', err);
    }
}

// ─── Member Cards ──────────────────────────────────────────────────────────
const membersContainer = document.getElementById('membersContainer');
const gridBtn          = document.getElementById('gridBtn');
const listBtn          = document.getElementById('listBtn');
let membersData = [];
let currentView = 'grid';

function buildCard(member, index) {
    const { label, cls } = getMembershipLabel(member.membershipLevel);
    const card = document.createElement('article');
    card.classList.add('member-card');
    card.style.animationDelay = `${index * 0.07}s`;
    card.innerHTML = `
        <div class="card-img-wrap">
            <img src="images/${member.image}" alt="${member.name}" loading="lazy"
                onerror="this.src='images/placeholder.jpg'; this.onerror=null;" />
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
                <a class="card-website-link" href="${member.website}" target="_blank" rel="noopener"
                    aria-label="Visit ${member.name} website">Visit site →</a>
            </div>
        </div>`;
    return card;
}

function buildListItem(member, index) {
    const { label, cls } = getMembershipLabel(member.membershipLevel);
    const li = document.createElement('div');
    li.classList.add('member-list-item');
    li.style.animationDelay = `${index * 0.04}s`;
    li.setAttribute('role', 'listitem');
    li.innerHTML = `
        <span class="badge ${cls}">${label}</span>
        <span class="list-item-name">${member.name}</span>
        <span class="list-item-address">${member.address}</span>
        <span class="list-item-phone">${member.phone}</span>`;
    return li;
}

function renderMembers(view) {
    currentView = view;
    membersContainer.innerHTML = '';
    if (view === 'list') membersContainer.setAttribute('role', 'list');
    else membersContainer.removeAttribute('role');
    membersData.forEach((member, index) => {
        membersContainer.appendChild(view === 'grid' ? buildCard(member, index) : buildListItem(member, index));
    });
}

async function loadMembers() {
    try {
        const res = await fetch('data/members.json');
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        membersData = await res.json();
        renderMembers(currentView);
    } catch (error) {
        membersContainer.innerHTML = `<p class="loading-message" role="alert">⚠️ Could not load the directory. Please reload.<br><small>${error.message}</small></p>`;
    }
}

gridBtn.addEventListener('click', () => {
    if (currentView === 'grid') return;
    membersContainer.classList.replace('list-view', 'grid-view');
    gridBtn.classList.add('active'); listBtn.classList.remove('active');
    gridBtn.setAttribute('aria-pressed', 'true'); listBtn.setAttribute('aria-pressed', 'false');
    renderMembers('grid');
});

listBtn.addEventListener('click', () => {
    if (currentView === 'list') return;
    membersContainer.classList.replace('grid-view', 'list-view');
    listBtn.classList.add('active'); gridBtn.classList.remove('active');
    listBtn.setAttribute('aria-pressed', 'true'); gridBtn.setAttribute('aria-pressed', 'false');
    renderMembers('list');
});

// ─── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadWeather();
    loadFeaturedBusinesses();
    loadMembers();
});

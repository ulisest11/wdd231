/**
 * home.js
 * Panajachel Chamber of Commerce — Home Page
 * Handles: nav toggle, weather API, wind chill, forecast, featured businesses, footer
 */

// ─── Footer: Year & Last Modified ─────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent =
    `Last Modification: ${document.lastModified}`;

// ─── Navigation Toggle (mobile) ────────────────────────────────────────────
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

// ─── Wind Chill Calculation ────────────────────────────────────────────────
// Formula valid when temp <= 10°C and wind > 4.8 km/h
function calculateWindChill(temperature, windSpeed) {
    return (
        13.12 +
        0.6215 * temperature -
        11.37 * Math.pow(windSpeed, 0.16) +
        0.3965 * temperature * Math.pow(windSpeed, 0.16)
    ).toFixed(1);
}

function updateWindChill(temperature, windSpeed) {
    const el = document.getElementById('windChill');
    if (temperature <= 10 && windSpeed > 4.8) {
        el.textContent = `${calculateWindChill(temperature, windSpeed)} °C`;
    } else {
        el.textContent = 'N/A';
    }
}

// ─── Weather: Open-Meteo API (no key required) ────────────────────────────
// Panajachel, Sololá coordinates: 14.7460° N, 91.1548° W
const LAT = 14.7460;
const LON = -91.1548;

const WMO_DESCRIPTIONS = {
    0: 'Clear Sky',
    1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Icy Fog',
    51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
    80: 'Showers', 81: 'Rain Showers', 82: 'Violent Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm w/ Hail', 99: 'Severe Thunderstorm'
};

async function loadWeather() {
    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${LAT}&longitude=${LON}` +
        `&current=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m` +
        `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
        `&timezone=America%2FGuatemala` +
        `&forecast_days=4`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Weather API: ${res.status}`);
        const data = await res.json();

        // ── Current conditions ──
        const current = data.current;
        const temp = Math.round(current.temperature_2m);
        const wind = Math.round(current.windspeed_10m);
        const code = current.weathercode;
        const hum = current.relative_humidity_2m;

        document.getElementById('temperature').textContent = temp;
        document.getElementById('windSpeed').textContent = wind;
        document.getElementById('humidity').textContent = hum;
        document.getElementById('conditions').textContent =
            WMO_DESCRIPTIONS[code] ?? 'Unknown';

        updateWindChill(temp, wind);

        // ── 3-day forecast (skip today = index 0) ──
        const daily = data.daily;
        const list = document.getElementById('forecastList');
        list.innerHTML = '';

        // Show next 3 days
        for (let i = 1; i <= 3; i++) {
            const dateStr = daily.time[i];                  // "2026-03-18"
            const date = new Date(dateStr + 'T12:00:00');
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const max = Math.round(daily.temperature_2m_max[i]);
            const min = Math.round(daily.temperature_2m_min[i]);
            const desc = WMO_DESCRIPTIONS[daily.weathercode[i]] ?? '';

            const li = document.createElement('li');
            li.innerHTML = `
        <span class="forecast-day">${dayName}</span>
        <span class="forecast-desc">${desc}</span>
        <span class="forecast-temp">${max}° / ${min}°C</span>
      `;
            list.appendChild(li);
        }

    } catch (err) {
        console.error('Weather failed:', err);
        document.getElementById('conditions').textContent = 'Unavailable';
        document.getElementById('forecastList').innerHTML =
            '<li>Forecast unavailable</li>';
    }
}

// ─── Featured Businesses (from members.json — show first 3 gold/silver) ───
async function loadFeaturedBusinesses() {
    try {
        const res = await fetch('data/members.json');
        if (!res.ok) throw new Error('Could not load members');
        const members = await res.json();

        // Prioritize gold (3) then silver (2) members
        const featured = members
            .sort((a, b) => b.membershipLevel - a.membershipLevel)
            .slice(0, 3);

        const grid = document.getElementById('featuredBusinesses');
        grid.innerHTML = '';

        featured.forEach((biz, index) => {
            const card = document.createElement('article');
            card.classList.add('biz-card');
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
        <div class="biz-card-header">
          <h3 class="biz-card-name">${biz.name}</h3>
          <p class="biz-card-tagline">${biz.tagline}</p>
        </div>
        <div class="biz-card-body">
          <img
            src="images/${biz.image}"
            alt="${biz.name}"
            class="biz-card-img"
            loading="lazy"
            onerror="this.src='images/placeholder.jpg'; this.onerror=null;"
          />
          <div class="biz-card-details">
            <span><strong>EMAIL:</strong> <a href="mailto:${biz.email}">${biz.email}</a></span>
            <span><strong>PHONE:</strong> ${biz.phone}</span>
            <span><strong>URL:</strong> <a href="${biz.website}" target="_blank" rel="noopener">${biz.website.replace('https://', '')}</a></span>
          </div>
        </div>
      `;

            grid.appendChild(card);
        });

    } catch (err) {
        console.error('Featured businesses failed:', err);
    }
}

// ─── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadWeather();
    loadFeaturedBusinesses();
});
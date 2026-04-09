// testimonials.js - Testimonials ES Module

const testimonials = [
  {
    id: 1,
    text: "The Tikal tour was absolutely breathtaking. Our guide was incredibly knowledgeable and made the history come alive. The sunrise view from Temple IV is something I'll never forget.",
    author: "Sarah Johnson",
    location: "New York, USA",
    tour: "Tikal Explorer",
    rating: 5
  },
  {
    id: 2,
    text: "Maya Tours organized the perfect custom itinerary for our family. The kids loved the volcano hike, and we all enjoyed learning about Maya culture. Highly recommend!",
    author: "The Rodriguez Family",
    location: "Miami, USA",
    tour: "Pacaya Volcano Hike",
    rating: 5
  },
  {
    id: 3,
    text: "As a solo female traveler, I felt completely safe and well taken care of. The attention to detail and local insights made it truly special. Already planning my next trip!",
    author: "Emma Chen",
    location: "Vancouver, Canada",
    tour: "Lake Atitlán Villages",
    rating: 5
  },
  {
    id: 4,
    text: "Semuc Champey was a dream come true. The guide was exceptional and the pools were even more beautiful in person. Worth every penny!",
    author: "Marco Rossi",
    location: "Rome, Italy",
    tour: "Semuc Champey Adventure",
    rating: 5
  }
];

export function loadTestimonials() {
  const container = document.querySelector('.testimonials-slider');
  if (!container) return;

  // Use map and template literals (required JS features)
  container.innerHTML = testimonials
    .map((t, i) => `
      <div class="testimonial ${i === 0 ? 'active' : ''}" role="article" aria-label="Testimonial by ${t.author}">
        <div class="testimonial-stars">${'★'.repeat(t.rating)}</div>
        <p class="testimonial-text">${t.text}</p>
        <div class="testimonial-tour">Tour: <em>${t.tour}</em></div>
        <p class="testimonial-author">${t.author}</p>
        <p class="testimonial-location">${t.location}</p>
      </div>
    `)
    .join('');

  initSlider();
}

function initSlider() {
  const items = document.querySelectorAll('.testimonial');
  if (items.length <= 1) return;

  let current = 0;

  // Create navigation dots
  const slider = document.querySelector('.testimonials-slider');
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'slider-dots';
  dotsContainer.setAttribute('role', 'tablist');
  dotsContainer.setAttribute('aria-label', 'Testimonial navigation');

  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  slider.after(dotsContainer);

  function goTo(index) {
    items[current].classList.remove('active');
    dotsContainer.querySelectorAll('.dot')[current].classList.remove('active');
    dotsContainer.querySelectorAll('.dot')[current].setAttribute('aria-selected', 'false');

    current = index;

    items[current].classList.add('active');
    dotsContainer.querySelectorAll('.dot')[current].classList.add('active');
    dotsContainer.querySelectorAll('.dot')[current].setAttribute('aria-selected', 'true');
  }

  setInterval(() => {
    goTo((current + 1) % items.length);
  }, 5000);
}

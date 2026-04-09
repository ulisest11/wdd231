
document.addEventListener('DOMContentLoaded', function () {
    
    setCurrentYear();
    initMobileMenu();
    initLazyLoading();

    
  

    if (document.querySelector('.all-tours')) {
        
        initTourFilters();
    }

    if (document.querySelector('.testimonials-slider')) {
        loadTestimonials();
    }

    if (document.getElementById('contactForm')) {
        initContactForm();
    }
});


function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}


function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            this.setAttribute('aria-expanded', this.classList.contains('active'));
        });
    }
}


function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');

    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src || lazyImage.src;
                    lazyImage.classList.add('loaded');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        
        lazyImages.forEach(function (lazyImage) {
            lazyImage.src = lazyImage.dataset.src || lazyImage.src;
            lazyImage.classList.add('loaded');
        });
    }
}






function initTourFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort');

   
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            filterAndSortTours();
        });
    });

    
    if (sortSelect) {
        sortSelect.addEventListener('change', filterAndSortTours);
    }
}


function filterAndSortTours() {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const sortValue = document.getElementById('sort').value;
    const tourCards = Array.from(document.querySelectorAll('.tour-card'));

    
    tourCards.forEach(card => {
        if (activeFilter === 'all' || card.dataset.type === activeFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    
    if (sortValue) {
        const container = document.querySelector('.tours-grid');
        const visibleCards = tourCards.filter(card =>
            activeFilter === 'all' || card.dataset.type === activeFilter
        );

        const sortedCards = [...visibleCards].sort((a, b) => {
            
            if (sortValue.includes('price')) {
                const priceA = parseInt(a.querySelector('.tour-price').textContent.replace('$', ''));
                const priceB = parseInt(b.querySelector('.tour-price').textContent.replace('$', ''));
                return sortValue === 'price-asc' ? priceA - priceB : priceB - priceA;
            }
            
            else if (sortValue.includes('duration')) {
                const durationA = parseInt(a.querySelector('.tour-meta span:first-child').textContent);
                const durationB = parseInt(b.querySelector('.tour-meta span:first-child').textContent);
                return sortValue === 'duration-asc' ? durationA - durationB : durationB - durationA;
            }
            return 0;
        });

        
        sortedCards.forEach(card => container.appendChild(card));
    }
}


function loadTestimonials() {
    const testimonials = [
        {
            id: 1,
            text: 'The Tikal tour was absolutely breathtaking. Our guide was incredibly knowledgeable and made the history come alive. The sunrise view from Temple IV is something I\'ll never forget.',
            author: 'Sarah Johnson',
            location: 'New York, USA'
        },
        {
            id: 2,
            text: 'Maya Tours organized the perfect custom itinerary for our family. The kids loved the volcano hike, and we all enjoyed learning about Maya culture. Highly recommend!',
            author: 'The Rodriguez Family',
            location: 'Miami, USA'
        },
        {
            id: 3,
            text: 'As a solo female traveler, I felt completely safe and well taken care of on my Guatemala trip with Maya Tours. The attention to detail and local insights made it truly special.',
            author: 'Emma Chen',
            location: 'Vancouver, Canada'
        }
    ];

    const testimonialsContainer = document.querySelector('.testimonials-slider');

    if (testimonialsContainer) {
        testimonialsContainer.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial">
                <p class="testimonial-text">${testimonial.text}</p>
                <p class="testimonial-author">${testimonial.author}</p>
                <p class="testimonial-location">${testimonial.location}</p>
            </div>
        `).join('');

        initTestimonialSlider();
    }
}


function initTestimonialSlider() {
    
    const testimonials = document.querySelectorAll('.testimonial');
    let currentIndex = 0;

    if (testimonials.length > 1) {
        
        testimonials[0].classList.add('active');

        
        setInterval(() => {
            testimonials[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % testimonials.length;
            testimonials[currentIndex].classList.add('active');
        }, 5000);
    }
}


function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        
        const urlParams = new URLSearchParams(window.location.search);
        const tourId = urlParams.get('tour');

        if (tourId) {
            const subjectSelect = document.getElementById('subject');
            if (subjectSelect) {
                subjectSelect.value = 'tour-inquiry';
            }

            const messageTextarea = document.getElementById('message');
            if (messageTextarea) {
                messageTextarea.value = `I'm interested in tour ID ${tourId}. Please send me more information.`;
            }
        }

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            
            const formData = {
                name: this.name.value,
                email: this.email.value,
                phone: this.phone.value,
                subject: this.subject.value,
                message: this.message.value,
                newsletter: this.newsletter.checked
            };

            
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                alert('Please fill in all required fields.');
                return;
            }

            
            saveFormData(formData);

            
            alert('Thank you for your message! We will get back to you soon.');

            
            this.reset();
        });
    }
}


function saveFormData(formData) {
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
    submissions.push({
        ...formData,
        date: new Date().toISOString()
    });
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
}


const currentYear = new Date().getFullYear();


const copyrightPara = document.querySelector("footer p");


if (copyrightPara) {
    copyrightPara.innerHTML = `©${currentYear} 🌵 Ulises Antonio Tzaj 🌵 Guatemala`;
}

const lastModified = document.lastModified;


const lastUpdatedSpan = document.getElementById("last-updated");

if (lastUpdatedSpan) {
    lastUpdatedSpan.textContent = lastModified;
}

// =============================================
// Responsive Navigation (Hamburger)
// =============================================
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});

// =============================================
// Footer: Current Year (dynamic)
// =============================================
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

// =============================================
// Course List Array
// =============================================
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming.',
        technology: ['Python'],
        completed: true   // ✓ sin color (gris)
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web.',
        technology: ['HTML', 'CSS'],
        completed: true   // ✓ sin color (gris)
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will teach students to write programs with functions.',
        technology: ['Python'],
        completed: false  // con color (azul oscuro)
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the principles of Object Oriented Programming.',
        technology: ['C#'],
        completed: false  // con color (azul oscuro)
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true   // ✓ sin color (gris)
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false  // con color (azul oscuro)
    }
];

// =============================================
// Render Courses
// =============================================
const coursesGrid = document.getElementById('courses-grid');
const totalCreditsEl = document.getElementById('total-credits');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderCourses(filter = 'all') {
    let filtered;

    if (filter === 'all') {
        filtered = courses;
    } else {
        filtered = courses.filter(course => course.subject === filter);
    }

    // Clear grid
    coursesGrid.innerHTML = '';

    // Build cards
    filtered.forEach(course => {
        const card = document.createElement('div');
        card.classList.add('course-card', course.completed ? 'completed' : 'incomplete');

        // Show checkmark for completed, label for incomplete
        const label = course.completed
            ? `✓ ${course.subject} ${course.number}`
            : `${course.subject} ${course.number}`;

        card.textContent = label;
        card.title = `${course.title} — ${course.credits} credits`;
        coursesGrid.appendChild(card);
    });

    // Update total credits using reduce
    const total = filtered.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsEl.textContent = total;
}

// Initial render
renderCourses('all');

// Filter button listeners
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        renderCourses(btn.dataset.filter);
    });
});
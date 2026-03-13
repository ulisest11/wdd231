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
// Footer: Current Year
// =============================================
const yearSpan = document.getElementById('currentyear');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// =============================================
// Footer: Last Modified
// =============================================
const lastModifiedEl = document.getElementById('lastModified');
if (lastModifiedEl) {
    lastModifiedEl.textContent = `Last Modification: ${document.lastModified}`;
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
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in Web design and development. The course is hands on with students actually participating in simple web creation.',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will teach students to write programs with functions. Students will also learn testing, error handling, and other good practices.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the principles of Object Oriented Programming. Students will learn to write programs with classes, including encapsulation, inheritance, and polymorphism.',
        technology: ['C#'],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites which are automatically updated based on existing content and user input.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
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
        card.textContent = `${course.subject} ${course.number}`;
        card.title = `${course.title} — ${course.credits} credits${course.completed ? ' ✓ Completed' : ''}`;
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
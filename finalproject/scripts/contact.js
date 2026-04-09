// contact.js - Contact Form ES Module

import { saveToLocalStorage } from './utils.js';

export function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Pre-fill from URL params
  const params = new URLSearchParams(window.location.search);
  const tourId = params.get('tour');

  if (tourId) {
    const subjectSelect = document.getElementById('subject');
    const messageArea = document.getElementById('message');
    if (subjectSelect) subjectSelect.value = 'tour-inquiry';
    if (messageArea) {
      messageArea.value = `I'm interested in booking tour #${tourId}. Please send me more information about availability and pricing.`;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      subject: form.subject.value,
      message: form.message.value.trim(),
      newsletter: form.newsletter.checked,
      date: new Date().toISOString()
    };

    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showFormError('Please fill in all required fields.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showFormError('Please enter a valid email address.');
      return;
    }

    // Save to localStorage
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push(formData);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

    // Save last submission summary
    saveToLocalStorage('lastSubmission', {
      name: formData.name,
      subject: formData.subject,
      date: formData.date
    });

    // Redirect to form action page with URL params
    const searchParams = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject,
      message: formData.message,
      newsletter: formData.newsletter ? 'Yes' : 'No'
    });

    window.location.href = `form-action.html?${searchParams.toString()}`;
  });
}

function showFormError(message) {
  let errorDiv = document.getElementById('formError');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'formError';
    errorDiv.className = 'form-error';
    errorDiv.setAttribute('role', 'alert');
    const form = document.getElementById('contactForm');
    form.prepend(errorDiv);
  }
  errorDiv.textContent = message;
  errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

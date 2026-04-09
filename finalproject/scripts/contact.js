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

  // Clear error on a field when user starts typing/selecting
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => clearFieldError(field));
    field.addEventListener('change', () => clearFieldError(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear all previous errors
    clearAllErrors();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();

    let hasError = false;

    if (!name) {
      setFieldError('name', 'Full name is required.');
      hasError = true;
    }

    if (!email) {
      setFieldError('email', 'Email is required.');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('email', 'Please enter a valid email address.');
      hasError = true;
    }

    if (!subject) {
      setFieldError('subject', 'Please select a subject.');
      hasError = true;
    }

    if (!message) {
      setFieldError('message', 'Message is required.');
      hasError = true;
    }

    if (hasError) {
      const firstError = form.querySelector('.field-error-msg');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // All valid — save and redirect
    const formData = {
      name,
      email,
      phone: form.phone.value.trim(),
      subject,
      message,
      newsletter: form.newsletter.checked,
      date: new Date().toISOString()
    };

    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push(formData);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

    saveToLocalStorage('lastSubmission', {
      name: formData.name,
      subject: formData.subject,
      date: formData.date
    });

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

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.add('field-invalid');
  let msg = field.parentElement.querySelector('.field-error-msg');
  if (!msg) {
    msg = document.createElement('span');
    msg.className = 'field-error-msg';
    msg.setAttribute('role', 'alert');
    field.after(msg);
  }
  msg.textContent = message;
}

function clearFieldError(field) {
  field.classList.remove('field-invalid');
  const msg = field.parentElement.querySelector('.field-error-msg');
  if (msg) msg.remove();
}

function clearAllErrors() {
  document.querySelectorAll('.field-invalid').forEach(f => f.classList.remove('field-invalid'));
  document.querySelectorAll('.field-error-msg').forEach(m => m.remove());
}
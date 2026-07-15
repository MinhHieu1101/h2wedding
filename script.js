const targetDate = new Date('August 8, 2026 17:00:00').getTime();

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownEl = document.getElementById('countdown');
const messageEl = document.getElementById('message');

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// RSVP Form Handling
const guestNameEl = document.getElementById('guest-name');
const nameInput = document.getElementById('name');
const rsvpForm = document.getElementById('rsvp-form');
const rsvpSuccess = document.getElementById('rsvp-success');

// Parse URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const invitee = urlParams.get('invitee');

if (invitee) {
  const decodedInvitee = decodeURIComponent(invitee);
  guestNameEl.textContent = `Dear ${decodedInvitee},`;
  if (nameInput) {
    nameInput.value = decodedInvitee;
  }
} else {
  guestNameEl.textContent = `Dear Guest,`;
}

if (rsvpForm) {
  rsvpForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(rsvpForm);
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeCk4lR2Fy637NlvSrdeRAyCBxMwUSZ-0hzbaEzt9-eXMim8w/formResponse';

    fetch(googleFormUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    }).then(() => {
      rsvpForm.classList.add('hidden');
      rsvpSuccess.classList.remove('hidden');
    }).catch(error => {
      console.error('Error submitting form', error);
      alert('We\'re truly sorry — Something went wrong while sending your RSVP. Please try again, and thank you for your patience.');
      rsvpForm.classList.add('hidden');
      rsvpSuccess.classList.remove('hidden');
    });
  });
}

// --- Gallery Carousel ---
const photoFiles = [
  "2aOboQiyd8Ak7A59gHAotOTspQlPn1RFuDJvlrTk.jpg",
  "2aOboQiydEP5zq019xvwCSGJUic1V6BAWHhbNCxE.jpg",
  "2aOboQiydF5aVfkZHqWpPUkNbUuSzVp1TYA1zGBk.jpg",
  "2aOboQiydFIqjO0hQ1xOjQ8vz23CN4kXqYtdg6wS.jpg",
  "2aOboQiydFJawzttyyZ1lpECxtlUdCqIHS2ZBvKi.jpg",
  "2aOboQiydFLTiR668wWCI0ALVsDo3joFR3AJEWmW.jpg",
  "2aOboQiydFQZxFVNZw921otT9Ualns90iyBTdDu4.jpg",
  "2aOboQkJKK8XHDaIfkuPD7VzSrfupd2f42PBaukC.jpg",
  "2aOboQkJKTnyeDJyqAd24lwlPxw1yxluYxB2hdY0.jpg",
  "2aOboQkJLVEAWqI0URoWPEEoL65Cbq5Ax7YrZUga.jpg",
  "2aOboQkJLVtYvffwWVw3ypumCeZkvty3FFB4EPaq.jpg",
  "2aOboQkJLVuLa6VWafPsra6gsiadZXp0IVjZVA24.jpg"
];

const galleryTrack = document.getElementById('gallery-track');
const galleryRow = document.getElementById('gallery-row');
const prevBtn = document.querySelector('.gallery__nav--prev');
const nextBtn = document.querySelector('.gallery__nav--next');

if (galleryTrack) {
  // Populate images
  photoFiles.forEach(file => {
    const tile = document.createElement('div');
    tile.className = 'gallery__tile';
    tile.innerHTML = `
      <div class="gallery__media">
        <img class="gallery__img" src="assets/photos/${file}" alt="Our Moment" loading="lazy" />
      </div>
    `;
    galleryTrack.appendChild(tile);
  });

  // Navigation arrows
  const scrollAmount = 350; // Scroll amount for arrows
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      galleryRow.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      galleryRow.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // Drag to scroll logic for desktop
  let isDown = false;
  let startX;
  let scrollLeft;

  galleryRow.addEventListener('mousedown', (e) => {
    isDown = true;
    galleryRow.classList.add('is-dragging');
    startX = e.pageX - galleryRow.offsetLeft;
    scrollLeft = galleryRow.scrollLeft;
  });

  galleryRow.addEventListener('mouseleave', () => {
    isDown = false;
    galleryRow.classList.remove('is-dragging');
  });

  galleryRow.addEventListener('mouseup', () => {
    isDown = false;
    galleryRow.classList.remove('is-dragging');
  });

  galleryRow.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - galleryRow.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    galleryRow.scrollLeft = scrollLeft - walk;
  });
}

// --- Scroll Animations ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

let delay = 0;
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      delay += 100; // Stagger fade-ins
      observer.unobserve(entry.target);
    }
  });
  // Reset delay after a batch completes
  setTimeout(() => {
    delay = 0;
  }, 100);
}, observerOptions);

// Select elements to animate
const animateElements = document.querySelectorAll(
  '.gallery__intro, .gallery__carousel-wrapper, .card > *, .venue, .rsvp-card > *'
);

animateElements.forEach((el) => {
  el.classList.add('fade-up');
  observer.observe(el);
});
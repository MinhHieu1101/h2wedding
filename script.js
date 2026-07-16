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
  '.gallery__intro, .gallery__carousel-wrapper, .vslider, .card > *, .venue, .gifts-wishes, .rsvp-card > *'
);

animateElements.forEach((el) => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// --- Vertical Slider (Mobile) ---
(function initVSlider() {
  const track = document.getElementById('vsliderTrack');
  const dotsWrap = document.getElementById('vsliderDots');
  if (!track || !dotsWrap) return;

  // Build cards from the same photoFiles list used by the horizontal gallery
  photoFiles.forEach((filename, i) => {
    const card = document.createElement('div');
    card.className = 'vslider__card';
    card.dataset.index = i;

    const img = document.createElement('img');
    img.className = 'vslider__img';
    img.src = `assets/photos/${filename}`;
    img.alt = '';
    img.loading = 'lazy';
    img.onerror = () => card.remove();

    card.appendChild(img);
    track.appendChild(card);
  });

  // Build matching dots
  photoFiles.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'vslider__dot' + (i === 0 ? ' is-active' : '');
    dot.dataset.index = i;
    dotsWrap.appendChild(dot);
  });

  const cards = track.querySelectorAll('.vslider__card');
  const dots = dotsWrap.querySelectorAll('.vslider__dot');
  const leftArrow = document.querySelector('.vslider__arrow--left');
  const rightArrow = document.querySelector('.vslider__arrow--right');
  const stage = document.querySelector('.vslider__stage');
  const affordance = document.getElementById('vsliderAffordance');

  let currentIndex = 0;
  let isAnimating = false;
  let affordanceDismissed = false;

  function dismissAffordance() {
    if (affordance && !affordanceDismissed) {
      affordance.classList.remove('is-visible');
      affordanceDismissed = true;
    }
  }

  function isVisible() {
    return track.offsetParent !== null;
  }

  function update(newIndex) {
    if (isAnimating || cards.length === 0 || !isVisible()) return;
    isAnimating = true;
    dismissAffordance();
    currentIndex = (newIndex + cards.length) % cards.length;

    cards.forEach((card, i) => {
      const offset = (i - currentIndex + cards.length) % cards.length;
      card.classList.remove('is-center', 'is-left-1', 'is-left-2', 'is-right-1', 'is-right-2', 'is-hidden');

      if (offset === 0) card.classList.add('is-center');
      else if (offset === 1) card.classList.add('is-right-1');
      else if (offset === 2) card.classList.add('is-right-2');
      else if (offset === cards.length - 1) card.classList.add('is-left-1');
      else if (offset === cards.length - 2) card.classList.add('is-left-2');
      else card.classList.add('is-hidden');
    });

    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentIndex));

    setTimeout(() => { isAnimating = false; }, 800);
  }

  leftArrow?.addEventListener('click', () => update(currentIndex - 1));
  rightArrow?.addEventListener('click', () => update(currentIndex + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => update(i)));
  cards.forEach((card, i) => card.addEventListener('click', () => update(i)));

  document.addEventListener('keydown', (e) => {
    if (!isVisible()) return; // Don't intercept if hidden
    if (e.key === 'ArrowLeft') update(currentIndex - 1);
    else if (e.key === 'ArrowRight') update(currentIndex + 1);
  });

  // Simple horizontal swipe handling
  let touchStartX = 0;

  stage?.addEventListener('touchstart', (e) => {
    if (!isVisible()) return;
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  stage?.addEventListener('touchend', (e) => {
    if (!isVisible()) return;
    const diff = touchStartX - e.changedTouches[0].screenX;

    // Simple 40px threshold for a swipe
    if (Math.abs(diff) > 40) {
      diff > 0 ? update(currentIndex + 1) : update(currentIndex - 1);
    }
  });

  // Affordance Visibility using IntersectionObserver
  const vsliderObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && affordance && !affordanceDismissed) {
        affordance.classList.add('is-visible');
        vsliderObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  if (stage) vsliderObserver.observe(stage);

  // Initialize without animating
  update(0);
})();

// --- Gifts & Wishes ---
const giftModal = document.getElementById('gift-modal');
const giftModalOverlay = document.querySelector('.gift-modal-overlay');
const giftModalClose = document.querySelector('.gift-modal-close');
const giftModalTitle = document.getElementById('gift-modal-title');
const giftModalQr = document.getElementById('gift-modal-qr');
const giftModalDetails = document.getElementById('gift-modal-details');
const bankName = document.getElementById('bank-name');
const bankAccountName = document.getElementById('bank-account-name');
const bankAccountNumber = document.getElementById('bank-account-number');
const copyToast = document.getElementById('copy-toast');
const giftBtns = document.querySelectorAll('.gift-icon-btn');

const giftData = {
  groom: {
    title: "Groom's Details",
    qr: "assets/images/qr_groom.png",
    bank: "VietinBank CN HAI BA TRUNG - PGD TIMES CITY",
    name: "DOAN MINH HIEU",
    number: "109876338294"
  },
  bride: {
    title: "Bride's Details",
    qr: "assets/images/qr_bride.png",
    bank: "Vietcombank - Trụ sở CN Ba Đình",
    name: "HOANG THUY HA",
    number: "9817079238"
  }
};

if (giftBtns.length > 0 && giftModal) {
  giftBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const person = btn.dataset.person;
      const data = giftData[person];
      if (data) {
        giftModalTitle.textContent = data.title;
        giftModalQr.src = data.qr;
        bankName.textContent = data.bank;
        bankAccountName.textContent = data.name;
        bankAccountNumber.textContent = data.number;
        giftModal.classList.add('is-open');
      }
    });
  });

  const closeModal = () => {
    giftModal.classList.remove('is-open');
  };

  giftModalClose.addEventListener('click', closeModal);
  giftModalOverlay.addEventListener('click', closeModal);

  giftModalDetails.addEventListener('click', () => {
    const textToCopy = bankAccountNumber.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
      copyToast.classList.add('is-visible');
      setTimeout(() => {
        copyToast.classList.remove('is-visible');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });
}
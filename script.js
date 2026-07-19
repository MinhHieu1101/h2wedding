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

  if (distance <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    messageEl.textContent = 'Today is the day! 🎉';
    countdownEl.style.opacity = '0.5';
    clearInterval(countdownInterval);
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');

  // Subtle tick pulse animation
  [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => {
    el.classList.add('tick');
    setTimeout(() => el.classList.remove('tick'), 150);
  });
}

updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);

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
  "2aOboQkJLVuLa6VWafPsra6gsiadZXp0IVjZVA24.jpg",
  "2aOboQl6SH0CyQlV7Aia3Q7rLZAcIPzMQoq9L5Ki.jpg",
  "2aOboQl6SGxr18GkuiH7PCIt7PEirIbkemZx5wjA.jpg",
  "2aOboQl6SGxer1YrOfuABW0XmxFsxQcbMdkmozho.jpg",
  "2812793016948479133.jpg"
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
  '.gallery__intro, .gallery__carousel-wrapper, .mgrid, .card > *, .venue, .gifts-wishes, .rsvp-card > *'
);

animateElements.forEach((el) => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// --- Mobile Waterfall Grid ---
(function initMGrid() {
  const grid = document.getElementById('mgrid');
  if (!grid) return;

  function setSpan(item) {
    const img = item.querySelector('.mgrid__img');
    if (!img) return;
    
    // 1. Get the natural height of the image
    const contentHeight = img.getBoundingClientRect().height;
    
    // 2. Define your gap and chunk size (must match your CSS grid-auto-rows)
    const rowGap = 20; 
    const rowHeight = 30;
    
    // 3. Use Math.round() to snap to the nearest chunk
    const rowSpan = Math.round((contentHeight + rowGap) / rowHeight);
    
    // 4. Apply the span
    item.style.gridRowEnd = `span ${rowSpan}`;
  }

  const mgridObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-inbound', entry.isIntersecting);
    });
  }, { 
    rootMargin: "-25% 0px -25% 0px", 
    threshold: 0 
  });

  photoFiles.forEach((filename) => {
    const item = document.createElement('div');
    item.className = 'mgrid__item';
    item.style.gridRowEnd = 'span 8'; // placeholder until real height is known

    const img = document.createElement('img');
    img.className = 'mgrid__img';
    img.src = `assets/photos/${filename}`;
    img.alt = 'Our Moment';
    img.loading = 'lazy';
    img.onerror = () => item.remove();

    // Set the span once the image's real dimensions are known,
    // then register with the observer — never before, so an item
    // can't get styled .is-inbound while it's still a placeholder.
    img.onload = () => {
      setSpan(item);
      mgridObserver.observe(item);
    };
    if (img.complete) {
      setSpan(item);
      mgridObserver.observe(item);
    }

    item.appendChild(img);
    grid.appendChild(item);
  });

  // Column width changes at different viewport widths, which changes
  // each image's rendered height under width:100% — recompute spans
  // on resize, debounced so it doesn't run on every pixel of a drag.
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      grid.querySelectorAll('.mgrid__item').forEach(setSpan);
    }, 150);
  });
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
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    giftModal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  giftModalClose.addEventListener('click', closeModal);
  giftModalOverlay.addEventListener('click', closeModal);

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && giftModal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Helper to show copy toast
  function showCopyToast() {
    copyToast.classList.add('is-visible');
    setTimeout(() => {
      copyToast.classList.remove('is-visible');
    }, 2000);
  }

  // Fallback copy for non-HTTPS contexts
  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopyToast();
    } catch {
      prompt('Copy this account number:', text);
    }
    document.body.removeChild(textarea);
  }

  giftModalDetails.addEventListener('click', () => {
    const textToCopy = bankAccountNumber.textContent;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showCopyToast();
      }).catch(() => fallbackCopy(textToCopy));
    } else {
      fallbackCopy(textToCopy);
    }
  });
}
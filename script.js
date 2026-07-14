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
  rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(rsvpForm);
    // TODO: Replace with your actual Google Form Action URL
    const googleFormUrl = 'YOUR_GOOGLE_FORM_URL/formResponse';
    
    fetch(googleFormUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    }).then(() => {
      // Hide form and show success message
      rsvpForm.classList.add('hidden');
      rsvpSuccess.classList.remove('hidden');
    }).catch(error => {
      console.error('Error submitting form', error);
      rsvpForm.classList.add('hidden');
      rsvpSuccess.classList.remove('hidden');
    });
  });
}
const loader = document.getElementById('loader');
if (window.lucide) window.lucide.createIcons();
const loaderStatus = document.getElementById('loaderStatus');
const skipLoader = document.getElementById('skipLoader');

const dismissLoader = () => loader.classList.add('done');
skipLoader.addEventListener('click', dismissLoader);
window.setTimeout(() => { loaderStatus.textContent = 'DOOMSDAY PROTOCOL INITIALIZING...'; }, 900);
window.setTimeout(dismissLoader, 3000);

const target = new Date('2026-12-18T00:00:00+05:30').getTime();
const units = { days: document.getElementById('days'), hours: document.getElementById('hours'), minutes: document.getElementById('minutes'), seconds: document.getElementById('seconds') };
const pad = (value, length = 2) => String(value).padStart(length, '0');
function updateCountdown() {
  const remaining = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const values = { days: Math.floor(totalSeconds / 86400), hours: Math.floor(totalSeconds / 3600) % 24, minutes: Math.floor(totalSeconds / 60) % 60, seconds: totalSeconds % 60 };
  Object.keys(units).forEach((key) => {
    const next = key === 'days' ? String(values[key]) : pad(values[key]);
    if (units[key].textContent !== next) {
      units[key].textContent = next;
      units[key].classList.remove('tick');
      void units[key].offsetWidth;
      units[key].classList.add('tick');
    }
  });
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a, .footer a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

const confirmation = document.getElementById('identityConfirm');
const missionCards = [...document.querySelectorAll('.mission-card[data-role]')];
const defaultConfirmation = confirmation.textContent;
let selectedRole = null;
const selectTrack = (role, track) => {
  const isAlreadySelected = selectedRole === role;
  selectedRole = isAlreadySelected ? null : role;
  missionCards.forEach((card) => {
    const selected = !isAlreadySelected && card.dataset.role === role;
    card.classList.toggle('selected', selected);
    card.setAttribute('aria-pressed', String(selected));
  });
  if (isAlreadySelected) {
    confirmation.textContent = defaultConfirmation;
    confirmation.classList.remove('confirmed');
    return;
  }
  confirmation.textContent = `IDENTITY ACCEPTED // DOOMBREAKER CLASS: ${role} // MISSION: ${track}`;
  confirmation.classList.add('confirmed');
};
missionCards.forEach((card) => {
  const chooseMission = () => selectTrack(card.dataset.role, card.dataset.track);
  card.addEventListener('click', (event) => {
    if (event.target.closest('.brief-button')) return;
    chooseMission();
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      chooseMission();
    }
  });
});
document.querySelectorAll('.brief-button').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const brief = button.nextElementSibling;
    const card = button.closest('.mission-card');
    const wasOpen = brief.classList.contains('open');
    document.querySelectorAll('.challenge-brief.open').forEach((item) => item.classList.remove('open'));
    document.querySelectorAll('.mission-card.brief-open').forEach((item) => item.classList.remove('brief-open'));
    document.querySelectorAll('.brief-button[aria-expanded="true"]').forEach((item) => {
      item.setAttribute('aria-expanded', 'false');
      item.nextElementSibling.setAttribute('aria-hidden', 'true');
    });
    if (!wasOpen) {
      brief.classList.add('open');
      brief.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-expanded', 'true');
      card.classList.add('brief-open');
    }
  });
});

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
  observer.observe(element);
});

const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
window.addEventListener('pointermove', (event) => {
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
  cursorRing.style.left = `${event.clientX}px`;
  cursorRing.style.top = `${event.clientY}px`;
});
document.querySelectorAll('a, button').forEach((element) => {
  element.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  element.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});
document.querySelectorAll('.magnetic').forEach((button) => {
  button.addEventListener('pointermove', (event) => {
    const box = button.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) * .12;
    const y = (event.clientY - box.top - box.height / 2) * .12;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener('pointerleave', () => { button.style.transform = ''; });
});

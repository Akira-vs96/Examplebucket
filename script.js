const checkboxes = [...document.querySelectorAll('[data-step]')];
const progressBar = document.querySelector('#progress-bar');
const progressFill = progressBar.querySelector('span');
const progressLabel = document.querySelector('#progress-label');
const progressPercent = document.querySelector('#progress-percent');
const storageKey = 'cloud-lab-04-checklist';

try {
  const savedSteps = JSON.parse(localStorage.getItem(storageKey) || '{}');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = Boolean(savedSteps[checkbox.dataset.step]);
  });
} catch {}

function updateProgress() {
  const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
  const percentage = Math.round((completed / checkboxes.length) * 100);
  progressFill.style.width = `${percentage}%`;
  progressBar.setAttribute('aria-valuenow', String(completed));
  progressLabel.textContent = `${completed} / ${checkboxes.length} ҚАДАМ ОРЫНДАЛДЫ`;
  progressPercent.textContent = `${percentage}%`;

  checkboxes.forEach((checkbox) => {
    checkbox.closest('.workflow-item').classList.toggle('is-complete', checkbox.checked);
  });

  try {
    localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(
      checkboxes.map((checkbox) => [checkbox.dataset.step, checkbox.checked]),
    )));
  } catch {
    // The checklist remains usable when browser storage is disabled.
  }
}

checkboxes.forEach((checkbox) => checkbox.addEventListener('change', updateProgress));
updateProgress();

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  siteNav.classList.toggle('is-open', !isExpanded);
});

siteNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('is-open');
  }
});

const endpointInput = document.querySelector('#endpoint-input');
const endpointStatus = document.querySelector('#endpoint-status');

function getEndpoint() {
  try {
    const endpoint = new URL(endpointInput.value.trim());
    if (!['http:', 'https:'].includes(endpoint.protocol)) return null;
    return endpoint.href;
  } catch {
    return null;
  }
}

function setEndpointStatus(message, isError = false) {
  endpointStatus.textContent = message;
  endpointStatus.classList.toggle('is-error', isError);
}

document.querySelector('#open-endpoint').addEventListener('click', () => {
  const endpoint = getEndpoint();
  if (!endpoint) {
    setEndpointStatus('Дұрыс HTTP немесе HTTPS Endpoint URL енгіз.', true);
    endpointInput.focus();
    return;
  }

  window.open(endpoint, '_blank', 'noopener,noreferrer');
  setEndpointStatus('Endpoint жаңа қойындыда ашылды.');
});

document.querySelector('#copy-endpoint').addEventListener('click', async () => {
  const endpoint = getEndpoint();
  if (!endpoint) {
    setEndpointStatus('Алдымен дұрыс Endpoint URL енгіз.', true);
    endpointInput.focus();
    return;
  }

  try {
    await navigator.clipboard.writeText(endpoint);
    setEndpointStatus('Endpoint URL көшірілді.');
  } catch {
    endpointInput.select();
    setEndpointStatus('URL таңдалды. Көшіру үшін Ctrl+C пернесін бас.');
  }
});

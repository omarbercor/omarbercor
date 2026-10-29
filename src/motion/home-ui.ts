export function initServicesTabs(): void {
  const serviceButtons = document.querySelectorAll<HTMLButtonElement>('.service-nav-btn');
  const serviceCards = document.querySelectorAll<HTMLElement>('.service-dossier-card');

  serviceButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-service-target');
      if (!targetId) return;

      serviceButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      serviceCards.forEach((card) => {
        card.classList.toggle('is-active', card.id === targetId);
      });
    });
  });
}

export function initExperienceAccordion(): void {
  const expRows = document.querySelectorAll<HTMLElement>('.experience-row');
  const expTriggers = document.querySelectorAll<HTMLButtonElement>('.exp-row-trigger');

  expTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetRow = trigger.closest<HTMLElement>('.experience-row');
      if (!targetRow) return;

      const isCurrentlyOpen = targetRow.classList.contains('is-open');

      expRows.forEach((row) => {
        if (row !== targetRow) {
          row.classList.remove('is-open');
          row.querySelector('.exp-row-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });

      targetRow.classList.toggle('is-open', !isCurrentlyOpen);
      trigger.setAttribute('aria-expanded', String(!isCurrentlyOpen));
    });
  });
}


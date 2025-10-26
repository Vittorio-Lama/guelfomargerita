
// Scaffale Libri – toggle expand al click sulla copertina
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.libri-container');
  if (!container) return;

  // Rendi le copertine “focusabili” e accessibili da tastiera
  const covers = container.querySelectorAll('.scheda-libro > img');
  covers.forEach(img => {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-expanded', 'false');
    img.style.cursor = 'pointer';
  });

  // Event delegation: click sulla copertina => toggle .expanded sulla card
  container.addEventListener('click', (e) => {
    const cover = e.target.closest('.scheda-libro > img');
    if (!cover || !container.contains(cover)) return;

    const card = cover.closest('.scheda-libro');
    const isOpen = card.classList.toggle('expanded');
    cover.setAttribute('aria-expanded', String(isOpen));
  });

  // Supporto tastiera (Enter/Space) sulla copertina
  container.addEventListener('keydown', (e) => {
    const isActivator = e.target.matches('.scheda-libro > img[tabindex]');
    if (!isActivator) return;

    const key = e.key || e.code;
    if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
      e.preventDefault();
      e.target.click();
    }
  });
});
  
  function expandCard(card) {
  // Alterna solo questa card
  card.classList.toggle('expanded');

  // Se si è appena espansa, assicuriamoci che l’utente la veda tutta
  if (card.classList.contains('expanded')) {
    // Piccolo delay per lasciare partire la transition del max-height
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}


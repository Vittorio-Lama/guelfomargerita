/* ===========================
   FAVICONS: inietta in <head>
   =========================== */
(function ensureFavicons() {
  // Metti la cartella "my-favicon" in root accanto a index.html
  const base = './my-favicon/';
  const defs = [
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: base + 'favicon-96x96.png' },
    { rel: 'icon', type: 'image/svg+xml', href: base + 'favicon.svg' },
    { rel: 'shortcut icon', href: base + 'favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: base + 'apple-touch-icon.png' },
    { rel: 'manifest', href: base + 'site.webmanifest' },
  ];

  const head = document.head;
  const existing = Array.from(head.querySelectorAll('link[rel*="icon"], link[rel="manifest"]'))
    .map(l => (l.getAttribute('href') || '').split('?')[0]);

  defs.forEach(def => {
    if (!existing.includes(def.href)) {
      const link = document.createElement('link');
      Object.entries(def).forEach(([k, v]) => link.setAttribute(k, v));
      head.appendChild(link);
    }
  });
})();

/* ============================================
   CARICA NAVBAR/FOOTER (da navbar.html/footer.html)
   ============================================ */
function injectNavbar() {
  const slots = document.querySelectorAll('#nav-placeholder');
  if (!slots.length) return;

  fetch('navbar.html')
    .then(r => r.text())
    .then(html => {
      slots.forEach(slot => (slot.innerHTML = html));
      initMegaNav();         // listener bottoni + chiusure
      highlightActiveLink(); // evidenzia voce corrente
    })
    .catch(console.error);
}

function injectFooter() {
  const slot = document.getElementById('footer-placeholder');
  if (!slot) return;
  fetch('footer.html')
    .then(r => r.text())
    .then(html => (slot.innerHTML = html))
    .catch(console.error);
}

/* =======================
   NAV: evidenzia link attivo
   ======================= */
function highlightActiveLink() {
  // pagina corrente senza query/hash
  const currentFile = (location.pathname.split('/').pop() || 'index.html').split('#')[0];

  // Nav classica (se presente)
  document.querySelectorAll('nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href === currentFile) a.classList.add('active');
  });

  // Mega-nav (voci nei submenu)
  document.querySelectorAll('.mega-nav .submenu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href === currentFile) a.classList.add('active');
  });
}

/* ==================================
   MEGA-NAV: 3 bottoni, dropdown sottili
   ================================== */
function initMegaNav() {
  const nav = document.querySelector('.mega-nav');
  if (!nav) return;

  const items = nav.querySelectorAll('.has-submenu');

  function closeAll(except = null) {
    items.forEach(li => {
      if (li !== except) li.classList.remove('open');
      const b = li.querySelector('.top-link');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  items.forEach(li => {
    const btn = li.querySelector('.top-link');
    if (!btn) return;
    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const willOpen = !li.classList.contains('open');
      closeAll();
      if (willOpen) {
        li.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // chiudi cliccando fuori
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) closeAll();
  });
  // chiudi con ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAll();
  });
}

/* ======================================================
   SCAFFALE LIBRI – toggle expand al click sulla copertina
   (tuo blocco, riportato e compatibile)
   ====================================================== */
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

/* ==================================
   IDEE-CARD: mantengo la tua expandCard
   ================================== */
function expandCard(card) {
  // Alterna solo questa card
  card.classList.toggle('expanded');

  // Se si è appena espansa, scroll in vista
  if (card.classList.contains('expanded')) {
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}

/* ===================
   AVVIO: on DOM ready
   =================== */
document.addEventListener('DOMContentLoaded', function () {
  // Carica navbar + footer (se presente lo slot)
  injectNavbar();
  injectFooter();

  // Highlight iniziale (se ci fosse una nav già inline)
  highlightActiveLink();
});
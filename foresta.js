window.addEventListener('DOMContentLoaded', () => {
  const foresta = document.getElementById('foresta');
  const NUM_ALBERI = 15;
  const ALBERI_CON_PERSONA = 4;
  const NUM_ROCCE = 8;
  const NUM_PERSONE = 4;
  const ELEMENT_SIZE = 60;
  const SPAZIO_MINIMO = 70;

  const ALBERI = [];
  const ELEMENTI = [];

  function getRandomPosition() {
    const maxTop = foresta.clientHeight - ELEMENT_SIZE;
    const maxLeft = foresta.clientWidth - ELEMENT_SIZE;
    return {
      top: Math.random() * maxTop,
      left: Math.random() * maxLeft
    };
  }

  function isOverlapping(pos) {
    return ELEMENTI.some(e => {
      const dx = e.left - pos.left;
      const dy = e.top - pos.top;
      return Math.sqrt(dx * dx + dy * dy) < SPAZIO_MINIMO;
    });
  }

  function creaElemento(classe, clickabile = false, posOverride = null) {
    let pos = posOverride;
    let tentativi = 0;

    if (!pos) {
      do {
        pos = getRandomPosition();
        tentativi++;
      } while (isOverlapping(pos) && tentativi < 100);
      if (tentativi >= 100) return null;
    }

    const el = document.createElement('div');
    el.className = classe;
    el.style.left = `${pos.left}px`;
    el.style.top = `${pos.top}px`;

    if (clickabile) {
      el.title = "Vai alla Tribù";
      el.style.cursor = "pointer";
      el.onclick = () => window.location.href = 'chi-tribu.html';
    }

    foresta.appendChild(el);
    ELEMENTI.push(pos);
    return { el, pos };
  }

  function creaAlberi() {
    for (let i = 0; i < NUM_ALBERI; i++) {
      const clickabile = i < ALBERI_CON_PERSONA;
      const albero = creaElemento('albero', clickabile);
      if (albero) ALBERI.push(albero);
    }
  }

  function creaRocce() {
    for (let i = 0; i < NUM_ROCCE; i++) {
      creaElemento('roccia');
    }
  }

  function creaPersona() {
    const el = document.createElement('div');
    el.className = 'persona';
    foresta.appendChild(el);

    function scegliDestinazione() {
      const target = ALBERI[Math.floor(Math.random() * ALBERI_CON_PERSONA)].pos;
      return {
        x: target.left + 20,
        y: target.top + 20
      };
    }

    function muovi() {
      const { x, y } = scegliDestinazione();
      const durata = 3000 + Math.random() * 3000;

      el.style.transition = `top ${durata}ms linear, left ${durata}ms linear`;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      setTimeout(muovi, durata + 1000);
    }

    const inizio = scegliDestinazione();
    el.style.left = `${inizio.x}px`;
    el.style.top = `${inizio.y}px`;

    setTimeout(muovi, 500);
  }

  // Costruzione
  creaAlberi();
  creaRocce();
  for (let i = 0; i < NUM_PERSONE; i++) creaPersona();
});
const villaggio = document.getElementById('villaggio');
const NUM_CASE = 10;
const NUM_ALBERI = 7;
const NUM_PERSONE = 3;

const SIZE_CASE = { w: 60, h: 60 };
const SIZE_ALBERO = { w: 50, h: 70 };

const CASE = [];
const elementiPosizionati = [];

function getRandomPosition(maxWidth, maxHeight) {
  return {
    left: Math.random() * maxWidth,
    top: Math.random() * maxHeight
  };
}

function isOverlapping(pos, size) {
  const margin = 20;
  return elementiPosizionati.some(el => {
    return !(
      pos.left + size.w + margin < el.left - margin ||
      pos.left - margin > el.left + el.w + margin ||
      pos.top + size.h + margin < el.top - margin ||
      pos.top - margin > el.top + el.h + margin
    );
  });
}

function registraElemento(pos, size) {
  elementiPosizionati.push({ ...pos, w: size.w, h: size.h });
}

function creaCasa() {
  const maxLeft = villaggio.clientWidth - SIZE_CASE.w;
  const maxTop = villaggio.clientHeight - SIZE_CASE.h;
  let pos, tentativi = 0;

  do {
    pos = getRandomPosition(maxLeft, maxTop);
    tentativi++;
  } while (isOverlapping(pos, SIZE_CASE) && tentativi < 200);

  if (tentativi >= 200) return;

  const el = document.createElement('div');
  el.className = 'casa';
  el.style.position = 'absolute';
  el.style.left = `${pos.left}px`;
  el.style.top = `${pos.top}px`;
  el.textContent = 'Casa';

  villaggio.appendChild(el);
  CASE.push({ element: el, ...pos });
  registraElemento(pos, SIZE_CASE);
}

function creaAlbero() {
  const maxLeft = villaggio.clientWidth - SIZE_ALBERO.w;
  const maxTop = villaggio.clientHeight - SIZE_ALBERO.h;
  let pos, tentativi = 0;

  do {
    pos = getRandomPosition(maxLeft, maxTop);
    tentativi++;
  } while (isOverlapping(pos, SIZE_ALBERO) && tentativi < 200);

  if (tentativi >= 200) return;

  const el = document.createElement('div');
  el.className = 'albero';
  el.style.position = 'absolute';
  el.style.left = `${pos.left}px`;
  el.style.top = `${pos.top}px`;
  el.title = "Torna alla Foresta";
  el.style.cursor = "pointer";
  el.onclick = () => window.location.href = 'chi-foresta.html';

  villaggio.appendChild(el);
  registraElemento(pos, SIZE_ALBERO);
}

function muoviPersona(persona) {
  function scegliDestinazione() {
    const target = CASE[Math.floor(Math.random() * CASE.length)];
    const rect = target.element.getBoundingClientRect();
    const containerRect = villaggio.getBoundingClientRect();
    const x = rect.left - containerRect.left + 15;
    const y = rect.top - containerRect.top + 15;
    return { x, y };
  }

  function anima() {
    const { x, y } = scegliDestinazione();
    const durata = 4000 + Math.random() * 2000;

    persona.style.transition = `top ${durata}ms linear, left ${durata}ms linear`;
    persona.style.left = `${x}px`;
    persona.style.top = `${y}px`;

    setTimeout(anima, durata + 1000);
  }

  const start = scegliDestinazione();
  persona.style.left = `${start.x}px`;
  persona.style.top = `${start.y}px`;
  anima();
}

function creaPersona() {
  const el = document.createElement('div');
  el.className = 'persona';
  el.style.position = 'absolute';
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.backgroundColor = 'blue';
  el.style.borderRadius = '50%';
  el.style.zIndex = '2';
  villaggio.appendChild(el);
  muoviPersona(el);
}

// --- AVVIO ---
for (let i = 0; i < NUM_CASE; i++) creaCasa();
for (let i = 0; i < NUM_ALBERI; i++) creaAlbero();
for (let i = 0; i < NUM_PERSONE; i++) creaPersona();
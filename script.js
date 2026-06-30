'use strict';

const form = document.querySelector('#prime-form');
const startInput = document.querySelector('#start-value');
const endInput = document.querySelector('#end-value');
const clearButton = document.querySelector('#clear-button');
const printButton = document.querySelector('#print-button');
const pdfButton = document.querySelector('#pdf-button');
const formMessage = document.querySelector('#form-message');
const results = document.querySelector('#results');
const primeList = document.querySelector('#prime-list');
const emptyResult = document.querySelector('#empty-result');
const resultRange = document.querySelector('#result-range');
const primeCount = document.querySelector('#prime-count');
const firstPrime = document.querySelector('#first-prime');
const lastPrime = document.querySelector('#last-prime');
const printDate = document.querySelector('#print-date');

const MAX_RANGE_SIZE = 1_000_000;
let currentResult = null;

function getPrimes(start, end) {
  if (end < 2) return [];

  const sieve = new Uint8Array(end + 1);
  sieve.fill(1, 2);

  for (let number = 2; number * number <= end; number += 1) {
    if (sieve[number] === 1) {
      for (let multiple = number * number; multiple <= end; multiple += number) {
        sieve[multiple] = 0;
      }
    }
  }

  const primes = [];
  for (let number = Math.max(2, start); number <= end; number += 1) {
    if (sieve[number] === 1) primes.push(number);
  }
  return primes;
}

function validateRange(start, end) {
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return 'Ingresa números enteros en ambos campos.';
  }
  if (start < 0 || end < 0) {
    return 'Los valores no pueden ser negativos.';
  }
  if (start > end) {
    return 'El valor inicial debe ser menor o igual al valor final.';
  }
  if (end - start > MAX_RANGE_SIZE || end > MAX_RANGE_SIZE) {
    return 'Usa valores de hasta 1.000.000 para mantener un buen rendimiento.';
  }
  return '';
}

function renderPrimes(primes, start, end) {
  const fragment = document.createDocumentFragment();

  primes.forEach((prime, index) => {
    const card = document.createElement('div');
    card.className = 'prime-number';
    card.textContent = prime.toLocaleString('es-BO');
    card.style.animationDelay = `${Math.min(index * 18, 360)}ms`;
    fragment.appendChild(card);
  });

  primeList.replaceChildren(fragment);
  primeCount.textContent = primes.length.toLocaleString('es-BO');
  firstPrime.textContent = primes.length ? primes[0].toLocaleString('es-BO') : '—';
  lastPrime.textContent = primes.length ? primes.at(-1).toLocaleString('es-BO') : '—';
  resultRange.textContent = `Rango: ${start.toLocaleString('es-BO')} – ${end.toLocaleString('es-BO')}`;
  printDate.textContent = `Fecha de impresión: ${new Intl.DateTimeFormat('es-BO', { dateStyle: 'long', timeStyle: 'short' }).format(new Date())}`;
  emptyResult.hidden = primes.length > 0;
  results.hidden = false;
  printButton.disabled = false;
  pdfButton.disabled = false;
  currentResult = { primes, start, end };
}

function downloadPdf() {
  if (!currentResult) return;

  if (!window.jspdf) {
    formMessage.textContent = 'No se pudo cargar el generador PDF. Verifica tu conexión e inténtalo nuevamente.';
    return;
  }

  const { jsPDF } = window.jspdf;
  const documentPdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const { primes, start, end } = currentResult;
  const pageWidth = documentPdf.internal.pageSize.getWidth();
  const pageHeight = documentPdf.internal.pageSize.getHeight();
  const margin = 16;
  const columns = 8;
  const gap = 2;
  const cellWidth = (pageWidth - (margin * 2) - (gap * (columns - 1))) / columns;
  const cellHeight = 10;
  const printTimestamp = new Intl.DateTimeFormat('es-BO', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(new Date());

  function drawHeader(isFirstPage = false) {
    documentPdf.setFillColor(55, 95, 122);
    documentPdf.rect(0, 0, pageWidth, 24, 'F');
    documentPdf.setTextColor(255, 255, 255);
    documentPdf.setFont('helvetica', 'bold');
    documentPdf.setFontSize(18);
    documentPdf.text('Generador de Numeros Primos', margin, 15.5);

    if (!isFirstPage) return 33;

    documentPdf.setTextColor(24, 48, 63);
    documentPdf.setFontSize(11);
    documentPdf.text(`Rango utilizado: ${start.toLocaleString('es-BO')} - ${end.toLocaleString('es-BO')}`, margin, 34);
    documentPdf.text(`Cantidad de primos: ${primes.length.toLocaleString('es-BO')}`, margin, 41);
    documentPdf.setFont('helvetica', 'normal');
    documentPdf.setTextColor(90, 100, 106);
    documentPdf.setFontSize(9);
    documentPdf.text(`Fecha de impresion: ${printTimestamp}`, margin, 48);
    return 57;
  }

  let verticalPosition = drawHeader(true);
  documentPdf.setFont('helvetica', 'bold');
  documentPdf.setFontSize(10);

  if (primes.length === 0) {
    documentPdf.setTextColor(55, 95, 122);
    documentPdf.text('No se encontraron numeros primos en este rango.', margin, verticalPosition);
  } else {
    primes.forEach((prime, index) => {
      const column = index % columns;

      if (column === 0 && verticalPosition + cellHeight > pageHeight - 16) {
        documentPdf.addPage();
        verticalPosition = drawHeader(false);
      }

      const horizontalPosition = margin + (column * (cellWidth + gap));
      documentPdf.setDrawColor(174, 187, 194);
      documentPdf.setFillColor(248, 251, 251);
      documentPdf.roundedRect(horizontalPosition, verticalPosition, cellWidth, cellHeight, 1.3, 1.3, 'FD');
      documentPdf.setTextColor(55, 95, 122);
      documentPdf.text(
        prime.toLocaleString('es-BO'),
        horizontalPosition + (cellWidth / 2),
        verticalPosition + 6.5,
        { align: 'center' }
      );

      if (column === columns - 1 || index === primes.length - 1) verticalPosition += cellHeight + gap;
    });
  }

  const totalPages = documentPdf.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    documentPdf.setPage(page);
    documentPdf.setFont('helvetica', 'normal');
    documentPdf.setFontSize(8);
    documentPdf.setTextColor(110, 120, 126);
    documentPdf.text(`Pagina ${page} de ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  documentPdf.save(`numeros-primos-${start}-${end}.pdf`);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const start = Number(startInput.value);
  const end = Number(endInput.value);
  const validationMessage = validateRange(start, end);

  if (validationMessage) {
    formMessage.textContent = validationMessage;
    results.hidden = true;
    printButton.disabled = true;
    pdfButton.disabled = true;
    currentResult = null;
    return;
  }

  formMessage.textContent = '';
  renderPrimes(getPrimes(start, end), start, end);
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

clearButton.addEventListener('click', () => {
  form.reset();
  startInput.value = '1';
  formMessage.textContent = '';
  primeList.replaceChildren();
  results.hidden = true;
  printButton.disabled = true;
  pdfButton.disabled = true;
  currentResult = null;
  startInput.focus();
});

printButton.addEventListener('click', () => {
  printDate.textContent = `Fecha de impresión: ${new Intl.DateTimeFormat('es-BO', { dateStyle: 'long', timeStyle: 'short' }).format(new Date())}`;
  window.print();
});

pdfButton.addEventListener('click', downloadPdf);

document.querySelector('#current-year').textContent = new Date().getFullYear();

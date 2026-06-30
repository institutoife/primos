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

function getPdfLogoAssets() {
  return new Promise((resolve, reject) => {
    const logo = new Image();

    logo.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      const watermarkCanvas = document.createElement('canvas');
      canvas.width = 760;
      canvas.height = 354;
      watermarkCanvas.width = canvas.width;
      watermarkCanvas.height = canvas.height;

      const context = canvas.getContext('2d');
      const watermarkContext = watermarkCanvas.getContext('2d');
      context.drawImage(logo, 0, 0, canvas.width, canvas.height);
      watermarkContext.globalAlpha = 0.055;
      watermarkContext.drawImage(logo, 0, 0, canvas.width, canvas.height);

      resolve({
        logo: canvas.toDataURL('image/png'),
        watermark: watermarkCanvas.toDataURL('image/png')
      });
    });

    logo.addEventListener('error', reject);
    logo.src = 'images/ifelogo.svg';
  });
}

async function downloadPdf() {
  if (!currentResult) return;

  if (!window.jspdf) {
    formMessage.textContent = 'No se pudo cargar el generador PDF. Verifica tu conexión e inténtalo nuevamente.';
    return;
  }

  pdfButton.disabled = true;
  pdfButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando PDF';
  formMessage.textContent = '';

  try {
    const logoAssets = await getPdfLogoAssets();
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

    function drawPageLayout(isFirstPage = false) {
      documentPdf.addImage(logoAssets.watermark, 'PNG', 40, 116, 130, 60.5, 'ife-watermark', 'FAST');
      documentPdf.setFillColor(55, 95, 122);
      documentPdf.rect(0, 0, pageWidth, 27, 'F');
      documentPdf.setTextColor(255, 255, 255);
      documentPdf.setFont('helvetica', 'bold');
      documentPdf.setFontSize(18);
      documentPdf.text('Generador de Numeros Primos', margin, 17);

      documentPdf.setDrawColor(38, 186, 165);
      documentPdf.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
      documentPdf.setFont('helvetica', 'normal');
      documentPdf.setTextColor(65, 78, 85);
      documentPdf.setFontSize(7.5);
      documentPdf.text('TikTok e Instagram: @ife_educabol  |  Facebook: ife.educabol', margin, pageHeight - 12);
      documentPdf.text('YouTube: @ife_educabol  |  WhatsApp: +591 75553338', margin, pageHeight - 8);

      if (!isFirstPage) return 35;

      documentPdf.setTextColor(24, 48, 63);
      documentPdf.setFont('helvetica', 'bold');
      documentPdf.setFontSize(11);
      documentPdf.text(`Rango utilizado: ${start.toLocaleString('es-BO')} - ${end.toLocaleString('es-BO')}`, margin, 37);
      documentPdf.text(`Cantidad de primos: ${primes.length.toLocaleString('es-BO')}`, margin, 44);
      documentPdf.setFont('helvetica', 'normal');
      documentPdf.setTextColor(90, 100, 106);
      documentPdf.setFontSize(9);
      documentPdf.text(`Fecha de impresion: ${printTimestamp}`, margin, 51);
      documentPdf.addImage(logoAssets.logo, 'PNG', pageWidth - margin - 45, 32, 45, 21, 'ife-logo', 'FAST');
      return 60;
    }

    let verticalPosition = drawPageLayout(true);
    documentPdf.setFont('helvetica', 'bold');
    documentPdf.setFontSize(10);

    if (primes.length === 0) {
      documentPdf.setTextColor(55, 95, 122);
      documentPdf.text('No se encontraron numeros primos en este rango.', margin, verticalPosition);
    } else {
      primes.forEach((prime, index) => {
        const column = index % columns;

        if (column === 0 && verticalPosition + cellHeight > pageHeight - 22) {
          documentPdf.addPage();
          verticalPosition = drawPageLayout(false);
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
      documentPdf.setFontSize(7.5);
      documentPdf.setTextColor(110, 120, 126);
      documentPdf.text(`Pagina ${page} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }

    documentPdf.save(`numeros-primos-${start}-${end}.pdf`);
  } catch (error) {
    formMessage.textContent = 'No se pudo incorporar el logo al PDF. Recarga la pagina e intentalo nuevamente.';
  } finally {
    pdfButton.disabled = false;
    pdfButton.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Descargar PDF';
  }
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

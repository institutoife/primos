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
const PDF_LOGO_SOURCE = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0ibG9nbyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA3NTYuNTEgMzUyLjUyIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLnN0MCB7IGZpbGw6ICMzNzVmN2E7IH0KICAgICAgLnN0MSB7IGZpbGw6ICMyNmJhYTU7IH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03MDcuMTYsMjYwLjM2bDQ3LjIzLS4wOGMtMi4wMiwyNC41Mi0xNy4yOCw0NC45NC0zOS41OSw1NC42NC0xMC43LDQuNjYtMjEuNTgsNy45MS0zMy4zMSw5LjAzLTcuMDIuNjctMTMuNDguMTYtMjAuMzEtLjg1LTE4LjMxLTIuNy0zNS41Ny02LjgyLTUwLjIyLTE4LjU2bC03Ljg4LTcuOGMtNS41LTYuNzctOS42OS0xNC0xMy42NS0yMS44LTYuNTgtMTIuOTYtMTAuNjEtMjYuNjctMTEuMzUtNDEuMzYtMS42LTMxLjkyLDUuMDUtNjkuODgsMjkuODktOTEuMzksMzAuMTUtMjYuMTIsNzQuMTUtMjcuODcsMTA4LjYxLTkuNzIsMjAuODcsMTAuOTksMzIuNTgsMzMuNjUsMzYuOTMsNTYuMjYsMS43NSw3LjIyLDIuMTYsMTQuMzUsMi43OCwyMS43N2wuMjEsMjEuNDItMTI4LjQ3LS4wMi4wMiw4Ljc3Yy4wMSw1LjkyLDEuMjQsMTEuNTgsMi44OSwxNy4yMywyLjgsOS41NSw3LjQyLDE4LjE5LDE1LjM0LDI0LjUsMTcuMDYsMTMuNiw0NC4zMiwxMi42MSw1NS43NS04LjA3LDIuMzctNC4zMiwzLjk0LTguNTYsNS4xMi0xMy45OFpNNzA2LjU0LDIwMy43OGwtMS0xMi42NmMtLjMtMy43Ni0xLjI5LTcuMTMtMi40MS0xMC43NC0yLjQxLTcuNy02LjMzLTE0LjkzLTEyLjM1LTIwLjI5LTYuMDgtNS40MS0xMy41MS04Ljc2LTIxLjU1LTguNDYtMTAuNDkuMzktMTkuOTQsNC43MS0yNi41NSwxMi43Ny04LjgsMTAuNTgtMTMuNCwyNS4zMy0xNC4zMiwzOS4zN2g3OC4wOVoiLz4KICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTM4LjEyLDI4OC42OWgzMy4zcy41NywzMi4wNi41NywzMi4wNmwtMTExLjQxLjAyLS4yMi0zMi4wOCwyNy4zNi4wMi0yLjI2LTEzNS43NC0yOS40My4wMy0uNTUtMzIuMDQsMjkuNTEtLjAyLS4wNS0yNy44NGMuNTMtNi4zOCwxLjgtMTIuMzksMy45Mi0xOC4zLDIuOTYtNy40LDcuMzMtMTMuNjgsMTMuODMtMTguMzMsMTIuMDktOC42NCwyNS43OS0xMy45Nyw0MC43LTE1LjI5LDAsMCwxNC41LS40NSwyMC4zNi0uMDYsNy4wMi40NiwxMy42LDIuNjksMjAuNTksNC40bC4yNSwyMy42NS4xLDEwLjM3Yy0xNy42Ny0zLjIxLTM1LjU2LTUuNDUtNDYuNzMsOS40OS0yLjA0LDUuNzMtMi44OCwxMS41OC0yLjQyLDE3LjY3bC0uMDcsMTQuMjQsMzQuMDItLjA2Yy45MywyLjcyLjkyLDUuNjIuOTEsOC43MWwtLjA2LDIzLjM5LTM0LjM0LS4wMywyLjA5LDEzNS43NFoiLz4KICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTkzLjI5LDEzMi40OGMtMjMuMDcsMTQuNTMtMzQuMDQsMzYuNzItNDAuMjQsNjIuNzYtMTMuMS01MC4wOS00MS44LTc5LjY1LTk1LjM5LTgwLjQyLDIuNzctMzguOSwxNC40My03NC42OSw1Mi4xNC05MS44OSw5LjIxLTQuMiwxOC43My02LjI1LDI4Ljc4LTcuNzUsOS40My0xLjQxLDE4LjM0LTEuMywyNy43OC4wMywyMi42NSwzLjE4LDQxLjk0LDEwLjg0LDU3LjMsMjguMjYsMTcuNDgsMTkuODIsMjQuNTYsNDcuODgsMjYuMjIsNzQuMDMtMTkuNjgtLjAyLTQwLjM4LDQuNzYtNTYuNiwxNC45N1oiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjQ4LjMxLDI2Mi4yNmwtNDMuMzEtMjguNTljLTEuODQtMS4yMS0zLjY2LS45NC01LjIzLjA3LTEuODgsMS4yMS0yLjY5LDIuOTgtMi44LDUuMDItLjEyLDIuMDcsMS4wOSwzLjUyLDIuOTgsNC44OGw0Mi4zNywzMC4zOGMxLjcsMS4yMiwxLjQ2LDQuMTYuNjYsNS40NC0xLjA1LDEuNjctMy41NiwyLjU4LTUuNjcsMS43bC0zMS4wMi0xMi45M2MtNC4yNC0xLjc3LTguNSwyLjU3LTkuMDUsNi43NC0uNDEsMy4xNywxLjQzLDYsNC4zLDcuMzQsOC4zMSwzLjg5LDE1Ljk0LDguMjYsMjMuNjMsMTMuMzYsOC41OCw1LjY5LDE2Ljc2LDExLjQsMjQuMzcsMTkuMDMtMjQuMzMsNS43NC00OC41MiwxMy4wNS02OS42NiwyNS40OC01LjgxLDMuNDItMTAuNjIsNy40Mi0xNS42OSwxMi4zM2wuMjItMTM4LjQ2Yy4wMi0xNC4wMiw0LjQ1LTI3LjI5LDEwLjM0LTM5LjY1LDQuNjItOS42OCwxMS4yNy0xNy43OSwxOS40OC0yNC40Myw3LjA4LTUuNzMsMTQuODYtOS4yOCwyMy41My0xMi4wMywxOC4zMi01Ljc5LDM2Ljk5LTguMzUsNTYuMjEtOS40OGwyNi4xNy0uMTcsNC40Ni41Ny4wNSw3MS40OGMtNi41Ljk0LTkuNTksOS44LTEwLjQsMTYuNTFsLTEuNjIsMTMuMzZjLS4xLjgzLTEuMjUsMS42My0xLjczLDEuOTUtLjY1LjQ0LTEuODcuMDQtMi42Ni0uNzVsLTMzLjg3LTMzLjQ3LTExLjM1LTExLjA2Yy0yLjIxLTIuMTUtNS43OS0yLjE1LTguMzYtLjc1LTIuMjcsMS4yNC00LjU3LDQuMTUtNC4xNSw3LjA4LjMyLDIuMjQsMS42MiwzLjksMy4xMSw1LjM0bDM1LjcyLDM0LjM4YzIuMTYsMi4wOCwyLjEsNS40OC40MSw3Ljg5LTEuMjUsMS43OC01LjA2LDMuMjUtNy41MywxLjI3bC01MS45MS00MS41Yy0zLjI0LTIuNTktOC41OS0uNDItMTAuMzEsMi41LTIuMzYsNC0xLjA2LDcuOTMsMi41MiwxMC43OWw1MS4wNiw0MC43NGMyLjEsMS42NywyLjU0LDQuNDMsMS4zMyw2LjM2LTEuMiwxLjkyLTQuMTUsMi45LTYuNTksMS4yOVoiLz4KICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNTYuMzYsMjYxLjk4Yy0yLjA4LDEuMzctNC41LDEuNTMtNi4zMS4wNS0xLjU2LTEuMjctMi4xMy01LjE1LS4yLTYuNjlsNTMuNTEtNDIuNjdjMi4wNC0xLjYyLDIuOTktMy40NSwzLjEyLTUuNTUuMTUtMi41Ni0uNjgtNC4zNS0yLjgtNi4zNC0yLjA0LTEuOTMtNi4yNC0yLjc3LTguOTYtLjZsLTUxLjczLDQxLjE4Yy0yLjY5LDIuMTQtNi4xMiwxLjk3LTguMzgtLjM5LTIuMjMtMi4zMi0xLjg5LTUuOTcuNjUtOC40MmwzNi40NS0zNS4xOGMyLjg2LTIuNzYsMi40Mi02LjQ4LjEtOS4yNy0yLjM4LTIuODYtNy4zOS00LjUtMTAuNjgtMS4yNmwtNDAuNDIsMzkuODMtNC44LDQuNjRjLS43My43MS0yLjE3LDEuMjUtMywuNTgtMS44MS0xLjQ1LTIuMDMtMy42OC0yLjA2LTUuOTEtLjExLTguNjctMi41NC0yMy43NC0xMC44NS0yNS41NXYtNzEuNjlzNC43OC0uNDgsNC43OC0uNDhsMjUuNjMuMmMxOC44LjkzLDM2Ljk0LDMuODYsNTQuOTMsOS4wOCwzNS4wNywxMC4xOCw1MC4yNywzOS4yLDU0Ljc5LDc0LjA4bC4wNSwxMzguOTJjMCwuNjUtLjE4LDEuMzItLjQzLDEuNDYtLjU0LjMxLS44NS0uMjgtMS4yNy0uNzItMTcuMzktMTguMzktNTcuODItMzAuMzktODMuMjUtMzYuMjEsNi45OC03LjE3LDE0LjgzLTEyLjkyLDIzLjExLTE4LjYxLDguMTMtNS41OSwxNi4yMi0xMC40OCwyNS4wOS0xNC41NCwzLjg1LTIuMzgsNS4yMS02LjYxLDMuMjgtMTAuMTEtMi4yMy00LjAzLTYuMjYtNC45NS0xMC4zOC0zLjE5bC0yOS42NywxMi43Yy0yLjIxLjk1LTQuNzYtLjQ0LTUuNDgtMi4wNy0uOS0yLjA0LS43Mi00LjM5LDEuMzQtNS44Mmw0My4xOS0zMC4xNWMyLjQtMS42OCwyLjM4LTUuMDMsMS4zNy03LjMyLS44Mi0xLjg2LTQuNjQtNC4zNC03LjA1LTIuNzRsLTQzLjY3LDI4Ljc4WiIvPgogIDxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iNDMzLjI5IDMxOS45NiAzNDUuNjQgMzIwLjAxIDM0NS42MSAyODguNTkgMzcxLjE3IDI4OC41OCAzNzEuMTQgMTU3LjMzIDM0NS43IDE1Ny4yMyAzNDUuNjMgMTI1LjQ5IDQyMS4yIDEyNS4zMyA0MjEuMjEgMjg4LjU5IDQ0Mi45NiAyODguNDIgNDQzLjA0IDMyMC4wNyA0MzMuMjkgMzE5Ljk2Ii8+CiAgPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSI0MjAuMzMgOTYuMzggMzcxLjMyIDk2LjM5IDM3MS4xOSA1Mi4wMyA0MjAuMjcgNTEuOTkgNDIwLjMzIDk2LjM4Ii8+CiAgPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIzNDkuMzEgMTA5Ljk3IDMwNi4zNiAxMTAuMDQgMzA2LjM2IDY3LjQ5IDM0OS4zMSA2Ny40OSAzNDkuMzEgMTA5Ljk3Ii8+CiAgPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIzMjEuODUgMzguODYgMjg5LjY2IDM4LjkxIDI4OS42NSA3LjI5IDMyMS44MyA3LjI1IDMyMS44NSAzOC44NiIvPgogIDxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iMzcxLjY0IDI4LjMgMzQyLjggMjguMzQgMzQyLjc5IC4wMSAzNzEuNjIgMCAzNzEuNjQgMjguMyIvPgo8L3N2Zz4=';
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
    let completed = false;
    const timeout = window.setTimeout(() => {
      if (!completed) reject(new Error('Tiempo de carga del logo agotado.'));
    }, 5000);

    function createAssets() {
      if (completed) return;

      try {
        const scale = Math.min(1, 900 / Math.max(logo.naturalWidth, logo.naturalHeight));
        const sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = Math.round(logo.naturalWidth * scale);
        sourceCanvas.height = Math.round(logo.naturalHeight * scale);
        const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true });
        sourceContext.drawImage(logo, 0, 0, sourceCanvas.width, sourceCanvas.height);

        const pixels = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height).data;
        let minX = sourceCanvas.width;
        let minY = sourceCanvas.height;
        let maxX = 0;
        let maxY = 0;

        for (let y = 0; y < sourceCanvas.height; y += 1) {
          for (let x = 0; x < sourceCanvas.width; x += 1) {
            const offset = (y * sourceCanvas.width + x) * 4;
            const isLogoPixel = pixels[offset + 3] > 10
              && (pixels[offset] < 245 || pixels[offset + 1] < 245 || pixels[offset + 2] < 245);

            if (isLogoPixel) {
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
        }

        if (minX > maxX || minY > maxY) throw new Error('No se detecto el contenido del logo.');

        const cropWidth = maxX - minX + 1;
        const cropHeight = maxY - minY + 1;
        const canvas = document.createElement('canvas');
        const watermarkCanvas = document.createElement('canvas');
        canvas.width = 760;
        canvas.height = Math.round(canvas.width * (cropHeight / cropWidth));
        watermarkCanvas.width = canvas.width;
        watermarkCanvas.height = canvas.height;

        const context = canvas.getContext('2d');
        const watermarkContext = watermarkCanvas.getContext('2d');
        context.drawImage(sourceCanvas, minX, minY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
        watermarkContext.globalAlpha = 0.055;
        watermarkContext.drawImage(canvas, 0, 0);

        completed = true;
        window.clearTimeout(timeout);
        resolve({
          logo: canvas.toDataURL('image/png'),
          watermark: watermarkCanvas.toDataURL('image/png')
        });
      } catch (error) {
        completed = true;
        window.clearTimeout(timeout);
        reject(error);
      }
    }

    logo.addEventListener('load', createAssets, { once: true });
    logo.addEventListener('error', () => {
      completed = true;
      window.clearTimeout(timeout);
      reject(new Error('No se pudo cargar el logo.'));
    }, { once: true });
    logo.src = PDF_LOGO_SOURCE;
    if (logo.complete && logo.naturalWidth > 0) createAssets();
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

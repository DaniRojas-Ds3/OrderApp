// buscador.js - normalización definitiva y buscador

function encodeImagePath(path) {
  if (!path) return '';
  return path.split('/').map(s => encodeURIComponent(s)).join('/');
}

function toIntegerPrecio(valor) {
  if (valor === null || valor === undefined || valor === '') return 0;

  if (typeof valor === 'number') {
    if (!Number.isInteger(valor) && valor < 1000) return Math.round(valor * 1000);
    return Math.round(valor);
  }

  if (typeof valor === 'string') {
    const s = valor.trim();
    // Normalizar comas->puntos y quitar espacios
    const normalized = s.replace(/\s/g,'').replace(/,/g,'.');

    // Si tiene solo dígitos y puntos, extraemos digits
    const onlyDigits = normalized.replace(/[^\d]/g, '');
    if (onlyDigits.length > 0) {
      // Caso típico "2.800" -> onlyDigits "2800"
      // Caso "2.8" -> onlyDigits "28" -> detectamos punto decimal y small length: convertir considerando decimal
      if (normalized.includes('.') && normalized.split('.').some(part => part.length <= 2)) {
        const floatVal = parseFloat(normalized);
        if (!Number.isNaN(floatVal) && floatVal < 1000) return Math.round(floatVal * 1000);
      }
      return parseInt(onlyDigits, 10);
    }
    return 0;
  }

  return 0;
}

function normalizeProductos(lista) {
  if (!Array.isArray(lista)) return;
  lista.forEach(prod => {
    if (!prod.imagen && prod.magen) prod.imagen = prod.magen;
    prod.imagen = prod.imagen ? encodeImagePath(prod.imagen) : 'IMAGENES/placeholder.png';
    prod.precio = toIntegerPrecio(prod.precio);
  });
}

if (typeof productos !== 'undefined') {
  console.log('Normalizando productos... (mira antes/después primeros 6)');
  console.log('antes', productos.slice(0,6).map(p=>({n:p.nombre,precio:p.precio})));
  normalizeProductos(productos);
  console.log('despues', productos.slice(0,6).map(p=>({n:p.nombre,precio:p.precio})));
} else {
  console.warn('No hay productos cargados. Asegura main.js se carga antes de buscador.js');
}

/* buscador (igual que antes) */
const normalizeText = txt => String(txt||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const input = document.getElementById('serchInput');
const contenedorResultados = document.getElementById('resultados');
const seccionCategorias = document.querySelector('.items');

if (input && contenedorResultados && seccionCategorias) {
  input.addEventListener('input', () => {
    const q = normalizeText(input.value.trim());
    contenedorResultados.innerHTML = '';
    if (q === '') {
      seccionCategorias.style.display = 'block';
      return;
    }
    const encontrados = (productos||[]).filter(p => normalizeText(p.nombre).includes(q));
    seccionCategorias.style.display = 'none';
    if (encontrados.length === 0) {
      contenedorResultados.innerHTML = `<p style="text-align:center;font-weight:bold;color:#a62929;">No se encontraron resultados</p>`;
      return;
    }
    encontrados.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'item';
      card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <div class="item-info">
          <h2>${prod.nombre}</h2>
          <p>$${prod.precio.toLocaleString('es-CO')}</p>
          <p style="font-size:14px;color:#a62929;">${prod.categoria}</p>
        </div>
      `;
      contenedorResultados.appendChild(card);
    });
  });
} else {
  console.error('Elementos HTML faltantes para buscador.');
}

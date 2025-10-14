// === FUNCIÓN DE BÚSQUEDA ===

// Normaliza el texto (para buscar sin importar mayúsculas ni acentos)
const normalize = (txt) => txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Referencias a los elementos
const input = document.getElementById("serchInput");
const contenedorResultados = document.getElementById("resultados");
const seccionCategorias = document.querySelector(".items");

// Escucha cada vez que el usuario escribe
input.addEventListener("input", () => {
  const query = normalize(input.value.trim());
  contenedorResultados.innerHTML = ""; // limpiar resultados previos

  if (query === "") {
    // Si no hay texto, se muestran las categorías normales
    seccionCategorias.style.display = "block";
    return;
  }

  // Filtramos los productos que coincidan con lo escrito
  const encontrados = productos.filter(p => normalize(p.nombre).includes(query));

  // Si hay resultados, se ocultan las categorías y se muestran tarjetas
  seccionCategorias.style.display = "none";

  if (encontrados.length === 0) {
    contenedorResultados.innerHTML = `<p style="text-align:center;font-weight:bold;">No se encontraron resultados</p>`;
    return;
  }

  // Crear las tarjetas dinámicamente
  encontrados.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("item");
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <div class="item-info">
        <h2>${prod.nombre}</h2>
        <p>$${prod.precio.toLocaleString()}</p>
        <p style="font-size:14px;color:#a62929;">${prod.categoria}</p>
      </div>
    `;
    contenedorResultados.appendChild(card);
  });
});

/* =========================================================
   BUSCADOR.JS
   ---------------------------------------------------------
   Buscador global de productos y categorías
   usando Firebase
   ========================================================= */


/* =========================
   REFERENCIAS DEL DOM
   ========================= */

const buscador = document.getElementById("serchInput");
const contenedorResultados = document.getElementById("resultados");
let productosCache = [];

async function cargarProductos() {

  try {

    const snapshot =
      await db
        .collection("productos")
        .get();

    productosCache = [];

    snapshot.forEach((doc) => {

      productosCache.push({
        id: doc.id,
        ...doc.data()
      });

    });

  } catch (error) {

    console.error(
      "Error cargando productos:",
      error
    );

  }

}


/* =========================================================
   EVENTO PRINCIPAL DEL BUSCADOR
   ========================================================= */
  cargarProductos();

buscador.addEventListener("input", (e) => {

  /* Texto escrito */
  const texto = e.target.value
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .trim();

  /* Limpiar resultados anteriores */
  contenedorResultados.innerHTML = "";

  /* =====================================================
     SI EL CAMPO ESTÁ VACÍO
     ===================================================== */
  if (texto.length === 0) {

    contenedorResultados.innerHTML = "";

    return;
  }

  try {

    /* Variable para saber si encontró algo */
    let resultadosEncontrados = false;

    productosCache.forEach((producto) => {

      /* Validaciones básicas */
      if (!producto.nombre || !producto.categoria) return;

      /* Convertir a minúsculas */
      const nombre = producto.nombre
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

const categoria = producto.categoria
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

      /* =================================================
         BUSCAR POR:
         - nombre
         - categoría
         ================================================= */

      const coincide =
  nombre.startsWith(texto) ||
  categoria.startsWith(texto);

      if (coincide) {

        resultadosEncontrados = true;

        /* Crear tarjeta */
        const tarjeta = document.createElement("div");

        tarjeta.classList.add("item");

        tarjeta.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">

          <div class="item-info">
            <h2>${producto.nombre}</h2>
            <p>${producto.categoria}</p>
            <p>$${producto.precio}</p>
          </div>
        `;

        contenedorResultados.appendChild(tarjeta);
      }

    });

    /* =====================================================
       SI NO ENCUENTRA RESULTADOS
       ===================================================== */

    if (!resultadosEncontrados) {

      contenedorResultados.innerHTML = `
      
        <div class="sin-resultados">

          <h2>😢 Producto no encontrado</h2>

          <p>
            Lo sentimos, por ahora no manejamos
            ese producto o categoría.
          </p>

        </div>
      `;
    }

  } catch (error) {

    console.error("Error en búsqueda:", error);

  }

});
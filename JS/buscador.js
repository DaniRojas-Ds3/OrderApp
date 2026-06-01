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


/* =========================================================
   EVENTO PRINCIPAL DEL BUSCADOR
   ========================================================= */

buscador.addEventListener("input", async (e) => {

  /* Texto escrito */
  const texto = e.target.value.toLowerCase().trim();

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

    /* Obtener productos desde Firebase */
    const snapshot = await db.collection("productos").get();

    /* Variable para saber si encontró algo */
    let resultadosEncontrados = false;

    snapshot.forEach((doc) => {

      const producto = doc.data();

      /* Validaciones básicas */
      if (!producto.nombre || !producto.categoria) return;

      /* Convertir a minúsculas */
      const nombre = producto.nombre.toLowerCase();
      const categoria = producto.categoria.toLowerCase();

      /* =================================================
         BUSCAR POR:
         - nombre
         - categoría
         ================================================= */

      const coincide =
        nombre.includes(texto) ||
        categoria.includes(texto);

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
/* =========================================================
   BUSCADOR ADMIN
   ---------------------------------------------------------
   Responsabilidad:
   - Buscar productos
   - Mostrar resultados
   - Abrir editor de productos
========================================================= */

import { abrirEditorProducto }
from "./editarProducto.js";


/* =========================================================
   VARIABLES GLOBALES
========================================================= */

/*
  Evita agregar múltiples eventos
  al mismo botón.
*/
let eventosActivados = false;


/* =========================================================
   INICIALIZAR BUSCADOR
========================================================= */

export function initBuscadorAdmin() {

  /* ================= REFERENCIAS DOM ================= */

  const buscador =
    document.getElementById(
      "buscadorProductos"
    );

  const contenedor =
    document.getElementById(
      "listaProductosAdmin"
    );



  /* ================= VALIDAR ================= */

  if (!buscador || !contenedor) {
    return;
  }



  /*
    IMPORTANTE:
    --------------------------------------------------
    Clonar el input elimina TODOS los eventos previos.
    Esto evita duplicados cuando el módulo
    se inicializa varias veces.
  */

  const nuevoBuscador =
    buscador.cloneNode(true);

  buscador.parentNode.replaceChild(
    nuevoBuscador,
    buscador
  );



  /* =====================================================
     EVENTO PRINCIPAL DEL BUSCADOR
  ===================================================== */

  nuevoBuscador.addEventListener(
    "input",
    async (e) => {

      /* ================= TEXTO ================= */

      const texto =
        e.target.value
        .toLowerCase()
        .trim();



      /* ================= LIMPIAR RESULTADOS ================= */

      contenedor.innerHTML = "";



      /* ================= CAMPO VACÍO ================= */

      if (!texto) {
        return;
      }



      try {

        /* ================= OBTENER PRODUCTOS ================= */

        const snapshot =
          await db
            .collection("productos")
            .get();



        let resultadosEncontrados = false;



        /* =====================================================
           RECORRER PRODUCTOS
        ===================================================== */
        const productosMostrados = new Set();
snapshot.forEach((doc) => {

  const producto = doc.data();

  /* ================= VALIDACIONES ================= */

  if (
    !producto.nombre ||
    !producto.categoria
  ) {
    return;
  }

  /* ================= NORMALIZAR TEXTO ================= */

  const nombre =
    producto.nombre.toLowerCase().trim();

  const categoria =
    producto.categoria.toLowerCase().trim();

  /* =====================================================
     EVITAR DUPLICADOS
  ===================================================== */

  if (productosMostrados.has(nombre)) {
    return;
  }

  /* ================= COINCIDENCIA ================= */

  const coincide =
    nombre.includes(texto) ||
    categoria.includes(texto);

  /* ================= SI COINCIDE ================= */

  if (coincide) {

    productosMostrados.add(nombre);

    resultadosEncontrados = true;

    /* ================= CREAR FILA ================= */

    const fila =
      document.createElement("tr");

    fila.classList.add(
      "fila-producto"
    );

    fila.innerHTML = `
      <td>
        <strong>
          ${producto.nombre}
        </strong>
        <br>
        ${producto.categoria}
      </td>

      <td>
        $${producto.precio}
      </td>

      <td>

        <button
          class="btn btn-primary btn-editar"
          data-id="${doc.id}"
        >
          ✏️ Editar
        </button>

      </td>
    `;

    /* ================= AGREGAR FILA ================= */

    contenedor.appendChild(fila);

  }

});



        /* =====================================================
           SIN RESULTADOS
        ===================================================== */

        if (!resultadosEncontrados) {

          contenedor.innerHTML = `

            <tr>

              <td colspan="3">

                <div class="sin-resultados">

                  <h3>
                    😢 Producto no encontrado
                  </h3>

                  <p>
                    No encontramos productos
                    o categorías relacionadas.
                  </p>

                </div>

              </td>

            </tr>

          `;

        }



        /* ================= ACTIVAR BOTONES ================= */

        activarBotonesEditar();

      } catch (error) {

        console.error(
          "Error en búsqueda:",
          error
        );

      }

    }
  );

}


/* =========================================================
   ACTIVAR BOTONES EDITAR
========================================================= */

function activarBotonesEditar() {

  /*
    IMPORTANTE:
    --------------------------------------------------
    Evita agregar múltiples eventos
    a los mismos botones.
  */

  if (eventosActivados) {
    return;
  }

  eventosActivados = true;



  /*
    Event Delegation:
    --------------------------------------------------
    Se usa un único evento global
    en vez de agregar uno por botón.
  */

  document.addEventListener(
    "click",
    (e) => {

      const boton =
        e.target.closest(".btn-editar");



      /* ================= VALIDAR BOTÓN ================= */

      if (!boton) {
        return;
      }



      /* ================= OBTENER ID ================= */

      const id =
        boton.dataset.id;



      /* ================= ABRIR EDITOR ================= */

      abrirEditorProducto(id);

    }
  );

}
/* =========================================================
   MODALES.JS
   ---------------------------------------------------------
   Maneja:
   - modal carrito
   - modal mensajes
   - modales reutilizables
   ========================================================= */

/* =========================================================
   IMPORTACIONES
   ========================================================= */

import {
  abrirFormulario
  } from "./formulario.js";

import {
  mostrarAlerta
} from "./alerts.js";


/* =========================================================
   REFERENCIAS DOM
   ========================================================= */

const contenedorModales =
  document.getElementById("contenedorModales");


/* =========================================================
   CREAR MODAL CARRITO
   ========================================================= */

export function crearModalCarrito(
  carrito,
  actualizarCarrito,
  aumentarCantidad,
  disminuirCantidad,
  eliminarProducto
) {

  /* =====================================================
     ELIMINAR MODAL ANTERIOR
     ===================================================== */

  const modalExistente =
    document.getElementById("modalCarrito");

  if (modalExistente) {

    modalExistente.remove();

  }


  /* =====================================================
     CREAR MODAL
     ===================================================== */

  const modal = document.createElement("div");

  modal.className = "modal";

  modal.id = "modalCarrito";


  /* =====================================================
     CALCULAR TOTAL
     ===================================================== */

  let total = 0;

  carrito.forEach(item => {

    total += item.precio * item.cantidad;

  });


  /* =====================================================
     HTML MODAL
     ===================================================== */

  modal.innerHTML = `

    <div class="modal-content">

      <span class="close" id="cerrarModal">
        &times;
      </span>

      <h2>
        Mi carrito
      </h2>

      <div id="listaCarrito">

        ${
          carrito.length === 0
            ? "<p>Tu carrito está vacío</p>"
            : carrito.map((item, index) => `

              <div class="item-carrito">

                <span>
                  ${item.nombre}
                </span>

                <div class="acciones-carrito">

                  <button
                    class="menos"
                    data-index="${index}"
                  >
                    −
                  </button>

                  <span>
                    ${item.cantidad}
                  </span>

                  <button
                    class="mas"
                    data-index="${index}"
                  >
                    +
                  </button>

                  <button
                    class="eliminar"
                    data-index="${index}"
                  >
                    ❌
                  </button>

                </div>

              </div>

            `).join("")
        }

      </div>

      <h3>
        Total:
        $ ${total.toLocaleString("es-CO")}
      </h3>

      <button
         class="confirmacion"
         id="btnConfirmarReserva"
      >
         Confirmar reserva
      </button>

    </div>

  `;


  /* =====================================================
     INSERTAR MODAL
     ===================================================== */

  contenedorModales.appendChild(modal);


  /* =====================================================
     MOSTRAR MODAL
     ===================================================== */

  modal.style.display = "flex";


  /* =====================================================
     CERRAR MODAL
     ===================================================== */

  modal
    .querySelector("#cerrarModal")
    .addEventListener("click", () => {

      modal.remove();

    });


  /* =====================================================
     CERRAR CLICK EXTERNO
     ===================================================== */

  modal.addEventListener("click", e => {

    if (e.target === modal) {

      modal.remove();

    }

  });


  /* =====================================================
     BOTONES +
     ===================================================== */

  modal
    .querySelectorAll(".mas")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        aumentarCantidad(
          btn.dataset.index
        );

      });

    });


  /* =====================================================
     BOTONES -
     ===================================================== */

  modal
    .querySelectorAll(".menos")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        disminuirCantidad(
          btn.dataset.index
        );

      });

    });


  /* =====================================================
     BOTONES ELIMINAR
     ===================================================== */

  modal
    .querySelectorAll(".eliminar")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        eliminarProducto(
          btn.dataset.index
        );

      });

    });

/* =====================================================
   BOTÓN CONFIRMAR RESERVA
   ===================================================== */

const btnConfirmar =
  modal.querySelector(
    "#btnConfirmarReserva"
  );

/* =====================================================
   VALIDAR CARRITO Y ABRIR FORMULARIO
   ===================================================== */

btnConfirmar.addEventListener(
  "click",
  () => {

    /* ===============================================
       VALIDAR PRODUCTOS
       =============================================== */

    if (carrito.length === 0) {

      mostrarAlerta(
        "El carrito está vacío"
      );

      return;

    }


    /* ===============================================
       ABRIR FORMULARIO
       =============================================== */

    modal.remove(); // 
    abrirFormulario();

  }
);


}

/* =========================================================
   MODAL TICKET / FACTURA
   ========================================================= */

export function mostrarTicket(
  nombre,
  carrito,
  total
) {

  /* =====================================================
     ELIMINAR SI YA EXISTE
     ===================================================== */

  const existente =
    document.getElementById("modalTicket");

  if (existente) existente.remove();

  /* =====================================================
     CREAR MODAL
     ===================================================== */

  const modal = document.createElement("div");

  modal.className = "modal";
  modal.id = "modalTicket";

  /* =====================================================
     GENERAR LISTA PRODUCTOS
     ===================================================== */

  const listaProductos = carrito.map(item => `
    <div class="ticket-item">
      <span>${item.nombre}</span>
      <span>x${item.cantidad}</span>
      <span>$${(item.precio * item.cantidad).toLocaleString("es-CO")}</span>
    </div>
  `).join("");

  /* =====================================================
     FECHA
     ===================================================== */

  const fecha = new Date().toLocaleString("es-CO");

  /* =====================================================
     HTML
     ===================================================== */

  modal.innerHTML = `
    <div class="modal-content ticket">

      <span class="close" id="cerrarTicket">
        &times;
      </span>

      <h2>🧾 Comprobante</h2>

      <p><strong>Cliente:</strong> ${nombre}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>

      <hr>

      <div class="ticket-lista">
        ${listaProductos}
      </div>

      <hr>

      <h3>Total: $${total.toLocaleString("es-CO")}</h3>

      <p class="mensaje-ticket">
        📸 Toma captura de este comprobante
      </p>

    </div>
  `;

  document.body.appendChild(modal);

  modal.style.display = "flex";

  /* =====================================================
     CERRAR SOLO CON X
     ===================================================== */

  modal
    .querySelector("#cerrarTicket")
    .addEventListener("click", () => {

      modal.remove();

    });

}
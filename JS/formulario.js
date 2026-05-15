/* =========================================================
   FORMULARIO.JS
   ---------------------------------------------------------
   Maneja:
   - formulario de reservas
   - validaciones
   - envío a Firebase
   - control de modal
   - generación de ticket
   ========================================================= */


/* =========================================================
   IMPORTACIONES
   ========================================================= */

import {
  mostrarAlerta
} from "./alerts.js";

import {
  obtenerCarrito,
  limpiarCarrito
} from "./carrito.js";

import {
  reservasActivas
} from "./contador.js";

import {
  mostrarTicket
} from "./modales.js";

import {
  db,
  firebase
} from "./firebase.js";


/* =========================================================
   ABRIR FORMULARIO
   ========================================================= */

export function abrirFormulario() {

  /* =====================================================
     VALIDAR SI EL MODAL YA EXISTE
     ===================================================== */

  const modalExistente =
    document.getElementById(
      "modalFormulario"
    );

  if (modalExistente) {

    return;

  }


  /* =====================================================
     CREAR MODAL
     ===================================================== */

  const modal =
    document.createElement("div");

  modal.className = "modal";

  modal.id = "modalFormulario";


  /* =====================================================
     HTML DEL FORMULARIO
     ===================================================== */

  modal.innerHTML = `

    <div class="modal-content">

      <span
        class="close"
        id="cerrarFormulario"
      >
        &times;
      </span>

      <h2>
        Confirmar reserva
      </h2>

      <form id="formularioReserva">

        <label>
          Nombre:
        </label>

        <input
          type="text"
          id="nombreReserva"
        >

        <label>
          Tipo de persona:
        </label>

        <select id="tipoPersona">

          <option value="">
            Seleccione...
          </option>

          <option value="Aprendiz">
            Aprendiz
          </option>

          <option value="Equipo SENA">
            Equipo SENA
          </option>

        </select>

        <div id="contenedorJornada">

          <label>
            Jornada:
          </label>

          <select id="jornada">

            <option value="">
              Seleccione...
            </option>

            <option value="Mañana">
              Mañana
            </option>

            <option value="Tarde">
              Tarde
            </option>

            <option value="Noche">
              Noche
            </option>

          </select>

        </div>

        <button
          type="submit"
          class="confirmacion"
        >

          Confirmar

        </button>

      </form>

    </div>

  `;


  /* =====================================================
     INSERTAR MODAL
     ===================================================== */

  document.body.appendChild(modal);

  modal.style.display = "flex";


  /* =====================================================
     VERIFICAR TIEMPO DE RESERVAS
     ===================================================== */

  const verificadorTiempo =
    setInterval(() => {

      if (!reservasActivas) {

        clearInterval(
          verificadorTiempo
        );

        modal.remove();

        const modalCarrito =
          document.getElementById(
            "modalCarrito"
          );

        if (modalCarrito) {

          modalCarrito.remove();

        }

        mostrarAlerta(
          "El tiempo de reservas terminó",
          "error"
        );

      }

    }, 1000);


  /* =====================================================
     REFERENCIAS DEL MODAL
     ===================================================== */

  const cerrar =
    modal.querySelector(
      "#cerrarFormulario"
    );

  const tipoPersona =
    modal.querySelector(
      "#tipoPersona"
    );

  const contenedorJornada =
    modal.querySelector(
      "#contenedorJornada"
    );

  const formulario =
    modal.querySelector(
      "#formularioReserva"
    );


  /* =====================================================
     OCULTAR JORNADA INICIALMENTE
     ===================================================== */

  contenedorJornada.style.display =
    "none";


  /* =====================================================
     MOSTRAR JORNADA SEGÚN TIPO
     ===================================================== */

  tipoPersona.addEventListener(
    "change",
    () => {

      if (
        tipoPersona.value ===
        "Aprendiz"
      ) {

        contenedorJornada.style.display =
          "block";

      } else {

        contenedorJornada.style.display =
          "none";

      }

    }
  );


  /* =====================================================
     CERRAR MODAL CON X
     ===================================================== */

  cerrar.addEventListener(
    "click",
    () => {

      clearInterval(
        verificadorTiempo
      );

      modal.remove();

    }
  );


  /* =====================================================
     CERRAR MODAL CON CLICK EXTERNO
     ===================================================== */

  modal.addEventListener(
    "click",
    e => {

      if (e.target === modal) {

        clearInterval(
          verificadorTiempo
        );

        modal.remove();

      }

    }
  );


  /* =====================================================
     SUBMIT FORMULARIO
     ===================================================== */

  formulario.addEventListener(
    "submit",
    async e => {

      e.preventDefault();


      /* =================================================
         OBTENER DATOS
         ================================================= */

      const nombre =
        document
          .getElementById(
            "nombreReserva"
          )
          .value
          .trim();

      const tipo =
        tipoPersona.value;

      const jornada =
        document
          .getElementById(
            "jornada"
          )
          .value;


      /* =================================================
         VALIDAR NOMBRE
         ================================================= */

      if (!nombre) {

        mostrarAlerta(
          "Ingrese un nombre"
        );

        return;

      }


      /* =================================================
         VALIDAR TIPO
         ================================================= */

      if (!tipo) {

        mostrarAlerta(
          "Seleccione un tipo"
        );

        return;

      }


      /* =================================================
         VALIDAR JORNADA
         ================================================= */

      if (
        tipo === "Aprendiz" &&
        !jornada
      ) {

        mostrarAlerta(
          "Seleccione jornada"
        );

        return;

      }


      /* =================================================
         OBTENER CARRITO
         ================================================= */

      const carrito =
        obtenerCarrito();


      /* =================================================
         VALIDAR CARRITO
         ================================================= */

      if (carrito.length === 0) {

        mostrarAlerta(
          "El carrito está vacío"
        );

        return;

      }


      /* =================================================
         FECHA ACTUAL
         ================================================= */

      const ahora = new Date();

const fecha =
  `${ahora.getDate()}/${
    ahora.getMonth() + 1
  }/${ahora.getFullYear()}`;


      /* =================================================
         GUARDAR RESERVAS
         ================================================= */
console.log(
  "TIPO COLLECTION:",
  typeof db.collection
);

try {

for (const producto of carrito) {

  console.log("ENVIANDO:", producto);

await db
.collection("reservas")
.add({

  producto:
    producto.nombre || "SIN NOMBRE",

  cantidad:
    producto.cantidad || 1,

  usuario:
    nombre.toUpperCase(),

  tipoPersona:
    tipo,

  jornada:
    tipo === "Aprendiz"
      ? jornada
      : "Jornada Externa",

  fecha,

  fechaCreacion:
    new Date()

});

}

  let total = 0;

  carrito.forEach(item => {

    total +=
      item.precio *
      item.cantidad;

  });

  mostrarTicket(
    nombre,
    carrito,
    total
  );

  limpiarCarrito();

  clearInterval(
    verificadorTiempo
  );

  modal.remove();

  const modalCarrito =
    document.getElementById(
      "modalCarrito"
    );

  if (modalCarrito) {

    modalCarrito.remove();

  }

} catch (error) {

  console.error(
    "ERROR FIREBASE:",
    error
  );

  mostrarAlerta(
    "Error enviando reserva",
    "error"
  );

}

  } // cierre async e =>

); // cierre addEventListener

} // cierre abrirFormulario
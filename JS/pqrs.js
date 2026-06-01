/* =========================================================
   PQRS.JS
   ---------------------------------------------------------
   Maneja:
   - envío PQRS
   - validaciones
   - Firebase
   ========================================================= */


/* =========================================================
   IMPORTACIONES
   ========================================================= */

import {
  mostrarAlerta
}
from "./alerts.js";


/* =========================================================
   ESPERAR DOM
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    iniciarPQRS();

    const contadorCaracteres =
      document.getElementById(
        "contadorCaracteres"
    );

  }
);


/* =========================================================
   INICIAR PQRS
   ========================================================= */

function iniciarPQRS() {

  const mensajeInput =
    document.getElementById(
      "mensaje"
    );

  const btnEnviar =
    document.getElementById(
      "btnEnviar"
    );


  /* =====================================================
     VALIDAR ELEMENTOS
     ===================================================== */

  if (!mensajeInput || !btnEnviar) {

    console.error(
      "Elementos PQRS no encontrados"
    );

    return;

  }


  /* =====================================================
     EVENTO BOTÓN
     ===================================================== */

  btnEnviar.addEventListener(
    "click",
    async () => {

      const mensaje =
        mensajeInput.value.trim();


      /* ===============================================
         VALIDAR MENSAJE
         =============================================== */

      if (!mensaje) {

        mostrarAlerta(
          "Escribe un mensaje"
        );

        return;

      }


      /* ===============================================
         GUARDAR EN FIREBASE
         =============================================== */

      try {

        await window.db.collection(
  "pqrs"
).add({

          mensaje,

          fecha:
            new Date().toLocaleString(
              "es-CO"
            )

        });


        /* ===========================================
           ALERTA ÉXITO
           =========================================== */

        mostrarAlerta(
          "Mensaje enviado correctamente", "exito",
          "success"
        );


        /* ===========================================
           LIMPIAR CAMPO
           =========================================== */

        mensajeInput.value = "";


      } catch (error) {

        console.error(error);

        mostrarAlerta(
          "Error enviando mensaje",
          "error"
        );

      }


    }

  );
  mensajeInput.addEventListener(
  "input",
  () => {

    const cantidad =
      mensajeInput.value.length;


    contadorCaracteres.textContent =
      `${cantidad} / 300 caracteres`;


    /* =========================================
       ALERTA LÍMITE
       ========================================= */

    if (cantidad >= 300) {

      mostrarAlerta(
        "Máximo 300 caracteres"
      );

    }

  }
);

}
/* =========================================================
   BREAK.JS
   ---------------------------------------------------------
   Maneja:
   - Recesos
   - Temporizadores
   - Firebase
   - Validaciones
   ========================================================= */


/* =========================================================
   IMPORTACIONES
   ========================================================= */


import {
  mostrarAlerta
}
from "./alerts.js";


/* =========================================================
   REFERENCIAS DOM
   ========================================================= */

const tokenInput =
  document.getElementById(
    "tokenInput"
  );

const startButton =
  document.getElementById(
    "startButton"
  );

const activeCount =
  document.getElementById(
    "activeCount"
  );

const container =
  document.getElementById(
    "activeTimersContainer"
  );


/* =========================================================
   VARIABLES GLOBALES
   ========================================================= */

let configuracion = null;

let temporizadores = [];

let procesando = false;


/* =========================================================
   EVENTOS
   ========================================================= */

startButton.addEventListener(
  "click",
  iniciarTemporizador
);


/* =========================================================
   VALIDACIÓN INPUT EN TIEMPO REAL
   ========================================================= */

tokenInput.addEventListener(
  "input",
  (event) => {

    /* =====================================================
       ELIMINAR ESPACIOS
       ===================================================== */

    if (
      /\s/.test(tokenInput.value)
    ) {

      mostrarAlerta(
        "No se permiten espacios"
      );

      tokenInput.value =
        tokenInput.value.replace(/\s/g, "");

    }


    /* =====================================================
       SOLO NÚMEROS
       ===================================================== */

    if (
      /[^0-9]/.test(tokenInput.value)
    ) {

      mostrarAlerta(
        "Solo se permiten números"
      );

      tokenInput.value =
        tokenInput.value.replace(/[^0-9]/g, "");

    }


    /* =====================================================
       LÍMITE DE CARACTERES
       ===================================================== */

    if (
      tokenInput.value.length >= 8 &&
      event.inputType === "insertText"
    ) {

      mostrarAlerta(
        "Máximo 8 caracteres permitidos"
      );

    }


    /* =====================================================
       RECORTAR A 8
       ===================================================== */

    if (
      tokenInput.value.length > 8
    ) {

      tokenInput.value =
        tokenInput.value.slice(0, 8);

    }

  }
);


/* =========================================================
   CARGAR CONFIGURACIÓN
   ========================================================= */

async function cargarConfiguracion() {

  try {

    const doc =
      await db.collection(
        "configuracion"
      ).doc(
        "configuracionHorarios"
      ).get();


    if (!doc.exists) {

      mostrarAlerta(
        "No existe configuración"
      );

      return;

    }

    configuracion =
      doc.data();

  } catch (error) {

    console.error(error);

  }

}


/* =========================================================
   INICIAR TEMPORIZADOR
   ========================================================= */

async function iniciarTemporizador() {

  /* =======================================================
     EVITAR DOBLE ENVÍO
     ======================================================= */

  if (procesando) return;

  procesando = true;

  startButton.disabled = true;


  try {

    /* =====================================================
       OBTENER FICHA
       ===================================================== */

    const ficha =
      tokenInput.value;


    /* =====================================================
       VALIDAR VACÍO
       ===================================================== */

    if (!ficha) {

      mostrarAlerta(
        "Ingrese una ficha"
      );

      return;

    }


    /* =====================================================
       VALIDAR SOLO NÚMEROS
       ===================================================== */

    const soloNumeros =
      /^\d+$/;

    if (
      !soloNumeros.test(ficha)
    ) {

      mostrarAlerta(
        "La ficha debe contener solo números"
      );

      return;

    }


    /* =====================================================
       VALIDAR FICHA REPETIDA
       ===================================================== */

    const fichaExistente =
      await db.collection(
        "break"
      )
      .where(
        "activo",
        "==",
        true
      )
      .where(
        "ficha",
        "==",
        ficha
      )
      .get();


    if (!fichaExistente.empty) {

      mostrarAlerta(
        "Tu ficha ya está en break"
      );

      return;

    }


    /* =====================================================
       VALIDAR LÍMITE
       ===================================================== */

    const snapshot =
      await db.collection(
        "break"
      )
      .where(
        "activo",
        "==",
        true
      )
      .get();


    const totalActivos =
      snapshot.size;


    if (
      totalActivos >=
      Number(
        configuracion.maxTemporizadores
      )
    ) {

      mostrarAlerta(
        "Máximo de recesos alcanzado"
      );

      return;

    }


    /* =====================================================
       CALCULAR TIEMPOS
       ===================================================== */

    const inicio =
      Date.now();

    const fin =
      inicio +
      (
        configuracion.duracionReceso
        * 60
        * 1000
      );


    /* =====================================================
       GUARDAR EN FIREBASE
       ===================================================== */

    await db.collection(
      "break"
    ).add({

      ficha,

      inicio,

      fin,

      activo: true

    });


    /* =====================================================
       ALERTA ÉXITO
       ===================================================== */

    mostrarAlerta(
      "Receso iniciado",
      "exito"
    );


    tokenInput.value = "";

    cargarTemporizadores();

  } catch (error) {

    console.error(error);

    mostrarAlerta(
      "Error iniciando receso"
    );

  } finally {

    procesando = false;

    startButton.disabled = false;

  }

}


/* =========================================================
   CARGAR TEMPORIZADORES
   ========================================================= */

async function cargarTemporizadores() {

  const snapshot =
    await db.collection(
      "break"
    )
    .where(
      "activo",
      "==",
      true
    )
    .get();


  temporizadores = [];


  snapshot.forEach(doc => {

    temporizadores.push({

      id: doc.id,

      ...doc.data()

    });

  });


  renderizarTemporizadores();

}


/* =========================================================
   FORMATEAR TIEMPO
   ========================================================= */

function formatearTiempo(ms) {

  const segundos =
    Math.max(
      0,
      Math.floor(ms / 1000)
    );

  const minutos =
    Math.floor(
      segundos / 60
    );

  const restante =
    segundos % 60;


  return `
    ${String(minutos).padStart(2,"0")}
    :
    ${String(restante).padStart(2,"0")}
  `;

}


/* =========================================================
   COLOR DEL TEMPORIZADOR
   ========================================================= */

function obtenerColor(ms) {

  const minutos =
    ms / 60000;


  if (minutos > 20)
    return "timer-green";

  if (minutos > 10)
    return "timer-yellow";

  if (minutos > 5)
    return "timer-orange";

  return "timer-red";

}


/* =========================================================
   RENDERIZAR TEMPORIZADORES
   ========================================================= */

function renderizarTemporizadores() {

  container.innerHTML = "";


  temporizadores.forEach(timer => {

    const restante =
      timer.fin - Date.now();


    /* =====================================================
       FINALIZAR AUTOMÁTICAMENTE
       ===================================================== */

    if (restante <= 0) {

      finalizarTemporizador(
        timer.id
      );

      return;

    }


    const card =
      document.createElement("div");


    card.className = `
      timer-card
      ${obtenerColor(restante)}
    `;


    card.innerHTML = `
      <div class="timer-token">
        ${timer.ficha}
      </div>

      <div class="timer-time">
        ${formatearTiempo(restante)}
      </div>
    `;


    container.appendChild(card);

  });


  activeCount.innerHTML = `
    Temporizadores Activos
    (
      ${temporizadores.length}
      /
      ${configuracion?.maxTemporizadores ?? 0}
    )
  `;

}


/* =========================================================
   FINALIZAR TEMPORIZADOR
   ========================================================= */

async function finalizarTemporizador(id) {

  await db.collection(
    "break"
  )
  .doc(id)
  .update({

    activo: false

  });


  cargarTemporizadores();

}


/* =========================================================
   INTERVALO
   ========================================================= */

setInterval(() => {

  renderizarTemporizadores();

}, 1000);


/* =========================================================
   INICIAR SISTEMA
   ========================================================= */

async function iniciarSistema() {

  await cargarConfiguracion();

  await cargarTemporizadores();

}


iniciarSistema();
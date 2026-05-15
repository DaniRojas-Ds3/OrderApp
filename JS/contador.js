/* =========================================================
   CONTADOR.JS
   ---------------------------------------------------------
   Controla:
   - horarios dinámicos desde Firebase
   - contador visual
   - habilitar/deshabilitar reservas
   - zona horaria Bogotá
   ========================================================= */

/* =========================================================
   IMPORTACIONES
   ========================================================= */
import {
  mostrarAlerta
} from "./alerts.js";


/* =========================================================
   VARIABLES GLOBALES
   ========================================================= */

export let reservasActivas = true;

const contadorNodo = document.getElementById("contador");

let tiempoRestante = 0;

let configuracion = null;
let alertaMostrada = false;


/* =========================================================
   OBTENER HORA BOGOTÁ
   ========================================================= */

function obtenerHoraBogota() {

  const ahora = new Date();

  return new Date(
    ahora.toLocaleString(
      "en-US",
      { timeZone: "America/Bogota" }
    )
  );
}


/* =========================================================
   CARGAR CONFIGURACIÓN DESDE FIREBASE
   ========================================================= */

async function cargarConfiguracion() {

  try {

    const snapshot = await db
        .collection("configuracion")
        .doc("reservas")
         .get();

    if (!snapshot.exists) {

      console.error("No existe configuración reservas");

      return null;
    }

    return snapshot.data();

  } catch (error) {

    console.error("Error cargando configuración:", error);

    return null;
  }
}


/* =========================================================
   VALIDAR HORARIO
   ========================================================= */

function estaDentroHorario() {

  if (!configuracion) return false;

  if (!configuracion.reservasActivas) return false;

  const ahora = obtenerHoraBogota();

  const apertura = new Date(ahora);

  apertura.setHours(
    configuracion.horaApertura,
    configuracion.minutoApertura,
    0,
    0
  );

  const cierre = new Date(ahora);

  cierre.setHours(
    configuracion.horaCierre,
    configuracion.minutoCierre,
    0,
    0
  );

  return ahora >= apertura && ahora < cierre;
}


/* =========================================================
   CALCULAR TIEMPO RESTANTE
   ========================================================= */

function calcularTiempoRestante() {

  if (!configuracion) return 0;

  const ahora = obtenerHoraBogota();

  const cierre = new Date(ahora);

  cierre.setHours(
    configuracion.horaCierre,
    configuracion.minutoCierre,
    0,
    0
  );

  return Math.max(
    0,
    Math.floor((cierre - ahora) / 1000)
  );
}


/* =========================================================
   ACTUALIZAR INTERFAZ
   ========================================================= */

function actualizarContador() {

  const botones = document.querySelectorAll(
    ".btn-agregar, #carritoBtn"
  );

  if (estaDentroHorario()) {

    /* =========================================
       RESERVAS ACTIVAS
       ========================================= */

    reservasActivas = true;

    const horas = Math.floor(tiempoRestante / 3600);

    const minutos = Math.floor(
      (tiempoRestante % 3600) / 60
    );

    const segundos = tiempoRestante % 60;

    contadorNodo.innerHTML = `
      ⏳ Reservas disponibles:
      ${horas}h ${minutos}m ${segundos}s
    `;

    botones.forEach(btn => {

      btn.disabled = false;

    });

 } else {

  /* =========================================
     RESERVAS DESACTIVADAS
     ========================================= */

  reservasActivas = false;


  /* =========================================
     CERRAR MODALES ABIERTOS
     ========================================= */

  const modalCarrito =
    document.getElementById(
      "modalCarrito"
    );

  if (modalCarrito) {

    modalCarrito.remove();

  }


  const modalFormulario =
    document.getElementById(
      "modalFormulario"
    );

  if (modalFormulario) {

    modalFormulario.remove();

  }


  /* =========================================
     MOSTRAR ALERTA SOLO UNA VEZ
     ========================================= */

  if (!alertaMostrada) {

    mostrarAlerta(
      "El tiempo de reservas finalizó"
    );

    alertaMostrada = true;

  }


  contadorNodo.innerHTML = `
    ⛔ Reservas no disponibles
  `;

  botones.forEach(btn => {

    btn.disabled = true;

  });

}}

/* =========================================================
   INICIAR CONTADOR
   ========================================================= */

export async function iniciarContador() {

  configuracion = await cargarConfiguracion();

  if (!configuracion) return;

  tiempoRestante = calcularTiempoRestante();

  actualizarContador();

  setInterval(() => {

    if (estaDentroHorario() && tiempoRestante > 0) {

      tiempoRestante--;
    }

    actualizarContador();

  }, 1000);
}
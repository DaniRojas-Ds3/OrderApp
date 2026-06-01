/* =========================================================
   CONFIGURACIÓN RESERVAS ADMIN
   ---------------------------------------------------------
   Responsabilidad:
   - Actualizar horarios reservas
========================================================= */

import { db }
from "./firebase.js";

import {
  mostrarAlerta
}
from "./alerts.js";


/* =========================================================
   INICIALIZAR CONFIGURACIÓN
========================================================= */

export function initConfigReservasAdmin() {

  const btnGuardar =
    document.getElementById(
      "btnGuardarConfigReservas"
    );

  btnGuardar?.addEventListener(
    "click",
    guardarConfiguracionReservas
  );

}


/* =========================================================
   GUARDAR CONFIGURACIÓN
========================================================= */

async function guardarConfiguracionReservas() {

  const inputInicio =
    document.getElementById(
      "horaInicioReservas"
    );

  const inputCierre =
    document.getElementById(
      "horaCierreReservas"
    );


  const horaInicio =
    inputInicio.value;

  const horaCierre =
    inputCierre.value;


  /* ================= VALIDAR ================= */

  if (
    !horaInicio ||
    !horaCierre
  ) {

    mostrarAlerta(
      "Completa todos los horarios",
      "error"
    );

    return;

  }


  try {

    /* =====================================================
       SEPARAR HORAS Y MINUTOS
    ===================================================== */

    const [
      horaApertura,
      minutoApertura
    ] = horaInicio.split(":");


    const [
      horaCierreNum,
      minutoCierre
    ] = horaCierre.split(":");


    /* =====================================================
       ACTUALIZAR FIREBASE
    ===================================================== */

    await db
      .collection("configuracion")
      .doc("reservas")
      .update({

        horaApertura:
          Number(horaApertura),

        minutoApertura:
          Number(minutoApertura),

        horaCierre:
          Number(horaCierreNum),

        minutoCierre:
          Number(minutoCierre)

      });


    /* =====================================================
       LIMPIAR INPUTS
    ===================================================== */

    inputInicio.value = "";
    inputCierre.value = "";


    /* =====================================================
       ALERTA
    ===================================================== */

    mostrarAlerta(
      "Configuración guardada correctamente",
      "exito"
    );

  } catch (error) {

    console.error(
      "Error configuración reservas:",
      error
    );

    mostrarAlerta(
      "Error al guardar configuración",
      "error"
    );

  }

}
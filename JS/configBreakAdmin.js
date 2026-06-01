/* =========================================================
   CONFIGURACIÓN BREAK ADMIN
   ---------------------------------------------------------
   Responsabilidad:
   - Actualizar configuración break
========================================================= */

import { db }
from "./firebase.js";

import {
  mostrarAlerta
}
from "./alerts.js";

import {
  validarSoloNumeros,
  bloquearTeclasNumero,
  validarMaximo60,
  validarMaximo9
}
from "./validaciones.js";


/* =========================================================
   INICIALIZAR CONFIGURACIÓN BREAK
========================================================= */

export function initConfigBreakAdmin() {

  const btnGuardar =
    document.getElementById(
      "btnGuardarConfigBreak"
    );

  const inputDuracion =
    document.getElementById(
      "duracionReceso"
    );

  const inputFichas =
    document.getElementById(
      "maxTemporizadores"
    );


  /* =====================================================
     VALIDACIONES INPUTS
  ===================================================== */

  bloquearTeclasNumero(
    inputDuracion
  );

  bloquearTeclasNumero(
    inputFichas
  );


  validarSoloNumeros(
    inputDuracion
  );

  validarSoloNumeros(
    inputFichas
  );


  validarMaximo60(
    inputDuracion
  );

  validarMaximo9(
    inputFichas
  );


  /* =====================================================
     GUARDAR CONFIGURACIÓN
  ===================================================== */

  btnGuardar?.addEventListener(
    "click",
    guardarConfiguracionBreak
  );

}


/* =========================================================
   GUARDAR CONFIGURACIÓN BREAK
========================================================= */

async function guardarConfiguracionBreak() {

  const inputDuracion =
    document.getElementById(
      "duracionReceso"
    );

  const inputFichas =
    document.getElementById(
      "maxTemporizadores"
    );


  const duracionReceso =
    Number(inputDuracion.value);

  const maxTemporizadores =
    Number(inputFichas.value);


  /* =====================================================
     VALIDAR CAMPOS VACÍOS
  ===================================================== */

  if (
    inputDuracion.value.trim() === "" ||
    inputFichas.value.trim() === ""
  ) {

    mostrarAlerta(
      "Completa todos los campos",
      "error"
    );

    return;

  }


  /* =====================================================
     VALIDAR MAYOR A 0
  ===================================================== */

  if (
    duracionReceso <= 0 ||
    maxTemporizadores <= 0
  ) {

    mostrarAlerta(
      "Los valores deben ser mayores a 0",
      "error"
    );

    return;

  }


  try {

    /* =====================================================
       ACTUALIZAR FIREBASE
    ===================================================== */

    await db
      .collection("configuracion")
      .doc("configuracionHorarios")
      .update({

        duracionReceso,
        maxTemporizadores

      });


    /* =====================================================
       LIMPIAR INPUTS
    ===================================================== */

    inputDuracion.value = "";

    inputFichas.value = "";


    /* =====================================================
       ALERTA ÉXITO
    ===================================================== */

    mostrarAlerta(
      "Configuración break guardada",
      "exito"
    );

  } catch (error) {

    console.error(
      "Error configuración break:",
      error
    );

    mostrarAlerta(
      "Error al guardar configuración",
      "error"
    );

  }

}
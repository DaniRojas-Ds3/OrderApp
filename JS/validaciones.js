/* =========================================================
   ALERTAS
========================================================= */

import { mostrarAlerta } from "./alerts.js";

/* =========================================================
   VALIDAR SOLO LETRAS Y ESPACIOS
========================================================= */

export function validarSoloTexto(input) {

  input.addEventListener("input", (e) => {

    let valor = e.target.value;

    const limpio = valor.replace(
      /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
      ""
    );

    if (valor !== limpio) {

      e.target.value = limpio;

      mostrarAlerta(
        "❌ No se permiten números ni caracteres especiales"
      );

    }

  });

}

/* =========================================================
   VALIDAR SOLO NÚMEROS
========================================================= */

export function validarSoloNumeros(input) {

  input.addEventListener("input", (e) => {

    let valor = e.target.value;

    const limpio = valor.replace(/\D/g, "");

    if (valor !== limpio) {

      e.target.value = limpio;

      mostrarAlerta(
        "❌ Solo se permiten números"
      );

    }



    /* ================= NO PERMITIR 0 ================= */

    if (limpio === "0") {

      e.target.value = "";

      mostrarAlerta(
        "❌ El Numero debe ser mayor a 0"
      );

    }

  });

}

/* =========================================================
   BLOQUEAR TECLAS INVÁLIDAS
========================================================= */

export function bloquearTeclasNumero(input) {

  input.addEventListener("keydown", (e) => {

    const teclasPermitidas = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab"
    ];



    /* ================= PERMITIR NÚMEROS ================= */

    if (/^[0-9]$/.test(e.key)) {
      return;
    }



    /* ================= TECLAS ESPECIALES ================= */

    if (teclasPermitidas.includes(e.key)) {
      return;
    }



    /* ================= BLOQUEAR ================= */

    e.preventDefault();

    mostrarAlerta(
      "❌ Solo se permiten números"
    );

  });

}/* =========================================================
   VALIDAR MÁXIMO 60
========================================================= */

export function validarMaximo60(input) {

  input.addEventListener("input", () => {

    const valor =
      Number(input.value);


    if (valor > 60) {

      input.value = 60;

      mostrarAlerta(
        "❌ El máximo permitido es 60"
      );

    }

  });

}


/* =========================================================
   VALIDAR MÁXIMO 9
========================================================= */

export function validarMaximo9(input) {

  input.addEventListener("input", () => {

    const valor =
      Number(input.value);


    if (valor > 9) {

      input.value = 9;

      mostrarAlerta(
        "❌ El máximo permitido es 9"
      );

    }

  });

}
/* =========================================================
   RESERVAS.JS
   ---------------------------------------------------------
   Archivo principal de reservas
   Inicia todos los módulos del sistema
   ========================================================= */


/* =========================================================
   IMPORTACIONES
   ========================================================= */

import { iniciarContador }
from "./contador.js";

import {
  cargarProductosReservas
} from "./reservas_productos.js";

import {
  iniciarCarrito
} from "./carrito.js";

/* =========================================================
   INICIAR SISTEMA
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  console.log(
    "Sistema de reservas iniciado"
  );


  /* =====================================================
     INICIAR CONTADOR
     ===================================================== */

  iniciarContador();
  iniciarCarrito();
  cargarProductosReservas();
});

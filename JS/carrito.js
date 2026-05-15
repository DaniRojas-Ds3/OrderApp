/* =========================================================
   CARRITO.JS
   ---------------------------------------------------------
   Maneja:
   - agregar productos
   - eliminar productos
   - cantidades
   - total
   - modal carrito
   ========================================================= */


/* =========================================================
   IMPORTAR MODALES
   ========================================================= */

import {
  crearModalCarrito
} from "./modales.js";
import {
  reservasActivas
} from "./contador.js";
import {
  mostrarAlerta
} from "./alerts.js";


/* =========================================================
   VARIABLES GLOBALES
   ========================================================= */

let carrito = [];


/* =========================================================
   REFERENCIAS DOM
   ========================================================= */

const contenedorModales =
  document.getElementById("contenedorModales");


/* =========================================================
   INICIALIZAR CARRITO
   ========================================================= */

export function iniciarCarrito() {

  crearBotonCarrito();

}


/* =========================================================
   CREAR BOTÓN FLOTANTE
   ========================================================= */

function crearBotonCarrito() {

  const boton = document.createElement("button");

  boton.id = "carritoBtn";

  boton.className = "carrito-boton";

  boton.innerHTML = "🛒";


  boton.addEventListener("click", abrirCarrito);


  document.body.appendChild(boton);

}


/* =========================================================
   ABRIR MODAL CARRITO
   ========================================================= */

function abrirCarrito() {

  /* =====================================================
     VALIDAR RESERVAS ACTIVAS
     ===================================================== */

  if (!reservasActivas) {

    mostrarAlerta(
      "Las reservas ya finalizaron"
    );

    const modalCarrito =
      document.getElementById(
        "modalCarrito"
      );

    if (modalCarrito) {

      modalCarrito.remove();

    }

    return;

  }


  /* =====================================================
     ABRIR MODAL
     ===================================================== */

  crearModalCarrito(
    carrito,
    actualizarCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto
  );

}

/* =========================================================
   AGREGAR PRODUCTO AL CARRITO
   ========================================================= */

export function agregarAlCarrito(producto) {

  const existente = carrito.find(
    item => item.nombre === producto.nombre
  );


  /* =====================================================
     VALIDAR LÍMITE
     ===================================================== */

  if (existente) {

    if (existente.cantidad >= 3) {

      mostrarAlerta(
        "Máximo 3 unidades por producto"
      );

      return false;

    }

    existente.cantidad++;

    return true;

  }


  /* =====================================================
     AGREGAR NUEVO PRODUCTO
     ===================================================== */

  carrito.push({
    ...producto,
    cantidad: 1
  });

  return true;

}
/* =========================================================
   AUMENTAR CANTIDAD
   ========================================================= */

function aumentarCantidad(index) {

  if (carrito[index].cantidad >= 3) {

    mostrarAlerta(
  "Máximo 3 unidades por producto"
    );

    return;

  }

  carrito[index].cantidad++;

  actualizarCarrito();

}

/* =========================================================
   DISMINUIR CANTIDAD
   ========================================================= */

function disminuirCantidad(index) {

  carrito[index].cantidad--;


  if (carrito[index].cantidad <= 0) {

    carrito.splice(index, 1);

  }

  actualizarCarrito();

}


/* =========================================================
   ELIMINAR PRODUCTO
   ========================================================= */

function eliminarProducto(index) {

  carrito.splice(index, 1);

  actualizarCarrito();

}


/* =========================================================
   ACTUALIZAR CARRITO
   ========================================================= */

function actualizarCarrito() {

  abrirCarrito();

}


/* =========================================================
   EXPORTAR CARRITO
   ========================================================= */

export function obtenerCarrito() {

  return carrito;

}
/* =========================================================
   LIMPIAR CARRITO
   ========================================================= */

export function limpiarCarrito() {

  carrito = [];

  actualizarCarrito();

}
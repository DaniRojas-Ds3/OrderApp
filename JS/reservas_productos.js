/* =========================================================
   RESERVAS_PRODUCTOS.JS
   ---------------------------------------------------------
   Maneja:
   - carga de productos reservas
   - renderizado de tarjetas
   - botón agregar carrito
   ========================================================= */


/* =========================================================
   IMPORTAR CARRITO
   ========================================================= */

import { agregarAlCarrito } from "./carrito.js";

import { db }
from "./firebase.js";


/* =========================================================
   REFERENCIAS DOM
   ========================================================= */

const listaProductos = document.getElementById("listaProductos");


/* =========================================================
   CARGAR PRODUCTOS DESDE FIREBASE
   ========================================================= */

export async function cargarProductosReservas() {

  try {

    const snapshot = await db
      .collection("productos")
      .where("activo", "==", true)
      .where("activoReservas", "==", true)
      .get();

    listaProductos.innerHTML = "";

    snapshot.forEach(doc => {

      const producto = doc.data();

      crearTarjetaProducto(producto);

    });

  } catch (error) {

    console.error(
      "Error cargando productos reservas:",
      error
    );

  }

}


/* =========================================================
   CREAR TARJETA PRODUCTO
   ========================================================= */

function crearTarjetaProducto(producto) {

  const card = document.createElement("div");

  card.className = "card";


  card.innerHTML = `

  <img
    src="${producto.imagen || 'Imagenes/placeholder.webp'}"
    alt="${producto.nombre}"
  >

  <div class="price">

    ${producto.nombre}

    ${
      producto.precioActivo && producto.precio
        ? `<br>$ ${producto.precio.toLocaleString("es-CO")}`
        : ""
    }

  </div>

  <button class="btn-agregar">
    Agregar al carrito
  </button>

`;


  /* =====================================================
     BOTÓN AGREGAR
     ===================================================== */

  const boton = card.querySelector(".btn-agregar");

boton.addEventListener("click", () => {

  const agregado =
    agregarAlCarrito(producto);


  /* =====================================================
     VALIDAR SI SE AGREGÓ
     ===================================================== */

  if (!agregado) return;


  /* =====================================================
     ANIMACIÓN PRODUCTO → CARRITO
     ===================================================== */

  const imagen =
    card.querySelector("img");

  const carritoBtn =
    document.getElementById("carritoBtn");


  if (!imagen || !carritoBtn) return;


  const clon = imagen.cloneNode(true);

  const imgRect =
    imagen.getBoundingClientRect();

  const carritoRect =
    carritoBtn.getBoundingClientRect();


  clon.style.position = "fixed";

  clon.style.left = `${imgRect.left}px`;

  clon.style.top = `${imgRect.top}px`;

  clon.style.width = `${imgRect.width}px`;

  clon.style.height = `${imgRect.height}px`;

  clon.style.borderRadius = "50%";

  clon.style.transition =
    "all 0.8s ease-in-out";

  clon.style.zIndex = "9999";


  document.body.appendChild(clon);


  setTimeout(() => {

    clon.style.left =
      `${carritoRect.left + 20}px`;

    clon.style.top =
      `${carritoRect.top + 20}px`;

    clon.style.width = "20px";

    clon.style.height = "20px";

    clon.style.opacity = "0.3";

  }, 10);


  setTimeout(() => {

    clon.remove();

  }, 800);

});
  /* =====================================================
     INSERTAR TARJETA
     ===================================================== */

  listaProductos.appendChild(card);

}
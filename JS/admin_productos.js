/* =========================================================
   CRUD DE PRODUCTOS - PANEL ADMIN
   =========================================================
   Este módulo controla:
   - Creación de productos
   - Listado en tiempo real
   - Renderizado de productos
   - Buscador de productos
   ========================================================= */



/* =========================================================
   IMPORTACIONES
   ========================================================= */

import { db } from "./firebase.js";

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { mostrarToast } from "./alerts.js";



/* =========================================================
   REFERENCIAS DEL DOM
   ========================================================= */

/* ---------- Formulario ---------- */

const nombreInput =
  document.getElementById("nombreProducto");

const precioInput =
  document.getElementById("precioProducto");

const categoriaSelect =
  document.getElementById("categoriaProducto");

const imagenArchivoInput =
  document.getElementById("imagenArchivo");

const productoActivoInput =
  document.getElementById("productoActivo");

const precioActivoInput =
  document.getElementById("precioActivo");

const activoReservasInput =
  document.getElementById("activoReservas");


/* ---------- Tabla productos ---------- */

const listaProductos =
  document.getElementById("listaProductosAdmin");

const buscadorProductos =
  document.getElementById("buscadorProductos");



/* =========================================================
   CONSULTA FIRESTORE
   ========================================================= */

const productosQuery = query(
  collection(db, "productos"),
  orderBy("nombre")
);



/* =========================================================
   GUARDAR PRODUCTO
   ========================================================= */

/**
 * Guarda un nuevo producto
 * en Firebase Firestore.
 */
async function guardarProducto() {

  try {

    /* =====================================================
       OBTENER DATOS
       ===================================================== */

    const nombre =
      nombreInput.value.trim();

    const precio =
      Number(precioInput.value);

    const categoria =
      categoriaSelect.value;

    const imagenFile =
      imagenArchivoInput.files[0];

    const productoActivo =
      productoActivoInput.checked;

    const precioActivo =
      precioActivoInput.checked;

    const activoReservas =
      activoReservasInput.checked;



    /* =====================================================
       VALIDACIÓN BÁSICA
       ===================================================== */

    if (!nombre || !precio || !categoria) {

      mostrarToast(
        "⚠️ Completa todos los campos obligatorios",
        "warn"
      );

      return;
    }



    /* =====================================================
       CREAR PRODUCTO
       ===================================================== */

    await addDoc(
      collection(db, "productos"),
      {
        nombre,
        precio,
        categoria,
        imagen: imagen || null,

        activo: productoActivo,

        precioActivo,

        activoReservas,

        creado: new Date()
      }
    );



    /* =====================================================
       MENSAJE ÉXITO
       ===================================================== */

    mostrarToast(
      "✅ Producto guardado correctamente",
      "success"
    );



    /* =====================================================
       LIMPIAR FORMULARIO
       ===================================================== */

    limpiarFormulario();

  }

  catch (error) {

    console.error(error);

    mostrarToast(
      "❌ Error al guardar producto",
      "error"
    );
  }
}



/* =========================================================
   LIMPIAR FORMULARIO
   ========================================================= */

/**
 * Reinicia todos los campos
 * del formulario de productos.
 */
function limpiarFormulario() {

  nombreInput.value = "";

  precioInput.value = "";

  categoriaSelect.value = "";

  imagenInput.value = "";

  imagenArchivoInput.value = "";

  productoActivoInput.checked = true;

  precioActivoInput.checked = true;

  activoReservasInput.checked = false;
}



/* =========================================================
   RENDERIZAR PRODUCTOS
   ========================================================= */

/**
 * Escucha cambios en Firestore
 * y renderiza productos en tiempo real.
 */
onSnapshot(productosQuery, (snapshot) => {

  listaProductos.innerHTML = "";



  snapshot.forEach((docSnap) => {

    const producto = docSnap.data();



    /* =====================================================
       CREAR FILA
       ===================================================== */

    const fila =
      document.createElement("tr");

    fila.dataset.categoria =
      (producto.categoria || "")
      .toLowerCase();



    /* =====================================================
       TEMPLATE HTML
       ===================================================== */

    fila.innerHTML = `
      <td class="fila-producto">

        <span class="nombre-producto">
          ${producto.nombre}
        </span>

        <small class="categoria-producto">
          ${producto.categoria || ""}
        </small>

        <button
          class="btn btn-primary"
          onclick="editarProducto('${docSnap.id}')"
        >
          ✏️ Editar
        </button>

      </td>
    `;



    listaProductos.appendChild(fila);

  });



  /* =====================================================
     MANTENER FILTRO ACTIVO
     ===================================================== */

  if (
    buscadorProductos.value.trim() !== ""
  ) {

    buscadorProductos.dispatchEvent(
      new Event("input")
    );
  }

});



/* =========================================================
   BUSCADOR DE PRODUCTOS
   ========================================================= */

buscadorProductos.addEventListener(
  "input",
  () => {

    const texto =
      buscadorProductos.value
      .toLowerCase()
      .trim();



    const filas =
      listaProductos.querySelectorAll("tr");



    filas.forEach(fila => {

      const nombre =
        fila
        .querySelector(".nombre-producto")
        .textContent
        .toLowerCase();



      const categoria =
        fila.dataset.categoria;



      const coincide =
        nombre.includes(texto) ||
        categoria.includes(texto);



      fila.style.display =
        coincide ? "" : "none";

    });

  }
);



/* =========================================================
   EXPORTACIÓN GLOBAL
   ========================================================= */

window.guardarProducto =
  guardarProducto;
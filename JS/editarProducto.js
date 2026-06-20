/* =========================================================
   EDITAR PRODUCTOS
   ---------------------------------------------------------
   Responsabilidades:
   - Abrir editor de productos
   - Actualizar información
   - Manejar validaciones
   - Controlar navegación del editor
========================================================= */


/* =========================================================
   IMPORTACIONES
========================================================= */

import { mostrarAlerta }
from "./alerts.js";

import {
  validarSoloNumeros,
  bloquearTeclasNumero
}
from "./validaciones.js";


/* =========================================================
   VARIABLES GLOBALES
========================================================= */

/*
  Guarda el ID del producto
  que se está editando actualmente.
*/
let productoEditandoId = null;


/* =========================================================
   INICIALIZAR MÓDULO
========================================================= */

export function initEditarProducto() {

  /* =====================================================
     VALIDACIONES INPUT PRECIO
  ===================================================== */

  validarSoloNumeros(
    document.getElementById("editPrecio")
  );

  bloquearTeclasNumero(
    document.getElementById("editPrecio")
  );



  /* =====================================================
     BOTÓN GUARDAR CAMBIOS
  ===================================================== */

  document
    .getElementById("btnGuardarCambios")
    .addEventListener(
      "click",
      guardarCambiosProducto
    );



  /* =====================================================
     BOTÓN CANCELAR EDICIÓN
  ===================================================== */

  document
    .getElementById("btnCancelarEdicion")
    .addEventListener(
      "click",
      volverListaProductos
    );
  
    /* =====================================================
   PREVIEW NUEVA IMAGEN
===================================================== */

document
  .getElementById("editImagenArchivo")
  .addEventListener("change", (e) => {

    const archivo = e.target.files[0];

    if (!archivo) return;

    const preview =
      document.getElementById(
        "editPreviewImagen"
      );

    const btnX =
      document.getElementById(
        "editBtnEliminarImagen"
      );

    const reader =
      new FileReader();

    reader.onload = (evento) => {

      preview.src =
        evento.target.result;

      preview.classList.remove(
        "hidden"
      );

      btnX.classList.remove(
        "hidden"
      );

    };

    reader.readAsDataURL(
      archivo
    );

  });



  /* =====================================================
     ELIMINAR IMAGEN PREVIEW
  ===================================================== */

  document
    .getElementById("editBtnEliminarImagen")
    .addEventListener("click", () => {

      const preview =
        document.getElementById(
          "editPreviewImagen"
        );

      const input =
        document.getElementById(
          "editImagenArchivo"
        );

      const btnX =
        document.getElementById(
          "editBtnEliminarImagen"
        );



      /* ================= LIMPIAR INPUT ================= */

      input.value = "";



      /* ================= LIMPIAR PREVIEW ================= */

      preview.src = "";



      /* ================= OCULTAR ELEMENTOS ================= */

      preview.classList.add("hidden");

      btnX.classList.add("hidden");

    });

}


/* =========================================================
   ACTIVAR BOTONES EDITAR
========================================================= */

function activarBotonesEditar() {

  const botones =
    document.querySelectorAll(
      ".btn-editar"
    );



  botones.forEach((btn) => {

    btn.addEventListener(
      "click",
      () => {

        const id =
          btn.dataset.id;

        abrirEditorProducto(id);

      }
    );

  });

}


/* =========================================================
   ABRIR EDITOR DE PRODUCTO
========================================================= */

export async function abrirEditorProducto(id) {

  /* ================= GUARDAR ID ================= */

  productoEditandoId = id;



  /* ================= OBTENER PRODUCTO ================= */

  const doc = await db
    .collection("productos")
    .doc(id)
    .get();

  const producto = doc.data();



  /* =====================================================
     CARGAR CATEGORÍAS
  ===================================================== */

  cargarCategoriasEditor();



  /* =====================================================
     MOSTRAR SECCIÓN EDITOR
  ===================================================== */

  document
    .querySelectorAll(".section")
    .forEach((sec) => {

      sec.classList.remove("active");

    });

  document
    .getElementById("editarProducto")
    .classList.add("active");



  /* =====================================================
     CARGAR DATOS DEL PRODUCTO
  ===================================================== */

  document.getElementById("editNombre")
    .value = producto.nombre || "";

  document.getElementById("editPrecio")
    .value = producto.precio || "";

  document.getElementById("editCategoria")
    .value = producto.categoria || "";

  document.getElementById("editActivo")
    .checked = producto.activo;

  document.getElementById("editPrecioActivo")
    .checked = producto.precioActivo;

  document.getElementById("editActivoReservas")
    .checked = producto.activoReservas;



  /* =====================================================
     PREVIEW IMAGEN
  ===================================================== */

  const preview =
    document.getElementById(
      "editPreviewImagen"
    );

  const btnX =
    document.getElementById(
      "editBtnEliminarImagen"
    );



  /* ================= SI EXISTE IMAGEN ================= */

  if (producto.imagen) {

    preview.src = producto.imagen;

    preview.classList.remove("hidden");

    btnX.classList.remove("hidden");

  }

  /* ================= SI NO EXISTE IMAGEN ================= */

  else {

    preview.src = "";

    preview.classList.add("hidden");

    btnX.classList.add("hidden");

  }

}


/* =========================================================
   VOLVER A LISTA DE PRODUCTOS
========================================================= */

function volverListaProductos() {

  /* =====================================================
     OCULTAR SECCIONES
  ===================================================== */

  document
    .querySelectorAll(".section")
    .forEach((sec) => {

      sec.classList.remove("active");

    });



  /* =====================================================
     MOSTRAR SECCIÓN PRECIOS
  ===================================================== */

  document
    .getElementById("precios")
    .classList.add("active");



  /* =====================================================
     LIMPIAR BUSCADOR
  ===================================================== */

  document.getElementById(
    "buscadorProductos"
  ).value = "";



  /* =====================================================
     LIMPIAR RESULTADOS
  ===================================================== */

  document.getElementById(
    "listaProductosAdmin"
  ).innerHTML = "";

}


/* =========================================================
   GUARDAR CAMBIOS DEL PRODUCTO
========================================================= */

async function guardarCambiosProducto() {

  /* =====================================================
     OBTENER VALORES
  ===================================================== */
  const nombre =
  document.getElementById(
    "editNombre"
  ).value.trim();

  const precio =
    document.getElementById(
      "editPrecio"
    ).value;

  const categoria =
    document.getElementById(
      "editCategoria"
    ).value;

  const activo =
    document.getElementById(
      "editActivo"
    ).checked;

  const precioActivo =
    document.getElementById(
      "editPrecioActivo"
    ).checked;

  const activoReservas =
    document.getElementById(
      "editActivoReservas"
    ).checked;

    const nuevaImagen =
  document.getElementById(
    "editImagenArchivo"
  ).files[0];


  /* =====================================================
     VALIDACIONES
  ===================================================== */

  if (!precio) {

    mostrarAlerta(
      "❌ El precio es obligatorio"
    );

    return;
  }



  try {

    let urlImagen = null;

/* ==========================================
   SUBIR NUEVA IMAGEN SI EXISTE
========================================== */

if (nuevaImagen) {

  const formData = new FormData();

  formData.append(
    "file",
    nuevaImagen
  );

  formData.append(
    "upload_preset",
    "anuncios_unsigned"
  );

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dyr1lufbt/image/upload",
    {
      method: "POST",
      body: formData
    }
  );

  const data =
    await res.json();

  urlImagen =
    data.secure_url;

}

    /* =================================================
       ACTUALIZAR FIREBASE
    ================================================= */

    const datosActualizar = {

  nombre: nombre,

  precio: Number(precio),

  categoria: categoria,

  activo: activo,

  precioActivo: precioActivo,

  activoReservas: activoReservas

};

/* ==========================================
   SOLO ACTUALIZAR IMAGEN
   SI SE SELECCIONÓ UNA NUEVA
========================================== */

if (urlImagen) {

  datosActualizar.imagen =
    urlImagen;

}

await db
  .collection("productos")
  .doc(productoEditandoId)
  .update(
    datosActualizar
  );



    /* =================================================
       ALERTA ÉXITO
    ================================================= */

    mostrarAlerta(
      "✅ Producto actualizado",
      "exito"
    );



    /* =================================================
       VOLVER A LISTA
    ================================================= */

    volverListaProductos();

  } catch (error) {

    console.error(error);

    mostrarAlerta(
      "❌ Error al actualizar"
    );

  }

}


/* =========================================================
   CARGAR CATEGORÍAS
========================================================= */

function cargarCategoriasEditor() {

  const select =
    document.getElementById(
      "editCategoria"
    );



  select.innerHTML = `

    <option value="">
      Selecciona una categoría
    </option>

    <option value="Comida">
      Comida
    </option>

    <option value="Bebidas">
      Bebidas
    </option>

    <option value="Combos">
      Combos
    </option>

    <option value="Paquetes">
      Paquetes
    </option>

    <option value="Helados">
      Helados
    </option>

    <option value="Greca">
      Greca
    </option>

    <option value="Jugos y Fruteria">
      Jugos y Fruteria
    </option>

    <option value="Pasteleria">
      Pasteleria
    </option>

    <option value="Lacteos">
      Lacteos
    </option>

    <option value="Dulceria">
      Dulceria
    </option>

    <option value="Reservas">
      Reservas
    </option>

    <option value="Variedades">
      Variedades
    </option>

  `;

}
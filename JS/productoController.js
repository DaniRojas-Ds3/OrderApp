/* =========================================================
   CONTROLADOR PRODUCTOS
========================================================= */

import { mostrarAlerta } from "./alerts.js";
import {
  validarSoloTexto,
  validarSoloNumeros,
  bloquearTeclasNumero
} from "./validaciones.js";

/* =========================================================
   INICIALIZACIÓN
========================================================= */

export function initProductoController() {

  /* ================= ELEMENTOS ================= */

  const btnGuardar = document.getElementById("btnGuardarProducto");

  const inputNombre =
    document.getElementById("nombreProducto");

  const inputPrecio =
    document.getElementById("precioProducto");



  /* ================= VALIDACIONES ================= */

  validarSoloTexto(inputNombre);

  validarSoloNumeros(inputPrecio);

  bloquearTeclasNumero(inputPrecio);



  /* ================= EVENTOS ================= */

  btnGuardar.addEventListener(
    "click",
    manejarGuardarProducto
  );
}
/* =========================================================
   GUARDAR PRODUCTO
========================================================= */

async function manejarGuardarProducto() {

    let urlImagen = "";

// 🔥 SI hay imagen → subir a Cloudinary
const archivo = document.getElementById("imagenArchivo").files[0];

if (archivo) {

  const formData = new FormData();

  // ✅ archivo
  formData.append("file", archivo);

  // ✅ upload preset (OBLIGATORIO)
  formData.append("upload_preset", "anuncios_unsigned");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dyr1lufbt/image/upload",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await res.json();

  urlImagen = data.secure_url;
}

  const nombre = document.getElementById("nombreProducto").value.trim();
  const precio = document.getElementById("precioProducto").value;
  const categoria = document.getElementById("categoriaProducto").value;

  const activo = document.getElementById("productoActivo").checked;
  const precioActivo = document.getElementById("precioActivo").checked;
  const activoReservas = document.getElementById("activoReservas").checked;

  /* ================= VALIDACIONES ================= */

  if (!nombre) {
    mostrarAlerta("❌ El nombre es obligatorio");
    return;
  }

  if (!precio) {
    mostrarAlerta("❌ El precio es obligatorio");
    return;
  }

  if (!categoria) {
    mostrarAlerta("❌ Selecciona una categoría");
    return;
  }

  try {

    await db.collection("productos").add({

      nombre: nombre,
      precio: Number(precio),
      categoria: categoria,

      activo: activo,
      precioActivo: precioActivo,
      activoReservas: activoReservas,

      creado: new Date(),

      imagen: urlImagen

    });

    mostrarAlerta("✅ Producto guardado correctamente","exito");
    // 🔥 LIMPIAR FORMULARIO

document.getElementById("nombreProducto").value = "";
document.getElementById("precioProducto").value = "";
document.getElementById("categoriaProducto").value = "";

document.getElementById("imagenArchivo").value = "";

// checkboxes reset
document.getElementById("productoActivo").checked = true;
document.getElementById("precioActivo").checked = true;
document.getElementById("activoReservas").checked = false;

// preview imagen
const preview = document.getElementById("previewImagen");
const btnX = document.getElementById("btnEliminarImagen");

preview.src = "";
preview.classList.add("hidden");
btnX.classList.add("hidden");

  } catch (error) {
    console.error(error);
    mostrarAlerta("❌ Error al guardar");
  }
}
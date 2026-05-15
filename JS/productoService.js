/* =========================================================
   PRODUCTO SERVICE
   ---------------------------------------------------------
   RESPONSABILIDAD:
   - Subir imagen a Cloudinary
   - Guardar producto en Firestore

   IMPORTANTE:
   - Usa db desde firebase.js (NO duplica config)
   - NO toca el DOM
   - NO valida datos
   ========================================================= */

import { db } from "./firebase.js";

/* =========================================================
   CONFIGURACIÓN CLOUDINARY
   ========================================================= */

const CLOUD_NAME = "dyr1lufbt";       // 
const UPLOAD_PRESET = "anuncios_unsigned"; // 

/* =========================================================
   FUNCIÓN: SUBIR IMAGEN
   ========================================================= */

export async function subirImagen(imagenFile) {

  // Creamos FormData para enviar la imagen
  const formData = new FormData();

  formData.append("file", imagenFile);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    // Retornamos la URL segura de la imagen
    return data.secure_url;

  } catch (error) {

    console.error("Error subiendo imagen:", error);
    throw new Error("Error al subir imagen");

  }

}

/* =========================================================
   FUNCIÓN: GUARDAR PRODUCTO EN FIRESTORE
   ========================================================= */

export async function guardarProductoDB(producto) {

  try {

    /* ---------- 1. Subir imagen ---------- */
    const urlImagen = await subirImagen(producto.imagen);

    /* ---------- 2. Construir objeto final ---------- */
    const productoFinal = {

      nombre: producto.nombre,
      precio: Number(producto.precio),
      categoria: producto.categoria,

      activo: producto.activo,
      precioActivo: producto.precioActivo,
      reservas: producto.reservas,

      imagen: urlImagen,

      creado: new Date()

    };

    /* ---------- 3. Guardar en Firestore ---------- */
    await db.collection("productos").add(productoFinal);

    console.log("✅ Producto guardado");

  } catch (error) {

    console.error("❌ Error guardando producto:", error);
    throw error;

  }

}
/* =========================================================
   ANUNCIOS ADMIN
   ---------------------------------------------------------
   Responsabilidad:
   - Preview imagen anuncio
   - Publicar anuncio
   - Mostrar anuncios
   - Eliminar anuncios
========================================================= */

import { db }
from "./firebase.js";

import {
  mostrarAlerta
}
from "./alerts.js";

import {
  subirImagen
}
from "./productoService.js";


/* =========================================================
   INICIALIZAR ANUNCIOS
========================================================= */

export function initAnunciosAdmin() {

  const inputImagen =
    document.getElementById(
      "imagenAnuncio"
    );

  const btnPublicar =
    document.getElementById(
      "btnPublicarAnuncio"
    );


  /* =====================================================
     PREVIEW IMAGEN
  ===================================================== */

  inputImagen?.addEventListener(
    "change",
    mostrarPreviewImagen
  );


  /* =====================================================
     PUBLICAR ANUNCIO
  ===================================================== */

  btnPublicar?.addEventListener(
    "click",
    publicarAnuncio
  );


  /* =====================================================
     CARGAR ANUNCIOS
  ===================================================== */

  cargarAnunciosAdmin();

}


/* =========================================================
   MOSTRAR PREVIEW IMAGEN
========================================================= */

function mostrarPreviewImagen(event) {

  const archivo =
    event.target.files[0];


  /* ================= VALIDAR ================= */

  if (!archivo) {
    return;
  }


  /* =====================================================
     ELIMINAR PREVIEW ANTERIOR
  ===================================================== */

  const previewAnterior =
    document.getElementById(
      "previewAnuncio"
    );

  previewAnterior?.remove();


  /* =====================================================
     CREAR PREVIEW
  ===================================================== */

  const reader =
    new FileReader();

  reader.onload = function(e) {

    const contenedor =
      document.createElement("div");

    contenedor.id =
      "previewAnuncio";

    contenedor.style.marginTop =
      "15px";


    /* ================= IMAGEN ================= */

    const img =
      document.createElement("img");

    img.src =
      e.target.result;

    img.style.width =
      "220px";

    img.style.borderRadius =
      "10px";

    img.style.display =
      "block";

    img.style.marginBottom =
      "10px";


    /* ================= BOTÓN ELIMINAR ================= */

    const btnEliminar =
      document.createElement("button");

    btnEliminar.textContent =
      "❌ Quitar imagen";

    btnEliminar.className =
      "btn btn-danger";


    btnEliminar.addEventListener(
      "click",
      () => {

        document.getElementById(
          "imagenAnuncio"
        ).value = "";

        contenedor.remove();

      }
    );


    /* ================= INSERTAR ================= */

    contenedor.appendChild(img);

    contenedor.appendChild(
      btnEliminar
    );


    event.target.parentElement.appendChild(
  contenedor
);

  };

  reader.readAsDataURL(archivo);

}


/* =========================================================
   PUBLICAR ANUNCIO
========================================================= */

async function publicarAnuncio() {

  const inputImagen =
    document.getElementById(
      "imagenAnuncio"
    );

  const imagen =
    inputImagen.files[0];


  /* =====================================================
     VALIDAR IMAGEN
  ===================================================== */

  if (!imagen) {

    mostrarAlerta(
      "Selecciona una imagen",
      "error"
    );

    return;

  }


  try {

    /* =====================================================
       SUBIR IMAGEN CLOUDINARY
    ===================================================== */

    const urlImagen =
      await subirImagen(imagen);


    /* =====================================================
       CREAR OBJETO
    ===================================================== */

    const anuncio = {

      imagen: urlImagen,

      activo: true,

      creado: new Date()

    };


    /* =====================================================
       GUARDAR FIREBASE
    ===================================================== */

    await db
      .collection("anuncios")
      .add(anuncio);


    /* =====================================================
       LIMPIAR
    ===================================================== */

    inputImagen.value = "";

    document.getElementById(
      "previewAnuncio"
    )?.remove();


    /* =====================================================
       RECARGAR LISTA
    ===================================================== */

    cargarAnunciosAdmin();


    /* =====================================================
       ALERTA
    ===================================================== */

    mostrarAlerta(
      "Anuncio publicado correctamente",
      "exito"
    );

  } catch (error) {

    console.error(
      "Error anuncio:",
      error
    );

    mostrarAlerta(
      "Error al publicar anuncio",
      "error"
    );

  }

}


/* =========================================================
   CARGAR ANUNCIOS ADMIN
========================================================= */

async function cargarAnunciosAdmin() {

  const contenedor =
    document.getElementById(
      "listaAnunciosAdmin"
    );

  contenedor.innerHTML = "";


  try {

    const snapshot =
      await db
        .collection("anuncios")
        .orderBy(
          "creado",
          "desc"
        )
        .get();


    /* ================= SIN DATOS ================= */

    if (snapshot.empty) {

      contenedor.innerHTML = `
        <p>
          No hay anuncios publicados
        </p>
      `;

      return;

    }


    /* =====================================================
       RECORRER ANUNCIOS
    ===================================================== */

    snapshot.forEach(doc => {

      const anuncio =
        doc.data();


      /* ================= CARD ================= */

      const card =
        document.createElement("div");

      card.className =
        "card-anuncio-admin";


      card.innerHTML = `
        <img
          src="${anuncio.imagen}"
          class="img-anuncio-admin"
        >

        <button
          class="btn btn-danger"
          data-id="${doc.id}"
        >
          🗑️ Eliminar
        </button>
      `;


      /* =================================================
         BOTÓN ELIMINAR
      ================================================= */

      const btnEliminar =
        card.querySelector("button");


      btnEliminar.addEventListener(
        "click",
        () => eliminarAnuncio(doc.id)
      );


      contenedor.appendChild(card);

    });

  } catch (error) {

    console.error(
      "Error cargando anuncios:",
      error
    );

  }

}


/* =========================================================
   ELIMINAR ANUNCIO
========================================================= */

async function eliminarAnuncio(id) {

  try {

    await db
      .collection("anuncios")
      .doc(id)
      .delete();


    cargarAnunciosAdmin();


    mostrarAlerta(
      "Anuncio eliminado",
      "exito"
    );

  } catch (error) {

    console.error(
      "Error eliminando anuncio:",
      error
    );

    mostrarAlerta(
      "Error al eliminar anuncio",
      "error"
    );

  }

}
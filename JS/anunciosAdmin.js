/* =========================================================
   ANUNCIOS ADMIN
   ---------------------------------------------------------
   Responsabilidad:
   - Preview imagen anuncio
   - Publicar anuncio
   - Mostrar anuncios activos
   - Historial promociones (max 10)
   - Republicar anuncio
   - Eliminar anuncios activos
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
   BLOQUEOS GLOBALES
========================================================= */

let publicando =
  false;

let republicando =
  false;


/* =========================================================
   INICIALIZAR
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

  inputImagen?.addEventListener(
    "change",
    mostrarPreviewImagen
  );

  btnPublicar?.addEventListener(
    "click",
    publicarAnuncio
  );

  cargarAnunciosAdmin();
  cargarHistorialPromos();

}


/* =========================================================
   PREVIEW
========================================================= */

function mostrarPreviewImagen(event) {

  const archivo =
    event.target.files[0];

  if (!archivo) return;

  document.getElementById(
    "previewAnuncio"
  )?.remove();

  const reader =
    new FileReader();

  reader.onload =
    function(e) {

      const contenedor =
        document.createElement(
          "div"
        );

      contenedor.id =
        "previewAnuncio";

      contenedor.style.marginTop =
        "15px";

      const img =
        document.createElement(
          "img"
        );

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

      const btnEliminar =
        document.createElement(
          "button"
        );

      btnEliminar.textContent =
        "❌ Quitar imagen";

      btnEliminar.className =
        "btn btn-danger";

      btnEliminar.addEventListener(
        "click",
        () => {

          document.getElementById(
            "imagenAnuncio"
          ).value =
            "";

          contenedor.remove();

        }
      );

      contenedor.appendChild(
        img
      );

      contenedor.appendChild(
        btnEliminar
      );

      event.target.parentElement.appendChild(
        contenedor
      );

    };

  reader.readAsDataURL(
    archivo
  );

}


/* =========================================================
   PUBLICAR
========================================================= */

async function publicarAnuncio() {

  if (
    publicando
  ) return;

  publicando =
    true;

  const btnPublicar =
    document.getElementById(
      "btnPublicarAnuncio"
    );

  const inputImagen =
    document.getElementById(
      "imagenAnuncio"
    );

  const imagen =
    inputImagen.files[0];

  if (!imagen) {

    publicando =
      false;

    mostrarAlerta(
      "Selecciona una imagen",
      "error"
    );

    return;

  }

  try {

    btnPublicar.disabled =
      true;

    btnPublicar.textContent =
      "⏳ Publicando...";

    const urlImagen =
      await subirImagen(
        imagen
      );

    const anuncio = {

      imagen:
        urlImagen,

      activo: true,

      creado:
        new Date()

    };

    /* ACTIVO */

    await db
      .collection(
        "anuncios"
      )
      .add(
        anuncio
      );

    /* HISTORIAL */

    await db
      .collection(
        "historialPromos"
      )
      .add(
        anuncio
      );

    /* MAX 10 */

    const historial =
      await db
        .collection(
          "historialPromos"
        )
        .orderBy(
          "creado",
          "desc"
        )
        .get();

    if (
      historial.size > 6
    ) {

      const ultimo =
        historial.docs[6];

      if (
        ultimo
      ) {

        await db
          .collection(
            "historialPromos"
          )
          .doc(
            ultimo.id
          )
          .delete();

      }

    }

    inputImagen.value =
      "";

    document.getElementById(
      "previewAnuncio"
    )?.remove();

    await cargarAnunciosAdmin();
    await cargarHistorialPromos();

    mostrarAlerta(
      "Anuncio publicado correctamente",
      "exito"
    );

  } catch(error) {

    console.error(
      error
    );

    mostrarAlerta(
      "Error al publicar anuncio",
      "error"
    );

  } finally {

    publicando =
      false;

    btnPublicar.disabled =
      false;

    btnPublicar.textContent =
      "📢 Publicar anuncio";

  }

}


/* =========================================================
   ANUNCIOS ACTIVOS
========================================================= */

async function cargarAnunciosAdmin() {

  const contenedor =
    document.getElementById(
      "listaAnunciosAdmin"
    );

  contenedor.innerHTML =
    "";

  try {

    const snapshot =
      await db
        .collection(
          "anuncios"
        )
        .orderBy(
          "creado",
          "desc"
        )
        .get();

    if (
      snapshot.empty
    ) {

      contenedor.innerHTML =
        "<p>No hay anuncios publicados</p>";

      return;

    }

    snapshot.forEach(
      doc => {

        const anuncio =
          doc.data();

        const card =
          document.createElement(
            "div"
          );

        card.className =
          "card-anuncio-admin";

        card.innerHTML =
        `
          <img
            src="${anuncio.imagen}"
            class="img-anuncio-admin"
          >

          <button
            class="btn btn-danger"
          >
            🗑️ Eliminar
          </button>
        `;

        const btnEliminar =
          card.querySelector(
            "button"
          );

        btnEliminar.addEventListener(
          "click",
          () =>
            eliminarAnuncio(
              doc.id
            )
        );

        contenedor.appendChild(
          card
        );

      }
    );

  } catch(error) {

    console.error(
      error
    );

  }

}


/* =========================================================
   HISTORIAL
========================================================= */

async function cargarHistorialPromos() {

  const contenedor =
    document.getElementById(
      "historialPromos"
    );

  if (!contenedor)
    return;

  contenedor.innerHTML =
    "";

  try {

    const snapshot =
      await db
        .collection(
          "historialPromos"
        )
        .orderBy(
          "creado",
          "desc"
        )
        .limit(6)
        .get();

    if (
      snapshot.empty
    ) {

      contenedor.innerHTML =
        "<p>No hay promociones guardadas</p>";

      return;

    }

    snapshot.forEach(
      doc => {

        const anuncio =
          doc.data();

        const card =
          document.createElement(
            "div"
          );

        card.className =
          "card-historial";

        card.innerHTML =
        `
          <img
            src="${anuncio.imagen}"
            class="img-historial"
          >

          <button
            class="btn btn-primary"
          >
            📢 Publicar otra vez
          </button>
        `;

        const btnRepublicar =
          card.querySelector(
            "button"
          );

        btnRepublicar.onclick =
          () =>
            republicarAnuncio(
              anuncio,
              btnRepublicar
            );

        contenedor.appendChild(
          card
        );

      }
    );

  } catch(error) {

    console.error(
      error
    );

  }

}


/* =========================================================
   REPUBLICAR
========================================================= */

async function republicarAnuncio(
  anuncio,
  btn
) {

  if (
    republicando
  ) return;

  republicando =
    true;

  if (btn) {

    btn.disabled =
      true;

    btn.textContent =
      "⏳ Publicando...";

  }

  try {

    await db
      .collection(
        "anuncios"
      )
      .add({

        imagen:
          anuncio.imagen,

        activo: true,

        creado:
          new Date()

      });

    await cargarAnunciosAdmin();

    mostrarAlerta(
      "Promoción republicada",
      "exito"
    );

  } catch(error) {

    console.error(
      error
    );

    mostrarAlerta(
      "Error al republicar",
      "error"
    );

  } finally {

    republicando =
      false;

    if (btn) {

      btn.disabled =
        false;

      btn.textContent =
        "📢 Publicar otra vez";

    }

  }

}


/* =========================================================
   ELIMINAR
========================================================= */

async function eliminarAnuncio(id) {

  try {

    await db
      .collection(
        "anuncios"
      )
      .doc(id)
      .delete();

    await cargarAnunciosAdmin();

    mostrarAlerta(
      "Anuncio eliminado",
      "exito"
    );

  } catch(error) {

    console.error(
      error
    );

    mostrarAlerta(
      "Error al eliminar anuncio",
      "error"
    );

  }

}
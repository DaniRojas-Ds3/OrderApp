/* =========================================================
   PANEL ADMINISTRATIVO - ORDERPAGE
   =========================================================
   Controla:
   - Navegación entre secciones
   - Vista previa de imágenes
   ========================================================= */
/* =========================================================
   IMPORTACIONES
========================================================= */

import { initProductoController }
from "./productoController.js";

import { initEditarProducto }
from "./editarProducto.js";

import { initBuscadorAdmin }
from "./buscadorAdmin.js";

import {
  db,
  firebase
} from "./firebase.js";

firebase.auth().onAuthStateChanged((user) => {

  if (!user) {
    window.location.replace("login.html");
    return;
  }

});

import { abrirEditorProducto }
from "./editarProducto.js";

import { initReportesAdmin }
from "./reportesAdmin.js";

import {
  initConfigReservasAdmin
}
from "./configReservasAdmin.js";

import {
  initConfigBreakAdmin
}
from "./configBreakAdmin.js";

import {
  initAnunciosAdmin
}
from "./anunciosAdmin.js";

/* =========================================================
   CERRAR SESIÓN AL RECARGAR
========================================================= */
window.addEventListener(
  "beforeunload",
  () => {
    firebase.auth().signOut();
  }
);


/* =========================================================
   VALIDAR LOGIN
========================================================= */
firebase.auth().onAuthStateChanged(
  (user) => {

    if (!user) {
      location.replace("login.html");
    }

  }
);

/* =========================================================
   REFERENCIAS DOM
========================================================= */

const menuButtons = document.querySelectorAll(".menu-btn");
const sections = document.querySelectorAll(".section");

const imagenInput = document.getElementById("imagenArchivo");
const previewImagen = document.getElementById("previewImagen");
const btnEliminarImagen = document.getElementById("btnEliminarImagen");


/* =========================================================
   NAVEGACIÓN
========================================================= */

function ocultarSecciones() {
  sections.forEach(section =>
    section.classList.remove("active")
  );
}

function mostrarSeccion(sectionId) {
  ocultarSecciones();

  const section = document.getElementById(sectionId);

  if (section) {
    section.classList.add("active");
  }
}

menuButtons.forEach(button => {
  button.addEventListener("click", () => {
    const sectionId = button.dataset.section;
    mostrarSeccion(sectionId);
  });
});


/* =========================================================
   PREVIEW IMAGEN + X
========================================================= */

imagenInput.addEventListener("change", (e) => {

  const archivo = e.target.files[0];

  // No hay archivo
  if (!archivo) {
    previewImagen.classList.add("hidden");
    btnEliminarImagen.classList.add("hidden");
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {

    previewImagen.src = event.target.result;

    // Mostrar preview
    previewImagen.classList.remove("hidden");

    // Mostrar botón X
    btnEliminarImagen.classList.remove("hidden");
  };

  reader.readAsDataURL(archivo);
});


/* =========================================================
   ELIMINAR IMAGEN
========================================================= */

if (btnEliminarImagen) {

  btnEliminarImagen.addEventListener("click", () => {

    imagenInput.value = "";

    previewImagen.src = "";

    previewImagen.classList.add("hidden");

    btnEliminarImagen.classList.add("hidden");

  });

}
/* =========================================================
   INICIALIZACIÓN DE MÓDULOS
========================================================= */
initProductoController();
initEditarProducto();
initBuscadorAdmin();
initReportesAdmin();
initConfigReservasAdmin();
initConfigBreakAdmin();
initAnunciosAdmin();
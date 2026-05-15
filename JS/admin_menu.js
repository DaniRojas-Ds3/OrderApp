/* =========================================================
   NAVEGACIÓN DEL PANEL ADMINISTRATIVO
   =========================================================
   Este módulo controla:
   - Cambio entre secciones
   - Activación de vistas
   - Navegación del menú superior
   ========================================================= */



/* =========================================================
   REFERENCIAS DEL DOM
   ========================================================= */

const sections = document.querySelectorAll(".section");



/* =========================================================
   MOSTRAR SECCIÓN
   ========================================================= */

/**
 * Muestra una sección específica
 * y oculta las demás.
 *
 * @param {string} id
 */
function mostrarSeccion(id) {

  sections.forEach(section => {
    section.classList.remove("active");
  });

  document
    .getElementById(id)
    .classList.add("active");
}



/* =========================================================
   SECCIÓN INICIAL
   ========================================================= */

/**
 * Mostrar sección principal
 * al cargar el panel.
 */
mostrarSeccion("productos");



/* =========================================================
   EXPORTACIÓN GLOBAL TEMPORAL
   =========================================================
   Se mantiene window.mostrar
   por compatibilidad con onclick
   del HTML actual.
   ========================================================= */

window.mostrar = mostrarSeccion;
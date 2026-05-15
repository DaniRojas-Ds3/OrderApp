/* =========================================================
   NAVEGACIÓN DEL PANEL ADMINISTRATIVO
   =========================================================
   Este archivo controla:
   - Cambio entre secciones
   - Activación visual del menú
   - Navegación principal del panel admin

   Buenas prácticas aplicadas:
   - Sin onclick inline
   - Eventos desacoplados
   - Reutilizable
   - Escalable
   ========================================================= */



/* =========================================================
   REFERENCIAS DEL DOM
   ========================================================= */

/**
 * Todas las secciones del panel.
 */
const sections = document.querySelectorAll(".section");

/**
 * Todos los botones del menú.
 */
const menuButtons =
  document.querySelectorAll(".menu-btn");



/* =========================================================
   MOSTRAR SECCIÓN
   ========================================================= */

/**
 * Oculta todas las secciones y
 * muestra únicamente la indicada.
 *
 * @param {string} sectionId
 */
function showSection(sectionId) {

  /* -----------------------------------------
     Ocultar todas las secciones
  ----------------------------------------- */
  sections.forEach(section => {
    section.classList.remove("active");
  });



  /* -----------------------------------------
     Mostrar sección seleccionada
  ----------------------------------------- */
  const activeSection =
    document.getElementById(sectionId);

  if (activeSection) {
    activeSection.classList.add("active");
  }



  /* -----------------------------------------
     Actualizar estado visual del menú
  ----------------------------------------- */
  menuButtons.forEach(button => {

    button.classList.remove("active");

    if (
      button.dataset.section === sectionId
    ) {
      button.classList.add("active");
    }

  });

}



/* =========================================================
   EVENTOS DEL MENÚ
   ========================================================= */

/**
 * Detecta clicks en cada botón
 * y abre la sección correspondiente.
 */
menuButtons.forEach(button => {

  button.addEventListener("click", () => {

    const sectionId =
      button.dataset.section;

    showSection(sectionId);

  });

});



/* =========================================================
   SECCIÓN INICIAL
   ========================================================= */

/**
 * Sección que se abre al iniciar.
 */
showSection("productos");



/* =========================================================
   EXPORTACIONES
   ========================================================= */

export {
  showSection
};
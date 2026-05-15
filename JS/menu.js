/* =========================================================
   MENU.JS
   ---------------------------------------------------------
   Controla la apertura y cierre del menú lateral
   ========================================================= */

// Selección de elementos
const menuBtn = document.querySelector('.menu-btn');
const menuLateral = document.getElementById('menuLateral');
const btnCerrarMenu = document.getElementById('cerrarMenu');

// =========================
// ABRIR MENÚ
// =========================
menuBtn.addEventListener('click', () => {

  menuLateral.classList.add('activo');

  document.body.classList.add('menu-abierto');

  menuBtn.style.display = 'none';

});


// =========================
// CERRAR CON BOTÓN (X)
// =========================
btnCerrarMenu.addEventListener('click', () => {

  menuLateral.classList.remove('activo');

  document.body.classList.remove('menu-abierto');

  menuBtn.style.display = 'flex';

});


// =========================
// CERRAR HACIENDO CLICK FUERA
// =========================
document.addEventListener('click', (e) => {

  if (
    menuLateral.classList.contains('activo') &&
    !menuLateral.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {

    menuLateral.classList.remove('activo');

    document.body.classList.remove('menu-abierto');

    menuBtn.style.display = 'flex';

  }

});

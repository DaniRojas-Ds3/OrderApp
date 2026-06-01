/* =========================================================
   ALERTS.JS
   ---------------------------------------------------------
   Sistema global reutilizable de alertas
   ========================================================= */

export function mostrarAlerta(
  mensaje,
  tipo = "error" // 👈 por defecto rojo
) {

  /* =====================================================
     ELIMINAR ALERTA ANTERIOR
     ===================================================== */

  const alertaExistente =
    document.querySelector(".alerta");

  if (alertaExistente) {
    alertaExistente.remove();
  }

  /* =====================================================
     CREAR ALERTA
     ===================================================== */

  const alerta =
    document.createElement("div");

  // 👇 AQUÍ ESTÁ LA MAGIA
  alerta.className = `alerta ${tipo}`;

  alerta.textContent = mensaje;

  document.body.appendChild(alerta);

  /* =====================================================
     ELIMINAR AUTOMÁTICAMENTE
     ===================================================== */

  setTimeout(() => {
    alerta.remove();
  }, 3000);

}
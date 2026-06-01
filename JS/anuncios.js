/******************************************************
 * ANUNCIOS.JS
 * ----------------------------------------------------
 * Se encarga de:
 * - Escuchar cambios en Firebase
 * - Mostrar anuncios activos
 * - Renderizar modal visual
 ******************************************************/

// Validar que Firebase esté disponible
if (!window.db) {
  console.error("❌ Firebase no está inicializado");
}

// Escuchar colección "anuncios"
db.collection("anuncios")
  .where("activo", "==", true)
  .orderBy("creado", "desc")
  .onSnapshot((snapshot) => {

    const contenedor = document.getElementById("anunciosPublicos");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    snapshot.forEach((doc) => {

      const a = doc.data();

      // Crear overlay
      const overlay = document.createElement("div");
      overlay.className = "anuncio-overlay";

      // Contenido del modal
      overlay.innerHTML = `
        <div class="anuncio-modal">
          <button class="cerrar-anuncio">✖</button>
          <img src="${a.imagen}">
        </div>
      `;

      // Evento cerrar
      overlay.querySelector(".cerrar-anuncio")
        .addEventListener("click", () => {
          overlay.remove();
        });

      // Insertar en DOM
      document.body.appendChild(overlay);

    });

  });


// 📦 ELEMENTOS HTML
const contenedor = document.getElementById("contenedor");
const titulo = document.getElementById("tituloPagina");

// 📌 LEER URL
const params = new URLSearchParams(window.location.search);
const categoria = params.get("categoria");

// 🛑 VALIDACIÓN
if (!categoria) {
  titulo.innerText = "Categoría no encontrada";
  throw new Error("Falta categoría");
}

// 🏷️ TÍTULO DINÁMICO
titulo.innerText = categoria;

// 🔄 CARGAR PRODUCTOS
function cargarProductos() {
  db.collection("productos")
    .where("categoria", "==", categoria)
    .where("activo", "==", true)
    .get()
    .then(snapshot => {
      contenedor.innerHTML = "";

      snapshot.forEach(doc => {
        const p = doc.data();
        contenedor.appendChild(crearCard(p));
      });
    })
    .catch(error => console.error(error));
}

// 🧱 CREAR CARD
function crearCard(p) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${p.imagen || 'Imagenes/placeholder.webp'}">
    <div class="price">
      ${p.nombre}
      ${
        p.precioActivo && p.precio
          ? `<br>$ ${p.precio.toLocaleString("es-CO")}`
          : ""
      }
    </div>
  `;

  return card;
}

// 🚀 INICIAR
cargarProductos();
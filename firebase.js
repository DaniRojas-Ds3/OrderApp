// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9pJcW57wuSQXBf2lUbgjZrZxYVWaAH_0",
  authDomain: "reservas-ea11f.firebaseapp.com",
  projectId: "reservas-ea11f",
  storageBucket: "reservas-ea11f.firebasestorage.app",
  messagingSenderId: "377091524438",
  appId: "1:377091524438:web:c0d8fb31ead8c0534d38f7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// --- GUARDAR AUTOMÁTICAMENTE CON TIMESTAMP ORDENABLE ---
export async function guardarReserva(data) {
  try {
    await addDoc(collection(db, "reservas"), {
      ...data,
      fechaCreacion: serverTimestamp()   // ✔ TIMESTAMP correcto de Firebase
    });
  } catch (e) {
    console.error("Error al guardar:", e);
  }
}

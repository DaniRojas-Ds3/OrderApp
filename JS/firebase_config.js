/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyB9pJcW57wuSQXBf2lUbgjZrZxYVWaAH_0",
  authDomain: "reservas-ea11f.firebaseapp.com",
  projectId: "reservas-ea11f",
  storageBucket: "reservas-ea11f.appspot.com",
  messagingSenderId: "377091524438",
  appId: "1:377091524438:web:c0d8fb31ead8c0534d38f7"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

/* validar firestore */
if (firebase.firestore) {
  window.db = firebase.firestore();
}

window.firebase = firebase;
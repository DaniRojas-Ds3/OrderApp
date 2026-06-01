/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyAj93s-21yheqoY8nlmsKugBa-WwO2Xrwk",
  authDomain: "orderpage-web.firebaseapp.com",
  projectId: "orderpage-web",
  storageBucket: "orderpage-web.firebasestorage.app",
  messagingSenderId: "530774248156",
  appId: "1:530774248156:web:a2762f89631b01df84c219"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

if (firebase.firestore) {
  window.db = firebase.firestore();
}

window.firebase = firebase;
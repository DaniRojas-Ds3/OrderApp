const auth = firebase.auth();

const btnLogin =
  document.getElementById("btnLogin");

const btnRecuperar =
  document.getElementById("btnRecuperar");

const mensaje =
  document.getElementById("mensaje");

btnLogin.addEventListener(
  "click",
  async ()=>{

    try{

      await auth.signInWithEmailAndPassword(
        email.value,
        password.value
      );

      location.href="admin.html";

    }catch(e){

      mensaje.innerText =
        e.code==="auth/invalid-email"
        ? "Correo no válido"
        : e.code==="auth/missing-password"
        ? "Ingresa la contraseña"
        : "Correo o contraseña incorrectos";

    }

  }
);

btnRecuperar.addEventListener(
  "click",
  async ()=>{

    if(!email.value){
      alert("Ingresa tu correo");
      return;
    }

    try{
      await auth.sendPasswordResetEmail(
        email.value
      );
      alert("Correo enviado");
    }catch{
      alert("Error al enviar correo");
    }

  }
);
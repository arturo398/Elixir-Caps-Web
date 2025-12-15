import { supabase } from "./supabase.js";

//Login
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const msg = document.getElementById("login-msg");

document.getElementById("btn-login").addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    msg.textContent = error.message;
    return;
  }
  window.location.href = "prueba.html"
  msg.textContent = "Sesión iniciada ✔";
  console.log("Usuario:", data.user);
});

//Registro de usuario
document.getElementById("btn-register").addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    msg.textContent = error.message;
    return;
  }

  msg.textContent = "Usuario creado ✔";
  console.log("Usuario:", data.user);
});

//Verificar si esta logueado
const { data: { session } } = await supabase.auth.getSession();

if (session) {
  console.log("Usuario logueado:", session.user.email);
} else {
  console.log("No hay sesión");
}

//Escucahr cambios de sesion
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);

  if (session) {
    console.log("Logueado:", session.user.email);
  } else {
    console.log("Logout");
  }
});

//Cerrar sesion
async function logout() {
  await supabase.auth.signOut();
  console.log("Sesión cerrada");
}

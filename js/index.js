// ------------------- ⚡ SUPABASE CONFIG -------------------
import { supabase } from "./supabase.js";
import { esAdmin } from "./roles.js";

const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  window.location.href = "login.html";
}
// ------------------- ⚡ MENU ANIMACIÓN -------------------
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

  menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });


// ------------------- ⚡ FRASES ANIMADAS -------------------
  const frases = [
    "algo fresco y frutal 🍓",
    "un cóctel con energía 💥",
    "un clásico intenso 🥃",
    "algo suave y elegante 🍸",
    "un frozen para relajar 🧊",
    "una mezcla exótica 🌺"
  ];

  const fraseElemento = document.getElementById('frase-actual');
  if(fraseElemento){
  let indice = 0;

  function cambiarFrase() {
    fraseElemento.classList.remove('visible');
    setTimeout(() => {
      indice = (indice + 1) % frases.length;
      fraseElemento.textContent = frases[indice];
      fraseElemento.classList.add('visible');
    }, 600);
  }

  fraseElemento.classList.add('visible');
  setInterval(cambiarFrase, 3000);
};

// ------------------- ⚡ MODO OSCURO -------------------
const modoBtn = document.getElementById('modo-btn');

modoBtn.addEventListener('click', () => {
  document.body.classList.toggle('modo-oscuro');
  modoBtn.textContent = document.body.classList.contains('modo-oscuro')
    ? "Mood 🌞"
    : "Mood 🌙";
});

// ------------------- 🛒 PRODUCTOS (Supabase) -------------------
async function cargarProductos() {
  const { data: productos, error } = await supabase
    .from("productos")
    .select("*");

  console.log("DATA:", productos);
  console.log("ERROR:", error);
  if (error) {
    console.error("Error al obtener productos:", error);
    return;
  }

  const contenedor = document.querySelector(".productos");
  contenedor.innerHTML = "";

  productos.forEach(prod => {
    const item = document.createElement("article");
    const imgName = prod.nombre.trim().replace(/\s+/g, "");

    item.innerHTML = `
      <h2>${prod.nombre}</h2>
      <img class="tarjeta" src="img/Elixir Caps ${imgName}.png" alt="${prod.nombre}">
      <p>${prod.descripcion}</p>
      <p class="precio">$${prod.precio}</p>
    `;
    
     const btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.textContent = "Comprar";

    btn.addEventListener("click", () => {
    agregarAlCarrito(prod.id);
  });
    item.appendChild(btn);
    contenedor.appendChild(item);
  });
}

cargarProductos();

// ------------------- 🛒 CARRITO (Supabase) -------------------

const carritoBtn = document.getElementById("carrito-btn");
const carritoPanel = document.getElementById("carrito-panel");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const carritoContenido = document.getElementById("carrito-contenido");

carritoBtn.addEventListener("click", () => {
  carritoPanel.classList.toggle("visible");
  mostrarCarrito();
});

cerrarCarrito.addEventListener("click", () => {
  carritoPanel.classList.remove("visible");
});

// Mostrar contenido del carrito
async function mostrarCarrito() {
  const { data: carrito, error } = await supabase
    .from("carrito")
    .select(`
      id,
      cantidad,
      productos (
        id,
        nombre, 
        precio
      )
    `);

  let total=0;
  carritoContenido.innerHTML = "";

  if (!carrito || carrito.length === 0) {
    carritoContenido.innerHTML = `<p class="mensaje">Tu carrito está vacío</p>`;
    return;
  }

  carrito.forEach(item => {
    const contenedor = document.createElement("div");
    contenedor.classList.add("producto-carrito");

    const producto = item.productos;
    const subtotal = producto.precio * item.cantidad;
    total += subtotal;

    const info = document.createElement("div");
    info.innerHTML= `
    <h4>${item.productos.nombre}</h4>
    <p>Cantidad: ${item.cantidad}</p>
    <p>$${subtotal}</p>
    `;

    const controles = document.createElement("div");
    controles.classList.add("cantidad-controles");

    // Boton Restar
    const btnRestar = document.createElement("button");
    btnRestar.textContent = "-";
    btnRestar.classList.add("btn-restar");
    btnRestar.addEventListener("click", () =>{
      cambiarCantidad(item.id, item.cantidad - 1);
    });

    // Boton Sumar
    const btnSumar = document.createElement("button");
    btnSumar.classList.add("btn-sumar");
    btnSumar.textContent = "+";
    btnSumar.addEventListener("click", () =>{
      cambiarCantidad(item.id, item.cantidad + 1);
    });

    // Boton Eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "🗑";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.addEventListener("click", () =>{
      eliminarDelCarrito(item.id);
    });

    controles.append(btnRestar, btnSumar, btnEliminar);
    contenedor.append(info, controles);
    carritoContenido.appendChild(contenedor);
  });

  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total-carrito");
  totalDiv.innerHTML = `<h3>Total: $${total}</h3>`;
  carritoContenido.appendChild(totalDiv);
}

// Agregar producto al carrito
async function agregarAlCarrito(id_producto, nombre) {
  
  // Ver si ya existe el producto en el carrito
  const { data: existente, error } = await supabase
    .from("carrito")
    .select("*")
    .eq("id_producto", id_producto)
    .maybeSingle();

    if (error) {
    console.error(error);
    return;
    }

  if (existente) {
    // Si existe → sumar cantidad
    await supabase
      .from("carrito")
      .update({ cantidad: existente.cantidad + 1 })
      .eq("id", existente.id);
  } else {
    // Si no existe → insertarlo
    await supabase
      .from("carrito")
      .insert({
        id_producto,
        cantidad: 1
      });
  }

  mostrarCarrito();
}

// Cambiar cantidad
async function cambiarCantidad(id, cantidad) {
  if (cantidad < 1) return eliminarDelCarrito(id);

  await supabase
    .from("carrito")
    .update({ cantidad })
    .eq("id", id);

  mostrarCarrito();
}

// Eliminar
async function eliminarDelCarrito(id) {
  await supabase.from("carrito").delete().eq("id", id);
  mostrarCarrito();
}

const logoutBtn = document.getElementById("btn-logout");

logoutBtn?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert("Error al cerrar sesión");
    return;
  }

  window.location.href = "login.html";
});

const btnAdmin = document.getElementById("btn-admin");

if (btnAdmin && await esAdmin()) {
  btnAdmin.style.display = "inline-block";

 // Redirigir al panel de admin al hacer clic
  btnAdmin.addEventListener("click", () => {
    window.location.href = "admin.html"; // cambia por la ruta correcta si es distinta
  });
}


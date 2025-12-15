import { supabase } from "./supabase.js";
import { esAdmin } from "./roles.js";

// 🔐 PROTECCIÓN
const admin = await esAdmin();

if (!admin) {
  alert("Acceso denegado");
  window.location.href = "prueba.html";
}

// --------------------
// VARIABLES
// --------------------
let productoEnEdicionId = null; // null = crear, id = editar

const inputNombre = document.getElementById("nombre");
const inputDescripcion = document.getElementById("descripcion");
const inputPrecio = document.getElementById("precio");
const btnCrear = document.getElementById("btn-crear");
const listaProductos = document.getElementById("lista-productos");
const logoutBtn = document.getElementById("btn-logout");

// --------------------
// BOTÓN CREAR / ACTUALIZAR
// --------------------
btnCrear.addEventListener("click", async () => {
  const nombre = inputNombre.value.trim();
  const descripcion = inputDescripcion.value.trim();
  const precio = Number(inputPrecio.value);

  if (!nombre || !descripcion || isNaN(precio)) {
    alert("Completa todos los campos correctamente");
    return;
  }

  if (productoEnEdicionId) {
    // Editar producto
    const { error } = await supabase
      .from("productos")
      .update({ nombre, descripcion, precio })
      .eq("id", productoEnEdicionId);

    if (error) {
      alert("Error al actualizar producto");
    } else {
      alert("Producto actualizado ✔");
      resetFormulario();
      cargarProductos();
    }
  } else {
    // Crear producto
    const { error } = await supabase
      .from("productos")
      .insert({ nombre, descripcion, precio });

    if (error) {
      alert("Error al crear producto");
    } else {
      alert("Producto creado ✔");
      resetFormulario();
      cargarProductos();
    }
  }
});

// --------------------
// FUNCIONES AUXILIARES
// --------------------
function resetFormulario() {
  inputNombre.value = "";
  inputDescripcion.value = "";
  inputPrecio.value = "";
  productoEnEdicionId = null;
  btnCrear.textContent = "Crear";
}

function editarProducto(id, producto) {
  inputNombre.value = producto.nombre;
  inputDescripcion.value = producto.descripcion;
  inputPrecio.value = producto.precio;
  productoEnEdicionId = id;
  btnCrear.textContent = "Actualizar";
}

// --------------------
// CARGAR PRODUCTOS
// --------------------
async function cargarProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*");

  if (error) {
    console.error("Error al obtener productos:", error);
    return;
  }

  listaProductos.innerHTML = "";

  data.forEach(prod => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${prod.nombre}</strong> - $${prod.precio}
      <button data-id="${prod.id}" class="editar">✏️ Editar</button>
      <button data-id="${prod.id}" class="eliminar">🗑</button>
    `;
    listaProductos.appendChild(div);
  });

  // Asignar eventos
  document.querySelectorAll(".editar").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      const producto = data.find(p => p.id == id);
      editarProducto(id, producto);
    });
  });

  document.querySelectorAll(".eliminar").forEach(btn => {
    btn.addEventListener("click", eliminarProducto);
  });
}

// --------------------
// ELIMINAR PRODUCTO
// --------------------
async function eliminarProducto(e) {
  const id = e.target.dataset.id;
  const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Error al eliminar producto");
  } else {
    cargarProductos();
  }
}

// --------------------
// LOGOUT
// --------------------
logoutBtn?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "login.html";
});
const backBtn = document.getElementById("btn-back");

backBtn?.addEventListener("click", () => {
  window.history.back(); // vuelve a la página anterior
});

// --------------------
// INICIALIZAR
// --------------------
cargarProductos();

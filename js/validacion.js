import { supabase } from './supabase.js'; // importas el cliente ya configurado

const form = document.getElementById('formulario');
const estado = document.getElementById('estado');

function validarDatos(nombre, email, mensaje) {
    if (!nombre || !email || !mensaje) return false;
    if (!email.includes('@')) return false;
    return true;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();

    if (!validarDatos(nombre, email, mensaje)) {
        estado.textContent = 'Datos inválidos ❌';
        estado.style.color = 'red';
        return;
    }

    estado.textContent = 'Enviando... ⏳';
    estado.style.color = '#1d3b34';

    try {
        const { data, error } = await supabase
            .from('contactos')
            .insert([{ nombre, email, mensaje }]);

        if (error) {
            estado.textContent = 'Error al enviar: ' + error.message;
            estado.style.color = 'red';
        } else {
            estado.textContent = 'Mensaje enviado correctamente ✅';
            estado.style.color = 'green';
            form.reset();
        }
    } catch (err) {
        estado.textContent = 'Error inesperado: ' + err.message;
        estado.style.color = 'red';
    }
});

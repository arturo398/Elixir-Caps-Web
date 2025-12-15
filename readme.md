
🍸 Elixir Caps – Tienda Web de Cócteles en Cápsulas

Proyecto web desarrollado para la materia de Programación Web, que simula una tienda en línea de cápsulas de cócteles instantáneos.  
Incluye conexión con servidor local (Node + Express), manejo dinámico de productos y un sistema de carrito con operaciones CRUD.

🚀 Tecnologías utilizadas

- Node.js + Express → Servidor backend
- HTML5 + CSS3 + JavaScript  → Interfaz y lógica del cliente
- Fetch API → Comunicación entre frontend y backend
- JSON → Simula la base de datos local (almacena el carrito y los datos del formulario)
- CORS → Permite la conexión entre cliente y servidor en entorno local

 🧩 Dependencias de Node.js
Asegúrate de instalar las siguientes:

| Dependencia   | Descripción                                                              |
|---------------|--------------------------------------------------------------------------|
| express       | Framework para crear el servidor y manejar rutas.                        |
| cors          | Permite el intercambio de recursos entre el cliente y el servidor local. |
| fs (nativo)   | Módulo interno de Node para leer/escribir archivos JSON.                 |
| path (nativo) | Módulo interno para manejar rutas de archivos y directorios.             |


Para instalarlas (solo las externas), ejecuta en la terminal:

npm install express cors

📁 Estructura del proyecto

Elixir_Caps_Web/
│
├── server.ts # Servidor principal con Express
├── index.js # Lógica del cliente (interfaz y carrito)
├── prueba.html # Página principal del sitio
├── estilos2.css # Estilos generales y del carrito flotante
├── datos.json # Archivo donde se guardan los formularios (simulación DB)
├── carrito.json # Archivo donde se almacena el carrito de compras
├── img/ # Carpeta con imágenes de productos y logo
└── package.json # Dependencias y scripts de Node

Instalación y configuración del entorno:
Requisitos previos tener intalado:
 Node.js (versión recomendada: 18 o superior)
 npm (instalando junto con Node)

Podes verificarlo ejecutando en la terminal:
node -v
npm -v
 
Por ultimo para compilar y ejecutar el servidor:

npx tsc server.ts

👨‍💻 Autores

Proyecto desarrollado por:

Arturo Balbi


Materia: Programación Web
Año: 2025


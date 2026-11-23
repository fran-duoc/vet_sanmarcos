# Veterinaria San Marcos - Migración a React + Vite

Aplicación web moderna desarrollada en **React 19** con **Vite**, **React Router v7** y **React Bootstrap**, correspondiente a la migración integral de la plataforma web de la **Clínica Veterinaria San Marcos**.

---

## 🚀 Instrucciones de Instalación y Ejecución

### 1. Instalación de dependencias
Asegúrate de contar con Node.js (versión 18 o superior). Ejecuta en la terminal de la raíz del proyecto:
```bash
npm install
```

### 2. Ejecutar en entorno de desarrollo
Inicia el servidor local de desarrollo con Hot Module Replacement (HMR):
```bash
npm run dev
```
La aplicación quedará disponible en `http://localhost:5173`.

### 3. Ejecutar pruebas unitarias (Vitest)
Para ejecutar la suite completa de pruebas unitarias automatizadas:
```bash
npm test
```
O para ejecutar una sola pasada sin modo watcher:
```bash
npx vitest run
```

### 4. Compilación para producción
Para compilar y empaquetar los artefactos optimizados:
```bash
npm run build
```

---

## 🧭 Estructura del Proyecto

Siguiendo de forma estricta la arquitectura y convenciones de la plantilla de referencia:

```text
fullstack/
├── index.html                  # Plantilla HTML base con título institucional
├── vite.config.js              # Configuración de Vite y Vitest (jsdom, setupFiles, globals)
├── eslint.config.js            # Reglas de linting
├── package.json                # Dependencias y scripts del proyecto
├── README.md                   # Instrucciones y documentación técnica
├── ERS.md                      # Especificación de Requisitos de Software
├── Plan de pruebas.md          # Tabla de pruebas unitarias según formato de referencia
├── public/
│   ├── favicon.svg
│   ├── img/                    # Copia pública de imágenes
│   └── video/                  # Video institucional en MP4
└── src/
    ├── main.jsx                # StrictMode + BrowserRouter + import de bootstrap.min.css
    ├── App.jsx                 # Configuración de rutas <Routes> y proveedores globales
    ├── App.css / index.css     # Estilos globales y modo oscuro fieles al sitio original
    ├── setupTests.js           # Configuración de Vitest con @testing-library/jest-dom
    ├── assets/img/             # Imágenes y fotografías originales de Vet San Marcos
    ├── context/                # Contextos globales de estado (Autenticación, Carrito, Productos)
    │   ├── AuthContext.jsx
    │   ├── CartContext.jsx
    │   └── ProductContext.jsx
    ├── data/                   # Datos estáticos del negocio
    │   ├── itemsMenu.js        # Enlaces de la barra de navegación
    │   └── productos.js        # Catálogo base de 8 productos con metadatos veterinarios
    ├── components/             # Componentes reutilizables con sus pruebas unitarias
    │   ├── Header.jsx / Header.test.jsx
    │   ├── Footer.jsx
    │   ├── TarjetaProducto.jsx / TarjetaProducto.test.jsx
    │   ├── GaleriaProducto.jsx
    │   ├── FormularioContacto.jsx / FormularioContacto.test.jsx
    │   ├── FormularioRegistro.jsx / FormularioRegistro.test.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── Nosotros.jsx
    │   ├── Seccion.jsx
    │   └── Ejemplo.jsx
    └── views/                  # Vistas por ruta
        ├── Home.jsx
        ├── Productos.jsx / Productos.test.jsx
        ├── DetalleProducto.jsx
        ├── Login.jsx / Login.test.jsx
        ├── Registro.jsx
        ├── Carrito.jsx / Carrito.test.jsx
        ├── MiPerfil.jsx
        ├── Nosotros.jsx
        └── NotFound.jsx
```

---

## 📦 Archivos Nuevos Agregados y su Justificación

De acuerdo con la **Regla 3** de las instrucciones ("Qué se puede agregar: solo lo estrictamente necesario"), se detallan los archivos creados fuera de la plantilla básica inicial:

1. **`src/context/AuthContext.jsx`**:
   - *Justificación:* Requerido explícitamente para centralizar el estado global de autenticación, validar credenciales estáticas de administrador (`admin@vetsanmarcos.cl` / `Admin123*`), soportar registro de clientes y persistir la sesión en `localStorage`.
2. **`src/context/CartContext.jsx`**:
   - *Justificación:* Requerido explícitamente para gestionar el carrito de compras global, cálculo de totales/subtotales en pesos chilenos y sincronización con `localStorage`.
3. **`src/context/ProductContext.jsx`**:
   - *Justificación:* Permite centralizar la lista reactiva de productos del catálogo veterinario.
4. **`src/components/ProtectedRoute.jsx`**:
   - *Justificación:* Requerido para restringir el acceso a rutas privadas (`/perfil`), redirigiendo a usuarios no autenticados hacia `/login`.
5. **Vistas requeridas en `src/views/` (`Carrito.jsx`, `MiPerfil.jsx`, `NotFound.jsx`, `Login.jsx`)**:
   - *Justificación:* Exigidas en la especificación de rutas del proyecto (`/carrito`, `/perfil`, `*` y `/login`).
6. **Archivos de pruebas unitarias (`*.test.jsx`)**:
   - *Justificación:* Para cumplir con la suite de pruebas unitarias con Vitest (13 pruebas implementadas en total), ubicadas estrictamente junto a sus respectivos componentes y vistas.

---

## 🔒 Credenciales de Prueba por Defecto

- **Email:** `admin@vetsanmarcos.cl`
- **Contraseña:** `Admin123*`
- *Acceso habilitado a:* Carrito (`/carrito`), Perfil (`/perfil`), Catálogo (`/productos`).

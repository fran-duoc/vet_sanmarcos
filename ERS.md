# Especificación de Requisitos de Software (ERS) - Veterinaria San Marcos

## 1. Introducción y Propósito
El presente documento describe la arquitectura, requerimientos funcionales, no funcionales y componentes de software implementados para la migración completa del sitio web **Veterinaria San Marcos** desde su versión estática en HTML5, CSS3 y JavaScript vanilla hacia una SPA (Single Page Application) moderna construida con **React 19**, **Vite**, **React Router v7** y **React Bootstrap**.

---

## 2. Requerimientos Funcionales (RF)

### RF-01: Navegación y Rutas SPA (`react-router-dom`)
- **RF-01.1**: Navegación fluida sin recargas mediante `BrowserRouter` en `src/main.jsx` y definición de rutas en `src/App.jsx`.
- **RF-01.2**: Rutas públicas disponibles:
  - `/`: Vista de Inicio (`Home.jsx`) con banner institucional, presentación clínica con galería de imágenes verticales, video de presentación con poster y enlace al catálogo completo, replicando con exactitud la distribución original de `index.html`.
  - `/productos`: Catálogo completo de artículos veterinarios (`Productos.jsx`).
  - `/producto/:id` y `/detalle`: Vista de detalle individual con información clínica del producto y botón para agregar al carrito (`DetalleProducto.jsx`).
  - `/nosotros`: Información histórica, misión, visión y valores de la clínica (`Nosotros.jsx`).
  - `/login`: Formulario de inicio de sesión (`Login.jsx`).
  - `/registro`: Formulario de registro de clientes con validaciones veterinarias (`Registro.jsx`).
  - `/carrito`: Vista de resumen de compra, control de cantidades y simulación de checkout (`Carrito.jsx`).
  - `*`: Vista 404 responsiva (`NotFound.jsx`).
- **RF-01.3**: Rutas protegidas (`ProtectedRoute.jsx`):
  - `/perfil`: Vista de información del usuario autenticado (`MiPerfil.jsx`).
  - Si un usuario no autenticado intenta acceder a esta ruta, es redirigido inmediatamente a `/login`.

### RF-02: Autenticación y Persistencia (`AuthContext.jsx`)
- **RF-02.1**: Credenciales por defecto para perfil Administrador:
  - **Email:** `admin@vetsanmarcos.cl`
  - **Password:** `Admin123*`
- **RF-02.2**: Soporte para registro de nuevos clientes mediante `Registro.jsx` y persistencia en `localStorage`.
- **RF-02.3**: Métodos de autenticación: `login(email, password)`, `logout()` y `registrarUsuario(datos)`.
- **RF-02.4**: Persistencia del estado de sesión en `localStorage` bajo la clave `usuarioAutenticado`.

### RF-03: Carrito de Compras Global (`CartContext.jsx`)
- **RF-03.1**: Agregar productos al carrito especificando cantidad.
- **RF-03.2**: Incrementar/disminuir cantidades o eliminar artículos de forma individual.
- **RF-03.3**: Cálculo dinámico en tiempo real de subtotales por artículo y total de la orden en formato moneda chilena (CLP `$XX.XXX`).
- **RF-03.4**: Persistencia del estado del carrito en `localStorage` (`carrito_sanmarcos`).
- **RF-03.5**: Simulación de checkout con generación de número de orden y vaciado automático de la cesta.

### RF-04: Catálogo y Búsqueda de Productos (`ProductContext.jsx` y `Productos.jsx`)
- **RF-04.1**: Inicialización del catálogo a partir de `src/data/productos.js`.
- **RF-04.2**: Búsqueda en tiempo real por texto en `/productos` (coincidencia por nombre, descripción o especie).
- **RF-04.3**: Filtrado dinámico por categorías: *Todas*, *Alimentos*, *Medicamentos*, *Accesorios* e *Higiene*.

### RF-05: Formularios y Validaciones Críticas de Contexto Veterinario
- **RF-05.1: Formulario de Registro (`FormularioRegistro.jsx`)**:
  - Nombre completo (validación regex de solo letras y espacios).
  - RUT chileno (validación de formato `12.345.678-9`).
  - Correo electrónico válido (@gmail.com, @duocuc.cl, @outlook.com).
  - Teléfono celular (+569 seguido de 8 dígitos).
  - Mayoría de edad (+18 años calculados en base a fecha de nacimiento).
  - Contraseña segura (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número).
  - **Campo Crítico Evaluado 1**: `¿Tienes mascotas?` (Radio button con opciones obligatorias "Sí" / "No").
  - **Campo Crítico Evaluado 2**: `¿Cuántas mascotas tienes?` (Input numérico deshabilitado y fijado en 0 si la respuesta es "No"; habilitado y obligatorio $\ge 1$ si la respuesta es "Sí").
- **RF-05.2: Formulario de Panel Administrador (`AdminPanel.jsx`)**:
  - **Campo Crítico Evaluado 3**: Especie objetivo (*Perro*, *Gato*, *Exóticos*).
  - **Campo Crítico Evaluado 4**: Tipo de receta / venta (*Libre*, *Retenida*).
  - **Campo Crítico Evaluado 5**: Rango de edad o peso (*Ej. Adultos / 10-25 kg, Cachorros, etc.*).

### RF-06: Alternancia de Tema Claro / Oscuro (Dark Mode)
- **RF-06.1**: Botón toggle accesible en el componente `Header.jsx`.
- **RF-06.2**: Almacenamiento y recuperación de la preferencia de tema en `localStorage` (`tema: 'claro' | 'oscuro'`).
- **RF-06.3**: Aplicación de la clase `.modo-oscuro` en el `<body>`, adaptando paletas de color con fondo `#14171a`, tarjetas `#1f2428`, y manteniendo la identidad visual verde azulada `#2a9d8f`.

---

## 3. Requerimientos No Funcionales (RNF)

- **RNF-01 (Fidelidad Visual):** Preservación de la paleta de colores original (`#2a9d8f`, `#e8f5e9`, `#264653`), tipografías, tarjetas y estilos de encabezado/pie de página.
- **RNF-02 (Arquitectura Modular):** Separación estricta entre componentes de presentación (`src/components/`), vistas de enrutamiento (`src/views/`), capas de contexto (`src/context/`) y datos estáticos (`src/data/`).
- **RNF-03 (Calidad y Testing):** 100% de las pruebas unitarias automatizadas con Vitest ejecutándose exitosamente bajo el patrón AAA.
- **RNF-04 (Rendimiento):** Compilación de producción con Vite en menos de 1 segundo.

---

## 4. Casos de Uso Principales

```
[Usuario Anónimo]  ---> (Explorar Catálogo / Filtrar Productos)
                   ---> (Ver Detalle de Producto)
                   ---> (Agregar Artículos al Carrito)
                   ---> (Registrarse como Cliente con Datos de Mascotas)
                   ---> (Iniciar Sesión)

[Usuario Cliente]  ---> (Ver Mi Perfil)
                   ---> (Simular Checkout de Carrito)
                   ---> (Cerrar Sesión)
```

---

## 5. Trazabilidad de Componentes y Vistas

| Requisito / Vista | Componente(s) Responsable(s) | Archivo de Test Asociado |
| :--- | :--- | :--- |
| Encabezado y Navegación | `Header.jsx` | `Header.test.jsx` |
| Tarjeta y Catálogo | `TarjetaProducto.jsx`, `GaleriaProducto.jsx` | `TarjetaProducto.test.jsx`, `Productos.test.jsx` |
| Formulario de Registro | `FormularioRegistro.jsx`, `Registro.jsx` | `FormularioRegistro.test.jsx` |
| Contacto y Consultas | `FormularioContacto.jsx` | `FormularioContacto.test.jsx` |
| Autenticación | `Login.jsx`, `AuthContext.jsx` | `Login.test.jsx` |
| Gestión Carrito | `Carrito.jsx`, `CartContext.jsx` | `Carrito.test.jsx` |
| Perfil Protegido | `MiPerfil.jsx`, `ProtectedRoute.jsx` | Evaluado en suite general |

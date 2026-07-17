# 🍽️ FoodReserveRD

FoodReserveRD es una aplicación móvil desarrollada con **Ionic + Angular + Capacitor** que permite localizar restaurantes cercanos utilizando la ubicación actual del usuario. La aplicación consume una API desarrollada en **Node.js y Express**, la cual se comunica con **Geoapify Places API** para obtener información actualizada de los establecimientos.

El proyecto fue desarrollado como trabajo final de la asignatura **Programación de Dispositivos Móviles** en la **Universidad Abierta para Adultos (UAPA)**.

---

# 📱 Características

- 📍 Obtención automática de la ubicación mediante GPS.
- 🍽️ Búsqueda de restaurantes cercanos.
- 📄 Vista detallada de cada restaurante.
- ❤️ Sistema de favoritos.
- 🕒 Historial de búsquedas.
- 📞 Llamadas telefónicas desde la aplicación.
- 🌐 Acceso al sitio web del restaurante.
- 🗺️ Visualización del restaurante en un mapa interactivo.
- 🚗 Trazado de rutas desde la ubicación del usuario hasta el restaurante.
- 🔄 Actualización mediante Pull To Refresh.
- 💾 Persistencia de datos utilizando Ionic Storage.

---

# 🛠️ Tecnologías utilizadas

## Frontend

- Ionic Framework
- Angular
- TypeScript
- Capacitor
- Ionic Storage
- Leaflet
- Leaflet Routing Machine
- RxJS

## Backend

- Node.js
- Express.js
- Axios

## API Externa

- Geoapify Places API

---

# 📂 Estructura del proyecto

```
src/
│
├── app/
│   ├── components/
│   ├── models/
│   ├── pages/
│   ├── services/
│   ├── guards/
│   └── app.routes.ts
│
├── assets/
├── environments/
└── theme/
```

---

# 📱 Módulos implementados

## 🏠 Inicio

- Obtiene la ubicación del usuario.
- Consulta restaurantes cercanos.
- Muestra tarjetas con la información principal.

---

## 📄 Detalle del restaurante

- Información completa del restaurante.
- Dirección.
- Teléfono.
- Sitio web.
- Mapa interactivo.
- Ruta desde la ubicación actual.
- Agregar o eliminar de favoritos.

---

## ❤️ Favoritos

- Guarda restaurantes favoritos.
- Permite acceder rápidamente a ellos.

---

## 🕒 Historial

- Almacena las búsquedas realizadas.
- Consulta rápida del historial.

---

## 📷 Escáner QR

- Escaneo de códigos QR utilizando la cámara del dispositivo.

---

## 📡 Bluetooth

- Demostración de conexión mediante Bluetooth utilizando Capacitor.

---

# ⚙️ Instalación

Clonar el repositorio

```bash
git clone https://github.com/EndersonEST/FoodReserveRD.git
```

Entrar al proyecto

```bash
cd FoodReserveRD
```

Instalar dependencias

```bash
npm install
```

Ejecutar la aplicación

```bash
ionic serve
```

---

# 📲 Ejecutar en Android

Compilar la aplicación

```bash
ionic build
```

Copiar archivos a Capacitor

```bash
npx cap copy
```

Sincronizar

```bash
npx cap sync
```

Abrir Android Studio

```bash
npx cap open android
```

---

# 📷 Capturas

Aquí pueden agregarse capturas de:

- Pantalla de inicio
- Lista de restaurantes
- Detalle del restaurante
- Favoritos
- Historial
- Ruta en el mapa

---

# 👥 Integrantes

- **Enderson Estrella**
- **Oliver Leo Tolentino**

Universidad Abierta Para Adultos (UAPA)

Carrera de Ingeniería en Software

Asignatura: Programación de Dispositivos Móviles

---

# 📄 Licencia

Proyecto desarrollado únicamente con fines académicos para la asignatura Programación de Dispositivos Móviles.

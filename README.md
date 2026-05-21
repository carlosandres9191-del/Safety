# 🧯 Safety CRM — Extintores Safety S.A.S

Sistema de gestión completo para recolección, laboratorio, entregas, inspecciones y trazabilidad de extintores.

---

## 📁 Archivos del proyecto

```
safety-crm/
├── index.html          ← Página principal (abrir en el navegador)
├── manifest.json       ← Para instalar como app en celular
├── Code.gs             ← Backend Google Apps Script
├── css/
│   └── global.css      ← Estilos del sistema
└── js/
    ├── app.js          ← Lógica principal, datos y navegación
    ├── modulos1.js     ← Dashboard, clientes, extintores, recolecciones, entregas
    └── modulos2.js     ← Laboratorio, visitas, préstamos, alertas, materiales, mensajero
```

---

## 🚀 PARTE 1 — Subir a GitHub Pages (para probar GRATIS)

### Paso 1: Crear cuenta en GitHub
1. Ve a https://github.com
2. Clic en **Sign up** (si no tienes cuenta)
3. Crea tu cuenta con tu correo

### Paso 2: Crear repositorio
1. Una vez dentro de GitHub, clic en el botón verde **New** (arriba a la izquierda)
2. **Repository name:** `safety-crm`
3. Selecciona **Public**
4. NO marques ninguna casilla adicional
5. Clic en **Create repository**

### Paso 3: Subir los archivos
1. En la página del repositorio vacío, clic en **uploading an existing file**
2. Arrastra y suelta **TODA la carpeta safety-crm** (o los archivos uno a uno)
3. Asegúrate de que la estructura quede así:
   ```
   index.html
   manifest.json
   Code.gs
   css/global.css
   js/app.js
   js/modulos1.js
   js/modulos2.js
   ```
4. Escribe un mensaje: `Primera versión Safety CRM`
5. Clic en **Commit changes**

### Paso 4: Activar GitHub Pages
1. En tu repositorio, clic en **Settings** (pestaña superior)
2. En el menú izquierdo, clic en **Pages**
3. En **Source**, selecciona `Deploy from a branch`
4. En **Branch**, selecciona `main` y carpeta `/ (root)`
5. Clic en **Save**
6. Espera 2-3 minutos
7. Tu CRM estará en: `https://TU-USUARIO.github.io/safety-crm/`

---

## 🗄️ PARTE 2 — Conectar Google Sheets (base de datos)

### Paso 1: Crear el Google Sheets
1. Ve a https://sheets.google.com
2. Crea una hoja nueva
3. Ponle nombre: `Safety CRM — Base de Datos`

### Paso 2: Crear el Apps Script
1. Dentro del Google Sheets, ve al menú **Extensiones → Apps Script**
2. Borra todo el código que aparece por defecto
3. Copia y pega el contenido del archivo `Code.gs`
4. Guarda con Ctrl+S (nombre: `Safety CRM Backend`)

### Paso 3: Inicializar las hojas
1. En Apps Script, en la barra superior selecciona la función: `testInicializar`
2. Clic en **Ejecutar** ▶
3. Acepta los permisos que pida
4. Verifica que se crearon las hojas en tu Google Sheets

### Paso 4: Desplegar como API web
1. En Apps Script, clic en **Implementar → Nueva implementación**
2. Clic en el engranaje ⚙️ y selecciona **Aplicación web**
3. Configura:
   - **Descripción:** Safety CRM v1
   - **Ejecutar como:** Yo (tu cuenta de Google)
   - **Quién tiene acceso:** Cualquier persona
4. Clic en **Implementar**
5. **COPIA la URL** que aparece (se ve así: `https://script.google.com/macros/s/XXXXXXXX/exec`)

### Paso 5: Conectar el CRM con el backend
1. Abre el archivo `js/app.js`
2. Busca esta línea (cerca del inicio):
   ```javascript
   APPS_SCRIPT_URL: 'TU_APPS_SCRIPT_URL_AQUI',
   ```
3. Reemplaza `TU_APPS_SCRIPT_URL_AQUI` con la URL que copiaste
4. Guarda el archivo y súbelo de nuevo a GitHub

---

## 🌐 PARTE 3 — Subir a Hostinger (dominio propio)

### Opción A: Por el panel de Hostinger
1. Entra a tu panel en https://hpanel.hostinger.com
2. Ve a **Administrador de archivos** → carpeta `public_html`
3. Crea una carpeta llamada `crm` (o sube directo en la raíz)
4. Sube todos los archivos manteniendo la misma estructura de carpetas
5. Tu CRM estará en: `https://tudominio.com/crm/`

### Opción B: Por FTP (más cómodo para muchos archivos)
1. En Hostinger, ve a **Avanzado → FTP**
2. Crea una cuenta FTP o usa la que aparece
3. Descarga FileZilla (gratis): https://filezilla-project.org
4. Conecta con los datos FTP de Hostinger
5. Sube la carpeta `safety-crm` dentro de `public_html`

### Opción C: Conectar GitHub con Hostinger (automático)
1. En Hostinger, busca **Git** o **Deployment**
2. Conecta tu repositorio de GitHub
3. Cada vez que subas cambios a GitHub, Hostinger se actualiza solo ✨

---

## 👥 Usuarios de acceso demo

| Usuario | Contraseña | Rol | Acceso |
|---------|-----------|-----|--------|
| admin@safety.com | admin123 | Coordinador | Casi todo el sistema |
| lab@safety.com | lab123 | Laboratorio | Lab + inventario |
| mensajero@safety.com | mens123 | Mensajero | Recolecciones + entregas |
| ventas@safety.com | ventas123 | Vendedor | Clientes + inspecciones |
| superadmin@safety.com | super123 | Superadmin | Todo sin restricciones |

---

## 📱 Instalar como app en el celular del mensajero

1. Abre el CRM en Chrome (Android) o Safari (iPhone)
2. Toca el menú ⋮ (Android) o el botón compartir (iPhone)
3. Selecciona **"Agregar a pantalla de inicio"**
4. El CRM aparecerá como una app normal en el celular

---

## 🔄 Modo sin internet

El sistema funciona sin internet gracias al almacenamiento local:
- Los cambios se guardan automáticamente en el dispositivo
- Cuando vuelve la conexión, sincroniza con Google Sheets
- Un banner naranja avisa cuando estás sin conexión

---

## 📞 Soporte técnico

**Extintores Safety S.A.S**
- Calle 48 N°51-68, Bello – Antioquia
- PBX: 444 75 71
- correo: Extintoresafety@gmail.com

# LUMINA Store — PWA con Stripe 🛍️

Proyecto universitario: tienda virtual PWA con pagos reales usando Stripe y desplegada en Vercel.

---

## 📁 Estructura del proyecto

```
tienda-pwa/
├── public/
│   ├── index.html      ← Página principal
│   ├── style.css       ← Estilos
│   ├── app.js          ← Lógica del carrito y frontend
│   ├── manifest.json   ← Configuración PWA
│   └── sw.js           ← Service Worker (offline)
├── api/
│   └── checkout.js     ← Función serverless de Stripe
├── package.json
└── vercel.json
```

---

## 🚀 Pasos para subir a internet

### Paso 1 — Instala las herramientas necesarias

```bash
# Instala Node.js desde https://nodejs.org (versión LTS)
# Luego instala Vercel CLI:
npm install -g vercel
```

### Paso 2 — Entra a tu carpeta e instala dependencias

```bash
cd tienda-pwa
npm install
```

### Paso 3 — Consigue tus claves de Stripe

1. Ve a https://stripe.com y crea una cuenta (es gratis)
2. En el dashboard, entra a **Developers → API Keys**
3. Copia tu **Secret key** (empieza con `sk_test_...`)
4. En modo prueba puedes usar la tarjeta: `4242 4242 4242 4242` con cualquier fecha futura y cualquier CVC

### Paso 4 — Haz login en Vercel

```bash
vercel login
# Abre el link que aparece en tu navegador y autoriza
```

### Paso 5 — Despliega el proyecto

```bash
vercel
# Vercel te hará algunas preguntas:
# - Set up and deploy? → Y
# - Which scope? → (elige tu cuenta)
# - Link to existing project? → N
# - What's your project name? → lumina-store (o el que quieras)
# - In which directory is your code? → . (punto, la carpeta actual)
# - Override settings? → N
```

Vercel te dará una URL como: `https://lumina-store-abc123.vercel.app`

### Paso 6 — Configura la variable de entorno de Stripe

```bash
vercel env add STRIPE_SECRET_KEY
# Te pedirá el valor → pega tu sk_test_... 
# Environments → selecciona: Production, Preview y Development
```

Luego vuelve a desplegar para que tome la variable:

```bash
vercel --prod
```

### Paso 7 — Prueba desde tu celular ✅

1. Abre la URL en tu celular
2. En Chrome/Safari verás opción de "Instalar app" o "Agregar a pantalla de inicio"
3. Prueba el pago con:
   - Tarjeta: `4242 4242 4242 4242`
   - Fecha: cualquier mes/año futuro (ej: `12/29`)
   - CVC: cualquier 3 dígitos (ej: `123`)
   - Código postal: cualquier 5 dígitos

---

## 🎨 Personalización

### Cambiar los productos
En `public/app.js`, edita el array `PRODUCTS`:
```javascript
const PRODUCTS = [
  { id: 1, name: "Mi Producto", emoji: "🎸", tag: "Música", price: 99.99, desc: "Descripción aquí." },
  // ... más productos
];
```

### Cambiar la moneda
En `api/checkout.js`, cambia:
```javascript
currency: 'mxn',  // 'usd' para dólares, 'mxn' para pesos mexicanos
```

### Cambiar el nombre de la tienda
- En `public/index.html`: busca `LUMINA` y reemplázalo
- En `public/manifest.json`: cambia `"name"` y `"short_name"`

---

## 🧪 Tarjetas de prueba de Stripe

| Número | Resultado |
|--------|-----------|
| `4242 4242 4242 4242` | ✅ Pago exitoso |
| `4000 0000 0000 9995` | ❌ Fondos insuficientes |
| `4000 0025 0000 3155` | 🔐 Requiere autenticación 3D Secure |

---

## ⚡ Tecnologías usadas

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **PWA**: Web App Manifest + Service Worker
- **Backend**: Node.js + Vercel Serverless Functions
- **Pagos**: Stripe Checkout
- **Deploy**: Vercel (gratis)
# tienda-pwa

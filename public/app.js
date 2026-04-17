// ===== PRODUCTOS (puedes cambiar emojis, nombres y precios) =====
const PRODUCTS = [
  { id: 1, name: "Audífonos Aura Pro", emoji: "🎧", tag: "Audio", price: 10.00, desc: "Sonido envolvente 360° con cancelación activa de ruido y 40h de batería." },
  { id: 2, name: "Smartwatch Zenith", emoji: "⌚", tag: "Wearables", price: 199.99, desc: "Monitoreo de salud en tiempo real, GPS integrado y pantalla AMOLED." },
  { id: 3, name: "Bocina Pulse 360", emoji: "🔊", tag: "Audio", price: 89.99, desc: "Sonido omnidireccional resistente al agua IPX7 y 24h de duración." },
  { id: 4, name: "Teclado Phantom RGB", emoji: "⌨️", tag: "Accesorios", price: 149.99, desc: "Mecánico táctil con retroiluminación RGB personalizable por tecla." },
  { id: 5, name: "Mouse Viper X", emoji: "🖱️", tag: "Accesorios", price: 69.99, desc: "Sensor óptico de 25,600 DPI con clic ultraligero y diseño ergonómico." },
  { id: 6, name: "Cámara Lux Mini", emoji: "📷", tag: "Fotografía", price: 349.99, desc: "28MP, lente f/1.8, video 4K y estabilización óptica en formato compacto." },
];

// ===== ESTADO =====
let cart = [];

// ===== DOM REFS =====
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const successModal = document.getElementById('successModal');
const modalClose = document.getElementById('modalClose');
const toastEl = document.getElementById('toast');

// ===== RENDER PRODUCTOS =====
function renderProducts() {
  productsGrid.innerHTML = PRODUCTS.map((p, i) => `
    <div class="product-card" style="animation-delay: ${i * 0.07}s">
      <div class="product-img-placeholder">${p.emoji}</div>
      <div class="product-body">
        <p class="product-tag">${p.tag}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <button class="add-btn" onclick="addToCart(${p.id})">+ Agregar</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== CARRITO =====
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  showToast(`${product.emoji} ${product.name} agregado`);
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
    cartFooter.style.display = 'none';
  } else {
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <span class="cart-item-emoji">${item.emoji}</span>
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</p>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join('');
    cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
    cartFooter.style.display = 'block';
  }
}

// ===== ABRIR / CERRAR CARRITO =====
function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ===== CHECKOUT CON STRIPE =====
checkoutBtn.addEventListener('click', async () => {
  if (cart.length === 0) return;

  checkoutBtn.disabled = true;
  checkoutBtn.textContent = 'Procesando...';

  try {
    // Llama a tu función serverless de Vercel
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: Math.round(item.price * 100), // centavos para Stripe
          quantity: item.qty,
        }))
      })
    });

    const data = await response.json();

    if (data.url) {
      // Redirige a Stripe Checkout
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Error al procesar el pago');
    }

  } catch (error) {
    console.error(error);
    showToast('❌ Error al procesar. Inténtalo de nuevo.');
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = 'Pagar con tarjeta →';
  }
});

// ===== MODAL ÉXITO (cuando Stripe redirige de vuelta) =====
const params = new URLSearchParams(window.location.search);
if (params.get('success') === '1') {
  cart = [];
  updateCartUI();
  successModal.style.display = 'flex';
  // Limpia la URL
  window.history.replaceState({}, document.title, '/');
}

modalClose.addEventListener('click', () => {
  successModal.style.display = 'none';
});

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
}

// ===== SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('✅ Service Worker registrado'))
      .catch(err => console.log('SW error:', err));
  });
}

// ===== INIT =====
renderProducts();
updateCartUI();

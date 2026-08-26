// ══════════════════════════════════════
//  DOM
// ══════════════════════════════════════
const catalog        = document.getElementById("catalog");
const searchInput     = document.getElementById("searchInput");
const genderBar       = document.getElementById("genderBar");
const categoryBar     = document.getElementById("categoryBar");
const resultsCount    = document.getElementById("resultsCount");
const toast           = document.getElementById("toast");
const newSection      = document.getElementById("newSection");
const newCarousel     = document.getElementById("newCarousel");

const modal        = document.getElementById("modal");
const modalImg     = document.getElementById("modal-img");
const modalBrand   = document.getElementById("modal-brand");
const modalTitle   = document.getElementById("modal-title");
const modalDesc    = document.getElementById("modal-desc");
const modalNotes   = document.getElementById("modal-notes");
const modalStock   = document.getElementById("modal-stock");
const closeModal   = document.getElementById("closeModal");
const sizeButtons  = document.querySelectorAll(".sizes button[data-size]");
const buyNowBtn    = document.getElementById("buyNowBtn");

const cartToggle    = document.getElementById("cartToggle");
const cartCount     = document.getElementById("cartCount");
const cartDrawer    = document.getElementById("cartDrawer");
const cartOverlay   = document.getElementById("cartOverlay");
const cartSubtitle  = document.getElementById("cartSubtitle");
const cartItemsEl   = document.getElementById("cartItems");
const cartTotalEl   = document.getElementById("cartTotal");
const cartCheckout  = document.getElementById("cartCheckout");
const cartClear     = document.getElementById("cartClear");
const closeCart     = document.getElementById("closeCart");

let selectedPerfume = null;
let currentGender = "all";
let currentCategory = "all";
let searchTerm = "";

// ══════════════════════════════════════
//  FILTROS DINÁMICOS (a partir de los datos)
// ══════════════════════════════════════
const GENDER_LABELS = { all: "Todos", hombre: "Hombre", mujer: "Mujer", unisex: "Unisex" };
const CATEGORY_LABELS = { all: "Todas", arabe: "Árabe", disenador: "Diseñador", nicho: "Nicho" };

function buildGenderBar() {
  const genders = ["all", ...new Set(PERFUMES.map(p => p.gender))];
  genderBar.innerHTML = genders.map((g, i) =>
    `<button class="filter-btn ${i === 0 ? "active" : ""}" data-gender="${g}">${GENDER_LABELS[g] || g}</button>`
  ).join("");

  genderBar.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      genderBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentGender = btn.dataset.gender;
      renderCards();
    });
  });
}

function buildCategoryBar() {
  const categories = ["all", ...new Set(PERFUMES.map(p => p.category))];
  categoryBar.innerHTML = categories.map((c, i) =>
    `<button class="filter-btn ${i === 0 ? "active" : ""}" data-category="${c}">${CATEGORY_LABELS[c] || c}</button>`
  ).join("");

  categoryBar.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      categoryBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderCards();
    });
  });
}

// ══════════════════════════════════════
//  RENDER CARDS
// ══════════════════════════════════════
function getFilteredList() {
  let list = PERFUMES;

  if (currentGender !== "all") list = list.filter(p => p.gender === currentGender);
  if (currentCategory !== "all") list = list.filter(p => p.category === currentCategory);

  if (searchTerm) {
    const t = searchTerm.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t));
  }

  return list;
}

function buildCard(p, num) {
  const card = document.createElement("article");
  card.className = "card" + (p.stock === false ? " out-of-stock" : "");

  const badge = p.stock === false
    ? '<span class="card-badge">Agotado</span>'
    : (p.isNew ? '<span class="card-badge card-badge-new">Nuevo</span>' : "");

  card.innerHTML = `
    <div class="card-photo">
      <span class="card-num">${num}</span>
      ${badge}
      <img src="${p.img}" alt="${p.name}" loading="lazy" width="280" height="280"/>
      <div class="card-overlay">
        <span class="card-overlay-text">Ver detalle</span>
      </div>
    </div>
    <div class="card-info">
      <p class="card-brand">${p.brand}</p>
      <h3 class="card-name">${p.name}</h3>
      <p class="card-desc">${p.desc}</p>
      <div class="card-footer">
        <span class="card-sizes-hint">5ml · 10ml · Full</span>
        <span class="card-price">desde $${p.prices["5ml"].toLocaleString("es-CO")}</span>
      </div>
    </div>
  `;

  card.addEventListener("click", () => openModal(p));
  return card;
}

function renderCards() {
  const list = getFilteredList();
  catalog.innerHTML = "";

  resultsCount.textContent = `${list.length} fragancia${list.length === 1 ? "" : "s"}`;

  if (list.length === 0) {
    catalog.innerHTML = `<p class="no-results">No se encontraron perfumes que coincidan con tu búsqueda.</p>`;
    return;
  }

  list.forEach((p, i) => {
    const card = buildCard(p, String(i + 1).padStart(2, "0"));
    card.style.animationDelay = `${Math.min(i, 12) * 0.04}s`;
    catalog.appendChild(card);
  });
}

// ══════════════════════════════════════
//  ESTANTE — LO NUEVO DE ESTA SEMANA
// ══════════════════════════════════════
function renderShelf(sectionEl, carouselEl, list) {
  if (list.length === 0) {
    sectionEl.style.display = "none";
    return;
  }

  sectionEl.style.display = "block";
  carouselEl.innerHTML = "";
  list.forEach((p, i) => {
    carouselEl.appendChild(buildCard(p, String(i + 1).padStart(2, "0")));
  });
}

function renderShelves() {
  renderShelf(newSection, newCarousel, PERFUMES.filter(p => p.isNew));
}

// ══════════════════════════════════════
//  MODAL
// ══════════════════════════════════════
function openModal(p) {
  selectedPerfume = p;

  modalImg.src           = p.img;
  modalImg.alt           = p.name;
  modalBrand.textContent = p.brand;
  modalTitle.textContent = p.name;
  modalDesc.textContent  = p.desc;

  modalNotes.innerHTML = `
    <span><strong>Salida</strong>${p.notes.salida}</span>
    <span><strong>Corazón</strong>${p.notes.corazon}</span>
    <span><strong>Fondo</strong>${p.notes.fondo}</span>
  `;

  const outOfStock = p.stock === false;
  modalStock.style.display = outOfStock ? "block" : "none";

  sizeButtons.forEach(btn => {
    const size = btn.dataset.size;
    if (p.prices[size] && !outOfStock) {
      btn.style.display = "block";
      btn.disabled = false;
      btn.textContent = size === "full"
        ? `Botella Completa · $${p.prices[size].toLocaleString("es-CO")}`
        : `${size} · $${p.prices[size].toLocaleString("es-CO")}`;
    } else {
      btn.style.display = p.prices[size] ? "block" : "none";
      btn.disabled = true;
    }
  });

  buyNowBtn.style.display = outOfStock ? "none" : "block";

  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModalFn() {
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

closeModal.onclick = closeModalFn;
modal.onclick = e => { if (e.target === modal) closeModalFn(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModalFn(); closeCartDrawer(); } });

// Agregar al carrito desde el modal
sizeButtons.forEach(btn => {
  btn.addEventListener("click", e => {
    e.stopPropagation();
    if (btn.disabled || !selectedPerfume) return;
    Cart.add(selectedPerfume, btn.dataset.size);
    flashAddedToCart(btn);
  });
});

// Compra directa (un solo perfume) por WhatsApp, sin pasar por el carrito
buyNowBtn.addEventListener("click", () => {
  if (!selectedPerfume) return;
  const size = document.querySelector('.sizes button[data-size]:not([disabled])')?.dataset.size || "5ml";
  window.open(Cart.buildSingleItemUrl(selectedPerfume, size), "_blank");
});

function flashAddedToCart(btn) {
  const original = btn.textContent;
  btn.textContent = "✓ Agregado";
  btn.classList.add("added");
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove("added");
  }, 900);
  pulseCartIcon();
  showToast(`${selectedPerfume.name} agregado al carrito`);
}

let toastTimer = null;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// ══════════════════════════════════════
//  CARRITO — UI
// ══════════════════════════════════════
function renderCart() {
  cartCount.textContent = Cart.count();
  cartCount.style.display = Cart.count() > 0 ? "flex" : "none";
  cartSubtitle.textContent = Cart.count() > 0
    ? `${Cart.count()} artículo${Cart.count() === 1 ? "" : "s"}`
    : "";

  if (Cart.items.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none"/>
          <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none"/>
          <path d="M2.5 4h2.6l2 12.2a1.6 1.6 0 0 0 1.6 1.3h8.9a1.6 1.6 0 0 0 1.6-1.3L21 8H6.4"/>
        </svg>
        <p>Tu carrito está vacío.<br>Agrega perfumes desde el catálogo.</p>
        <button id="cartEmptyCta" class="cart-empty-cta">Ver catálogo</button>
      </div>`;
    cartCheckout.disabled = true;
    document.getElementById("cartEmptyCta").addEventListener("click", () => {
      closeCartDrawer();
      document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
    });
  } else {
    cartItemsEl.innerHTML = Cart.items.map((item, idx) => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.img}" alt="${item.name}" loading="lazy" />
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-meta">${item.brand} · ${Cart.sizeLabel(item.size)}</p>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button data-action="dec" data-idx="${idx}">−</button>
              <span>${item.qty}</span>
              <button data-action="inc" data-idx="${idx}">+</button>
            </div>
            <span class="cart-item-price">$${(item.price * item.qty).toLocaleString("es-CO")}</span>
          </div>
        </div>
        <button class="cart-item-remove" data-action="remove" data-idx="${idx}" aria-label="Quitar">✕</button>
      </div>
    `).join("");
    cartCheckout.disabled = false;
  }

  cartTotalEl.textContent = `$${Cart.total().toLocaleString("es-CO")}`;

  cartItemsEl.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const action = btn.dataset.action;
      if (action === "inc") Cart.updateQty(idx, Cart.items[idx].qty + 1);
      if (action === "dec") Cart.updateQty(idx, Cart.items[idx].qty - 1);
      if (action === "remove") Cart.remove(idx);
    });
  });
}

function openCartDrawer() {
  cartDrawer.classList.add("show");
  cartOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  cartDrawer.classList.remove("show");
  cartOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

function pulseCartIcon() {
  cartToggle.classList.add("pulse");
  setTimeout(() => cartToggle.classList.remove("pulse"), 500);
}

cartToggle.addEventListener("click", openCartDrawer);
closeCart.addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", closeCartDrawer);

cartCheckout.addEventListener("click", () => {
  if (Cart.items.length === 0) return;
  window.open(Cart.checkoutUrl(), "_blank");
});

cartClear.addEventListener("click", () => {
  if (confirm("¿Vaciar el carrito?")) Cart.clear();
});

document.addEventListener("cart:change", renderCart);

// ══════════════════════════════════════
//  BUSCADOR
// ══════════════════════════════════════
searchInput.addEventListener("input", e => {
  searchTerm = e.target.value;
  renderCards();
});

// ══════════════════════════════════════
//  SCROLL SUAVE DESDE EL HERO
// ══════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ══════════════════════════════════════
//  INIT
// ══════════════════════════════════════
buildGenderBar();
buildCategoryBar();
renderShelves();
renderCards();
renderCart();

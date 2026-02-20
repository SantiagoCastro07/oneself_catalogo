// ══════════════════════════════════════
//  CONFIG
// ══════════════════════════════════════
const phone = "573227747150";

// ══════════════════════════════════════
//  DOM
// ══════════════════════════════════════
const catalog     = document.getElementById("catalog");
const modal       = document.getElementById("modal");
const modalImg    = document.getElementById("modal-img");
const modalBrand  = document.getElementById("modal-brand");
const modalTitle  = document.getElementById("modal-title");
const modalDesc   = document.getElementById("modal-desc");
const modalNotes  = document.getElementById("modal-notes");
const closeModal  = document.getElementById("closeModal");
const sizeButtons = document.querySelectorAll(".sizes button");

let selectedPerfume = null;

// ══════════════════════════════════════
//  DATOS
// ══════════════════════════════════════
const perfumes = [
  {
    name: "Hawas Ice",
    brand: "Rasasi",
    img: "assets/hawasIce.png",
    desc: "Fresco, dulce y moderno. Perfecto para clima cálido.",
    prices: { "5ml": 19900, "10ml": 38900 },
    notes: {
      salida:  "Cítricos, manzana",
      corazon: "Canela, lavanda",
      fondo:   "Ámbar, almizcle"
    }
  },
  {
    name: "Hawas Fire (agotado)",
    brand: "Rasasi",
    img: "assets/HawasFire.png",
    desc: "Intenso, especiado y audaz. Una versión ardiente del clásico.",
    prices: { "5ml": 22500, "10ml": 41400 },
    notes: {
      salida:  "Especias, pimienta",
      corazon: "Oud, incienso",
      fondo:   "Ámbar, vetiver"
    }
  },
  {
    name: "Hawas Diva",
    brand: "Rasasi",
    img: "assets/HawasDiva.png",
    desc: "Sofisticado, floral y con carácter. Ideal para ella.",
    prices: { "5ml": 19900, "10ml": 38600 },
    notes: {
      salida:  "Frutas rojas, bergamota",
      corazon: "Rosa, jazmín",
      fondo:   "Sándalo, almizcle"
    }
  },
  {
    name: "Asad Bourbon (agotado)",
    brand: "Lattafa",
    img: "assets/AsadBourbon.png",
    desc: "Dulce, especiado y elegante. Ideal para la noche.",
    prices: { "5ml": 18900, "10ml": 36900 },
    notes: {
      salida:  "Pimienta negra, piña",
      corazon: "Vainilla, café",
      fondo:   "Ámbar, maderas"
    }
  },
  {
    name: "Art Of Universe",
    brand: "Lattafa",
    img: "assets/ArtOfUniverse.png",
    desc: "Sofisticado y versátil, con un aire moderno.",
    prices: { "5ml": 19900, "10ml": 37900 },
    notes: {
      salida:  "Bergamota, cítricos",
      corazon: "Notas florales",
      fondo:   "Maderas, almizcle"
    }
  },
  {
    name: "Yara Tous",
    brand: "Lattafa",
    img: "assets/YaraTous.png",
    desc: "Dulce tropical y femenino. Muy llamativo.",
    prices: { "5ml": 18400, "10ml": 34900 },
    notes: {
      salida:  "Mango, coco",
      corazon: "Flores blancas",
      fondo:   "Vainilla, almizcle"
    }
  },
  {
    name: "Odyssey Aqua",
    brand: "Armaf",
    img: "assets/OdysseyAqua.png",
    desc: "Marino, fresco y libre. Evoca brisa de océano y cielos abiertos.",
    prices: { "5ml": 18800, "10ml": 35900 },
    notes: {
      salida:  "Notas acuáticas, cítricos",
      corazon: "Menta, cachemir",
      fondo:   "Almizcle blanco, ámbar"
    }
  },
  {
    name: "Mandarin Sky",
    brand: "Armaf",
    img: "assets/MandarinSky.png",
    desc: "Cítrico vibrante con corazón cálido. Energizante y optimista.",
    prices: { "5ml": 18900, "10ml": 35900 },
    notes: {
      salida:  "Mandarina, bergamota",
      corazon: "Neroli, flores blancas",
      fondo:   "Cedro, almizcle suave"
    }
  },
  {
    name: "Nitro Red",
    brand: "Armaf",
    img: "assets/nitroRed.png",
    desc: "Intenso, moderno y magnético. Para quien deja huella.",
    prices: { "5ml": 18200, "10ml": 34900 },
    notes: {
      salida:  "Pimienta roja, manzana",
      corazon: "Geranio, lavanda",
      fondo:   "Ámbar, patchouli"
    }
  }
];

// ══════════════════════════════════════
//  RENDER CARDS
// ══════════════════════════════════════
function renderCards(filter) {
  catalog.innerHTML = "";

  const list = filter === "all"
    ? perfumes
    : perfumes.filter(p => p.brand === filter);

  list.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = `${i * 0.06}s`;

    const num = String(i + 1).padStart(2, "0");

    card.innerHTML = `
      <div class="card-photo">
        <span class="card-num">${num}</span>
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        <div class="card-overlay">
          <span class="card-overlay-text">Ver detalle</span>
        </div>
      </div>
      <div class="card-info">
        <p class="card-brand">${p.brand}</p>
        <h3 class="card-name">${p.name}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-footer">
          <span class="card-sizes-hint">5ml · 10ml</span>
          <span class="card-price">desde $${p.prices["5ml"].toLocaleString("es-CO")}</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => openModal(p));
    catalog.appendChild(card);
  });
}

// ══════════════════════════════════════
//  MODAL — abrir
// ══════════════════════════════════════
function openModal(p) {
  selectedPerfume = p;

  modalImg.src            = p.img;
  modalImg.alt            = p.name;
  modalBrand.textContent  = p.brand;
  modalTitle.textContent  = p.name;
  modalDesc.textContent   = p.desc;

  modalNotes.innerHTML = `
    <span><strong>Salida</strong>${p.notes.salida}</span>
    <span><strong>Corazón</strong>${p.notes.corazon}</span>
    <span><strong>Fondo</strong>${p.notes.fondo}</span>
  `;

  // Actualizar precios en botones
  sizeButtons.forEach(btn => {
    const size = btn.dataset.size;
    btn.textContent = `${size} · $${p.prices[size].toLocaleString("es-CO")}`;
  });

  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

// ══════════════════════════════════════
//  MODAL — cerrar
// ══════════════════════════════════════
function closeModalFn() {
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

closeModal.onclick = closeModalFn;
modal.onclick = e => { if (e.target === modal) closeModalFn(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModalFn(); });

// ══════════════════════════════════════
//  TAMAÑOS → WhatsApp
// ══════════════════════════════════════
sizeButtons.forEach(btn => {
  btn.addEventListener("click", e => {
    e.stopPropagation();
    const size = btn.dataset.size;
    const msg  = `Hola! 👋 Me interesa el *${selectedPerfume.name} – ${selectedPerfume.brand}* en ${size}. ¿Está disponible?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    closeModalFn();
  });
});

// ══════════════════════════════════════
//  FILTROS
// ══════════════════════════════════════
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderCards(btn.dataset.filter);
  });
});

// ══════════════════════════════════════
//  INIT
// ══════════════════════════════════════
renderCards("all");

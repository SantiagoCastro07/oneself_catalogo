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
const searchInput = document.getElementById("searchInput");

let selectedPerfume = null;
let currentFilter = "all";
let searchTerm = "";

// ══════════════════════════════════════
//  DATOS
// ══════════════════════════════════════
const perfumes = [
  {
    name: "Eclaire",
    brand: "Lattafa",
    img: "assets/EclaireLattafa.png",
    desc: "Gourmand irresistible con notas dulces. Una delicia exquisita que enamora.",
    prices: { "5ml": 18900, "10ml": 37400 },
    notes: {
      salida:  "Caramelo, leche",
      corazon: "Miel, flores blancas",
      fondo:   "Vainilla, praliné"
    }
  },
  {
    name: "Liquid Brun",
    brand: "Lattafa",
    img: "assets/LiquidBrun.png",
    desc: "Cálido, especiado y sumamente reconfortante. Pura elegancia embotellada.",
    prices: { "5ml": 21900, "10ml": 41600 },
    notes: {
      salida:  "Cardamomo, canela",
      corazon: "Praliné, maderas",
      fondo:   "Vainilla, ámbar"
    }
  },
  {
    name: "Khamrah Qahwa",
    brand: "Lattafa",
    img: "assets/KhamrahQahwa.png",
    desc: "El encanto dulce y especiado con un adictivo toque de café tostado.",
    prices: { "5ml": 18600, "10ml": 36600 },
    notes: {
      salida:  "Canela, cardamomo",
      corazon: "Café, praliné",
      fondo:   "Vainilla, haba tonka"
    }
  },
  {
    name: "Club de Nuit Urban Man Elixir",
    brand: "Armaf",
    img: "assets/ClubDeNuitUrbanManElixir.png",
    desc: "Masculino, especiado y fresco. Una estela poderosa, versátil y muy duradera.",
    prices: { "5ml": 20900, "10ml": 40900 },
    notes: {
      salida:  "Pimienta rosa, bergamota",
      corazon: "Lavanda, geranio",
      fondo:   "Ambroxan, pachulí"
    }
  },
  {
    name: "Sublime",
    brand: "Lattafa",
    img: "assets/Sublime.png",
    desc: "Dulce, frutal y juguetón. Una explosión de manzana roja y flores.",
    prices: { "5ml": 17900, "10ml": 34900 },
    notes: {
      salida:  "Manzana, lichi",
      corazon: "Ciruela, rosa",
      fondo:   "Vainilla, musgo"
    }
  },
  {
    name: "Mandarin Sky Elixir",
    brand: "Armaf",
    img: "assets/MandarinSkyElixir.png",
    desc: "Versión más intensa y profunda del clásico Mandarin Sky. Brillante y ambarado.",
    prices: { "5ml": 21900, "10ml": 41400 },
    notes: {
      salida:  "Mandarina, naranja dulce",
      corazon: "Azafrán, maderas",
      fondo:   "Ámbar, almizcle"
    }
  },
  {
    name: "Odyssey Mega",
    brand: "Armaf",
    img: "assets/OdysseyMega.png",
    desc: "Cítrico, muy fresco. Una ráfaga de energía elegante.",
    prices: { "5ml": 18600, "10ml": 36600 },
    notes: {
      salida:  "Naranja, jengibre",
      corazon: "Bayas de enebro",
      fondo:   "Haba tonka, vetiver"
    }
  },
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
function renderCards() {
  catalog.innerHTML = "";

  let list = perfumes;

  // 1. Filtrar por marca
  if (currentFilter !== "all") {
    list = list.filter(p => p.brand === currentFilter);
  }

  // 2. Filtrar por buscador
  if (searchTerm) {
    const lowerTerm = searchTerm.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(lowerTerm) || 
      p.brand.toLowerCase().includes(lowerTerm)
    );
  }

  // Si no hay resultados
  if (list.length === 0) {
    catalog.innerHTML = `<p class="no-results">No se encontraron perfumes que coincidan con tu búsqueda.</p>`;
    return;
  }

  // Renderizar tarjetas
  list.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = `${i * 0.05}s`;

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
//  FILTROS Y EVENTOS
// ══════════════════════════════════════
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderCards();
  });
});

// Buscador
searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderCards();
});

// ══════════════════════════════════════
//  INIT
// ══════════════════════════════════════
renderCards();
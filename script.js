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
  // --- NUEVOS PERFUMES ---
  // --- NUEVOS PERFUMES AGREGADOS ---
  // --- NUEVOS PERFUMES AÑADIDOS ---
    {
    name: "Stallion 53",
    brand: "Emper",
    img: "assets/stallion53.png",
    desc: "Potente, masculino y elegante. Una fragancia intensa con carácter fuerte que impone presencia desde el primer momento.",
    prices: { "5ml": 21000, "10ml": 41000, "full": 230000 },
    notes: {
      salida:  "Bergamota, Pimienta",
      corazon: "Lavanda, Geranio",
      fondo:   "Ámbar, Madera, Almizcle"
    }
  },
  {
  name: "TAG Uomo Rosso",
  brand: "Armaf",
  img: "assets/TagUomoRosso.png",
  desc: "Elegante, seductor y versátil. Un aroma cálido con un toque dulce y especiado que destaca especialmente en la noche.",
  prices: { "5ml": 22000, "10ml": 42000, "full": 230000 },
  notes: {
    salida:  "Bergamota, Limón, Pimienta Rosa",
    corazon: "Lavanda, Geranio, Canela",
    fondo:   "Ámbar, Vainilla, Cedro, Pachulí"
  }
},
  {
  name: "Amethyst",
  brand: "Lattafa",
  img: "assets/Amethyst.png",
  desc: "Elegante, floral y oscuro. Una rosa intensa con un toque de oud que transmite lujo y sofisticación.",
  prices: { "5ml": 20000, "10ml": 35000, "full": 200000 },
  notes: {
    salida:  "Rosa, Pimienta Rosa",
    corazon: "Jazmín, Rosa Búlgara",
    fondo:   "Oud, Ámbar, Vainilla"
  }
},
{
  name: "Dynasty",
  brand: "Lattafa",
  img: "assets/Dynasty.png",
  desc: "Moderno, elegante y versátil. Un aroma fresco con un fondo amaderado que funciona en cualquier ocasión.",
  prices: { "5ml": 23000, "10ml": 42000, "full": 250000 },
  notes: {
    salida:  "Bergamota, Mandarina",
    corazon: "Lavanda, Geranio",
    fondo:   "Vetiver, Cedro, Ámbar"
  }
},
{
  name: "Hawas Verde",
  brand: "Rasasi",
  img: "assets/HawasVerde.png",
  desc: "Fresco, verde y extremadamente limpio. Perfecto para clima cálido y uso diario.",
  prices: { "5ml": 30000, "10ml": 55000, "full": 320000 },
  notes: {
    salida:  "Bergamota, Toronja",
    corazon: "Jengibre, Cedro",
    fondo:   "Sándalo, Almizcle, Ámbar"
  }
},
{
  name: "Yara",
  brand: "Lattafa",
  img: "assets/YaraPink.png",
  desc: "Dulce, cremoso y femenino. Una fragancia irresistible con vainilla y frutas tropicales.",
  prices: { "5ml": 20000, "10ml": 35000, "full": 210000 },
  notes: {
    salida:  "Heliotropo, Orquídea, Mandarina",
    corazon: "Frutas Tropicales",
    fondo:   "Vainilla, Sándalo, Almizcle"
  }
},
{
  name: "9AM Pour Femme EDP",
  brand: "Afnan",
  img: "assets/9AMPourFemme.png",
  desc: "Luminoso, floral y elegante. Una fragancia femenina fresca con excelente duración.",
  prices: { "5ml": 22000, "10ml": 42000, "full": 225000 },
  notes: {
    salida:  "Mandarina, Bergamota, Toronja",
    corazon: "Rosa, Jazmín, Grosella Negra",
    fondo:   "Almizcle, Vainilla, Cedro"
  }
},
{
  name: "Bright Crystal",
  brand: "Versace",
  img: "assets/BrightCrystal.png",
  desc: "Fresco, floral y delicado. Un clásico femenino elegante y muy fácil de llevar.",
  prices: { "5ml": 30000, "10ml": 55000, "full": 340000 },
  notes: {
    salida:  "Yuzu, Granada",
    corazon: "Peonía, Magnolia, Flor de Loto",
    fondo:   "Almizcle, Caoba, Ámbar"
  }
},
{
  name: "Arabians Tonka",
  brand: "Montale",
  img: "assets/ArabiansTonka.png",
  desc: "Potente, dulce y lujoso. Una mezcla intensa de oud, rosa y haba tonka con una duración espectacular.",
  prices: { "5ml": 35000, "10ml": 65000, "full": 520000 },
  notes: {
    salida:  "Azafrán, Bergamota",
    corazon: "Rosa de Bulgaria, Oud",
    fondo:   "Haba Tonka, Ámbar, Almizcle, Azúcar de Caña"
  }
},
  {
    name: "Eros EDP",
    brand: "Versace",
    img: "assets/erosedp.png",
    desc: "Seductor, intenso y adictivo. Una fragancia dulce y potente que deja huella en cualquier ambiente.",
    prices: { "5ml": 26000, "10ml": 46000, "full": 290000 },
    notes: {
      salida:  "Menta, Manzana, Limón",
      corazon: "Haba Tonka, Ambroxan, Geranio",
      fondo:   "Vainilla, Cedro, Vetiver"
    }
  },
  {
    name: "Bois Imperial",
    brand: "Essential Parfums",
    img: "assets/boisimperial.png",
    desc: "Nicho, elegante y moderno. Un aroma amaderado fresco con un aire limpio y sofisticado que no pasa desapercibido.",
    prices: { "5ml": 40000, "10ml": 75000, "full": 560000 },
    notes: {
      salida:  "Albahaca, Pimienta",
      corazon: "Vetiver, Akigalawood",
      fondo:   "Maderas, Pachulí"
    }
  },
  {
    name: "Vulcan Feu",
    brand: "French Avenue",
    img: "assets/vulcanfeu.png",
    desc: "Caliente, especiado y explosivo. Una fragancia intensa con vibra ardiente perfecta para la noche.",
    prices: { "5ml": 24000, "10ml": 44000, "full": 280000 },
    notes: {
      salida:  "Canela, Pimienta",
      corazon: "Tabaco, Incienso",
      fondo:   "Ámbar, Vainilla, Maderas"
    }
  },
  {
    name: "Hawas Kobra",
    brand: "Rasasi",
    img: "assets/hawasKobra.png",
    desc: "Más oscuro y atrevido. Una versión intensa con un toque dulce y misterioso ideal para destacar.",
    prices: { "5ml": 24000, "10ml": 44000, "full": 265000 },
    notes: {
      salida:  "Frutas, Cítricos",
      corazon: "Especias, Lavanda",
      fondo:   "Ámbar, Maderas, Almizcle"
    }
  },
  {
    name: "Hawas Ice",
    brand: "Rasasi",
    img: "assets/hawasIce.png",
    desc: "Ultra fresco y vibrante. Una fragancia limpia, acuática y moderna perfecta para clima caliente.",
    prices: { "5ml": 24000, "10ml": 44000, "full": 280000 },
    notes: {
      salida:  "Cítricos, Manzana",
      corazon: "Notas acuáticas, Lavanda",
      fondo:   "Almizcle, Maderas"
    }
  },
  {
    name: "Asad Elixir",
    brand: "Lattafa",
    img: "assets/asadelixir.png",
    desc: "Intenso, dulce y especiado. Una fragancia envolvente con mucha personalidad y excelente duración.",
    prices: { "5ml": 23000, "10ml": 43000, "full": 230000 },
    notes: {
      salida:  "Pimienta, Canela",
      corazon: "Vainilla, Incienso",
      fondo:   "Ámbar, Maderas, Benjuí"
    }
  },
  {
    name: "Precieux",
    brand: "Lattafa",
    img: "assets/Precieux.png",
    desc: "Elegancia pura y sofisticación. Una fragancia amaderada y ambarada que proyecta lujo en cada spray.",
    prices: { "5ml": 32000, "10ml": 59000, "full": 320000 },
    notes: {
      salida:  "Azafrán, Bergamota",
      corazon: "Rosa, Jazmín, Madera de Cedro",
      fondo:   "Ámbar, Almizcle, Vainilla"
    }
  },
  {
    name: "9PM Night Out",
    brand: "Afnan",
    img: "assets/9pmNightOut.png",
    desc: "La evolución del 9PM original. Más intenso, nocturno y perfecto para eventos especiales.",
    prices: { "5ml": 25000, "10ml": 45000, "full": 280000 },
    notes: {
      salida:  "Manzana, Canela, Bergamota",
      corazon: "Flor de Azahar, Lirio de los Valles",
      fondo:   "Vainilla, Haba Tonka, Ámbar"
    }
  },
  {
    name: "Hawas for Him",
    brand: "Rasasi",
    img: "assets/HawasForHim.png",
    desc: "El rey de la seducción acuática. Frescura marina combinada con notas frutales y un fondo amaderado irresistible.",
    prices: { "5ml": 22000, "10ml": 42000, "full": 242000 },
    notes: {
      salida:  "Manzana, Bergamota, Canela",
      corazon: "Notas Marinas, Ciruela, Cardamomo",
      fondo:   "Ámbar Gris, Almizcle, Madera a la deriva"
    }
  },
  {
    name: "His Confession",
    brand: "Lattafa",
    img: "assets/HisConfession.png",
    desc: "Inspirado en la intensidad y la elegancia. Un aroma profundo, especiado y magnético.",
    prices: { "5ml": 21000, "10ml": 40000, "full": 245000 },
    notes: {
      salida:  "Canela, Mandarina",
      corazon: "Lavanda, Especias",
      fondo:   "Vainilla, Pachulí"
    }
  },
  {
    name: "Le Male",
    brand: "Jean Paul Gaultier",
    img: "assets/LeMaleJPG.png",
    desc: "Un clásico atemporal. Frescura de lavanda combinada con la calidez de la vainilla.",
    prices: { "5ml": 32000, "10ml": 60000, "full": 620000 },
    notes: {
      salida:  "Menta, Lavanda",
      corazon: "Flor de azahar, Canela",
      fondo:   "Vainilla, Haba tonka"
    }
  },
  {
    name: "Amber Oud Gold Edition",
    brand: "Al Haramain",
    img: "assets/AmberOudGoldEdition.png",
    desc: "Lujo puro. Una fragancia dulce, frutal y ambarada con una proyección inigualable.",
    prices: { "5ml": 23000, "10ml": 43000, "full (120ml)": 290000 },
    notes: {
      salida:  "Notas verdes, Bergamota",
      corazon: "Melón, Piña, Ámbar",
      fondo:   "Vainilla, Almizcle"
    }
  },
  {
    name: "9PM Rebel",
    brand: "Afnan",
    img: "assets/9PmRebel.png",
    desc: "Una versión más fresca y audaz del clásico 9PM. Perfecta para destacar en cualquier lugar.",
    prices: { "5ml": 20000, "10ml": 38000, "full": 226000 },
    notes: {
      salida:  "Manzana verde, Cítricos",
      corazon: "Notas amaderadas",
      fondo:   "Musgo de roble, Ámbar"
    }
  },
  {
    name: "Odyssey Aqua",
    brand: "Armaf",
    img: "assets/OdysseyAqua.png",
    desc: "Acuático, fresco y afrutado. Perfecto para el día a día y climas cálidos.",
    prices: { "5ml": 23000, "10ml": 42000, "full": 235000 },
    notes: {
      salida:  "Naranja, Toronja",
      corazon: "Menta, Notas acuáticas",
      fondo:   "Ambroxan, Maderas"
    }
  },
  {
    name: "9PM",
    brand: "Afnan",
    img: "assets/9Pm.png",
    desc: "Dulce, nocturno y seductor. Una bomba de vainilla y manzana para salir de fiesta.",
    prices: { "5ml": 20000, "10ml": 38000, "full": 210000 },
    notes: {
      salida:  "Manzana, Canela",
      corazon: "Flor de azahar",
      fondo:   "Vainilla, Haba tonka"
    }
  },
  {
    name: "Supremacy Collector Edition",
    brand: "Afnan",
    img: "assets/SupremacyCollector.png",
    desc: "Intenso, afrutado y ahumado. Proyección bestial y lluvia de cumplidos.",
    prices: { "5ml": 25000, "10ml": 45000, "full": 269000 },
    notes: {
      salida:  "Grosellas, Bergamota",
      corazon: "Pachulí, Abedul",
      fondo:   "Almizcle, Musgo"
    }
  },
  // --- PERFUMES EXISTENTES ---
  {
    name: "Eclaire",
    brand: "Lattafa",
    img: "assets/EclaireLattafa.png",
    desc: "Gourmand irresistible con notas dulces. Una delicia exquisita que enamora.",
    prices: { "5ml": 20000, "10ml": 38000, "full": 210000 },
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
    prices: { "5ml": 24000, "10ml": 44000, "full": 275000 },
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
    prices: { "5ml": 21000, "10ml": 39000, "full": 210000 },
    notes: {
      salida:  "Canela, cardamomo",
      corazon: "Café, praliné",
      fondo:   "Vainilla, haba tonka"
    }
  },
  {
    name: "Sublime",
    brand: "Lattafa",
    img: "assets/Sublime.png",
    desc: "Dulce, frutal y juguetón. Una explosión de manzana roja y flores.",
    prices: { "5ml": 20000, "10ml": 38000, "full": 190000 },
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
    prices: { "5ml": 23000, "10ml": 42000, "full": 265000 },
    notes: {
      salida:  "Mandarina, naranja dulce",
      corazon: "Azafrán, maderas",
      fondo:   "Ámbar, almizcle"
    }
  },
  {
    name: "Odyssey HOMME White",
    brand: "Armaf",
    img: "assets/odysseywhite.png",
    desc: "Un perfume infravalorado que sorprende desde el primer spray. Abre fresco y jugoso con cítricos y Pimienta rosa, luego evoluciona a un corazón elegante con hojas de violeta y notas marinas que le da un toque cálido y masculino. En el fondo, el ámbar y el amberwood crean una estela suave, ligeramente dulce y muy adictiva. Versátil, moderno y perfecto para clima cálido, uso diario o citas.",
    prices: { "5ml": 22000, "10ml": 42000, "full": 220000 },
    notes: {
      salida:  "Pimienta Rosa, Toronja",
      corazon: "Hojas de violeta, notas marinas",
      fondo:   "Ámbar, Amberwood"
    }
  },
  {
    name: "Hawas Fire",
    brand: "Rasasi",
    img: "assets/HawasFire.png",
    desc: "Intenso, especiado y audaz. Una versión ardiente del clásico.",
    prices: { "5ml": 25000, "10ml": 43000, "full": 270000 },
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
    prices: { "5ml": 20000, "10ml": 39000, "full": 248000 },
    notes: {
      salida:  "Frutas rojas, bergamota",
      corazon: "Rosa, jazmín",
      fondo:   "Sándalo, almizcle"
    }
  },
  {
    name: "Asad Bourbon",
    brand: "Lattafa",
    img: "assets/AsadBourbon.png",
    desc: "Dulce, especiado y elegante. Ideal para la noche.",
    prices: { "5ml": 20000, "10ml": 38000, "full": 206000 },
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
    prices: { "5ml": 23000, "10ml": 40000, "full": 256000 },
    notes: {
      salida:  "Bergamota, cítricos",
      corazon: "Notas florales",
      fondo:   "Maderas, almizcle"
    }
  },
  {
    name: "Mandarin Sky",
    brand: "Armaf",
    img: "assets/MandarinSky.png",
    desc: "Cítrico vibrante con corazón cálido. Energizante y optimista.",
    prices: { "5ml": 20000, "10ml": 38000, "full": 204000 },
    notes: {
      salida:  "Mandarina, bergamota",
      corazon: "Neroli, flores blancas",
      fondo:   "Cedro, almizcle suave"
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
          <span class="card-sizes-hint">5ml · 10ml · Full</span>
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

  // Actualizar precios en botones dinámicamente
  sizeButtons.forEach(btn => {
    const size = btn.dataset.size;
    if (p.prices[size]) {
      btn.style.display = "block";
      if (size === "full") {
        btn.textContent = `Botella Completa · $${p.prices[size].toLocaleString("es-CO")}`;
      } else {
        btn.textContent = `${size} · $${p.prices[size].toLocaleString("es-CO")}`;
      }
    } else {
      btn.style.display = "none";
    }
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
    const sizeKey = btn.dataset.size;
    // Si seleccionó botella completa, lo ponemos en el mensaje de forma bonita
    const sizeText = sizeKey === "full" ? "botella completa" : sizeKey;
    
    const msg  = `Hola! 👋 Me interesa el *${selectedPerfume.name} – ${selectedPerfume.brand}* en formato *${sizeText}*. ¿Está disponible?`;
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

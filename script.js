const phone = "573227747150";

const catalog = document.getElementById("catalog");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalNotes = document.getElementById("modal-notes");
const modalPrice = document.getElementById("modal-price");
const closeModal = document.getElementById("closeModal");

let selectedPerfume = null;

const perfumes = [
  {
    name: "Hawas Ice – Rasasi",
    img: "assets/hawas.webp",
    desc: "Fresco, dulce y moderno. Perfecto para clima cálido y uso diario.",
    prices: {
      "5ml": 25000,
      "10ml": 45000
    },
    notes: {
      salida: "Cítricos, manzana",
      corazon: "Canela, lavanda",
      fondo: "Ámbar, almizcle"
    }
  },
  {
    name: "Asad Bourbon – Lattafa",
    img: "assets/AsadBourbon.jpg",
    desc: "Dulce, especiado y elegante. Ideal para la noche.",
    prices: {
      "5ml": 30000,
      "10ml": 55000
    },
    notes: {
      salida: "Pimienta negra, piña",
      corazon: "Vainilla, café",
      fondo: "Ámbar, maderas"
    }
  },
  {
    name: "Art Of Universe – Lattafa",
    img: "assets/ArtOfUniverse.webp",
    desc: "Sofisticado y versátil, con un aire artístico y moderno.",
    prices: {
      "5ml": 28000,
      "10ml": 52000
    },
    notes: {
      salida: "Bergamota, cítricos",
      corazon: "Notas florales",
      fondo: "Maderas, almizcle"
    }
  },
  {
    name: "Yara Tous – Lattafa",
    img: "assets/YaraTous.webp",
    desc: "Dulce tropical y femenino. Muy llamativo y agradable.",
    prices: {
      "5ml": 27000,
      "10ml": 50000
    },
    notes: {
      salida: "Mango, coco",
      corazon: "Flores blancas",
      fondo: "Vainilla, almizcle"
    }
  }
];

/* ==========================
   RENDER CATÁLOGO
========================== */
perfumes.forEach(p => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${p.img}" alt="${p.name}">
    <h3>${p.name}</h3>
    <span>Decant · 5ml / 10ml</span>
  `;

  card.addEventListener("click", () => {
    selectedPerfume = p;

    modalTitle.textContent = p.name;
    modalDesc.textContent = p.desc;

    modalNotes.innerHTML = `
      <span><strong>Salida:</strong> ${p.notes.salida}</span>
      <span><strong>Corazón:</strong> ${p.notes.corazon}</span>
      <span><strong>Fondo:</strong> ${p.notes.fondo}</span>
    `;

    modalPrice.textContent = `
      5ml: $${p.prices["5ml"].toLocaleString()} · 
      10ml: $${p.prices["10ml"].toLocaleString()}
    `;

    modal.classList.add("show");
  });

  catalog.appendChild(card);
});

/* ==========================
   BOTONES DE TAMAÑO
========================== */
document.querySelectorAll(".sizes button").forEach(btn => {
  btn.addEventListener("click", () => {
    const size = btn.dataset.size;
    const price = selectedPerfume.prices[size];

    const message = `Hola 👋, me interesa el ${selectedPerfume.name}
Tamaño: ${size}
Precio: $${price.toLocaleString()}`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    modal.classList.remove("show");
  });
});

/* ==========================
   CERRAR MODAL
========================== */
closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

const phone = "573227747150";

const catalog = document.getElementById("catalog");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalNotes = document.getElementById("modal-notes");
const closeModal = document.getElementById("closeModal");
const sizeButtons = document.querySelectorAll(".sizes button");

let selectedPerfume = null;

const perfumes = [
  {
    name: "Hawas Ice – Rasasi",
    img: "assets/hawasIce.png",
    desc: "Fresco, dulce y moderno. Perfecto para clima cálido.",
    prices: { "5ml": 22000, "10ml": 40000 },
    notes: {
      salida: "Cítricos, manzana",
      corazon: "Canela, lavanda",
      fondo: "Ámbar, almizcle"
    }
  },
  {
    name: "Asad Bourbon – Lattafa",
    img: "assets/AsadBourbon.png",
    desc: "Dulce, especiado y elegante. Ideal para la noche.",
    prices: { "5ml": 18000, "10ml": 32000 },
    notes: {
      salida: "Pimienta negra, piña",
      corazon: "Vainilla, café",
      fondo: "Ámbar, maderas"
    }
  },
  {
    name: "Art Of Universe – Lattafa",
    img: "assets/ArtOfUniverse.png",
    desc: "Sofisticado y versátil, con un aire moderno.",
    prices: { "5ml": 21000, "10ml": 38000 },
    notes: {
      salida: "Bergamota, cítricos",
      corazon: "Notas florales",
      fondo: "Maderas, almizcle"
    }
  },
  {
    name: "Yara Tous – Lattafa",
    img: "assets/YaraTous.png",
    desc: "Dulce tropical y femenino. Muy llamativo.",
    prices: { "5ml": 17000, "10ml": 30000 },
    notes: {
      salida: "Mango, coco",
      corazon: "Flores blancas",
      fondo: "Vainilla, almizcle"
    }
  }
];

// Crear cards
perfumes.forEach(p => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${p.img}" alt="${p.name}">
    <h3>${p.name}</h3>
    <span>Decant · 5ml / 10ml</span>
    <div class="price">
      $${p.prices["5ml"]} · $${p.prices["10ml"]}
    </div>
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

    sizeButtons.forEach(btn => {
      const size = btn.dataset.size;
      btn.textContent = `${size} · $${p.prices[size]}`;
    });

    modal.classList.add("show");
  });

  catalog.appendChild(card);
});

// Tamaños → WhatsApp
sizeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const size = btn.dataset.size;
    const price = selectedPerfume.prices[size];

    const message = `Hola, me interesa el ${selectedPerfume.name} en ${size} por $${price}.`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    modal.classList.remove("show");
  });
});

// Cerrar modal
closeModal.onclick = () => modal.classList.remove("show");
modal.onclick = e => e.target === modal && modal.classList.remove("show");

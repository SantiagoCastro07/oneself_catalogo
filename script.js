const phone = "573227747150";
const catalog = document.getElementById("catalog");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalNotes = document.getElementById("modal-notes");
const closeModal = document.getElementById("closeModal");

let selectedPerfume = null;

const perfumes = [
  {
    name: "Hawas Ice – Rasasi",
    img: "assets/hawas.webp",
    desc: "Fresco, dulce y moderno. Perfecto para clima cálido y uso diario.",
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
    notes: {
      salida: "Mango, coco",
      corazon: "Flores blancas",
      fondo: "Vainilla, almizcle"
    }
  }
];

perfumes.forEach(p => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${p.img}">
    <h3>${p.name}</h3>
    <span>Decant · 5ml / 10ml</span>
  `;

  card.onclick = () => {
    selectedPerfume = p;
    modalTitle.textContent = p.name;
    modalDesc.textContent = p.desc;

    modalNotes.innerHTML = `
      <span><strong>Salida:</strong> ${p.notes.salida}</span>
      <span><strong>Corazón:</strong> ${p.notes.corazon}</span>
      <span><strong>Fondo:</strong> ${p.notes.fondo}</span>
    `;

    modal.classList.add("show");
  };

  catalog.appendChild(card);
});

document.querySelectorAll(".sizes button").forEach(btn => {
  btn.addEventListener("click", () => {
    const size = btn.dataset.size;
    const message = `Hola, me interesa el ${selectedPerfume.name} en ${size}.`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    modal.classList.remove("show");
  });
});

closeModal.onclick = () => {
  modal.classList.remove("show");
};

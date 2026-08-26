// ══════════════════════════════════════
//  CARRITO — persistido en localStorage
//  Un pedido con varios perfumes genera UN solo mensaje de WhatsApp.
// ══════════════════════════════════════
const WHATSAPP_PHONE = "573227747150";
const CART_KEY = "oneself_cart_v1";

const Cart = {
  items: [],

  load() {
    try {
      this.items = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      this.items = [];
    }
  },

  save() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
    document.dispatchEvent(new CustomEvent("cart:change"));
  },

  add(perfume, size) {
    const existing = this.items.find(i => i.id === perfume.id && i.size === size);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({
        id: perfume.id,
        name: perfume.name,
        brand: perfume.brand,
        img: perfume.img,
        size,
        price: perfume.prices[size],
        qty: 1
      });
    }
    this.save();
  },

  updateQty(index, qty) {
    if (qty <= 0) {
      this.remove(index);
      return;
    }
    this.items[index].qty = qty;
    this.save();
  },

  remove(index) {
    this.items.splice(index, 1);
    this.save();
  },

  clear() {
    this.items = [];
    this.save();
  },

  count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  total() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  sizeLabel(size) {
    return size === "full" ? "botella completa" : size;
  },

  buildWhatsappMessage() {
    if (this.items.length === 0) return "";
    const lines = this.items.map((i, idx) =>
      `${idx + 1}. *${i.name}* (${i.brand}) — ${this.sizeLabel(i.size)} x${i.qty} — $${(i.price * i.qty).toLocaleString("es-CO")}`
    );
    const total = this.total().toLocaleString("es-CO");
    return [
      "Hola! 👋 Quiero hacer un pedido en OneSelf:",
      "",
      ...lines,
      "",
      `Total estimado: $${total}`,
      "",
      "¿Me confirman disponibilidad y envío? 🙌"
    ].join("\n");
  },

  checkoutUrl() {
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(this.buildWhatsappMessage())}`;
  },

  buildSingleItemUrl(perfume, size) {
    const sizeText = this.sizeLabel(size);
    const msg = `Hola! 👋 Me interesa el *${perfume.name} – ${perfume.brand}* en formato *${sizeText}*. ¿Está disponible?`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  }
};

Cart.load();

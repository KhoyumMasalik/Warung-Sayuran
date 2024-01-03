document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 18, name: "Kangkung", img: "18.jpg", price:35000 },
      { id: 1, name: "Bayam", img: "1.jpg", price: 15000 },
      { id: 2, name: "Saladaa", img: "2.jpg", price: 20000 },
      { id: 3, name: "Sawi Hijau ", img: "3.jpg", price: 13000 },
      { id: 4, name: "Kol", img: "4.jpg", price: 18000 },
      { id: 5, name: "Sawi Putih", img: "5.jpg", price: 12000 },
      { id: 6, name: "Tahu Kuning /12pcs", img: "6.jpeg", price: 13000 },
      { id: 7, name: "Tahu Putih /12pcs", img: "7.jpg", price: 12000 },
      { id: 8, name: "Bawang Putih", img: "8.jpg", price: 33000 },
      { id: 9, name: "Bawang Merah", img: "9.jpg", price: 36000 },
      { id: 20, name: "Cabai Kriting", img: "20.jpg", price: 58000 },
      { id: 11, name: "Cabai Rawit", img: "11.jpg", price: 45000 },
      { id: 12, name: "Cabai Merah", img: "12.jpg", price: 65000 },
      { id: 10, name: "Tomat", img: "10.jpeg", price: 28000 },
      { id: 13, name: "Jengkol", img: "13.jpeg", price: 40000 },
      { id: 14, name: "Browkoli", img: "14.jpg", price: 35000 },
      { id: 15, name: "Terong", img: "15.jpeg", price: 12000 },
      { id: 16, name: "Kacang Panjang", img: "16.jpg", price: 17000 },
      { id: 17, name: "Buncis", img: "17.jpg", price: 22000 },
      { id: 19, name: "Timun", img: "19.png", price: 17000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada /cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        //   jika brang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          //   jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            //   jika barang sudah ada maka tambah dan totanya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau di remove
      const cartItem = this.items.find((item) => item.id === id);

      //   jika lebih dari 1
      if (cartItem.quantity > 1) {
        //   telusuri satu satu
        this.items = this.items.map((item) => {
          //   jika bukan barang yang di clik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// form validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open("http://wa.me/6282246108750?text=" + encodeURIComponent(message));
});

// format pesan Whatsapp
const formatMessage = (obj) => {
  return `Data Customer 
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
    Data Pesanan
    ${JSON.parse(obj.items).map(
      (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})\n`
    )}
    TOTAL: ${rupiah(obj.total)}
    Terima Kasih.`;
};

// Konversi ke rupiah

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

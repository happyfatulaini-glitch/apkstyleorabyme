// =====================================
// 1. DATA PRODUK
// =====================================

const products = [
    {
        id: 1,
        name: "Elegant Summer Dress",
        category: "Women",
        price: 185000,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
        label: "BEST SELLER"
    },
    {
        id: 2,
        name: "Classic White Shirt",
        category: "Men",
        price: 125000,
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600",
        label: "NEW"
    },
    {
        id: 3,
        name: "Minimalist Handbag",
        category: "Accessories",
        price: 210000,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",
        label: "TRENDING"
    },
    {
        id: 4,
        name: "Casual Beige Outfit",
        category: "Women",
        price: 175000,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
        label: "POPULAR"
    },
    {
        id: 5,
        name: "Modern Streetwear",
        category: "Men",
        price: 195000,
        image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600",
        label: "NEW"
    },
    {
        id: 6,
        name: "Fashion Sunglasses",
        category: "Accessories",
        price: 95000,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
        label: "SALE"
    },
    {
        id: 7,
        name: "Chic Pink Dress",
        category: "Women",
        price: 225000,
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600",
        label: "FAVORITE"
    },
    {
        id: 8,
        name: "Casual Denim Jacket",
        category: "Men",
        price: 250000,
        image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600",
        label: "TRENDING"
    }
];


// =====================================
// 2. MENYIMPAN DATA
// =====================================

let cart = JSON.parse(localStorage.getItem("styleoraCart")) || [];

let wishlist = JSON.parse(localStorage.getItem("styleoraWishlist")) || [];

let currentCategory = "All";
let showWishlist = false;

function saveData() {
    localStorage.setItem("styleoraCart", JSON.stringify(cart));
    localStorage.setItem("styleoraWishlist", JSON.stringify(wishlist));
}


// =====================================
// 3. MENAMPILKAN PRODUK
// =====================================

const productGrid = document.getElementById("productGrid");

function displayProducts() {

    const keyword = document
        .getElementById("searchInput")
        .value.toLowerCase();

    const filteredProducts = products.filter(product => {

        const matchCategory =
            currentCategory === "All" ||
            product.category === currentCategory;

        const matchSearch =
            product.name.toLowerCase().includes(keyword);

        const matchWishlist =
            !showWishlist || wishlist.includes(product.id);

        return matchCategory && matchSearch && matchWishlist;
    });

    productGrid.innerHTML = "";

    if (filteredProducts.length === 0) {
        productGrid.innerHTML =
            '<p class="no-result">Produk tidak ditemukan 💗</p>';
        return;
    }

    filteredProducts.forEach(product => {

        const liked = wishlist.includes(product.id);

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">

                <span class="badge">${product.label}</span>

                <button class="heart-btn ${liked ? "liked" : ""}"
                    data-action="wishlist"
                    data-id="${product.id}">
                    ${liked ? "♥" : "♡"}
                </button>
            </div>

            <div class="product-info">
                <small>${product.category}</small>
                <h3>${product.name}</h3>
                <p>${formatRupiah(product.price)}</p>

                <button class="add-btn"
                    data-action="add"
                    data-id="${product.id}">
                    + Add to Bag
                </button>
            </div>
        `;

        productGrid.appendChild(card);
    });
}


// =====================================
// 4. FORMAT HARGA RUPIAH
// =====================================

function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}


// =====================================
// 5. FILTER KATEGORI
// =====================================

document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filter-btn")
            .forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        currentCategory = this.dataset.category;

        showWishlist = false;

        document.getElementById("wishlistBtn").style.color = "";

        displayProducts();
    });
});


// =====================================
// 6. PENCARIAN PRODUK
// =====================================

document.getElementById("searchInput")
    .addEventListener("input", displayProducts);


// =====================================
// 7. WISHLIST
// =====================================

document.getElementById("wishlistBtn")
    .addEventListener("click", function() {

        showWishlist = !showWishlist;

        this.style.color = showWishlist ? "#d75b74" : "";

        currentCategory = "All";

        document.querySelectorAll(".filter-btn")
            .forEach(btn => btn.classList.remove("active"));

        document.querySelector('[data-category="All"]')
            .classList.add("active");

        displayProducts();
    });


// =====================================
// 8. TOMBOL PRODUK
// =====================================

productGrid.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);

    const action = button.dataset.action;

    const product = products.find(item => item.id === id);

    if (!product) return;

    if (action === "add") {

        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                id: id,
                quantity: 1
            });
        }

        saveData();
        updateCart();

        alert(product.name + " berhasil ditambahkan ke keranjang!");

    }

    if (action === "wishlist") {

        if (wishlist.includes(id)) {

            wishlist = wishlist.filter(item => item !== id);

        } else {

            wishlist.push(id);

        }

        saveData();
        updateCart();
        displayProducts();
    }
});


// =====================================
// 9. MENAMPILKAN KERANJANG
// =====================================

const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

function openCart() {

    cartPanel.classList.add("show");
    overlay.classList.add("show");

}

function closeCart() {

    cartPanel.classList.remove("show");
    overlay.classList.remove("show");

}

document.getElementById("cartBtn")
    .addEventListener("click", openCart);

document.getElementById("closeCart")
    .addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);


// =====================================
// 10. MENGHITUNG TOTAL BELANJA
// =====================================

function updateCart() {

    const cartItems = document.getElementById("cartItems");

    const cartCount = document.getElementById("cartCount");

    const wishCount = document.getElementById("wishCount");

    const cartTotal = document.getElementById("cartTotal");

    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="no-result">Keranjang masih kosong 🛍️</p>';

    }

    cart.forEach(item => {

        const product = products.find(p => p.id === item.id);

        if (!product) return;

        const subtotal = product.price * item.quantity;

        total += subtotal;
        totalQuantity += item.quantity;

        const element = document.createElement("div");

        element.className = "cart-item";

        element.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="cart-detail">
                <h4>${product.name}</h4>
                <p>${formatRupiah(product.price)}</p>

                <div class="quantity">
                    <button data-action="minus" data-id="${product.id}">-</button>
                    <span>${item.quantity}</span>
                    <button data-action="plus" data-id="${product.id}">+</button>
                </div>
            </div>

            <button class="remove-btn"
                data-action="remove"
                data-id="${product.id}">
                ✕
            </button>
        `;

        cartItems.appendChild(element);
    });

    cartCount.textContent = totalQuantity;
    wishCount.textContent = wishlist.length;
    cartTotal.textContent = formatRupiah(total);

    document.getElementById("checkoutBtn").disabled =
        cart.length === 0;
}


// =====================================
// 11. MENGATUR JUMLAH BARANG
// =====================================

document.getElementById("cartItems")
    .addEventListener("click", function(event) {

        const button = event.target.closest("button");

        if (!button) return;

        const id = Number(button.dataset.id);

        const action = button.dataset.action;

        const item = cart.find(p => p.id === id);

        if (!item) return;

        if (action === "plus") {

            item.quantity++;

        }

        if (action === "minus") {

            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(p => p.id !== id);
            }

        }

        if (action === "remove") {

            cart = cart.filter(p => p.id !== id);

        }

        saveData();
        updateCart();
    });


// =====================================
// 12. CHECKOUT
// =====================================

document.getElementById("checkoutBtn")
    .addEventListener("click", function() {

        if (cart.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        let total = 0;

        cart.forEach(item => {

            const product = products.find(p => p.id === item.id);

            if (product) {
                total += product.price * item.quantity;
            }

        });

        const confirmOrder = confirm(
            "Total belanja kamu: " + formatRupiah(total) +
            "\nApakah kamu ingin melanjutkan checkout?"
        );

        if (confirmOrder) {

            alert(
                "Terima kasih sudah berbelanja di Styleora! 💗" +
                "\nIni hanya simulasi pemesanan."
            );

            cart = [];

            saveData();
            updateCart();
            closeCart();
        }
    });


// =====================================
// 13. MENJALANKAN APLIKASI
// =====================================

displayProducts();
updateCart();
  

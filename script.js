// Sample Jewelry Product Data
const products = [
  {
    id: 1,
    name: "Solitaire Diamond Ring",
    price: 1250,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "18k Gold Layered Necklace",
    price: 450,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Pearl Drop Earrings",
    price: 280,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Minimalist Gold Cuff",
    price: 320,
    image: "https://images.unsplash.com/photo-1611591475140-49886469c240?auto=format&fit=crop&w=600&q=80"
  }
];

let cart = [];

// DOM Elements
const productGrid = document.getElementById("product-grid");
const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotalPrice = document.getElementById("cart-total-price");

// Render Product Grid
function renderProducts() {
  productGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Bag</button>
    </div>
  `).join('');
}

// Add Item to Cart
function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  updateCartUI();
}

// Update Cart Display & Count
function updateCartUI() {
  cartCount.textContent = cart.length;
  
  cartItemsContainer.innerHTML = cart.map(item => `
    <li class="cart-item">
      <span>${item.name}</span>
      <span>$${item.price}</span>
    </li>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotalPrice.textContent = `$${total}`;
}

// Toggle Modal Controls
cartBtn.addEventListener("click", () => cartModal.style.display = "flex");
closeCartBtn.addEventListener("click", () => cartModal.style.display = "none");

window.addEventListener("click", (e) => {
  if (e.target === cartModal) cartModal.style.display = "none";
});

// Initialize Page
renderProducts();
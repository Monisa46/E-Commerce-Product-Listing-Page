// ============================
// Get DOM Elements
// ============================
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const ratingFilter = document.getElementById('ratingFilter');
const productCards = document.querySelectorAll('.product-card');
const modal = document.getElementById('productModal');
const closeModalBtn = document.querySelector('.close-btn');

// Modal Content Elements
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalPrice = document.getElementById('modalPrice');
const modalRating = document.getElementById('modalRating');
const modalDescription = document.getElementById('modalDescription');

// ============================
// Event Listeners
// ============================
searchInput.addEventListener('keyup', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
priceFilter.addEventListener('change', filterProducts);
ratingFilter.addEventListener('change', filterProducts);
closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// Add click event to "View Details" buttons
document.querySelectorAll('.details-btn').forEach(button => {
  button.addEventListener('click', openProductModal);
});

// ============================
// Filtering Function
// ============================
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedPrice = priceFilter.value;
  const selectedRating = ratingFilter.value;

  productCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const category = card.dataset.category;
    const price = parseFloat(card.dataset.price);
    const rating = parseFloat(card.dataset.rating);

    let visible = true;

    // Filter by Search
    if (!title.includes(searchTerm)) {
      visible = false;
    }

    // Filter by Category
    if (selectedCategory !== 'all' && selectedCategory !== category) {
      visible = false;
    }

    // Filter by Price
    if (selectedPrice !== 'all') {
      const [min, max] = selectedPrice.split('-').map(Number);
      if (price < min || price > max) {
        visible = false;
      }
    }

    // Filter by Rating
    if (selectedRating !== 'all' && rating < parseFloat(selectedRating)) {
      visible = false;
    }

    card.style.display = visible ? 'block' : 'none';
  });
}

// ============================
// Modal Functionality
// ============================
function openProductModal(e) {
  const card = e.target.closest('.product-card');

  const title = card.querySelector('h3').textContent;
  const image = card.querySelector('img').src;
  const price = card.querySelector('p').textContent;
  const rating = card.querySelector('.rating').textContent;

  modalTitle.textContent = title;
  modalImage.src = image;
  modalPrice.textContent = price;
  modalRating.textContent = rating;
  modalDescription.textContent = `Here is a detailed description of ${title}. This high-quality item is perfect for your needs!`;

  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}

function outsideClick(e) {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
}

// ============================
// Optional: Keyboard Support
// ============================
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    modal.style.display = 'none';
  }
});

// ============================
// Bonus: Highlight Matching Search
// ============================
function highlightSearchMatch(text, term) {
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Optional Extension (if needed for dynamic content later)
function createProductCard(product) {
  const card = document.createElement('div');
  card.classList.add('product-card');
  card.setAttribute('data-category', product.category);
  card.setAttribute('data-price', product.price);
  card.setAttribute('data-rating', product.rating);

  card.innerHTML = `
    <img src="${product.image}" alt="${product.title}" />
    <h3>${product.title}</h3>
    <p>₹${product.price}</p>
    <p class="rating">⭐⭐⭐⭐ (${product.rating})</p>
    <button class="details-btn">View Details</button>
  `;

  card.querySelector('.details-btn').addEventListener('click', openProductModal);
  return card;
}

// Example: You could dynamically generate more products like this:
// const newProduct = {
//   title: "New Arrival",
//   image: "https://via.placeholder.com/200x150",
//   price: 349,
//   category: "electronics",
//   rating: 4.7
// };
// document.querySelector('.product-grid').appendChild(createProductCard(newProduct));

// ============================
// End of Script
// ============================
// ============================
// Sorting Functionality
// ============================

const sortSelect = document.createElement('select');
sortSelect.id = 'sortOptions';
sortSelect.innerHTML = `
  <option value="default">Sort By</option>
  <option value="price-low-high">Price: Low to High</option>
  <option value="price-high-low">Price: High to Low</option>
  <option value="rating-high-low">Rating: High to Low</option>
`;

document.querySelector('.filters').appendChild(sortSelect);

sortSelect.addEventListener('change', function () {
  sortProducts(sortSelect.value);
});

function sortProducts(option) {
  const grid = document.querySelector('.product-grid');
  const cardsArray = Array.from(grid.children);

  const sortedCards = cardsArray.sort((a, b) => {
    const priceA = parseFloat(a.dataset.price);
    const priceB = parseFloat(b.dataset.price);
    const ratingA = parseFloat(a.dataset.rating);
    const ratingB = parseFloat(b.dataset.rating);

    if (option === 'price-low-high') return priceA - priceB;
    if (option === 'price-high-low') return priceB - priceA;
    if (option === 'rating-high-low') return ratingB - ratingA;
    return 0;
  });

  sortedCards.forEach(card => grid.appendChild(card));
}

// ============================
// Filter Result Count
// ============================

const countDisplay = document.createElement('p');
countDisplay.id = 'resultCount';
countDisplay.style.marginTop = '10px';
document.querySelector('.product-section .container').prepend(countDisplay);

function updateCount() {
  const visibleCards = Array.from(productCards).filter(card => card.style.display !== 'none');
  countDisplay.textContent = `${visibleCards.length} product(s) found`;
}
setInterval(updateCount, 500); // updates count every 0.5s

// ============================
// Reset Filters Button
// ============================

const resetBtn = document.createElement('button');
resetBtn.textContent = 'Reset Filters';
resetBtn.style.marginLeft = '10px';
resetBtn.style.padding = '5px 10px';
resetBtn.style.backgroundColor = '#dc3545';
resetBtn.style.color = '#fff';
resetBtn.style.border = 'none';
resetBtn.style.borderRadius = '4px';
resetBtn.style.cursor = 'pointer';

document.querySelector('.filters').appendChild(resetBtn);

resetBtn.addEventListener('click', () => {
  searchInput.value = '';
  categoryFilter.value = 'all';
  priceFilter.value = 'all';
  ratingFilter.value = 'all';
  sortSelect.value = 'default';
  filterProducts();
});

// ============================
// Optional: Dark Mode Toggle
// ============================

const toggleBtn = document.createElement('button');
toggleBtn.textContent = '🌙 Dark Mode';
toggleBtn.style.marginLeft = '10px';
toggleBtn.style.padding = '5px 10px';
toggleBtn.style.backgroundColor = '#222';
toggleBtn.style.color = '#fff';
toggleBtn.style.border = 'none';
toggleBtn.style.borderRadius = '4px';
toggleBtn.style.cursor = 'pointer';

document.querySelector('.filters').appendChild(toggleBtn);

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Dark mode CSS (add to CSS file or inject via JS)
const style = document.createElement('style');
style.textContent = `
  .dark-mode {
    background-color: #121212;
    color: #e0e0e0;
  }
  .dark-mode .product-card {
    background-color: #1e1e1e;
    border-color: #333;
  }
  .dark-mode .site-header, 
  .dark-mode .site-footer {
    background-color: #0b0b0b;
  }
  .dark-mode .modal-content {
    background-color: #2a2a2a;
  }
  .dark-mode input,
  .dark-mode select {
    background-color: #222;
    color: #eee;
    border-color: #555;
  }
`;
document.head.appendChild(style);
// ============================
// Add to Cart Functionality
// ============================

// Inject cart icon and counter in header
const cartIcon = document.createElement('div');
cartIcon.innerHTML = `
  <a href="#" style="color:white; position:relative;">
    🛒 Cart <span id="cart-count" style="background:red; border-radius:50%; color:white; padding:2px 8px; font-size:12px; position:absolute; top:-10px; right:-15px;">0</span>
  </a>
`;
document.querySelector('.nav-links').appendChild(cartIcon);

// Modify product cards to include "Add to Cart" buttons
document.querySelectorAll('.product-card').forEach(card => {
  const addBtn = document.createElement('button');
  addBtn.textContent = "Add to Cart";
  addBtn.classList.add('add-cart-btn');
  addBtn.style.backgroundColor = "#198754";
  addBtn.style.marginTop = "10px";
  addBtn.style.display = "block";
  addBtn.style.marginInline = "auto";

  addBtn.addEventListener('click', () => addToCart(card));
  card.appendChild(addBtn);
});

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart UI on load
updateCartCount();

// Add to cart function
function addToCart(card) {
  const title = card.querySelector('h3').textContent;
  const price = parseFloat(card.dataset.price);
  const id = title.replace(/\s+/g, '-').toLowerCase(); // Simple ID from title

  const product = { id, title, price, quantity: 1 };

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${title} added to cart`);
}

// Update cart count badge
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

// Toast Notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.backgroundColor = '#333';
  toast.style.color = '#fff';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '9999';
  toast.style.opacity = '0.95';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s';
    toast.style.opacity = '0';
  }, 2000);

  setTimeout(() => {
    document.body.removeChild(toast);
  }, 2500);
}

// Clear Cart Option (Optional)
const clearBtn = document.createElement('button');
clearBtn.textContent = '🧹 Clear Cart';
clearBtn.style.marginLeft = '10px';
clearBtn.style.backgroundColor = '#dc3545';
clearBtn.style.color = '#fff';
clearBtn.style.padding = '6px 10px';
clearBtn.style.border = 'none';
clearBtn.style.borderRadius = '5px';
clearBtn.style.cursor = 'pointer';

clearBtn.addEventListener('click', () => {
  cart = [];
  localStorage.removeItem('cart');
  updateCartCount();
  showToast("Cart cleared");
});

document.querySelector('.filters').appendChild(clearBtn);

// ============================
// Optional: Load Saved Cart Items
// ============================
// This could be expanded into a cart page or modal popup

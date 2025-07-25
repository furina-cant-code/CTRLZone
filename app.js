const products = [
  {
    name: "S25 Ultra",
    desc: "Samsung's premium smartphone that offers cutting-edge technology and features.",
    prices: { "256 GB": 5299.99, "512 GB": 5999.99, "1 TB": 6999.99 },
    colors: [
      { code: "#e3e8f0", img: "img/Product/1.png" },
      { code: "#222", img: "img/Product/2.png" }
    ]
  },
  {
    name: "S24 Ultra",
    desc: "The previous flagship with outstanding camera and performance.",
    prices: { "256 GB": 5999.99, "512 GB": 6599.99, "1 TB": 7599.99 },
    colors: [
      { code: "#a3b8e3", img: "img/Product/9.png" },
      { code: "#222", img: "img/Product/10.png" }
    ]
  },
  {
    name: "Z Flip 7",
    desc: "The latest foldable with a stylish design and powerful specs.",
    prices: { "256 GB": 4299.99, "512 GB": 4799.99, "1 TB": 5799.99 },
    colors: [
      { code: "#f7e1da", img: "img/Product/5.png" },
      { code: "#222", img: "img/Product/6.png" }
    ]
  },
  {
    name: "Z Fold 7",
    desc: "A foldable phone for productivity and entertainment.",
    prices: { "256 GB": 6999.99, "512 GB": 7599.99, "1 TB": 8599.99 },
    colors: [
      { code: "#d1e7dd", img: "img/Product/3.png" },
      { code: "#222", img: "img/Product/4.png" }
    ]
  },
  {
    name: "A16 5G",
    desc: "Affordable 5G phone with great battery life.",
    prices: { "256 GB": 699.99, "512 GB": 759.99 },
    colors: [
      { code: "#cfe2f3", img: "img/Product/7.png" },
      { code: "#222", img: "img/Product/8.png" }
    ]
  }
];

const menuItems = document.querySelectorAll(".navBottom .menuItem");
const sliderWrapper = document.querySelector('.sliderWrapper');
const productImg = document.querySelector('.productImg');
const productTitle = document.querySelector('.productTitle');
const productDesc = document.querySelector('.productDesc');
const productPrice = document.querySelector('.productPrice');
const sizeButtons = document.querySelectorAll('.size');
const addToCartBtn = document.getElementById('addToCartBtn');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');

let currentProduct = 0;
let selectedSize = "256 GB";
let cart = [];

// Add a subtitle/description for each phone
const sliderDescriptions = [
  "🔥 Hot Selling! The S25 Ultra is the ultimate flagship for power users and creators.",
  "🔥 Hot Selling! The S24 Ultra delivers top-tier performance and camera innovation.",
  "✨ Brand New! Meet the Galaxy Z Flip 7 – the future of foldables, now in your pocket.",
  "✨ Brand New! The Galaxy Z Fold 7 redefines productivity and entertainment.",
  "💡 The A16 5G: Affordable, reliable, and ready for the next-gen network."
];

// Show only the current phone in the slider
function showCurrentPhone(idx) {
  sliderWrapper.innerHTML = '';
  const prod = products[idx];
  const imgSrc = prod.colors && prod.colors.length > 0 ? prod.colors[0].img : prod.img;
  const sliderItem = document.createElement('div');
  sliderItem.className = 'sliderItem';
  sliderItem.innerHTML = `
    <div class="sliderImgWrap">
      <img src="${imgSrc}" alt="${prod.name}" class="sliderImgCenter">
    </div>
    <div class="sliderInfo">
      <h3 class="sliderPhoneName">${prod.name}</h3>
      <div class="sliderSubtitle">${sliderDescriptions[idx]}</div>
      <button class="sliderBuyButton" data-idx="${idx}">BUY NOW!</button>
    </div>
  `;
  sliderWrapper.appendChild(sliderItem);

  // Buy button scrolls to product section
  sliderItem.querySelector('.sliderBuyButton').onclick = function() {
    document.getElementById('product').scrollIntoView({ behavior: 'smooth' });
  };
}

// Product section logic
function renderProduct(idx) {
  const prod = products[idx];
  productImg.src = prod.colors[0].img;
  productTitle.textContent = prod.name;
  productDesc.textContent = prod.desc;
  selectedSize = "256 GB";
  sizeButtons.forEach(b => b.classList.remove('selected'));
  sizeButtons[0].classList.add('selected');
  productPrice.textContent = "RM" + prod.prices[selectedSize].toLocaleString(undefined, {minimumFractionDigits: 2});

  // Render color buttons
  const colorsContainer = document.querySelector('.colors');
  colorsContainer.innerHTML = '';
  prod.colors.forEach((color, cidx) => {
    const colorBtn = document.createElement('div');
    colorBtn.className = 'color';
    colorBtn.style.background = color.code;
    if (cidx === 0) colorBtn.classList.add('selected');
    colorBtn.onclick = function() {
      document.querySelectorAll('.color').forEach(b => b.classList.remove('selected'));
      colorBtn.classList.add('selected');
      productImg.src = color.img;
    };
    colorsContainer.appendChild(colorBtn);
  });

  // Hide 1TB button for A16 5G, show for others
  if (prod.name === "A16 5G") {
    sizeButtons[2].style.display = "none";
    if (selectedSize === "1 TB") {
      selectedSize = "256 GB";
      sizeButtons.forEach(b => b.classList.remove('selected'));
      sizeButtons[0].classList.add('selected');
      productPrice.textContent = "RM" + prod.prices[selectedSize].toLocaleString(undefined, {minimumFractionDigits: 2});
    }
  } else {
    sizeButtons[2].style.display = "";
  }
}

// Size button logic
sizeButtons.forEach(btn => {
  btn.onclick = function() {
    sizeButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedSize = btn.textContent.trim();
    productPrice.textContent = "RM" + products[currentProduct].prices[selectedSize].toLocaleString(undefined, {minimumFractionDigits: 2});
  };
});

// Cart logic
function updateCartDisplay() {
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = '<li class="cart-empty">Your cart is empty.</li>';
  } else {
    cart.forEach((item, idx) => {
      cartItems.innerHTML += `
        <li class="cart-item">
          <div class="cart-item-main">
            <span class="cart-item-name">${item.name} <span class="cart-item-size">(${item.size})</span></span>
            <span class="cart-item-qty">x${item.qty}</span>
          </div>
          <button onclick="removeFromCart(${idx})" class="cart-remove-btn">Remove</button>
        </li>
      `;
    });
  }
  cartCount.textContent = cart.length;
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCartDisplay();
}

function closeCart() {
  cartModal.style.display = 'none';
}

addToCartBtn.onclick = function() {
  const qty = parseInt(document.getElementById('productQty').value, 10);
  // Check if product with same name and size already exists in cart
  const existingIdx = cart.findIndex(item => item.name === products[currentProduct].name && item.size === selectedSize);
  if (existingIdx !== -1) {
    cart[existingIdx].qty += qty;
  } else {
    cart.push({ name: products[currentProduct].name, size: selectedSize, qty: qty });
  }
  updateCartDisplay();
  cartModal.style.display = 'flex';

  // Feedback message logic
  const feedback = document.getElementById('cartFeedback');
  feedback.textContent = `Added ${qty} item${qty > 1 ? 's' : ''} to cart!`;
  feedback.style.display = 'inline-block';
  setTimeout(() => { feedback.style.display = 'none'; }, 2000);
};

cartBtn.onclick = function() {
  updateCartDisplay();
  cartModal.style.display = 'flex';
};

window.onclick = function(event) {
  if (event.target === cartModal) {
    cartModal.style.display = 'none';
  }
};

// Menu buttons control the slider and product info
menuItems.forEach((item, idx) => {
  item.addEventListener("click", () => {
    currentProduct = idx;
    showCurrentPhone(idx);
    renderProduct(idx);
    menuItems.forEach((itm, i) => itm.classList.toggle('active', i === idx));
  });
});

// Initial render
showCurrentPhone(0);
renderProduct(0);
menuItems[0].classList.add('active');

// Add this script before </body> or in your app.js
function toggleComparisonDetails(btn) {
  const table = document.querySelector('.comparison-table');
  if (table.classList.contains('show-details')) {
    table.classList.remove('show-details');
    btn.textContent = 'See More';
  } else {
    table.classList.add('show-details');
    btn.textContent = 'See Less';
  }
}

// Add to your app.js or before </body>
function toggleFaq(btn) {
  const item = btn.parentElement;
  item.classList.toggle('open');
}

// Add to your app.js or before </body>
(function autoWideSlider() {
  const slides = document.querySelectorAll('.wide-slide');
  let idx = 0;
  setInterval(() => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, 3000);
})();

// Add to app.js
function openPaymentModal() {
  // Check if cart is empty
  if (!cart || cart.length === 0) {
    alert("No items in cart.");
    return;
  }
  document.getElementById('paymentModal').style.display = 'flex';
  document.getElementById('paymentBlurBg').classList.add('active');

  // Display cart items and total
  const cartList = document.getElementById('paymentCartList');
  const totalDiv = document.getElementById('paymentTotal');
  let total = 0;
  let html = '<ul>';
  cart.forEach(item => {
    const price = getProductPrice(item.name, item.size); // Implement this function
    const itemTotal = price * item.qty;
    total += itemTotal;
    html += `<li>
      <span>${item.name} (${item.size}) x${item.qty}</span>
      <span>RM${itemTotal.toFixed(2)}</span>
    </li>`;
  });
  html += '</ul>';
  cartList.innerHTML = html;
  totalDiv.textContent = `Total: RM${total.toFixed(2)}`;
}

function closePaymentModal() {
  document.getElementById('paymentModal').style.display = 'none';
  document.getElementById('paymentBlurBg').classList.remove('active');
}

function submitPayment() {
  // Gather payment info
  const name = document.getElementById('payName').value;
  const phone = document.getElementById('payPhone').value;
  const address = document.getElementById('payAddress').value;
  const card = document.getElementById('payCard').value;
  const month = document.getElementById('payMonth').value;
  const year = document.getElementById('payYear').value;
  const cvv = document.getElementById('payCVV').value;

  // Prepare cart summary
  let cartSummary = [];
  cart.forEach(item => {
    cartSummary.push({
      name: item.name,
      size: item.size,
      qty: item.qty
    });
  });

  // Prepare data to send
  const paymentData = {
    name,
    phone,
    address,
    card,
    month,
    year,
    cvv,
    cart: cartSummary
  };

  // Send to admin.php via POST (AJAX)
  fetch('admin.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  })
  .then(res => res.text())
  .then(msg => {
    if (msg.includes("Order received")) {
      // Success
    } else {
      // Show error
    }
  });
}

// Example price lookup (replace with your actual logic)
function getProductPrice(name, size) {
  const prices = {
    'S25 Ultra': { '256 GB': 5299.99, '512 GB': 5799.99, '1 TB': 6299.99 },
    'S24 Ultra': { '256 GB': 4899.99, '512 GB': 5399.99, '1 TB': 5899.99 },
    'Z Flip 7': { '256 GB': 3999.99, '512 GB': 4499.99 },
    'Z Fold 7': { '256 GB': 6999.99, '512 GB': 7499.99, '1 TB': 7999.99 },
    'A16 5G': { '128 GB': 899.99, '256 GB': 1099.99 }
  };
  return prices[name] && prices[name][size] ? prices[name][size] : 0;
}


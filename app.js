const products = [
  {
    name: "S25 Ultra",
    desc: "Samsung's premium smartphone that offers cutting-edge technology and features.",
    prices: { "256 GB": 5299.99, "512 GB": 5799.99, "1 TB": 6299.99 },
    colors: [
      { code: "#e3e8f0", img: "img/Product/1.png" },
      { code: "#222", img: "img/Product/2.png" }
    ]
  },
  {
    name: "S24 Ultra",
    desc: "The previous flagship with outstanding camera and performance.",
    prices: { "256 GB": 4899.99, "512 GB": 5399.99, "1 TB": 5899.99 },
    colors: [
      { code: "#a3b8e3", img: "img/Product/9.png" },
      { code: "#222", img: "img/Product/10.png" }
    ]
  },
  {
    name: "Z Flip 7",
    desc: "The latest foldable with a stylish design and powerful specs.",
    prices: { "256 GB": 3999.99, "512 GB": 4499.99 },
    colors: [
      { code: "#f7e1da", img: "img/Product/5.png" },
      { code: "#222", img: "img/Product/6.png" }
    ]
  },
  {
    name: "Z Fold 7",
    desc: "A foldable phone for productivity and entertainment.",
    prices: { "256 GB": 6999.99, "512 GB": 7499.99, "1 TB": 7999.99 },
    colors: [
      { code: "#d1e7dd", img: "img/Product/3.png" },
      { code: "#222", img: "img/Product/4.png" }
    ]
  },
  {
    name: "A16 5G",
    desc: "Affordable 5G phone with great battery life.",
    prices: { "128 GB": 899.99, "256 GB": 1099.99 },
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
let selectedSize = null;
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
  
  // Set default size to first available size
  const availableSizes = Object.keys(prod.prices);
  selectedSize = availableSizes[0];
  
  sizeButtons.forEach(b => b.classList.remove('selected'));
  
  // Update size buttons based on available sizes
  sizeButtons.forEach((btn, btnIdx) => {
    const btnSize = btn.textContent.trim();
    if (availableSizes.includes(btnSize)) {
      btn.style.display = "";
      btn.disabled = false;
      if (btnSize === selectedSize) {
        btn.classList.add('selected');
      }
    } else {
      btn.style.display = "none";
      btn.disabled = true;
    }
  });
  
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
}

// Size button logic
sizeButtons.forEach(btn => {
  btn.onclick = function() {
    if (btn.disabled) return;
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
  
  if (!selectedSize) {
    alert('Please select a size first!');
    return;
  }
  
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
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  document.getElementById('cartModal').style.display = 'none';
  document.getElementById('paymentModal').style.display = 'flex';
  document.getElementById('paymentBlurBg').classList.add('active');

  // Display cart items and total
  const cartList = document.getElementById('paymentCartList');
  const totalDiv = document.getElementById('paymentTotal');
  let total = 0;
  let html = '<ul>';
  cart.forEach(item => {
    const price = getProductPrice(item.name, item.size);
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

  // Basic validation
  if (!name || !phone || !address || !card || !month || !year || !cvv) {
    alert('Please fill in all required fields!');
    return;
  }

  // Validate card number format (basic check)
  if (card.replace(/\s/g, '').length < 13) {
    alert('Please enter a valid card number!');
    return;
  }

  // Validate CVV
  if (cvv.length < 3) {
    alert('Please enter a valid CVV!');
    return;
  }

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

  // Store order data locally (since we're using static files)
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push({
    ...paymentData,
    timestamp: new Date().toISOString(),
    orderId: 'ORD-' + Date.now()
  });
  localStorage.setItem('orders', JSON.stringify(orders));

  // Clear cart and show success
  cart = [];
  updateCartDisplay();
  closePaymentModal();
  alert('Order placed successfully! Your order ID is: ORD-' + Date.now());
  
  // Reset form
  document.getElementById('paymentForm').reset();
}

// Fixed price lookup function
function getProductPrice(name, size) {
  const product = products.find(p => p.name === name);
  return product && product.prices[size] ? product.prices[size] : 0;
}

// Format card number input
document.addEventListener('DOMContentLoaded', function() {
  const cardInput = document.getElementById('payCard');
  if (cardInput) {
    cardInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      if (formattedValue !== e.target.value) {
        e.target.value = formattedValue;
      }
    });
  }

  // CVV input validation
  const cvvInput = document.getElementById('payCVV');
  if (cvvInput) {
    cvvInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  }

  // Phone input validation
  const phoneInput = document.getElementById('payPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/[^0-9+\-\s]/g, '');
    });
  }
});

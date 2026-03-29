const products = [
  {
    id: "surge",
    name: "GelBlaster Surge",
    price: 49.99,
    description: "Great for beginners",
    details: "Simple, reliable, and easy to use.",
    bullets: ["Beginner ready", "Balanced build", "Strong value"],
    image: "images/surge.jpg",
    imageLabel: "Replace with /images/surge.jpg"
  },
  {
    id: "starfire-xl",
    name: "GelBlaster Starfire XL",
    price: 89.99,
    description: "Long range, high capacity",
    details: "Built for longer shots and more ammo on hand.",
    bullets: ["Long range", "High capacity", "Field ready"],
    image: "images/starfire.jpg",
    imageLabel: "Replace with /images/starfire.jpg"
  },
  {
    id: "surge-max",
    name: "GelBlaster Surge Max",
    price: 129.99,
    description: "Professional semi-auto model",
    details: "A stronger upgrade for serious players.",
    bullets: ["Semi-auto", "Pro feel", "Premium build"],
    image: "images/surge-max.jpg",
    imageLabel: "Replace with /images/surge-max.jpg"
  },
  {
    id: "gel-balls",
    name: "Gel Balls 10.000 stuks",
    price: 9.99,
    description: "Ammo pack",
    details: "Keep your setup stocked with a full refill pack.",
    bullets: ["10.000 rounds", "Easy refill", "Essential extra"],
    image: "images/gel-balls.jpg",
    imageLabel: "Replace with /images/gel-balls.jpg"
  },
  {
    id: "pistol",
    name: "GelBlaster Pistol",
    price: 34.99,
    description: "Compact sidearm",
    details: "Compact backup for close play.",
    bullets: ["Compact", "Lightweight", "Quick backup"],
    image: "images/pistol.jpg",
    imageLabel: "Replace with /images/pistol.jpg"
  }
];

const currencyFormatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR"
});

function formatPrice(value) {
  return currencyFormatter.format(value);
}

function getProductById(productId) {
  return products.find((product) => product.id === productId);
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("blackline-cart")) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("blackline-cart", JSON.stringify(cart));
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

function updateCartCount() {
  const badges = document.querySelectorAll("[data-cart-count]");
  const count = getCartCount();
  badges.forEach((badge) => {
    badge.textContent = count;
  });
}

function addToCart(productId) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
}

function updateCartItem(productId, quantity) {
  const cart = getCart()
    .map((item) => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    })
    .filter((item) => item.quantity > 0);

  saveCart(cart);
  updateCartCount();
}

function createFallbackDataUri(label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#101826"/>
          <stop offset="100%" stop-color="#070b12"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <circle cx="920" cy="170" r="200" fill="rgba(255,106,43,0.14)"/>
      <rect x="120" y="330" width="720" height="110" rx="36" fill="#1a2534"/>
      <rect x="780" y="292" width="180" height="185" rx="30" fill="#202d3f"/>
      <rect x="900" y="280" width="120" height="230" rx="26" fill="#1a2534"/>
      <text x="120" y="680" fill="#f2f4f7" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700">
        PHOTO PLACEHOLDER
      </text>
      <text x="120" y="742" fill="#ff6a2b" font-family="Arial, Helvetica, sans-serif" font-size="28">
        ${label}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function productCardTemplate(product) {
  return `
    <article class="product-card">
      <a class="product-media" href="product.html?id=${product.id}">
        <!-- Replace this image by adding your own file in /images with the same name shown below. -->
        <img src="${product.image}" alt="${product.name}" data-fallback="${product.imageLabel}" />
        <span class="placeholder-label">${product.imageLabel}</span>
      </a>
      <div class="product-card-content">
        <div class="product-title-row">
          <h3>${product.name}</h3>
          <span class="price">${formatPrice(product.price)}</span>
        </div>
        <p>${product.description}</p>
        <div class="product-card-actions">
          <a class="button button-secondary button-small" href="product.html?id=${product.id}">View Details</a>
          <button class="button button-primary button-small" type="button" data-add-to-cart="${product.id}">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderFeaturedProducts() {
  const container = document.querySelector("[data-featured-products]");
  if (!container) return;

  container.innerHTML = products.slice(0, 4).map(productCardTemplate).join("");
}

function renderProductGrid() {
  const container = document.querySelector("[data-product-grid]");
  if (!container) return;

  container.innerHTML = products.map(productCardTemplate).join("");
}

function renderProductDetail() {
  const detailContainer = document.querySelector("[data-product-detail]");
  if (!detailContainer) return;

  const productId = new URLSearchParams(window.location.search).get("id") || products[0].id;
  const product = getProductById(productId) || products[0];

  document.title = `${product.name} | Blackline Gelblasters`;

  detailContainer.innerHTML = `
    <div class="product-detail-grid">
      <div class="product-gallery">
        <div class="product-image-large">
          <!-- Replace this image by adding your own file in /images with the same name shown below. -->
          <img src="${product.image}" alt="${product.name}" data-fallback="${product.imageLabel}" />
        </div>
      </div>
      <div class="product-info">
        <p class="eyebrow">Product Detail</p>
        <h1>${product.name}</h1>
        <div class="product-price">${formatPrice(product.price)}</div>
        <p class="product-copy">${product.description}</p>
        <ul class="product-bullets">
          ${product.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
        </ul>
        <p class="product-meta">Photo file to replace: ${product.image}</p>
        <button class="button button-primary" type="button" data-add-to-cart="${product.id}">
          Add to cart
        </button>
      </div>
    </div>
  `;

  renderRelatedProducts(product.id);
}

function renderRelatedProducts(currentId) {
  const relatedContainer = document.querySelector("[data-related-products]");
  if (!relatedContainer) return;

  const related = products.filter((product) => product.id !== currentId).slice(0, 3);
  relatedContainer.innerHTML = related.map(productCardTemplate).join("");
}

function renderCart() {
  const itemsContainer = document.querySelector("[data-cart-items]");
  const summaryContainer = document.querySelector("[data-cart-summary]");
  if (!itemsContainer || !summaryContainer) return;

  const cart = getCart();
  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add products to continue.</p>
        <a class="button button-primary" href="products.html">Browse products</a>
      </div>
    `;
    summaryContainer.innerHTML = `
      <h2>Order Summary</h2>
      <div class="summary-line"><span>Items</span><strong>0</strong></div>
      <div class="summary-total"><span>Total</span><strong>${formatPrice(0)}</strong></div>
      <button class="button button-secondary button-block" type="button" disabled>Checkout</button>
      <p class="checkout-note">Add products to continue.</p>
    `;
    return;
  }

  const lineItems = cart
    .map((item) => {
      const product = getProductById(item.id);
      if (!product) return "";

      return `
        <article class="cart-row">
          <div class="cart-thumb">
            <img src="${product.image}" alt="${product.name}" data-fallback="${product.imageLabel}" />
          </div>
          <div class="cart-row-body">
            <div class="cart-row-head">
              <h3>${product.name}</h3>
              <strong class="price">${formatPrice(product.price * item.quantity)}</strong>
            </div>
            <p>${product.description}</p>
            <div class="qty-control">
              <span>Quantity</span>
              <button class="qty-button" type="button" data-cart-decrease="${product.id}">-</button>
              <strong>${item.quantity}</strong>
              <button class="qty-button" type="button" data-cart-increase="${product.id}">+</button>
              <button class="remove-button" type="button" data-cart-remove="${product.id}">Remove</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  const total = cart.reduce((sum, item) => {
    const product = getProductById(item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  itemsContainer.innerHTML = lineItems;
  summaryContainer.innerHTML = `
    <h2>Order Summary</h2>
    <div class="summary-line"><span>Items</span><strong>${getCartCount()}</strong></div>
    <div class="summary-line"><span>Shipping</span><strong>Later</strong></div>
    <div class="summary-total"><span>Total</span><strong>${formatPrice(total)}</strong></div>
    <button class="button button-primary button-block" type="button">Checkout</button>
    <p class="checkout-note">Ready for checkout flow.</p>
  `;
}

function attachImageFallbacks() {
  document.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        image.src = createFallbackDataUri(image.dataset.fallback || "Add your photo");
      },
      { once: true }
    );
  });
}

function attachCartEvents() {
  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      addToCart(addButton.dataset.addToCart);
      return;
    }

    const increaseButton = event.target.closest("[data-cart-increase]");
    if (increaseButton) {
      const cart = getCart();
      const item = cart.find((entry) => entry.id === increaseButton.dataset.cartIncrease);
      if (item) {
        updateCartItem(item.id, item.quantity + 1);
        renderCart();
        attachImageFallbacks();
      }
      return;
    }

    const decreaseButton = event.target.closest("[data-cart-decrease]");
    if (decreaseButton) {
      const cart = getCart();
      const item = cart.find((entry) => entry.id === decreaseButton.dataset.cartDecrease);
      if (item) {
        updateCartItem(item.id, item.quantity - 1);
        renderCart();
        attachImageFallbacks();
      }
      return;
    }

    const removeButton = event.target.closest("[data-cart-remove]");
    if (removeButton) {
      updateCartItem(removeButton.dataset.cartRemove, 0);
      renderCart();
      attachImageFallbacks();
    }
  });
}

function attachMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function initPage() {
  updateCartCount();
  renderFeaturedProducts();
  renderProductGrid();
  renderProductDetail();
  renderCart();
  attachImageFallbacks();
  attachCartEvents();
  attachMobileNav();
}

initPage();

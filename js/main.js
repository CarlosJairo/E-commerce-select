import hamburgermenu from "./modules/menu-hamburger.js";
import filterOfSearch from "./modules/search-product.js";
import sendEmail from "./modules/send-form.js";

const d = document,
  c = console.log,
  $products = d.querySelector(".products"),
  $searchContainer = d.querySelector(".search-container"),
  $sections = d.querySelectorAll(".alternar"),
  $navBtns = d.querySelectorAll(".menu .btn"),
  $tem = d.querySelector(".template").content,
  $categoriesBtns = d.querySelectorAll(".categories-container .btn"),
  $productsCart = d.querySelector(".products-cart"),
  stairsIcons = `<i class="bi bi-star-fill"></i>`.repeat(5),
  loaderSvg = `<img src="./assets/svg/three-dots.svg" alt="cargando..." class="loder" />`;

let cartProducts = [];

class ProductObjCart {
  constructor(id, img, title, price, quantity) {
    this.id = id;
    this.img = img;
    this.title = title;
    this.price = price;
    this.quantity = quantity;
    this.total_price = price;
  }
}

// Get products with FETCH
async function getProducts(url) {
  try {
    let res = await fetch(url);
    if (!res.ok) throw { status: res.status, statusText: res.statusText };
    let json = await res.json();

    return json;
  } catch (error) {
    return `<p>Error ${error.status || "unknown"}: ${
      error.statusText || "something went wrong"
    }</p>`;
  }
}

// Generate HTML to show products
function showProducts(json) {
  if (typeof json == "string") return json;

  let productsHTML = "";
  json.forEach((product) => {
    const name = product.title;
    const rate = product.rating.rate;

    productsHTML += `
                <div class="product">
                    <div class="img-container flex">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <h3 class="title-product" id="${product.id}">${
      name.length > 32 ? name.slice(0, 32) + "..." : name
    }</h3>
                    <p class="price">$${product.price}</p>
                    <div class="rate-car-container flex">
                      <div class="stars-outer">${stairsIcons}</div>
                      <div class="stars-inner" data-rate="${(
                        (rate * 70) /
                        5
                      ).toFixed(2)}">
                        ${stairsIcons}
                      </div>
                      <i class="bi bi-cart-dash-fill add-cart-product" data-id="${
                        product.id
                      }" data-title="${product.title}" data-img="${
      product.image
    }" data-price="${product.price}"></i>
                    </div>
                </div>
            `;
  });
  return productsHTML;
}

function addProductToCart() {
  let fragment = "";

  d.querySelector(".red-point").style.opacity = 0;

  if (cartProducts.length === 0)
    return ($productsCart.innerHTML = `<p>There are no products in the cart</p>`);

  setTimeout(() => (d.querySelector(".red-point").style.opacity = 100), 150);

  cartProducts.forEach((product) => {
    fragment += `
    <div class="product-cart">
      <img class="cart-image" src="${product.img}" alt="${product.title}">
      <div>
        <p class="cart-product">${product.title.slice(0, 20)}</p>
        <p>$<span class="price-cart">${
          product.price
        }</span> x <span class="quantity-cart">${product.quantity}</span><span
            class="price-card"> $${parseFloat(product.total_price).toFixed(
              2
            )}</span></p>
      </div>
      <i class="bi bi-x-lg delete" data-id="${product.id}"></i>
    </div>`;
    $productsCart.innerHTML = fragment;
  });
}

// Paint stairs according to the qualification
function paintStairs() {
  const stairs = d.querySelectorAll(".stars-inner");
  stairs.forEach((el) => (el.style.width = `${el.dataset.rate}px`));
}

// Add or remove classes to show which section is active
const addClickClass = (arr, btn) => {
  arr.forEach((el) => {
    if (el.matches(btn)) {
      el.classList.add("clicked");
      el.classList.remove("click-out");
    } else {
      el.classList.add("click-out");
      el.classList.remove("clicked");
    }
  });
};

// Show a specific section and hide others
const showSection = (section) => {
  $sections.forEach((el) => {
    if (el.matches(section)) el.classList.replace("no-active", "is-active");
    else el.classList.replace("is-active", "no-active");
  });
};

// Reload
const reload = () => setTimeout(() => location.reload(), 3000);

// Event when the DOM is loaded
d.addEventListener("DOMContentLoaded", () => {
  const storedCart = localStorage.getItem("cartProducts");
  if (storedCart) {
    cartProducts = JSON.parse(storedCart);
    addProductToCart();
  }

  showSection(".home");
  addClickClass($navBtns, ".go-home-btn");
  filterOfSearch(".search-input");
  sendEmail();
  hamburgermenu();
});

// Click event
d.addEventListener("click", async (e) => {
  // Go HOME - SHOP - CONTACT - ABOUT
  if (e.target.matches(".menu input") || e.target.matches(".shop-now-btn")) {
    d.querySelector(".cart-div").classList.remove("show");
    const nameClass =
      e.target.value.toLowerCase() ||
      e.target.textContent.slice(0, 4).toLowerCase();

    showSection(`.${nameClass}`);
    addClickClass($navBtns, `.go-${nameClass}-btn`);
  }

  // Get - Show Products
  if (e.target.matches(".go-shop-btn")) {
    const URL = e.target.dataset.url
      ? `https://fakestoreapi.com/products/category/${e.target.dataset.url}'s clothing`
      : `https://fakestoreapi.com/products`;

    $products.innerHTML = loaderSvg;
    $searchContainer.classList.replace("no-active", "is-active");

    addClickClass($categoriesBtns, `.${e.target.dataset.url || "all"}`);

    const json = await getProducts(URL);
    const products = showProducts(json);
    $products.innerHTML = products;

    paintStairs();
  }

  // Search single product
  if (e.target.matches(".title-product")) {
    $searchContainer.classList.add("no-active");
    $products.innerHTML = loaderSvg;
    const json = await getProducts(
      `https://fakestoreapi.com/products/${e.target.id}`
    );

    $tem.querySelector("img").src = json.image;
    $tem.querySelector(".title").textContent = json.title;
    $tem.querySelector(".priice").textContent = json.price;
    $tem.querySelector(".stars-inner").dataset.rate =
      (json.rating.rate * 70) / 5;
    $tem.querySelector(".category").textContent = json.category;
    $tem.querySelector(".description").textContent = json.description;
    $tem.querySelector(".add-cart-product").dataset.id = json.id;
    $tem.querySelector(".add-cart-product").dataset.title = json.title;
    $tem.querySelector(".add-cart-product").dataset.img = json.image;
    $tem.querySelector(".add-cart-product").dataset.price = json.price;

    const $clone = d.importNode($tem, true);

    $products.innerHTML = "";
    $products.appendChild($clone);
    paintStairs();
  }

  // Show cart
  if (e.target.matches(".show-cart"))
    d.querySelector(".cart-div").classList.toggle("show");

  // Delete product cart
  if (e.target.matches(".delete")) {
    let idObj = cartProducts.findIndex((obj) => obj.id === e.target.dataset.id);
    cartProducts.splice(idObj, 1);

    // Update localStorage
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    addProductToCart();
  }

  // Add product(s) to cart
  if (e.target.matches(".add-cart-product")) {
    let objExists = cartProducts.some((obj) => obj.id === e.target.dataset.id);
    const $quantity = d.querySelector(".quantity-number")
      ? parseInt(d.querySelector(".quantity-number").value)
      : 1;

    if ($quantity < 1) return;

    if (!objExists) {
      let productObj = new ProductObjCart(
        e.target.dataset.id,
        e.target.dataset.img,
        e.target.dataset.title,
        e.target.dataset.price,
        $quantity
      );
      cartProducts.push(productObj);
    } else {
      let foundObj = cartProducts.find((obj) => obj.id === e.target.dataset.id);
      foundObj.quantity += $quantity;
      foundObj.total_price = foundObj.quantity * foundObj.price;
    }

    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
    addProductToCart();
  }

  // Buy
  if (e.target.matches(".cart-chekount")) {
    if (cartProducts.length === 0)
      return alert("There are no cart products yet");
    let totalCartPrice = 0;
    cartProducts.forEach(
      (product) => (totalCartPrice += parseFloat(product.total_price))
    );

    showSection(".card-payment-container");
    d.querySelector(".footer").classList.add("no-active");
    d.querySelector(".header").classList.add("no-active");
    d.querySelector(".price-to-pay").textContent = totalCartPrice.toFixed(2);
  }

  // Reload
  if (e.target.matches(".make-payment")) {
    d.querySelector(".card-loader").classList.remove("none");
    setTimeout(() => {
      // Delete Local Storage
      localStorage.removeItem("cartProducts");
      d.querySelector(".card-loader").classList.add("none");
      d.querySelector(".thanks-msg").classList.remove("none");
      reload();
    }, 2000);
  }
});

let products = [
  { id: 1, name: "chips", price: 20 },
  { id: 2, name: "chocolate", price: 50 },
  { id: 3, name: "juice", price: 25 }
];

const limit = 2;
let cartStack = [];
let pricesDoubled = false;

//--------------Welcome Message-----------------

let username = localStorage.getItem("username");
if(!username){
   localStorage.setItem("username",username);
}
else{
   username = prompt("Write Your Name:");
}

document.getElementById("welcome").innerText = ("Welcome"+ " "+ username);

//------------Render Products-------------
let productsDiv = document.querySelector(".Products");

function renderProducts() {
  productsDiv.innerHTML = "";

  products.forEach(product => {
    let card = document.createElement("div");
    card.className = "product";

    card.innerHTML = `
      <p class="name">${product.name}</p>
      <p class="price">${product.price} EGP</p>
      <button class="add">Add</button>
      <button class="remove">Remove</button>
    `;

    card.querySelector(".add").onclick = () => addToCart(product);
    card.querySelector(".remove").onclick = () => removeFromCart(product);

    productsDiv.appendChild(card);
  });
}

//---------Cart Logic---------
function addToCart(product) {
  if (cartStack.length >= limit) {
    alert("Cart limit reached (2 products)");
    return;
  }

  if (cartStack.includes(product)) {
    alert("Product already added");
    return;
  }

  cartStack.push(product);
  saveCart();
  renderCart();
}

function removeFromCart(product) {
  cartStack = cartStack.filter(p => p.id !== product.id);
  saveCart();
  renderCart();
}

function undoLast() {
  if (cartStack.length === 0) {
    alert("Cart is empty");
    return;
  }

  cartStack.pop();
  saveCart();
  renderCart();
}

function clearCart() {
  if (confirm("Are you sure you want to clear the cart?")) {
    cartStack = [];
    saveCart();
    renderCart();
  }
}

//---------------Render Cart------------
function renderCart() {
  let cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  let total = 0;

  cartStack.forEach(item => {
    let div = document.createElement("div");
    div.className = "cart-item";
    div.innerText = `${item.name} - ${item.price} EGP`;
    cartItems.appendChild(div);
    total += item.price;
  });

  document.getElementById("total").innerText =
    cartStack.length ? `Total: ${total} EGP` : "";
}

//--------------LocalStorage--------------
function saveCart() {
  try {
    localStorage.setItem("cart", JSON.stringify(cartStack));
  } catch (e) {
    console.error("LocalStorage Error", e);
  }
}

function loadCart() {
  try {
    let data = JSON.parse(localStorage.getItem("cart"));
    cartStack = data || [];
  } catch {
    cartStack = [];
  }
}

//---------Double Prices After Timer-------------
function doublePrices() {
  if (pricesDoubled) return;

  products.forEach(p => p.price *= 2);
  pricesDoubled = true;

  renderProducts();
  renderCart();
}

//--------Countdown Timer------------
let time = 10;
let timer = setInterval(() => {
  document.getElementById("offer").innerText =
    `Offer ends in ${time}s`;

  time--;

  if (time < 0) {
    clearInterval(timer);
    document.getElementById("offer").innerText =
      " Offer Ended - Prices Doubled";

    doublePrices();
  }
}, 1000);


loadCart();
renderProducts();
renderCart();

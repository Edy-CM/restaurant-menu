import { menuArray } from "./data.js"

let menuArr = localStorage.getItem("menuArray") ? JSON.parse(localStorage.getItem("menuArray")) : menuArray

const webPage = document.querySelector(".web-page")
const addBtn = document.getElementById("add-btn")
const menuModal = document.getElementById("add-menu")
const menu = document.getElementById("menu")
const makeOrder = document.getElementById("make-order")
const orders = document.getElementById("orders")
const totalEl = document.getElementById("total")
const paymentModal = document.querySelector(".payment")
const orderBtn = document.getElementById("complete-order")
const darkMode = document.getElementById("toggle-dark")

let orderedItemsArr = []

webPage.classList.toggle("blur")

darkMode.addEventListener("click", function(){
  document.querySelector("main").classList.toggle("dark-mode")
  document.querySelector("footer").classList.toggle("dark-mode")
  document.querySelector("header").classList.toggle("dark-mode")
  webPage.classList.toggle("dark-mode")
  render()
})


document.addEventListener("click", function(e) {
  if (e.target.dataset.itemId) {
    document.querySelector(".msg").style.display = "none"
    const item = findItem(e.target.dataset.itemId)
    orderedItemsArr.push(item)
    renderCheck()
  }
  if (e.target.dataset.removeItem) {
    orderedItemsArr = orderedItemsArr.filter((i, index) => index != e.target.dataset.removeItem)
    renderCheck()
  }
  if (e.target.dataset.removeMenu) {
    const pin = prompt("Ingrese el codigo de acceso.")
    if (pin === "2007") {
      const newMenu = menuArr.filter(item => item.id != e.target.dataset.removeMenu)
      localStorage.setItem("menuArray", JSON.stringify(newMenu, null, 2))
      render()
    } else {
      alert("Not valid.")
    }
  }

})

function renderCheck() {
  const display = orderedItemsArr.length > 0 ? "block" : "none"
  makeOrder.style.display = display
  const total = orderedItemsArr.reduce((total, item) => {
    return total + item.price
  },0)
  const check = orderedItemsArr.map((menuItem, index) => {
    const { name, price } = menuItem
    return `
    <div class="order">
      <div>
        <p>${name}</p>
        <button data-remove-item="${index}">remove</button>
      </div>
      <p>$${price}</p>
    </div>
    `
  })
  totalEl.textContent = `$${total}`
  orders.innerHTML = check.join("")
}

addBtn.addEventListener("click", function(){
  if (addBtn.getAttribute("disabled")) return   

  addBtn.setAttribute("disabled", "disabled")
  closeModal()
})

menuModal.addEventListener("submit", function(e){
  e.preventDefault()
  const newItem = {
    name: document.querySelector("input[name='name']").value,
    ingredients: document.querySelector("input[name='ingredients']").value.split(","),
    id: menuArr.length + 1,
    price: document.querySelector("input[name='price']").value,
    emoji: document.querySelector("input[name='emoji']").value,
  }

  menuArr.push(newItem)
  localStorage.setItem("menuArray", JSON.stringify(menuArr, null, 2))
  closeModal()
  addBtn.removeAttribute("disabled")
  render()
})

menuModal.addEventListener("reset", function(){
  addBtn.removeAttribute("disabled")
  closeModal()
})

function findItem(itemId){
  return menuArr.find((item) => {
    return item.id == itemId})
}

function disable() {
  const input = document.getElementsByClassName("input")
  for (let i of input) {
    i.value = ""
  }

  const ordersArr = document.getElementsByClassName("order-button")
  for (let order of ordersArr) {
    if (order.getAttribute("disabled")) {
      order.removeAttribute("disabled") 
    } else {
      order.setAttribute("disabled", "disabled")
    }
  }
}

function closeModal() {
  disable()
  webPage.classList.toggle("blur")
  menuModal.classList.toggle("hidden")
}

function render() {
  const mode = !webPage.classList.contains("dark-mode") ? "#9bafd9" : "#103783"
  console.log(mode)
  darkMode.style.backgroundColor = mode

  const color = !webPage.classList.contains("dark-mode") ? "#3C3C3C" : "white"
  menuArr = localStorage.getItem("menuArray") ? JSON.parse(localStorage.getItem("menuArray")) : menuArray

  const menuItems = menuArr.map(item => {
    const { name, ingredients, id, price, emoji } = item
    return `
      <div class="item">
        <div class="item-info">
          <h1>${emoji}</h1>
          <div>
            <p class="item-name">${name}</p>
            <p class="item-ingredients">${ingredients.join(", ")}</p>
            <p class="item-price">${price}</p>
          </div>
        </div>
        <div>
          <button style="color: ${color}" class="order-button" data-remove-menu="${id}">-</button>
          <button style="color: ${color}" class="order-button" data-item-id="${id}">+</button>
        </div>
      </div>
    `
  })
  menu.innerHTML = menuItems.join("")
}

render()

orderBtn.addEventListener("click", function(){
  disable()
  paymentModal.style.display = "block"
})

paymentModal.addEventListener("submit", function(e){
  e.preventDefault()
  const name = document.querySelector(".payment form input[name='name']").value
  document.querySelector(".msg").style.display = "block"
  document.getElementById("thanks-msg").textContent = `Thanks ${name}. Your order is on it's way!`
  orderedItemsArr = []
  renderCheck()
  paymentModal.style.display = "none"
  disable()
})
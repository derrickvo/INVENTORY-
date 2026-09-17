const itemName = document.getElementById("itemName");
const brand = document.getElementById("brand");
const size = document.getElementById("size");
const Buy = document.getElementById("buyPrice");
const ListingPrice = document.getElementById("listingPrice");
const add = document.getElementById("ADD");
const totalItems = document.getElementById("totalItems");
const status = document.getElementById("status");
const image = document.getElementById("image");
const listedCount = document.getElementById("listedCount");
const unlisted = document.getElementById("unlistedCount");
const totalSpent = document.getElementById("totalSpent");
const totalSales = document.getElementById("totalSales");
const totalProfits = document.getElementById("totalPROFITS");
const description = document.getElementById("DESCRIPTION")

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];


function updateStats() {
    totalItems.textContent = inventory.length;

    const listedItems = inventory.filter(function(item) {
        return item.status === "Listed";
    });
    const unlistedItems = inventory.filter(function(item) {
    return item.status === "Unlisted";
});
    const spent = inventory.reduce(function(total, item) {
    return total + Number(item.bought);
}, 0);
const sales = inventory.reduce(function(total, item) {
    return total + Number(item.soldPrice || 0);
}, 0);
  
    const profits = sales - spent;
    totalProfits.textContent = `$${profits.toFixed(2)}`;
    totalSales.textContent = `$${sales.toFixed(2)}`;
    totalSpent.textContent = `$${spent.toFixed(2)}`;
    unlisted.textContent = unlistedItems.length;
    listedCount.textContent = listedItems.length;
}
updateStats();

add.addEventListener("click",function(){

const images = image.files[0];
const reader = new FileReader();

reader.onload = function() {
newItem.image = reader.result;
inventory.push(newItem);
localStorage.setItem("inventory", JSON.stringify(inventory));

updateStats();
}

const newItem = {
    name: itemName.value,
    brand: brand.value,
    size: size.value,
    bought:Buy.value,
    listing:ListingPrice.value,
    description:description.value,
    status:status.value,
    dateAdded: new Date().toLocaleDateString()
}
reader.readAsDataURL(images);



});
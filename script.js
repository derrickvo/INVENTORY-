const itemName = document.getElementById("itemName");
const brand = document.getElementById("brand");
const size = document.getElementById("size");
const Buy = document.getElementById("buyPrice");
const ListingPrice = document.getElementById("listingPrice");
const add = document.getElementById("ADD");
const inventoryList = document.getElementById("inventoryList");
const status = document.getElementById("status");
const image = document.getElementById("image");
let inventory = [];

add.addEventListener("click",function(){

const images = image.files[0];
const link = URL.createObjectURL(images);
const imagelink = document.createElement("img");
const itemCard = document.createElement("div");
const itemTitle = document.createElement("h3");
const itemInfo = document.createElement("div");
itemTitle.textContent = itemName.value;

const itemDetails = document.createElement("p");
itemDetails.textContent = `${brand.value} • Size ${size.value}`;

const itemPrices = document.createElement("p");
itemPrices.textContent = `Bought: $${Buy.value} • Listed: $${ListingPrice.value}`;

const itemStatus = document.createElement("p");

itemStatus.textContent=status.value;
itemCard.className = "item-card";
imagelink.src = link;
itemInfo.className= "item-info";
itemCard.append(imagelink);
itemCard.append(itemInfo);

itemInfo.append(itemTitle);
itemInfo.append(itemDetails);
itemInfo.append(itemPrices);
itemInfo.append(itemStatus);
inventoryList.append(itemCard);

const newItem = {
    name: itemName.value,
    brand: brand.value,
    size: size.value,
    bought:Buy.value,
    listing:ListingPrice.value,
    status:status.value
}
inventory.push(newItem);
localStorage.setItem("inventory", JSON.stringify(inventory))
});
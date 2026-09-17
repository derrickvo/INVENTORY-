
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
inventory.forEach(function(item,index) {
const imagelink = document.createElement("img");
const itemCard = document.createElement("div");
const itemTitle = document.createElement("h3");
const itemInfo = document.createElement("div");
const itemDetails = document.createElement("p");
const itemPrices = document.createElement("p");
const itemStatus = document.createElement("p");
const unlisted = document.getElementById("unlistedList");
const listed = document.getElementById("listedList");
const sold = document.getElementById("soldList");
const shipped = document.getElementById("shippedList");
const deleteButton = document.createElement('button');
const description = document.createElement("p");
const soldNumber = document.createElement('button');
const shippedButton = document.createElement('button');
const list = document.createElement('button');
const buttonGroup = document.createElement("div");
const copyButton = document.createElement("button");
const editButton = document.createElement("button");
const searchInput = document.getElementById("searchInput");
const itemDate = document.createElement("p");
const itemProfit = document.createElement("p");
const profit = Number(item.soldPrice) - Number(item.bought);

itemStatus.className = "status-badge";
description.className = "item-description";
copyButton.textContent = "COPY DESCRIPTION";
copyButton.className = "copy-button";
itemProfit.className = "item-profit";

buttonGroup.append(copyButton);


buttonGroup.className = "button-group";


itemTitle.textContent = item.name;
itemDetails.textContent = `${item.brand} • Size ${item.size}`;
if (item.status === "Sold" || item.status === "Shipped") {
    itemPrices.textContent =
        `Bought: $${item.bought} • Listed: $${item.listing} • Sold: $${item.soldPrice}`;

    itemProfit.textContent = `Profit: $${profit.toFixed(2)}`;
} else {
    itemPrices.textContent =
        `Bought: $${item.bought} • Listed: $${item.listing}`;
}
itemDate.textContent = item.dateAdded
    ? `Added: ${item.dateAdded}`
    : "Added: Older item";
itemStatus.textContent = item.status;
description.textContent = item.description;
deleteButton.textContent = "DELETE";
editButton.textContent = "EDIT";

editButton.className = "edit-button";
itemCard.className = "item-card";
itemInfo.className= "item-info";
imagelink.src = item.image;

itemInfo.append(itemDate);
buttonGroup.append(editButton);

itemCard.append(imagelink);
itemCard.append(itemInfo);

buttonGroup.append(deleteButton);
itemCard.append(buttonGroup);

itemInfo.append(itemTitle);
itemInfo.append(itemDetails);
itemInfo.append(itemPrices);

if (item.status === "Sold" || item.status === "Shipped") {
    itemInfo.append(itemProfit);
}

itemInfo.append(itemStatus);
itemInfo.append(description);

if (item.status === "Unlisted") {
    unlisted.append(itemCard);
    list.textContent = "MARK LISTED";
    buttonGroup.append(list);
} else if (item.status === "Listed") {
    soldNumber.textContent = "MARKED SOLD";
    listed.append(itemCard);
    buttonGroup.append(soldNumber);
} else if (item.status === "Sold") {
   shippedButton.textContent = "MARK SHIPPED";
   buttonGroup.append(shippedButton);
    sold.append(itemCard);
} else if (item.status === "Shipped") {
    shipped.append(itemCard);
}

list.addEventListener("click", function() {
item.status = "Listed";
localStorage.setItem("inventory", JSON.stringify(inventory));
location.reload();
});
shippedButton.addEventListener("click", function() {
    item.status = "Shipped";
    localStorage.setItem("inventory", JSON.stringify(inventory));
    location.reload();
});

soldNumber.addEventListener("click", function() {
    const soldPrice = prompt("How much did it sell for?");
    if (soldPrice !== null && soldPrice !== "") {
    item.soldPrice = soldPrice;
    item.status = "Sold";
    localStorage.setItem("inventory", JSON.stringify(inventory));
    location.reload();
    }
});

deleteButton.addEventListener("click",function(){
const choice2 = prompt(
    "Are you sure you want to delete it? \nyes\nno");
if (choice2 ==="yes"){
    itemCard.remove();
    inventory.splice(index, 1);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    location.reload();
}


});

copyButton.addEventListener("click", function() {
    navigator.clipboard.writeText(item.description);
});

editButton.addEventListener("click",function() {

     const choice = prompt(
        "What do you want to edit?\nname\nbrand\nsize\nbought\nlisting\ndescription"
    );

    if (choice === "name") {
        const newName = prompt("New item name:", item.name);
        item.name = newName;
    }

    if (choice === "brand") {
        const newBrand = prompt("New brand:", item.brand);
        item.brand = newBrand;
    }

    if (choice === "size") {
        const newSize = prompt("New size:", item.size);
        item.size = newSize;
    }

    if (choice === "bought") {
        const newBought = prompt("New buy price:", item.bought);
        item.bought = newBought;
    }

    if (choice === "listing") {
        const newListing = prompt("New listing price:", item.listing);
        item.listing = newListing;
    }

    if (choice === "description") {
        const newDescription = prompt("New description:", item.description);
        item.description = newDescription;
    }

    localStorage.setItem("inventory", JSON.stringify(inventory));
    location.reload();

});
searchInput.addEventListener("input", function() {
    const searchValue = searchInput.value.toLowerCase();

    if (
        item.name.toLowerCase().includes(searchValue) ||
        item.brand.toLowerCase().includes(searchValue)
    ) {
        itemCard.style.display = "grid";
    } else {
        itemCard.style.display = "none";
    }
});

});




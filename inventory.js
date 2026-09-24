
let inventory = [];

async function loadInventory() {
    const { data, error } = await supabaseClient
        .from("INVENTORY")
        .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    inventory = data;
    renderInventory();
}

function renderInventory() {
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
const profit = Number(item.sold_price) - Number(item.bought);

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
        `Bought: $${item.bought} • Listed: $${item.listing} • Sold: $${item.sold_price}`;

    itemProfit.textContent = `Profit: $${profit.toFixed(2)}`;
} else {
    itemPrices.textContent =
        `Bought: $${item.bought} • Listed: $${item.listing}`;
}
itemDate.textContent = item.date_added
    ? `Added: ${item.date_added}`
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
    soldNumber.textContent = "MARK SOLD";
    listed.append(itemCard);
    buttonGroup.append(soldNumber);
} else if (item.status === "Sold") {
   shippedButton.textContent = "MARK SHIPPED";
   buttonGroup.append(shippedButton);
    sold.append(itemCard);
} else if (item.status === "Shipped") {
    shipped.append(itemCard);
}

list.addEventListener("click", async function() {
const { error } = await supabaseClient
    .from("INVENTORY")
    .update({ status: "Listed" })
    .eq("id", item.id);

console.log("ERROR:", error);

location.reload();
});
shippedButton.addEventListener("click", async function() {
    const { error } = await supabaseClient
    .from("INVENTORY")
    .update({ status: "Shipped" })
    .eq("id", item.id);

console.log("ERROR:", error);
    location.reload();
});

soldNumber.addEventListener("click", async function() {
    const soldPrice = prompt("How much did it sell for?");

    if (soldPrice !== null && soldPrice !== "") {

        const { error } = await supabaseClient
            .from("INVENTORY")
            .update({
                status: "Sold",
                sold_price: Number(soldPrice)
            })
            .eq("id", item.id);
        console.log("ERROR:", error);
        location.reload();
    }
});

deleteButton.addEventListener("click", async function(){
const choice2 = prompt(
    "Are you sure you want to delete it? \nyes\nno");
if (choice2 ==="yes"){
        const { error } = await supabaseClient
            .from("INVENTORY")
            .delete()
            .eq("id", item.id);

        console.log("ERROR:", error);

        location.reload();
    }



});

copyButton.addEventListener("click", function() {
    navigator.clipboard.writeText(item.description);
});

editButton.addEventListener("click", async function() {

     const choice = prompt(
        "What do you want to edit?\nname\nbrand\nsize\nbought\nlisting\ndescription"
    );

    if (choice === "name") {
          const newName = prompt("New item name:", item.name);

    if (newName !== null && newName !== "") {
        const { error } = await supabaseClient
            .from("INVENTORY")
            .update({ name: newName })
            .eq("id", item.id);

        console.log("ERROR:", error);
    }
}

    if (choice === "brand") {
        const newBrand = prompt("New brand:", item.brand);
      if (newBrand !== null && newBrand !== "") {
        const { error } = await supabaseClient
            .from("INVENTORY")
            .update({ brand: newBrand })
            .eq("id", item.id);

        console.log("ERROR:", error);
    }
    }
    if (choice === "size") {
        const newSize = prompt("New size:", item.size);
        if (newSize !== null && newSize !== "") {
        const { error } = await supabaseClient
            .from("INVENTORY")
            .update({ size: newSize })
            .eq("id", item.id);

        console.log("ERROR:", error);
    }
    }

    if (choice === "bought") {
        const newBought = prompt("New buy price:", item.bought);
        if (newBought!== null && newBought !== "") {
        const { error } = await supabaseClient
            .from("INVENTORY")
            .update({ bought: newBought})
            .eq("id", item.id);

        console.log("ERROR:", error);
    }
    }

    if (choice === "listing") {
        const newListing = prompt("New listing price:", item.listing);
         if (newListing !== null && newListing!== "") {
        const { error } = await supabaseClient
            .from("INVENTORY")
            .update({ listing: newListing })
            .eq("id", item.id);

        console.log("ERROR:", error);
    }
    }

    if (choice === "description") {
        const newDescription = prompt("New description:", item.description);
     
         if (newDescription !== null && newDescription!== "") {
        const { error } = await supabaseClient
            .from("INVENTORY")
            .update({ description: newDescription})
            .eq("id", item.id);

        console.log("ERROR:", error);
    }
    }

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

}
loadInventory();
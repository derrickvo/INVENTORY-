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


add.addEventListener("click", async function() {

    const images = image.files[0];
    const reader = new FileReader();

    const newItem = {
        name: itemName || null,
        brand: brand || null,
        size: size || null,
        bought: buyPrice ? Number(buyPrice) : null,
        listing: listingPrice ? Number(listingPrice) : null,
        description: description || null,
        status: status.value,
        dateAdded: new Date().toLocaleDateString()
    };

    reader.onload = async function() {

        newItem.image = reader.result;

        const { data, error } = await supabaseClient
            .from("INVENTORY")
            .insert([
                {
                    name: newItem.name,
                    brand: newItem.brand,
                    size: newItem.size,
                    bought: newItem.bought,
                    listing: newItem.listing,
                    description: newItem.description,
                    status: newItem.status,
                    date_added: newItem.dateAdded,
                    image: newItem.image
                }
            ]);

        console.log("DATA:", data);
        console.log("ERROR:", error);
    };
if (!images) {
    alert("Please choose an image.");
    return;
}
    reader.readAsDataURL(images);
});
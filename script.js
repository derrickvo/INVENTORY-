async function checkLogin() {
    const { data } = await supabaseClient.auth.getSession();

    if (!data.session) {
        window.location.href = "login.html";
        return;
    }
    const username =
    data.session.user.user_metadata.username || "USER";

    document.getElementById("user").textContent =
        `${username}'s Inventory`;
}

checkLogin();
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
const description = document.getElementById("DESCRIPTION");
const logout = document.getElementById("logoutButton");
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", async function() {
    await supabaseClient.auth.signOut();

    window.location.href = "login.html";
});

let inventory = [];

const bobbyToggle =
    document.getElementById("bobbyToggle");

const bobbyPopup =
    document.getElementById("bobbyPopup");

const bobbyClose =
    document.getElementById("bobbyClose");


bobbyToggle.addEventListener("click", function() {

    bobbyPopup.classList.toggle("open");

});


bobbyClose.addEventListener("click", function() {

    bobbyPopup.classList.remove("open");

});
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
    return total + Number(item.sold_price || 0);
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
    name: itemName.value,
    brand: brand.value,
    size: size.value,
    bought: Number(Buy.value),
    listing: Number(ListingPrice.value),
    description: description.value,
    status: status.value,
    dateAdded: new Date().toLocaleDateString()
};

    reader.onload = async function() {

        newItem.image = reader.result;
const {
    data: { user }
} = await supabaseClient.auth.getUser();
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

const aiForm = document.getElementById("aiForm");
const aiInput = document.getElementById("aiInput");
const aiMessages = document.getElementById("aiMessages");


// Stores recent conversation
let aiChatHistory = [];


// =========================
// EXACT INVENTORY QUESTIONS
// =========================

function answerExactInventoryQuestion(
    message,
    currentInventory
) {

    const question =
        message.toLowerCase();


    const totalItemCount =
        currentInventory.length;


    const spent =
        currentInventory.reduce(
            function(total, item) {

                return (
                    total +
                    Number(item.bought || 0)
                );

            },
            0
        );


    const listingValue =
        currentInventory.reduce(
            function(total, item) {

                return (
                    total +
                    Number(item.listing || 0)
                );

            },
            0
        );


    const listedItems =
        currentInventory.filter(
            function(item) {

                return item.status === "Listed";

            }
        );


    const unlistedItems =
        currentInventory.filter(
            function(item) {

                return item.status === "Unlisted";

            }
        );


    const soldItems =
        currentInventory.filter(
            function(item) {

                return item.status === "Sold";

            }
        );


    // HOW MANY ITEMS

    if (
        question.includes("how many items") ||
        question.includes("total items")
    ) {

        return (
            `You have ${totalItemCount} items ` +
            `in your inventory.`
        );
    }


    // TOTAL SPENT

    if (
        question.includes("how much have i spent") ||
        question.includes("how much did i spend") ||
        question.includes("total spent") ||
        question.includes("money spent")
    ) {

        return (
            `You've spent $${spent.toFixed(2)} ` +
            `on inventory.`
        );
    }


    // LISTED COUNT

    if (
        question.includes("how many listed") ||
        question.includes("listed count")
    ) {

        return (
            `You have ${listedItems.length} ` +
            `listed items.`
        );
    }


    // UNLISTED COUNT

    if (
        question.includes("how many unlisted") ||
        question.includes("unlisted count")
    ) {

        return (
            `You have ${unlistedItems.length} ` +
            `unlisted items.`
        );
    }


    // SOLD COUNT

    if (
        question.includes("how many sold") ||
        question.includes("sold count")
    ) {

        return (
            `You have ${soldItems.length} ` +
            `sold items.`
        );
    }


    // POTENTIAL REVENUE

    if (
        question.includes("potential revenue") ||
        question.includes("listing value") ||
        question.includes("everything sells")
    ) {

        return (
            `Your potential revenue is ` +
            `$${listingValue.toFixed(2)} ` +
            `if everything sells at listing price.`
        );
    }


    // POTENTIAL PROFIT

    if (
        question.includes("potential profit") ||
        question.includes("possible profit")
    ) {

        const potentialProfit =
            listingValue - spent;


        return (
            `Your potential gross profit is ` +
            `$${potentialProfit.toFixed(2)} ` +
            `before fees, shipping, and taxes.`
        );
    }


    // Let AI answer everything else
    return null;
}


// =========================
// ADD CHAT MESSAGE
// =========================



// =========================
// SEND AI MESSAGE
// =========================

aiForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const message =
            aiInput.value.trim();


        if (message === "") {
            return;
        }


        // Show user's message
        addChatMessage(
            "user",
            message
        );


        aiInput.value = "";


        // Loading message
        const loadingMessage =
            addChatMessage(
                "ai",
                "Thinking..."
            );


        try {

            // =========================
            // GET FRESH INVENTORY
            // =========================

            const {
                data: latestInventory,
                error: inventoryError
            } =
                await supabaseClient
                    .from("INVENTORY")
                    .select(`
    name,
    brand,
    size,
    bought,
    listing,
    sold_price,
    description,
    status,
    date_added
`);


            if (inventoryError) {

                console.error(
                    "INVENTORY ERROR:",
                    inventoryError
                );

                throw inventoryError;
            }


            const inventoryForAI =
                latestInventory || [];


            console.log(
                "INVENTORY SENT TO AI:",
                inventoryForAI
            );



            const exactAnswer =
                answerExactInventoryQuestion(
                    message,
                    inventoryForAI
                );


            if (exactAnswer) {

                loadingMessage.remove();


                addChatMessage(
                    "ai",
                    exactAnswer
                );


                // Add exact answer to memory
                aiChatHistory.push(
                    {
                        role: "user",
                        content: message
                    },
                    {
                        role: "assistant",
                        content: exactAnswer
                    }
                );


                return;
            }


            // =========================
            // SEND TO AI
            // =========================

            const { data, error } =
                await supabaseClient
                    .functions
                    .invoke(
                        "inventory-assistant",
                        {
                            body: {

                                message: message,

                                inventory:
                                    inventoryForAI,

                                chatHistory:
                                    aiChatHistory.slice(-10)
                            }
                        }
                    );


            loadingMessage.remove();


            if (error) {

                console.error(
                    "AI ERROR:",
                    error
                );


                addChatMessage(
                    "ai",
                    "Something went wrong."
                );


                return;
            }


            if (data.error) {

                console.error(
                    "AI RESPONSE ERROR:",
                    data.error
                );


                addChatMessage(
                    "ai",
                    data.error
                );


                return;
            }


            // =========================
            // SHOW AI RESPONSE
            // =========================

            addChatMessage(
                "ai",
                data.reply
            );


            // =========================
            // SAVE CHAT MEMORY
            // =========================

            aiChatHistory.push(
                {
                    role: "user",
                    content: message
                },
                {
                    role: "assistant",
                    content: data.reply
                }
            );


            // Don't keep unlimited messages
            if (aiChatHistory.length > 20) {

                aiChatHistory =
                    aiChatHistory.slice(-20);

            }

        } catch (error) {

            loadingMessage.remove();


            console.error(
                "AI ERROR:",
                error
            );


            addChatMessage(
                "ai",
                "Something went wrong."
            );
        }

    }
);

function addChatMessage(sender, text) {

    const messageElement =
        document.createElement("div");

    messageElement.classList.add(
        "chat-message"
    );

    if (sender === "user") {

        messageElement.classList.add(
            "user-message"
        );

    } else {

        messageElement.classList.add(
            "ai-message"
        );

    }

    messageElement.textContent = text;

    aiMessages.appendChild(
        messageElement
    );

    aiMessages.scrollTop =
        aiMessages.scrollHeight;

    return messageElement;
}
// =========================
// START APP
// =========================
async function loadInventory() {

    const { data, error } = await supabaseClient
        .from("INVENTORY")
        .select("*");

    if (error) {
        console.error("LOAD INVENTORY ERROR:", error);
        return;
    }

    inventory = data || [];

    console.log("INVENTORY LOADED:", inventory);

    updateStats();
}

loadInventory();
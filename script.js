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

let inventory = [];


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

function addChatMessage(sender, text) {

    const messageElement =
        document.createElement("p");


    if (sender === "user") {

        messageElement.textContent =
            "You: " + text;

    } else {

        messageElement.textContent =
            "AI: " + text;

    }


    aiMessages.appendChild(
        messageElement
    );


    aiMessages.scrollTop =
        aiMessages.scrollHeight;


    return messageElement;
}


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


            // =========================
            // CHECK FOR EXACT QUESTION
            // =========================

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

loadInventory();
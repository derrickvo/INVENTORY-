async function checkLogin() {
    const { data } = await supabaseClient.auth.getSession();

    if (!data.session) {
        window.location.href = "login.html";
        return;
    }
    const username =
    data.session.user.user_metadata.username || "USER";

    document.getElementById("user").textContent =
        `Hello ${username}  👋
        Here's what's happening with your inventory`;
}

checkLogin();

const logout = document.getElementById("logoutButton");
const logoutButton = document.getElementById("logoutButton");
let btn = document.querySelector('#btn')
let sidebar = document.querySelector('.sidebar')

btn.addEventListener("click", function(){

 sidebar.classList.toggle('active');
});
logoutButton.addEventListener("click", async function() {
    await supabaseClient.auth.signOut();

    window.location.href = "login.html";
});



const pfpInput = document.getElementById("pfpInput");
const profilePicture = document.getElementById("profilePicture");

async function loadProfilePicture() {
    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();

    if (error) {
        console.error("User error:", error);
        return;
    }

    if (!user) return;

    console.log("USER:", user);
    console.log("AVATAR:", user.user_metadata.avatar_url);

    if (user.user_metadata.avatar_url) {
        profilePicture.src = user.user_metadata.avatar_url;
    }
}

pfpInput.addEventListener("change", async () => {
    const file = pfpInput.files[0];

    if (!file) return;

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) return;

    const fileExt = file.name.split(".").pop();

    const filePath = `${user.id}/profile.${fileExt}`;

    const { error: uploadError } = await supabaseClient.storage
        .from("pfp")
        .upload(filePath, file, {
            upsert: true
        });

    if (uploadError) {
        console.error("UPLOAD ERROR:", uploadError);
        return;
    }

    const { data: urlData } = supabaseClient.storage
        .from("pfp")
        .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    console.log("IMAGE URL:", avatarUrl);

    const { error: updateError } =
        await supabaseClient.auth.updateUser({
            data: {
                avatar_url: avatarUrl
            }
        });

    if (updateError) {
        console.error("UPDATE ERROR:", updateError);
        return;
    }

    profilePicture.src = avatarUrl;
});

loadProfilePicture();
console.log("pfpInput:", pfpInput);
console.log("profilePicture:", profilePicture);

const totalItems = document.getElementById("totalItems");
const listedCount = document.getElementById("listedCount");
const totalSpent = document.getElementById("totalSpent");
const totalProfits = document.getElementById("totalPROFITS");
let inventory =[];

async function loadInventory() {
    const { data, error } = await supabaseClient
        .from("INVENTORY")
        .select("*");

    if (error) {
        console.log(error);
        return;
    }

    inventory = data;

    updateStats();

    await loadMonthlyGoal();
}


function updateStats(){
totalItems.textContent = inventory.length;
const listedItems = inventory.filter(function(item) {
        return item.status === "Listed";
    });
listedCount.textContent = listedItems.length;
const spent = inventory.reduce(function(total, item) {
    return total + Number(item.bought);
}, 0);
totalSpent.textContent = `$${spent.toFixed(2)}`;

const sales = inventory.reduce(function(total, item) {
    return total + Number(item.sold_price || 0);
}, 0);
const unlistedItems = inventory.filter(function(item) {
    return item.status === "Unlisted";
});
const soldItems = inventory.filter(function(item) {
    return item.status === "Sold";
});
document.getElementById("soldItemsattention").textContent =
     `${soldItems.length} items need to be shipped`;
 document.getElementById("unlistedAttention").textContent =
     `${unlistedItems.length} items need to be listed`;
const profits = sales - spent;
totalProfits.textContent = `$${profits.toFixed(2)}`;

const oldListings = inventory.filter(function(item){
    if(item.status != "listed" || !item.date_added){
        return false;
    }
    const addedDate = newDate(item.date_added);
    const today= new Date();
    const difference = today - addedDate;
    const daysOld = difference / (1000 * 80 * 60 * 24);
    return daysOld >=30;
});
document.getElementById("oldListingsAttention").textContent =
    `${oldListings.length} listings are 30+ days old`;
}
loadInventory();

const monthlyGoalInput = document.getElementById("monthlyGoalInput");
const saveGoalBtn = document.getElementById("saveGoalBtn");
const goalProgress = document.getElementById("goalProgress");
const editBtn = document.getElementById("edit");

editBtn.addEventListener("click", function() {

    monthlyGoalInput.style.display = "block";
    saveGoalBtn.style.display = "block";

    monthlyGoalInput.value = monthlyGoal;
});
let monthlyGoal = 0;

saveGoalBtn.addEventListener("click", async function() {

    monthlyGoal = Number(monthlyGoalInput.value);

    const currentProfit = Number(
        totalProfits.textContent.replace("$", "")
    );

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) return;

    const { error } = await supabaseClient
        .from("PROFILES")
        .upsert({
            user_id: user.id,
            monthly_goal: monthlyGoal
        });

    if (error) {
        console.log(error);
        return;
    }

    goalProgress.textContent =
        `$${currentProfit.toFixed(2)} / $${monthlyGoal}`;
  monthlyGoalInput.style.display = "none";
    saveGoalBtn.style.display = "none";

    console.log("Goal saved!");

});
edit.addEventListener("click", async function(){


});
async function loadMonthlyGoal() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) return;

    const { data, error } = await supabaseClient
        .from("PROFILES")
        .select("monthly_goal")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        console.log(error);
        return;
    }

    if (!data) return;

    monthlyGoal = Number(data.monthly_goal);

    const currentProfit = Number(
        totalProfits.textContent.replace("$", "")
    );

    goalProgress.textContent =
        `$${currentProfit.toFixed(2)} / $${monthlyGoal}`;
}
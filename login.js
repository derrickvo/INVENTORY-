const user = document.getElementById("user");
const password = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const register = document.getElementById("registerButton");
const welcomeName = document.getElementById("welcomeName");
const loginCard = document.getElementById("loginCard");
const welcomeScreen = document.getElementById("welcomeScreen");

register.addEventListener("click", function(){
window.location.href = "signup.html";
});

loginButton.addEventListener("click", async function() {
    
    const emailValue = user.value;
    const passValue = password.value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: emailValue,
        password: passValue
    });

    if (error) {
        loginMessage.textContent =
            "Login failed: " + error.message;
    } else {
const clickSound = new Audio(
            "freesound_community-game-start-6104.mp3"
        );

        clickSound.play();

        clickSound.addEventListener("ended", function() {
            window.location.href = "homepage.html";
        });
        const username =
            data.user.user_metadata.username || "USER";
            
        localStorage.setItem("username", username);
        welcomeName.textContent =
            `WELCOME BACK, ${username.toUpperCase()}`;

        loginCard.style.display = "none";
        welcomeScreen.style.display = "flex";

        setTimeout(function() {
            window.location.href = "homepage.html";
        }, 1500);
    }


});
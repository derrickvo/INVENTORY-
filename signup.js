const user = document.getElementById("user");
const password = document.getElementById("password");
const username = document.getElementById("username");
const registerButton = document.getElementById("registerButton");
const registerMessage = document.getElementById("registerMessage");
const login = document.getElementById("login");

registerButton.addEventListener("click", async function() {

    registerButton.disabled = true;
    registerButton.textContent = "CREATING...";

    const emailValue = user.value;
    const passValue = password.value;
    const usernameValue = username.value;

    const { data, error } = await supabaseClient.auth.signUp({
        email: emailValue,
        password: passValue,
        options: {
            data: {
                username: usernameValue
            }
        }
    });

    if (error) {
        registerMessage.textContent =
            "Registration failed: " + error.message;

        registerButton.disabled = false;
        registerButton.textContent = "REGISTER";

    } else {
        window.location.href = "index.html";
    }
});

login.addEventListener("click", function() {
    window.location.href = "login.html";
});
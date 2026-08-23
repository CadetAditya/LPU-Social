const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const registrationNumber =
        document.getElementById("registrationNumber").value;

    const password =
        document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:8080/api/users/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    registrationNumber: registrationNumber,
                    password: password
                })
            }
        );

        if (response.ok) {

            const data = await response.json();

            message.textContent = "Login successful!";
            message.style.color = "green";

            console.log("Logged in user:", data);

            // Later we will redirect:
            // window.location.href = "home.html";

        } else {

            message.textContent =
                "Invalid registration number or password";

            message.style.color = "red";
        }

    } catch (error) {

        console.error("Login error:", error);

        message.textContent =
            "Unable to connect to server";

        message.style.color = "red";
    }
}); 
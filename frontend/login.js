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

    // Store the logged-in user's information
    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(data)
    );

    message.textContent = "Login successful!";
    message.style.color = "green";

    // Go to the existing index page
    setTimeout(() => {
        window.location.href = "index.html";
    }, 500);
}
else {

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
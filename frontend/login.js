const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const registrationNumber = document.getElementById("registrationNumber").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                registrationNumber: registrationNumber,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("loggedInUser", JSON.stringify(data));

            if (typeof showToast === "function") {
                showToast(`Welcome back, ${data.name}!`, "success");
            }
            if (message) {
                message.textContent = "Login successful!";
                message.style.color = "green";
            }

            setTimeout(() => {
                window.location.href = "index.html";
            }, 800);
        } else {
            const errMsg = "Invalid registration number or password.";
            if (typeof showToast === "function") {
                showToast(errMsg, "error");
            }
            if (message) {
                message.textContent = errMsg;
                message.style.color = "red";
            }
        }
    } catch (error) {
        console.error("Login error:", error);
        const errMsg = "Unable to connect to server.";
        if (typeof showToast === "function") {
            showToast(errMsg, "error");
        }
        if (message) {
            message.textContent = errMsg;
            message.style.color = "red";
        }
    }
});
 
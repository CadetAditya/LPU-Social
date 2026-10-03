const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const registrationNumber = document.getElementById("registrationNumber").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;

    if (password !== confirmPassword) {
        if (typeof showToast === "function") showToast("Passwords do not match.", "error");
        if (message) { message.textContent = "Passwords do not match."; message.style.color = "red"; }
        return;
    }

    if (password.length < 6) {
        if (typeof showToast === "function") showToast("Password must be at least 6 characters.", "warning");
        if (message) { message.textContent = "Password must be at least 6 characters."; message.style.color = "red"; }
        return;
    }

    try {
        if (message) { message.textContent = "Creating account..."; message.style.color = "#555"; }

        const response = await fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                registrationNumber: registrationNumber,
                password: password,
                role: role
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (typeof showToast === "function") showToast("Account created successfully! Redirecting to login...", "success");
            if (message) { message.textContent = "Account created successfully!"; message.style.color = "green"; }

            registerForm.reset();

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1200);
        } else {
            const errMsg = response.status === 400 || response.status === 500 
                ? "Registration number may already exist." 
                : "Unable to create account.";
            if (typeof showToast === "function") showToast(errMsg, "error");
            if (message) { message.textContent = errMsg; message.style.color = "red"; }
        }
    } catch (error) {
        console.error("Registration error:", error);
        if (typeof showToast === "function") showToast("Unable to connect to server.", "error");
        if (message) { message.textContent = "Unable to connect to server."; message.style.color = "red"; }
    }
});
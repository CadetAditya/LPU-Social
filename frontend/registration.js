const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Get values from the form
    const name =
        document.getElementById("name").value.trim();

    const registrationNumber =
        document.getElementById("registrationNumber").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const role =
        document.getElementById("role").value;


    // Check password
    if (password !== confirmPassword) {

        message.textContent = "Passwords do not match.";
        message.style.color = "red";

        return;
    }


    // Basic password validation
    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        message.style.color = "red";

        return;
    }


    try {

        message.textContent = "Creating account...";
        message.style.color = "#555";


        // Send data to Spring Boot
        const response = await fetch(
            "http://localhost:8080/api/users",
            {
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
            }
        );


        // Successful registration
        if (response.ok) {

            const data = await response.json();

            console.log("Registered user:", data);

            message.textContent =
                "Account created successfully!";

            message.style.color = "green";


            // Clear form
            registerForm.reset();


            // Redirect to login after 1.5 seconds
            setTimeout(function () {

                window.location.href = "login.html";

            }, 1500);

        }


        // Registration number already exists
        else if (response.status === 500) {

            message.textContent =
                "Registration number may already exist.";

            message.style.color = "red";

        }


        // Other errors
        else {

            message.textContent =
                "Unable to create account.";

            message.style.color = "red";
        }

    }

    catch (error) {

        console.error("Registration error:", error);

        message.textContent =
            "Unable to connect to server.";

        message.style.color = "red";
    }

});
// ===============================
// AUTHENTICATION CHECK
// ===============================



const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
);

if (loggedInUser) {

    const navAuth = document.getElementById("navAuth");

    if (navAuth) {

        navAuth.innerHTML = `
            <span class="user-name">
                Welcome, ${loggedInUser.name}
            </span>

            <button class="btn btn-primary" id="logoutBtn">
                Logout
            </button>
        `;

        const logoutBtn = document.getElementById("logoutBtn");

        logoutBtn.addEventListener("click", function () {

            localStorage.removeItem("loggedInUser");

            window.location.href = "login.html";

        });
    }
}
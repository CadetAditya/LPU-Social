// ========================================
// LPU SOCIAL - AUTHENTICATION & ROUTE GUARD
// ========================================

const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
);

document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname.toLowerCase();
    const userRole = loggedInUser && loggedInUser.role ? loggedInUser.role.toUpperCase() : null;

    // ========================================
    // PAGE ROUTE PROTECTION
    // ========================================

    // Protected pages
    if (currentPath.includes("create-event.html") || currentPath.includes("organizer-events.html") || currentPath.includes("my-events.html")) {
        if (!loggedInUser) {
            alert("Please log in to access this page.");
            window.location.href = "login.html";
            return;
        }
    }

    // ========================================
    // NAVBAR ROLE-BASED RENDER
    // ========================================

    const navLinks = document.getElementById("navLinks");
    const navAuth = document.getElementById("navAuth");

    if (navLinks) {
        let linksHTML = `
            <li><a href="index.html" class="${currentPath.endsWith("index.html") || currentPath.endsWith("/") ? "active" : ""}">Home</a></li>
            <li><a href="events.html" class="${currentPath.includes("events.html") && !currentPath.includes("organizer-events.html") && !currentPath.includes("my-events.html") ? "active" : ""}">Events</a></li>
        `;

        if (loggedInUser) {
            linksHTML += `
                <li><a href="create-event.html" class="${currentPath.includes("create-event.html") ? "active" : ""}">Create Event</a></li>
                <li><a href="my-events.html" class="${currentPath.includes("my-events.html") || currentPath.includes("organizer-events.html") ? "active" : ""}">My Events</a></li>
            `;
        }

        navLinks.innerHTML = linksHTML;
    }

    if (navAuth) {
        if (loggedInUser) {
            navAuth.innerHTML = `
                <span class="user-name" style="font-weight:600; color: var(--primary); font-size: 0.9rem;">
                    👋 ${escapeAuthHTML(loggedInUser.name)} <span style="font-size:0.75rem; background: rgba(108, 76, 232, 0.1); padding: 3px 8px; border-radius: 12px; margin-left: 4px;">${userRole}</span>
                </span>
                <button class="btn btn-outline" id="logoutBtn" style="padding: 6px 14px; font-size: 0.85rem;">
                    Logout
                </button>
            `;

            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", function () {
                    localStorage.removeItem("loggedInUser");
                    window.location.href = "login.html";
                });
            }
        } else {
            navAuth.innerHTML = `
                <a href="login.html" class="login-link">Login</a>
                <a href="registration.html" class="btn btn-primary">Sign Up</a>
            `;
        }
    }
});

function escapeAuthHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}
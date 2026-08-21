// ===============================
// MOBILE MENU
// ===============================

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
const navAuth = document.getElementById("navAuth");

mobileMenuBtn.addEventListener("click", function () {

    navLinks.classList.toggle("active-mobile");
    navAuth.classList.toggle("active-mobile");

});


// ===============================
// EVENT SEARCH
// ===============================

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const eventCards = document.querySelectorAll(".event-card");

function searchEvents() {

    const searchText = searchInput.value.toLowerCase().trim();

    eventCards.forEach(function (card) {

        const eventText = card.textContent.toLowerCase();

        if (eventText.includes(searchText)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }

    });

}


// Search button
searchBtn.addEventListener("click", searchEvents);


// Search when pressing Enter
searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchEvents();
    }

});


// ===============================
// CATEGORY FILTER
// ===============================

const categoryPills = document.querySelectorAll(".category-pill");

categoryPills.forEach(function (category) {

    category.addEventListener("click", function () {

        // Remove active class from all categories
        categoryPills.forEach(function (pill) {
            pill.classList.remove("active");
        });

        // Add active class to selected category
        category.classList.add("active");

        const selectedCategory = category.textContent
            .replace(/^[^\w]+/, "")
            .trim();

        eventCards.forEach(function (card) {

            const cardCategory =
                card.querySelector(".card-category").textContent.trim();

            if (
                selectedCategory === "Others" ||
                cardCategory.toLowerCase() === selectedCategory.toLowerCase()
            ) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }

        });

    });

});
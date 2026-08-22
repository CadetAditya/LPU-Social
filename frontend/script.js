// ===============================
// MOBILE MENU
// ===============================

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
const navAuth = document.getElementById("navAuth");

if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener("click", function () {

        navLinks.classList.toggle("active-mobile");
        navAuth.classList.toggle("active-mobile");

    });

}


// ===============================
// EVENTS
// ===============================

const eventCards = document.querySelectorAll(".event-card");


// ===============================
// EVENT SEARCH
// ===============================

const searchInput = document.getElementById("eventSearch");
const searchBtn = document.getElementById("eventSearchBtn");

function searchEvents() {

    const searchText = searchInput.value
        .toLowerCase()
        .trim();

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
if (searchBtn) {

    searchBtn.addEventListener("click", searchEvents);

}


// Search when pressing Enter
if (searchInput) {

    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            searchEvents();

        }

    });

}


// ===============================
// CATEGORY FILTER
// ===============================

const categoryPills = document.querySelectorAll(
    ".event-filters .category-pill"
);


categoryPills.forEach(function (category) {

    category.addEventListener("click", function () {

        // Remove active class from all categories
        categoryPills.forEach(function (pill) {

            pill.classList.remove("active");

        });


        // Add active class to selected category
        category.classList.add("active");


        // Get selected category
        const selectedCategory = category.dataset.category;


        console.log("Selected category:", selectedCategory);


        // Filter event cards
        eventCards.forEach(function (card) {

            const cardCategory = card
                .querySelector(".card-category")
                .textContent
                .trim()
                .toLowerCase();


            console.log("Event category:", cardCategory);


            // Show all events
            if (selectedCategory === "all") {

                card.style.display = "flex";

            }

            // Show matching category
            else if (cardCategory === selectedCategory) {

                card.style.display = "flex";

            }

            // Hide non-matching events
            else {

                card.style.display = "none";

            }

        });

    });

});
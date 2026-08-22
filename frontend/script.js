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



// ===============================
// VIEW EVENT DETAILS
// ===============================

function viewEvent(eventId) {
    window.location.href = "event-details.html?id=" + eventId;
}


// ===============================
// EVENT DETAILS DATA
// ===============================

const eventsData = {

    "ai-ml": {
        category: "TECHNOLOGY",
        title: "AI & Machine Learning Fundamentals",
        date: "Aug 28, 2026",
        time: "10:00 AM - 1:00 PM",
        location: "Block 34, Room 402",
        joined: "72 / 100 Joined",
        description: "Learn the fundamentals of Artificial Intelligence and Machine Learning through practical examples and interactive sessions.",
        organizer: "LPU Faculty",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"
    },

    "football": {
        category: "SPORTS",
        title: "Inter-Hostel Football Tournament",
        date: "Sep 02, 2026",
        time: "4:00 PM - 7:00 PM",
        location: "Main Ground",
        joined: "45 / 80 Joined",
        description: "Compete with students from different hostels and showcase your football skills in the inter-hostel tournament.",
        organizer: "LPU Sports Committee",
        image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=1200&q=80"
    },

    "open-mic": {
        category: "CULTURAL",
        title: "Open Mic Night: Poetry & Music",
        date: "Sep 05, 2026",
        time: "6:00 PM - 9:00 PM",
        location: "Student Center",
        joined: "35 / 50 Joined",
        description: "An evening of poetry, music and creative performances where students can showcase their talent.",
        organizer: "LPU Cultural Club",
        image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80"
    },

    "web-development": {
        category: "TECHNOLOGY",
        title: "Web Development Workshop",
        date: "Sep 08, 2026",
        time: "2:00 PM - 5:00 PM",
        location: "Block 38, Lab 204",
        joined: "38 / 60 Joined",
        description: "Build your web development skills through a practical workshop covering modern web technologies.",
        organizer: "LPU Coding Club",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
    },

    "programming": {
        category: "ACADEMIC",
        title: "Competitive Programming Contest",
        date: "Sep 12, 2026",
        time: "11:00 AM - 2:00 PM",
        location: "Block 32, Lab 101",
        joined: "84 / 120 Joined",
        description: "Test your problem-solving and programming skills by competing against fellow students.",
        organizer: "LPU Programming Club",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
    },

    "placement-workshop": {
        category: "WORKSHOPS",
        title: "Career & Placement Preparation Workshop",
        date: "Sep 15, 2026",
        time: "3:00 PM - 5:00 PM",
        location: "Seminar Hall",
        joined: "120 / 200 Joined",
        description: "Prepare for upcoming placement opportunities with guidance on resumes, interviews and career preparation.",
        organizer: "LPU Placement Cell",
        image: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1200&q=80"
    }

};


// ===============================
// LOAD EVENT DETAILS
// ===============================

const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get("id");

if (eventId && eventsData[eventId]) {

    const event = eventsData[eventId];

    const category = document.getElementById("eventCategory");
    const title = document.getElementById("eventTitle");
    const date = document.getElementById("eventDate");
    const time = document.getElementById("eventTime");
    const location = document.getElementById("eventLocation");
    const participants = document.getElementById("eventParticipants");
    const description = document.getElementById("eventDescription");
    const organizer = document.getElementById("organizerName");
    const image = document.getElementById("eventImage");

    if (category) {
        category.textContent = event.category;
    }

    if (title) {
        title.textContent = event.title;
    }

    if (date) {
        date.textContent = event.date;
    }

    if (time) {
        time.textContent = event.time;
    }

    if (location) {
        location.textContent = event.location;
    }

    if (participants) {
        participants.textContent = event.joined;
    }

    if (description) {
        description.textContent = event.description;
    }

    if (organizer) {
        organizer.textContent = event.organizer;
    }

    if (image) {
        image.style.backgroundImage = `url('${event.image}')`;
    }

}
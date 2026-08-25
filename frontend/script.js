// ============================================================
// LPU SOCIAL - MAIN SCRIPT
// ============================================================

const API_URL = "http://localhost:8080/api/events";


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    setupMobileMenu();

    // Load events wherever an events grid exists
    if (document.querySelector(".events-grid")) {
        loadEvents();
    }

    // Event details page
    if (document.getElementById("eventTitle")) {
        loadEventDetails();
    }

    setupSearchAndFilters();

});


// ============================================================
// MOBILE MENU
// ============================================================

function setupMobileMenu() {

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const navLinks =
        document.getElementById("navLinks");

    const navAuth =
        document.getElementById("navAuth");


    if (!mobileMenuBtn || !navLinks || !navAuth) {
        return;
    }


    mobileMenuBtn.addEventListener("click", function () {

        navLinks.classList.toggle("active-mobile");

        navAuth.classList.toggle("active-mobile");

    });

}


// ============================================================
// LOAD EVENTS FROM SPRING BOOT
// ============================================================

async function loadEvents() {

    const eventsGrid =
        document.querySelector(".events-grid");


    if (!eventsGrid) {
        return;
    }


    try {

        console.log("Loading events from:", API_URL);


        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load events. Status: " +
                response.status
            );

        }


        const events =
            await response.json();


        console.log(
            "Events received from backend:",
            events
        );


        renderEvents(events);


    } catch (error) {

        console.error(
            "Error loading events:",
            error
        );


        eventsGrid.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
            ">

                <h2>
                    Unable to load events
                </h2>

                <p>
                    Please make sure the Spring Boot backend
                    is running on port 8080.
                </p>

                <p style="color:red;">
                    ${error.message}
                </p>

            </div>
        `;

    }

}


// ============================================================
// RENDER EVENTS
// ============================================================

function renderEvents(events) {

    const eventsGrid =
        document.querySelector(".events-grid");


    if (!eventsGrid) {
        return;
    }


    // Remove old hardcoded events
    eventsGrid.innerHTML = "";


    // Update event count
    updateEventCount(events.length);


    // No events
    if (!events || events.length === 0) {

        eventsGrid.innerHTML = `

            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
            ">

                <h2>
                    No Events Available
                </h2>

                <p>
                    There are currently no events.
                </p>

            </div>

        `;

        return;
    }


    // Create cards
    events.forEach(function (event) {

        const card =
            createEventCard(event);

        eventsGrid.appendChild(card);

    });


    // Re-apply filters
    filterEvents();

}


// ============================================================
// CREATE EVENT CARD
// ============================================================

function createEventCard(event) {

    const card =
        document.createElement("div");


    card.className =
        "event-card";


    // ========================================================
    // EVENT IMAGE
    // ========================================================

    let imageHTML = "";


    if (
        event.image &&
        event.image.trim() !== ""
    ) {

        imageHTML = `
            <div
                class="card-image"
                style="
                    background-image:
                    url('${escapeAttribute(event.image)}');
                "
            >
                <span class="faculty-tag">
                    📅 CAMPUS EVENT
                </span>
            </div>
        `;

    } else {

        imageHTML = `
            <div
                class="card-image"
                style="
                    background:
                    linear-gradient(
                        135deg,
                        #6c4ce8,
                        #8f70ff
                    );
                "
            >
                <span class="faculty-tag">
                    📅 CAMPUS EVENT
                </span>
            </div>
        `;

    }


    // ========================================================
    // CATEGORY
    // ========================================================

    const category =
        event.category
            ? event.category.toUpperCase()
            : "GENERAL";


    // ========================================================
    // DATE
    // ========================================================

    const formattedDate =
        formatDate(event.date);


    // ========================================================
    // TIME
    // ========================================================

    const startTime =
        formatTime(event.startTime);


    const endTime =
        formatTime(event.endTime);


    // ========================================================
    // PARTICIPANTS
    // ========================================================

    const joined =
        event.joined != null
            ? event.joined
            : 0;


    const capacity =
        event.capacity != null
            ? event.capacity
            : 0;


    // ========================================================
    // CARD HTML
    // ========================================================

    card.innerHTML = `

        ${imageHTML}

        <div class="card-body">

            <span class="card-category">
                ${escapeHTML(category)}
            </span>


            <h3 class="card-title">
                ${escapeHTML(
                    event.title || "Untitled Event"
                )}
            </h3>


            <div class="card-meta">

                <div class="meta-item">
                    📅 ${escapeHTML(formattedDate)}
                </div>


                <div class="meta-item">
                    ⏰ ${escapeHTML(startTime)}
                    ${
                        endTime
                            ? " - " + escapeHTML(endTime)
                            : ""
                    }
                </div>


                <div class="meta-item">
                    📍 ${
                        escapeHTML(
                            event.location ||
                            "Location not specified"
                        )
                    }
                </div>


                <div class="meta-item">
                    👥 ${joined} / ${capacity} Joined
                </div>

            </div>


            <div class="card-footer">

                <button
                    class="btn btn-outline view-details-btn"
                    onclick="viewEvent(${event.id})"
                >
                    View Details
                </button>

            </div>

        </div>

    `;


    return card;

}


// ============================================================
// EVENT COUNT
// ============================================================

function updateEventCount(count) {

    const eventCount =
        document.querySelector(".event-count");


    if (!eventCount) {
        return;
    }


    eventCount.textContent =
        count +
        (count === 1 ? " Event" : " Events");

}


// ============================================================
// SEARCH + FILTER SETUP
// ============================================================

function setupSearchAndFilters() {

    // ========================================================
    // EVENTS PAGE SEARCH
    // ========================================================

    const eventsSearchInput =
        document.getElementById("eventSearch");


    const eventsSearchBtn =
        document.getElementById("eventSearchBtn");


    // ========================================================
    // HOME PAGE SEARCH
    // ========================================================

    const homeSearchInput =
        document.getElementById("searchInput");


    const homeSearchBtn =
        document.getElementById("searchBtn");


    // ========================================================
    // EVENTS PAGE CATEGORY BUTTONS
    // ========================================================

    const eventsCategoryPills =
        document.querySelectorAll(
            ".event-filters .category-pill"
        );


    // ========================================================
    // HOME PAGE CATEGORY BUTTONS
    // ========================================================

    const homeCategoryPills =
        document.querySelectorAll(
            "#categoryList .category-pill"
        );


    // ========================================================
    // EVENTS PAGE SEARCH BUTTON
    // ========================================================

    if (eventsSearchBtn) {

        eventsSearchBtn.addEventListener(
            "click",
            filterEvents
        );

    }


    // ========================================================
    // HOME PAGE SEARCH BUTTON
    // ========================================================

    if (homeSearchBtn) {

        homeSearchBtn.addEventListener(
            "click",
            filterEvents
        );

    }


    // ========================================================
    // EVENTS PAGE ENTER KEY
    // ========================================================

    if (eventsSearchInput) {

        eventsSearchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    filterEvents();

                }

            }
        );

    }


    // ========================================================
    // HOME PAGE ENTER KEY
    // ========================================================

    if (homeSearchInput) {

        homeSearchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    filterEvents();

                }

            }
        );

    }


    // ========================================================
    // EVENTS PAGE CATEGORY
    // ========================================================

    eventsCategoryPills.forEach(
        function (category) {

            category.addEventListener(
                "click",
                function () {

                    eventsCategoryPills.forEach(
                        function (pill) {

                            pill.classList.remove(
                                "active"
                            );

                        }
                    );


                    category.classList.add(
                        "active"
                    );


                    filterEvents();

                }
            );

        }
    );


    // ========================================================
    // HOME PAGE CATEGORY
    // ========================================================

    homeCategoryPills.forEach(
        function (category) {

            category.addEventListener(
                "click",
                function () {

                    homeCategoryPills.forEach(
                        function (pill) {

                            pill.classList.remove(
                                "active"
                            );

                        }
                    );


                    category.classList.add(
                        "active"
                    );


                    filterEvents();

                }
            );

        }
    );

}


// ============================================================
// FILTER EVENTS
// ============================================================

function filterEvents() {

    // ========================================================
    // GET SEARCH INPUT
    // ========================================================

    let searchText = "";


    const eventsSearchInput =
        document.getElementById("eventSearch");


    const homeSearchInput =
        document.getElementById("searchInput");


    if (eventsSearchInput) {

        searchText =
            eventsSearchInput.value
                .toLowerCase()
                .trim();

    }
    else if (homeSearchInput) {

        searchText =
            homeSearchInput.value
                .toLowerCase()
                .trim();

    }


    // ========================================================
    // GET ACTIVE CATEGORY
    // ========================================================

    let activeCategory = null;


    const eventsActiveCategory =
        document.querySelector(
            ".event-filters .category-pill.active"
        );


    const homeActiveCategory =
        document.querySelector(
            "#categoryList .category-pill.active"
        );


    if (eventsActiveCategory) {

        activeCategory =
            eventsActiveCategory;

    }
    else if (homeActiveCategory) {

        activeCategory =
            homeActiveCategory;

    }


    let selectedCategory = "all";


    if (activeCategory) {

        selectedCategory =
            (
                activeCategory.dataset.category ||
                "all"
            )
            .toLowerCase()
            .trim();

    }


    // ========================================================
    // GET EVENT CARDS
    // ========================================================

    const eventCards =
        document.querySelectorAll(
            ".events-grid .event-card"
        );


    let visibleCount = 0;


    // ========================================================
    // FILTER EACH CARD
    // ========================================================

    eventCards.forEach(
        function (card) {

            const eventText =
                card.textContent
                    .toLowerCase();


            const categoryElement =
                card.querySelector(
                    ".card-category"
                );


            const cardCategory =
                categoryElement
                    ? categoryElement.textContent
                        .toLowerCase()
                        .trim()
                    : "";


            // =================================================
            // CATEGORY MATCH
            // =================================================

            const categoryMatches =
                selectedCategory === "all" ||
                selectedCategory === "" ||
                cardCategory === selectedCategory;


            // =================================================
            // SEARCH MATCH
            // =================================================

            const searchMatches =
                eventText.includes(searchText);


            // =================================================
            // SHOW / HIDE
            // =================================================

            if (
                categoryMatches &&
                searchMatches
            ) {

                card.style.display = "flex";

                visibleCount++;

            }
            else {

                card.style.display = "none";

            }

        }
    );


    // ========================================================
    // UPDATE COUNT
    // ========================================================

    updateVisibleEventCount(
        visibleCount
    );

}


// ============================================================
// UPDATE VISIBLE EVENT COUNT
// ============================================================

function updateVisibleEventCount(count) {

    const eventCount =
        document.querySelector(".event-count");


    if (!eventCount) {
        return;
    }


    eventCount.textContent =
        count +
        (count === 1 ? " Event" : " Events");

}


// ============================================================
// VIEW EVENT DETAILS
// ============================================================

function viewEvent(eventId) {

    window.location.href =
        "event-details.html?id=" + eventId;

}


// ============================================================
// LOAD EVENT DETAILS
// ============================================================

async function loadEventDetails() {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const eventId =
        urlParams.get("id");


    if (!eventId) {
        return;
    }


    try {

        console.log(
            "Loading event details:",
            eventId
        );


        const response =
            await fetch(
                API_URL + "/" + eventId
            );


        if (!response.ok) {

            throw new Error(
                "Event not found. Status: " +
                response.status
            );

        }


        const event =
            await response.json();


        displayEventDetails(event);


    }
    catch (error) {

        console.error(
            "Error loading event details:",
            error
        );


        const title =
            document.getElementById(
                "eventTitle"
            );


        if (title) {

            title.textContent =
                "Event not found";

        }

    }

}


// ============================================================
// DISPLAY EVENT DETAILS
// ============================================================

function displayEventDetails(event) {

    const category =
        document.getElementById(
            "eventCategory"
        );


    const title =
        document.getElementById(
            "eventTitle"
        );


    const date =
        document.getElementById(
            "eventDate"
        );


    const time =
        document.getElementById(
            "eventTime"
        );


    const location =
        document.getElementById(
            "eventLocation"
        );


    const joined =
        document.getElementById(
            "eventJoined"
        );


    const description =
        document.getElementById(
            "eventDescription"
        );


    const organizer =
        document.getElementById(
            "eventOrganizer"
        );


    const image =
        document.getElementById(
            "eventImage"
        );


    if (category) {

        category.textContent =
            event.category
                ? event.category.toUpperCase()
                : "GENERAL";

    }


    if (title) {

        title.textContent =
            event.title ||
            "Untitled Event";

    }


    if (date) {

        date.textContent =
            formatDate(event.date);

    }


    if (time) {

        const start =
            formatTime(event.startTime);


        const end =
            formatTime(event.endTime);


        time.textContent =
            end
                ? start + " - " + end
                : start;

    }


    if (location) {

        location.textContent =
            event.location ||
            "Location not specified";

    }


    if (joined) {

        joined.textContent =
            `${event.joined || 0} / ${
                event.capacity || 0
            } Joined`;

    }


    if (description) {

        description.textContent =
            event.description ||
            "No description available.";

    }


    if (organizer) {

        if (
            event.organizer &&
            typeof event.organizer === "object"
        ) {

            organizer.textContent =
                event.organizer.name ||
                event.organizer.registrationNumber ||
                "LPU Social";

        }
        else {

            organizer.textContent =
                event.organizer ||
                "LPU Social";

        }

    }


    if (image) {

        if (
            event.image &&
            event.image.trim() !== ""
        ) {

            image.style.backgroundImage =
                `url('${escapeAttribute(
                    event.image
                )}')`;

        }
        else {

            image.style.backgroundImage =
                "linear-gradient(135deg, #6c4ce8, #8f70ff)";

        }

    }

}


// ============================================================
// DATE FORMAT
// ============================================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "";
    }


    try {

        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {

            return dateValue;

        }


        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric"
            }
        );

    }
    catch (error) {

        return dateValue;

    }

}


// ============================================================
// TIME FORMAT
// ============================================================

function formatTime(timeValue) {

    if (!timeValue) {
        return "";
    }


    const parts =
        timeValue
            .toString()
            .split(":");


    if (parts.length < 2) {

        return timeValue;

    }


    let hours =
        parseInt(parts[0], 10);


    const minutes =
        parts[1];


    if (isNaN(hours)) {

        return timeValue;

    }


    const period =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12;


    if (hours === 0) {
        hours = 12;
    }


    return (
        String(hours).padStart(2, "0") +
        ":" +
        minutes +
        " " +
        period
    );

}


// ============================================================
// HTML ESCAPING
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// ATTRIBUTE ESCAPING
// ============================================================

function escapeAttribute(value) {

    if (!value) {
        return "";
    }


    return String(value)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");

}
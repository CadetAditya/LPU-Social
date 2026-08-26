// ============================================================
// LPU SOCIAL - MAIN SCRIPT
// ============================================================

const API_URL = "http://localhost:8080/api/events";


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    setupMobileMenu();

    /*
     * IMPORTANT PAGE ORDER:
     *
     * 1. My Events
     * 2. Event Details
     * 3. Events page
     * 4. Home page
     */

    // ========================================================
    // MY EVENTS PAGE
    // ========================================================

    if (document.getElementById("myEventsGrid")) {

        loadMyEvents();

    }

    // ========================================================
    // EVENT DETAILS PAGE
    // ========================================================

    else if (document.getElementById("eventTitle")) {

        loadEventDetails();

    }

    // ========================================================
    // EVENTS PAGE
    // ========================================================

    else if (document.querySelector(".events-page")) {

        loadEvents();

    }

    // ========================================================
    // HOME PAGE
    // ========================================================

    else if (
        document.querySelector(
            ".events-section .events-grid"
        )
    ) {

        loadHomeEvents();

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


    mobileMenuBtn.addEventListener(
        "click",
        function () {

            navLinks.classList.toggle(
                "active-mobile"
            );

            navAuth.classList.toggle(
                "active-mobile"
            );

        }
    );

}


// ============================================================
// GET LOGGED-IN USER
// ============================================================

function getLoggedInUser() {

    try {

        return JSON.parse(
            localStorage.getItem("loggedInUser")
        );

    } catch (error) {

        console.error(
            "Could not read logged-in user:",
            error
        );

        return null;

    }

}


// ============================================================
// LOAD ALL EVENTS
// ============================================================

async function loadEvents() {

    const eventsGrid =
        document.querySelector(
            ".events-page .events-grid"
        );


    if (!eventsGrid) {
        return;
    }


    try {

        console.log(
            "Loading all events from:",
            API_URL
        );


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
            "Events received:",
            events
        );


        renderEvents(events);


    } catch (error) {

        console.error(
            "Error loading events:",
            error
        );


        eventsGrid.innerHTML = `

            <div
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                "
            >

                <h2>
                    Unable to load events
                </h2>

                <p>
                    Please make sure the Spring Boot backend
                    is running on port 8080.
                </p>

                <p style="color:red;">
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

    }

}


// ============================================================
// LOAD UPCOMING EVENTS ON HOME PAGE
// ============================================================

async function loadHomeEvents() {

    const eventsGrid =
        document.querySelector(
            ".events-section .events-grid"
        );


    if (!eventsGrid) {
        return;
    }


    try {

        console.log(
            "Loading upcoming events for home page..."
        );


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
            "Home page events received:",
            events
        );


        // ====================================================
        // CURRENT DATE
        // ====================================================

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        // ====================================================
        // FILTER UPCOMING EVENTS
        // ====================================================

        const upcomingEvents =
            events.filter(function (event) {

                if (!event.date) {
                    return false;
                }


                const eventDate =
                    new Date(event.date);


                eventDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return eventDate >= today;

            });


        // ====================================================
        // SORT EVENTS BY DATE
        // ====================================================

        upcomingEvents.sort(
            function (a, b) {

                const dateA =
                    new Date(a.date);

                const dateB =
                    new Date(b.date);


                // If same date, sort by start time
                if (
                    dateA.getTime() ===
                    dateB.getTime()
                ) {

                    return compareTime(
                        a.startTime,
                        b.startTime
                    );

                }


                return dateA - dateB;

            }
        );


        // ====================================================
        // SHOW FIRST 6 EVENTS
        // ====================================================

        const eventsToShow =
            upcomingEvents.slice(0, 6);


        // ====================================================
        // NO UPCOMING EVENTS
        // ====================================================

        if (
            eventsToShow.length === 0
        ) {

            eventsGrid.innerHTML = `

                <div
                    style="
                        grid-column: 1 / -1;
                        text-align: center;
                        padding: 60px 20px;
                    "
                >

                    <h2>
                        No Upcoming Events
                    </h2>

                    <p>
                        There are currently no upcoming
                        events on campus.
                    </p>

                </div>

            `;

            return;

        }


        // ====================================================
        // DISPLAY EVENTS
        // ====================================================

        eventsGrid.innerHTML = "";


        eventsToShow.forEach(
            function (event) {

                const card =
                    createEventCard(event);


                eventsGrid.appendChild(card);

            }
        );


    } catch (error) {

        console.error(
            "Error loading home events:",
            error
        );


        eventsGrid.innerHTML = `

            <div
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                "
            >

                <h2>
                    Unable to load events
                </h2>

                <p>
                    Please make sure the Spring Boot
                    backend is running on port 8080.
                </p>

                <p style="color:red;">
                    ${escapeHTML(error.message)}
                </p>

            </div>

        `;

    }

}


// ============================================================
// COMPARE EVENT TIMES
// ============================================================

function compareTime(
    timeA,
    timeB
) {

    if (!timeA && !timeB) {
        return 0;
    }

    if (!timeA) {
        return 1;
    }

    if (!timeB) {
        return -1;
    }


    const partsA =
        timeA
            .toString()
            .split(":");


    const partsB =
        timeB
            .toString()
            .split(":");


    const hourA =
        parseInt(partsA[0], 10) || 0;


    const hourB =
        parseInt(partsB[0], 10) || 0;


    const minuteA =
        parseInt(partsA[1], 10) || 0;


    const minuteB =
        parseInt(partsB[1], 10) || 0;


    if (hourA !== hourB) {
        return hourA - hourB;
    }


    return minuteA - minuteB;

}


// ============================================================
// LOAD MY EVENTS
// ============================================================

async function loadMyEvents() {

    const eventsGrid =
        document.getElementById(
            "myEventsGrid"
        );


    const noEventsMessage =
        document.getElementById(
            "noEventsMessage"
        );


    const eventCount =
        document.getElementById(
            "myEventCount"
        );


    if (!eventsGrid) {
        return;
    }


    const loggedInUser =
        getLoggedInUser();


    // ========================================================
    // USER NOT LOGGED IN
    // ========================================================

    if (
        !loggedInUser ||
        !loggedInUser.id
    ) {

        console.log(
            "No logged-in user found."
        );


        eventsGrid.innerHTML = "";


        if (eventCount) {

            eventCount.textContent =
                "0 Events";

        }


        if (noEventsMessage) {

            noEventsMessage.style.display =
                "block";


            noEventsMessage.innerHTML = `

                <h2>
                    Please Login
                </h2>

                <p>
                    Login to see the events you have joined.
                </p>

                <br>

                <a
                    href="login.html"
                    class="btn btn-primary"
                >
                    Login
                </a>

            `;

        }


        return;

    }


    try {

        console.log(
            "Loading events for user:",
            loggedInUser.id
        );


        // ====================================================
        // GET ONLY EVENTS JOINED BY CURRENT USER
        // ====================================================

        const response =
            await fetch(
                API_URL +
                "/user/" +
                loggedInUser.id
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load your events. Status: " +
                response.status
            );

        }


        const events =
            await response.json();


        console.log(
            "My events:",
            events
        );


        // Clear previous events

        eventsGrid.innerHTML = "";


        // ====================================================
        // NO EVENTS
        // ====================================================

        if (
            !events ||
            events.length === 0
        ) {

            if (eventCount) {

                eventCount.textContent =
                    "0 Events";

            }


            if (noEventsMessage) {

                noEventsMessage.style.display =
                    "block";

            }


            return;

        }


        // Hide empty message

        if (noEventsMessage) {

            noEventsMessage.style.display =
                "none";

        }


        // Update count

        if (eventCount) {

            eventCount.textContent =
                events.length +
                (
                    events.length === 1
                        ? " Event"
                        : " Events"
                );

        }


        // ====================================================
        // DISPLAY JOINED EVENTS
        // ====================================================

        events.forEach(
            function (event) {

                if (!event) {

                    console.warn(
                        "Invalid event:",
                        event
                    );

                    return;

                }


                const card =
                    createEventCard(event);


                eventsGrid.appendChild(card);

            }
        );


    } catch (error) {

        console.error(
            "Error loading my events:",
            error
        );


        eventsGrid.innerHTML = `

            <div
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                "
            >

                <h2>
                    Unable to load your events
                </h2>

                <p>
                    Please make sure the backend is running.
                </p>

                <p style="color:red;">
                    ${escapeHTML(error.message)}
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
        document.querySelector(
            ".events-page .events-grid"
        );


    if (!eventsGrid) {
        return;
    }


    eventsGrid.innerHTML = "";


    updateEventCount(
        events ? events.length : 0
    );


    if (
        !events ||
        events.length === 0
    ) {

        eventsGrid.innerHTML = `

            <div
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                "
            >

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


    events.forEach(
        function (event) {

            const card =
                createEventCard(event);


            eventsGrid.appendChild(card);

        }
    );


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
    // IMAGE
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
                    background-size: cover;
                    background-position: center;
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
    // JOINED
    // ========================================================

    const joined =
        event.joined != null
            ? event.joined
            : 0;


    // ========================================================
    // CAPACITY
    // ========================================================

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
                    event.title ||
                    "Untitled Event"
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
                            ? " - " +
                              escapeHTML(endTime)
                            : ""
                    }
                </div>

                <div class="meta-item">
                    📍 ${escapeHTML(
                        event.location ||
                        "Location not specified"
                    )}
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
        document.querySelector(
            ".event-count"
        );


    if (!eventCount) {
        return;
    }


    eventCount.textContent =
        count +
        (
            count === 1
                ? " Event"
                : " Events"
        );

}


// ============================================================
// SEARCH + FILTER SETUP
// ============================================================

function setupSearchAndFilters() {

    // ========================================================
    // EVENTS PAGE SEARCH
    // ========================================================

    const searchInput =
        document.getElementById(
            "eventSearch"
        );


    const searchBtn =
        document.getElementById(
            "eventSearchBtn"
        );


    const categoryPills =
        document.querySelectorAll(
            ".event-filters .category-pill"
        );


    if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            filterEvents
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    filterEvents();

                }

            }
        );

    }


    categoryPills.forEach(
        function (category) {

            category.addEventListener(
                "click",
                function () {

                    categoryPills.forEach(
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
    // HOME PAGE SEARCH
    // ========================================================

    const homeSearchInput =
        document.getElementById(
            "searchInput"
        );


    const homeSearchBtn =
        document.getElementById(
            "searchBtn"
        );


    if (homeSearchBtn) {

        homeSearchBtn.addEventListener(
            "click",
            function () {

                const searchText =
                    homeSearchInput
                        ? homeSearchInput.value.trim()
                        : "";


                if (searchText !== "") {

                    window.location.href =
                        "events.html?search=" +
                        encodeURIComponent(
                            searchText
                        );

                } else {

                    window.location.href =
                        "events.html";

                }

            }
        );

    }


    if (homeSearchInput) {

        homeSearchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    const searchText =
                        homeSearchInput.value.trim();


                    if (
                        searchText !== ""
                    ) {

                        window.location.href =
                            "events.html?search=" +
                            encodeURIComponent(
                                searchText
                            );

                    }

                }

            }
        );

    }

}


// ============================================================
// FILTER EVENTS
// ============================================================

function filterEvents() {

    const searchInput =
        document.getElementById(
            "eventSearch"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const activeCategory =
        document.querySelector(
            ".event-filters .category-pill.active"
        );


    let selectedCategory =
        "all";


    if (activeCategory) {

        selectedCategory =
            (
                activeCategory.dataset.category ||
                "all"
            )
            .toLowerCase()
            .trim();

    }


    const eventCards =
        document.querySelectorAll(
            ".events-page .events-grid .event-card"
        );


    let visibleCount =
        0;


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


            const categoryMatches =
                selectedCategory === "all" ||
                selectedCategory === "" ||
                cardCategory === selectedCategory;


            const searchMatches =
                eventText.includes(
                    searchText
                );


            if (
                categoryMatches &&
                searchMatches
            ) {

                card.style.display =
                    "flex";

                visibleCount++;

            } else {

                card.style.display =
                    "none";

            }

        }
    );


    updateVisibleEventCount(
        visibleCount
    );

}


// ============================================================
// UPDATE VISIBLE EVENT COUNT
// ============================================================

function updateVisibleEventCount(count) {

    const eventCount =
        document.querySelector(
            ".event-count"
        );


    if (!eventCount) {
        return;
    }


    eventCount.textContent =
        count +
        (
            count === 1
                ? " Event"
                : " Events"
        );

}


// ============================================================
// VIEW EVENT
// ============================================================

function viewEvent(eventId) {

    window.location.href =
        "event-details.html?id=" +
        eventId;

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
            "Loading event:",
            eventId
        );


        const response =
            await fetch(
                API_URL +
                "/" +
                eventId
            );


        if (!response.ok) {

            throw new Error(
                "Event not found."
            );

        }


        const event =
            await response.json();


        displayEventDetails(
            event
        );


        await checkJoinedStatus(
            eventId
        );


    } catch (error) {

        console.error(
            "Error loading event:",
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


    const participants =
        document.getElementById(
            "eventParticipants"
        );


    const description =
        document.getElementById(
            "eventDescription"
        );


    const organizer =
        document.getElementById(
            "organizerName"
        );


    const organizerAvatar =
        document.getElementById(
            "organizerAvatar"
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
            formatDate(
                event.date
            );

    }


    if (time) {

        const start =
            formatTime(
                event.startTime
            );


        const end =
            formatTime(
                event.endTime
            );


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


    if (participants) {

        participants.textContent =
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
            event.organizer.name
        ) {

            organizer.textContent =
                event.organizer.name;

        } else {

            organizer.textContent =
                "LPU Social";

        }

    }


    if (organizerAvatar) {

        if (
            event.organizer &&
            event.organizer.name
        ) {

            organizerAvatar.textContent =
                event.organizer.name
                    .charAt(0)
                    .toUpperCase();

        } else {

            organizerAvatar.textContent =
                "L";

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

            image.style.backgroundSize =
                "cover";

            image.style.backgroundPosition =
                "center";

        } else {

            image.style.backgroundImage =
                "linear-gradient(135deg, #6c4ce8, #8f70ff)";

        }

    }


    updateJoinInformation(
        event
    );

}


// ============================================================
// UPDATE JOIN INFORMATION
// ============================================================

function updateJoinInformation(event) {

    const joined =
        event.joined || 0;


    const capacity =
        event.capacity || 0;


    const joinedText =
        document.getElementById(
            "joinedText"
        );


    const remainingText =
        document.getElementById(
            "remainingText"
        );


    if (joinedText) {

        joinedText.textContent =
            joined +
            (
                joined === 1
                    ? " student has joined"
                    : " students have joined"
            );

    }


    if (remainingText) {

        const remaining =
            Math.max(
                capacity - joined,
                0
            );


        remainingText.textContent =
            remaining +
            (
                remaining === 1
                    ? " spot remaining"
                    : " spots remaining"
            );

    }

}


// ============================================================
// CHECK JOINED STATUS
// ============================================================

async function checkJoinedStatus(
    eventId
) {

    const joinButton =
        document.getElementById(
            "joinEventBtn"
        );


    if (!joinButton) {
        return;
    }


    const loggedInUser =
        getLoggedInUser();


    if (!loggedInUser) {

        joinButton.textContent =
            "Login to Join";


        joinButton.disabled =
            false;


        joinButton.onclick =
            function () {

                window.location.href =
                    "login.html";

            };


        return;

    }


    try {

        const response =
            await fetch(
                API_URL +
                "/" +
                eventId +
                "/joined/" +
                loggedInUser.id
            );


        if (!response.ok) {

            console.error(
                "Could not check joined status."
            );

            return;

        }


        const hasJoined =
            await response.json();


        if (hasJoined) {

            setJoinedButton();

        } else {

            setJoinButton();

        }


    } catch (error) {

        console.error(
            "Error checking joined status:",
            error
        );

    }

}


// ============================================================
// SET JOIN BUTTON
// ============================================================

function setJoinButton() {

    const joinButton =
        document.getElementById(
            "joinEventBtn"
        );


    if (!joinButton) {
        return;
    }


    joinButton.disabled =
        false;


    joinButton.textContent =
        "Join Event";


    joinButton.onclick =
        joinEvent;

}


// ============================================================
// SET ALREADY JOINED BUTTON
// ============================================================

function setJoinedButton() {

    const joinButton =
        document.getElementById(
            "joinEventBtn"
        );


    if (!joinButton) {
        return;
    }


    joinButton.textContent =
        "✓ Already Joined";


    joinButton.disabled =
        true;


    joinButton.onclick =
        null;

}


// ============================================================
// JOIN EVENT
// ============================================================

async function joinEvent() {

    const loggedInUser =
        getLoggedInUser();


    if (!loggedInUser) {

        alert(
            "Please login first to join this event."
        );


        window.location.href =
            "login.html";


        return;

    }


    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const eventId =
        urlParams.get("id");


    if (!eventId) {

        alert(
            "Event ID not found."
        );


        return;

    }


    const joinButton =
        document.getElementById(
            "joinEventBtn"
        );


    try {

        joinButton.disabled =
            true;


        joinButton.textContent =
            "Joining...";


        const response =
            await fetch(
                API_URL +
                "/" +
                eventId +
                "/join/" +
                loggedInUser.id,
                {
                    method: "POST"
                }
            );


        let data = {};


        try {

            data =
                await response.json();

        } catch (error) {

            console.log(
                "No JSON response."
            );

        }


        // ====================================================
        // SUCCESS
        // ====================================================

        if (response.ok) {

            alert(
                "You have joined the event successfully!"
            );


            setJoinedButton();


            await reloadEventAfterJoin(
                eventId
            );


            return;

        }


        // ====================================================
        // ERROR
        // ====================================================

        const errorMessage =
            data.message ||
            "Unable to join event.";


        console.log(
            "Join error:",
            errorMessage
        );


        // ====================================================
        // DUPLICATE JOIN
        // ====================================================

        if (
            errorMessage
                .toLowerCase()
                .includes("already joined")
        ) {

            alert(
                "You have already joined this event."
            );


            setJoinedButton();


            return;

        }


        // ====================================================
        // EVENT FULL
        // ====================================================

        if (
            errorMessage
                .toLowerCase()
                .includes("full")
        ) {

            alert(
                "This event is already full."
            );


            joinButton.disabled =
                true;


            joinButton.textContent =
                "Event Full";


            return;

        }


        // ====================================================
        // OTHER ERROR
        // ====================================================

        alert(
            errorMessage
        );


        joinButton.disabled =
            false;


        joinButton.textContent =
            "Join Event";


    } catch (error) {

        console.error(
            "Join event error:",
            error
        );


        alert(
            "Unable to connect to server."
        );


        joinButton.disabled =
            false;


        joinButton.textContent =
            "Join Event";

    }

}


// ============================================================
// RELOAD EVENT AFTER JOIN
// ============================================================

async function reloadEventAfterJoin(
    eventId
) {

    try {

        const response =
            await fetch(
                API_URL +
                "/" +
                eventId
            );


        if (!response.ok) {
            return;
        }


        const event =
            await response.json();


        const participants =
            document.getElementById(
                "eventParticipants"
            );


        if (participants) {

            participants.textContent =
                `${event.joined || 0} / ${
                    event.capacity || 0
                } Joined`;

        }


        updateJoinInformation(
            event
        );


    } catch (error) {

        console.error(
            "Could not refresh event:",
            error
        );

    }

}


// ============================================================
// DATE FORMAT
// ============================================================

function formatDate(
    dateValue
) {

    if (!dateValue) {
        return "";
    }


    try {

        const date =
            new Date(dateValue);


        if (
            isNaN(
                date.getTime()
            )
        ) {

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


    } catch (error) {

        return dateValue;

    }

}


// ============================================================
// TIME FORMAT
// ============================================================

function formatTime(
    timeValue
) {

    if (!timeValue) {
        return "";
    }


    const parts =
        timeValue
            .toString()
            .split(":");


    if (
        parts.length < 2
    ) {

        return timeValue;

    }


    let hours =
        parseInt(
            parts[0],
            10
        );


    const minutes =
        parts[1];


    if (
        isNaN(hours)
    ) {

        return timeValue;

    }


    const period =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12;


    if (
        hours === 0
    ) {

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

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// ATTRIBUTE ESCAPING
// ============================================================

function escapeAttribute(
    value
) {

    if (!value) {
        return "";
    }


    return String(value)
        .replace(
            /'/g,
            "%27"
        )
        .replace(
            /"/g,
            "%22"
        );

}
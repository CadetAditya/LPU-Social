// ========================================
// LPU SOCIAL - CREATE EVENT
// ========================================


// ========================================
// GET FORM ELEMENTS
// ========================================

const createEventForm =
    document.getElementById("createEventForm");

const message =
    document.getElementById("message");


// ========================================
// CHECK LOGIN
// ========================================

// loggedInUser comes from auth.js
// auth.js is loaded before create-event.js

if (!loggedInUser) {

    message.textContent =
        "Please login first.";

    message.style.color =
        "red";

    createEventForm.style.display =
        "none";
}


// ========================================
// IMAGE ELEMENTS
// ========================================

const eventImage =
    document.getElementById("eventImage");

const imagePreview =
    document.getElementById("imagePreview");

const imagePreviewContainer =
    document.getElementById(
        "imagePreviewContainer"
    );


// ========================================
// IMAGE DATA
// ========================================

// This will contain the complete Base64 image
// Example:
// data:image/jpeg;base64,/9j/4AAQSkZJRg...

let imageData = null;


// ========================================
// IMAGE PREVIEW + BASE64 CONVERSION
// ========================================

if (eventImage) {

    eventImage.addEventListener(
        "change",
        function () {

            const file =
                eventImage.files[0];


            // ========================================
            // NO FILE
            // ========================================

            if (!file) {

                imageData = null;

                if (imagePreviewContainer) {

                    imagePreviewContainer.style.display =
                        "none";

                }

                return;
            }


            // ========================================
            // CHECK IMAGE TYPE
            // ========================================

            if (!file.type.startsWith("image/")) {

                message.textContent =
                    "Please select a valid image.";

                message.style.color =
                    "red";

                eventImage.value = "";

                imageData = null;

                if (imagePreviewContainer) {

                    imagePreviewContainer.style.display =
                        "none";

                }

                return;
            }


            // ========================================
            // CHECK IMAGE SIZE
            // ========================================

            // Maximum 2 MB

            if (file.size > 2 * 1024 * 1024) {

                message.textContent =
                    "Image size must be less than 2 MB.";

                message.style.color =
                    "red";

                eventImage.value = "";

                imageData = null;

                if (imagePreviewContainer) {

                    imagePreviewContainer.style.display =
                        "none";

                }

                return;
            }


            // ========================================
            // CONVERT IMAGE TO BASE64
            // ========================================

            const reader =
                new FileReader();


            reader.onload =
                function (e) {

                    // Store complete Base64 image
                    imageData =
                        e.target.result;


                    // ========================================
                    // DEBUG LOGS
                    // ========================================

                    console.log(
                        "IMAGE DATA CREATED:"
                    );

                    console.log(
                        imageData.substring(
                            0,
                            80
                        )
                    );

                    console.log(
                        "IMAGE DATA LENGTH:",
                        imageData.length
                    );


                    // ========================================
                    // VERIFY BASE64 FORMAT
                    // ========================================

                    if (
                        !imageData.startsWith(
                            "data:image/"
                        )
                    ) {

                        console.error(
                            "Invalid Base64 image format."
                        );

                        imageData = null;

                        message.textContent =
                            "Could not process the image.";

                        message.style.color =
                            "red";

                        return;
                    }


                    // ========================================
                    // SHOW IMAGE PREVIEW
                    // ========================================

                    if (imagePreview) {

                        imagePreview.src =
                            imageData;

                    }


                    if (imagePreviewContainer) {

                        imagePreviewContainer.style.display =
                            "block";

                    }


                    // Clear previous error message

                    if (
                        message.textContent ===
                        "Please select a valid image." ||
                        message.textContent ===
                        "Image size must be less than 2 MB."
                    ) {

                        message.textContent =
                            "";

                    }

                };


            // ========================================
            // FILE READER ERROR
            // ========================================

            reader.onerror =
                function () {

                    console.error(
                        "Could not read image file."
                    );

                    imageData =
                        null;

                    message.textContent =
                        "Could not read the selected image.";

                    message.style.color =
                        "red";

                };


            // ========================================
            // START READING FILE
            // ========================================

            reader.readAsDataURL(file);

        }
    );

}


// ========================================
// CREATE EVENT
// ========================================

createEventForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ========================================
        // CHECK USER
        // ========================================

        if (!loggedInUser) {

            message.textContent =
                "Please login before creating an event.";

            message.style.color =
                "red";

            return;
        }


        // ========================================
        // CHECK IMAGE
        // ========================================

        if (!imageData) {

            message.textContent =
                "Please select an event image.";

            message.style.color =
                "red";

            return;
        }


        // ========================================
        // VERIFY IMAGE DATA
        // ========================================

        if (
            !imageData.startsWith(
                "data:image/"
            )
        ) {

            console.error(
                "Invalid image data:",
                imageData
            );

            message.textContent =
                "Invalid image data. Please select the image again.";

            message.style.color =
                "red";

            return;
        }


        // ========================================
        // GET FORM VALUES
        // ========================================

        const title =
            document
                .getElementById("title")
                .value
                .trim();


        const category =
            document
                .getElementById("category")
                .value;


        const date =
            document
                .getElementById("date")
                .value;


        const startTime =
            document
                .getElementById("startTime")
                .value;


        const endTime =
            document
                .getElementById("endTime")
                .value;


        const location =
            document
                .getElementById("location")
                .value
                .trim();


        const capacity =
            parseInt(
                document
                    .getElementById("capacity")
                    .value
            );


        const description =
            document
                .getElementById("description")
                .value
                .trim();


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !title ||
            !category ||
            !date ||
            !startTime ||
            !endTime ||
            !location ||
            !capacity ||
            !description
        ) {

            message.textContent =
                "Please fill all required fields.";

            message.style.color =
                "red";

            return;
        }


        // ========================================
        // CAPACITY VALIDATION
        // ========================================

        if (
            isNaN(capacity) ||
            capacity <= 0
        ) {

            message.textContent =
                "Capacity must be greater than 0.";

            message.style.color =
                "red";

            return;
        }


        // ========================================
        // TIME VALIDATION
        // ========================================

        if (startTime >= endTime) {

            message.textContent =
                "End time must be after start time.";

            message.style.color =
                "red";

            return;
        }


        // ========================================
        // DATE VALIDATION
        // ========================================

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        if (date < today) {

            message.textContent =
                "Event date cannot be in the past.";

            message.style.color =
                "red";

            return;
        }


        // ========================================
        // FINAL IMAGE DEBUG
        // ========================================

        console.log(
            "================================"
        );

        console.log(
            "FINAL IMAGE DATA:"
        );

        console.log(
            imageData.substring(
                0,
                80
            )
        );

        console.log(
            "IMAGE LENGTH:",
            imageData.length
        );

        console.log(
            "IMAGE TYPE:",
            imageData.substring(
                0,
                imageData.indexOf(";")
            )
        );

        console.log(
            "================================"
        );


        // ========================================
        // CREATE EVENT OBJECT
        // ========================================

        const eventData = {

            title:
                title,

            category:
                category,

            date:
                date,

            startTime:
                startTime,

            endTime:
                endTime,

            location:
                location,

            capacity:
                capacity,

            joined:
                0,

            description:
                description,

            // IMPORTANT
            // Send complete Base64 image
            image:
                imageData,

            organizer: {

                id:
                    loggedInUser.id

            }

        };


        // ========================================
        // DEBUG EVENT DATA
        // ========================================

        console.log(
            "Event data being sent:"
        );

        console.log(
            {
                title: eventData.title,
                category: eventData.category,
                date: eventData.date,
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                location: eventData.location,
                capacity: eventData.capacity,
                description: eventData.description,
                imageLength: eventData.image.length,
                imageStart: eventData.image.substring(
                    0,
                    80
                ),
                organizerId: eventData.organizer.id
            }
        );


        // ========================================
        // SEND TO SPRING BOOT
        // ========================================

        try {

            message.textContent =
                "Creating event...";

            message.style.color =
                "#5a4fcf";


            const response =
                await fetch(
                    "http://localhost:8080/api/events",
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                eventData
                            )

                    }
                );


            // ========================================
            // SUCCESS
            // ========================================

            if (response.ok) {

                const savedEvent =
                    await response.json();


                console.log(
                    "Event created successfully:"
                );

                console.log(
                    savedEvent
                );


                // ========================================
                // VERIFY IMAGE RETURNED BY BACKEND
                // ========================================

                if (
                    savedEvent.image
                ) {

                    console.log(
                        "IMAGE RETURNED FROM BACKEND:"
                    );

                    console.log(
                        savedEvent.image.substring(
                            0,
                            80
                        )
                    );

                    console.log(
                        "RETURNED IMAGE LENGTH:",
                        savedEvent.image.length
                    );

                } else {

                    console.warn(
                        "WARNING: Backend returned no image."
                    );

                }


                // ========================================
                // SUCCESS MESSAGE
                // ========================================

                message.textContent =
                    "Event created successfully!";

                message.style.color =
                    "green";


                // ========================================
                // RESET FORM
                // ========================================

                createEventForm.reset();

                imageData =
                    null;


                if (imagePreviewContainer) {

                    imagePreviewContainer.style.display =
                        "none";

                }


                // ========================================
                // REDIRECT
                // ========================================

                setTimeout(
                    function () {

                        window.location.href =
                            "events.html";

                    },
                    1000
                );

            }


            // ========================================
            // ERROR RESPONSE
            // ========================================

            else {

                let errorMessage =
                    "Unable to create event.";


                try {

                    const errorData =
                        await response.json();


                    console.error(
                        "Backend error:",
                        errorData
                    );


                    if (
                        errorData.message
                    ) {

                        errorMessage =
                            errorData.message;

                    }

                }

                catch (error) {

                    console.log(
                        "Could not read error response."
                    );

                }


                message.textContent =
                    errorMessage;

                message.style.color =
                    "red";

            }

        }


        // ========================================
        // SERVER CONNECTION ERROR
        // ========================================

        catch (error) {

            console.error(
                "Create event error:",
                error
            );


            message.textContent =
                "Unable to connect to server.";

            message.style.color =
                "red";

        }

    }
);
// ========================================
// CREATE EVENT
// ========================================

const createEventForm = document.getElementById("createEventForm");
const message = document.getElementById("message");


// ========================================
// CHECK LOGIN
// ========================================

if (!loggedInUser) {

    message.textContent = "Please login first.";
    message.style.color = "red";

    createEventForm.style.display = "none";
}


// ========================================
// IMAGE PREVIEW
// ========================================

const eventImage = document.getElementById("eventImage");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer =
    document.getElementById("imagePreviewContainer");

let imageData = null;


if (eventImage) {

    eventImage.addEventListener("change", function () {

        const file = eventImage.files[0];

        if (!file) {

            imageData = null;

            imagePreviewContainer.style.display = "none";

            return;
        }


        // Check image type

        if (!file.type.startsWith("image/")) {

            message.textContent =
                "Please select a valid image.";

            message.style.color = "red";

            eventImage.value = "";

            return;
        }


        // Check image size
        // Maximum 2 MB

        if (file.size > 2 * 1024 * 1024) {

            message.textContent =
                "Image size must be less than 2 MB.";

            message.style.color = "red";

            eventImage.value = "";

            return;
        }


        // Convert image to Base64

        const reader = new FileReader();

        reader.onload = function (e) {

            imageData = e.target.result;

            // Show preview

            imagePreview.src = imageData;

            imagePreviewContainer.style.display = "block";

        };

        reader.readAsDataURL(file);

    });

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

            message.style.color = "red";

            return;
        }


        // ========================================
        // GET FORM VALUES
        // ========================================

        const title =
            document.getElementById("title").value.trim();

        const category =
            document.getElementById("category").value;

        const date =
            document.getElementById("date").value;

        const startTime =
            document.getElementById("startTime").value;

        const endTime =
            document.getElementById("endTime").value;

        const location =
            document.getElementById("location").value.trim();

        const capacity =
            parseInt(
                document.getElementById("capacity").value
            );

        const description =
            document.getElementById("description").value.trim();


        // ========================================
        // VALIDATION
        // ========================================

        if (!title ||
            !category ||
            !date ||
            !startTime ||
            !endTime ||
            !location ||
            !capacity ||
            !description) {

            message.textContent =
                "Please fill all required fields.";

            message.style.color = "red";

            return;
        }


        // ========================================
        // TIME VALIDATION
        // ========================================

        if (startTime >= endTime) {

            message.textContent =
                "End time must be after start time.";

            message.style.color = "red";

            return;
        }


        // ========================================
        // DATE VALIDATION
        // ========================================

        const today =
            new Date().toISOString().split("T")[0];

        if (date < today) {

            message.textContent =
                "Event date cannot be in the past.";

            message.style.color = "red";

            return;
        }


        // ========================================
        // CREATE EVENT OBJECT
        // ========================================

        const eventData = {

            title: title,

            category: category,

            date: date,

            startTime: startTime,

            endTime: endTime,

            location: location,

            capacity: capacity,

            joined: 0,

            description: description,

            image: imageData,

            organizer: {
                id: loggedInUser.id
            }

        };


        // ========================================
        // SEND TO SPRING BOOT
        // ========================================

        try {

            message.textContent =
                "Creating event...";

            message.style.color = "#5a4fcf";


            const response = await fetch(
                "http://localhost:8080/api/events",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(eventData)
                }
            );


            // ========================================
            // SUCCESS
            // ========================================

            if (response.ok) {

                const savedEvent =
                    await response.json();

                console.log(
                    "Event created:",
                    savedEvent
                );


                message.textContent =
                    "Event created successfully!";

                message.style.color = "green";


                // Reset form

                createEventForm.reset();

                imageData = null;

                imagePreviewContainer.style.display =
                    "none";


                // Redirect after 1 second

                setTimeout(function () {

                    window.location.href =
                        "events.html";

                }, 1000);

            }


            // ========================================
            // ERROR
            // ========================================

            else {

                let errorMessage =
                    "Unable to create event.";

                try {

                    const errorData =
                        await response.json();

                    if (errorData.message) {

                        errorMessage =
                            errorData.message;

                    }

                } catch (error) {

                    console.log(
                        "Could not read error response."
                    );

                }


                message.textContent =
                    errorMessage;

                message.style.color = "red";
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

            message.style.color = "red";
        }

    }
);
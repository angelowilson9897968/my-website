document.addEventListener("DOMContentLoaded", function () {
    console.log("Risk Profile Page Loaded");

    // Selecting the heading and applying a delay for animation
    const heading = document.querySelector(".heading");
    setTimeout(() => {
        heading.style.transform = "scale(1)";
        heading.style.opacity = "1";
    }, 200);

    // Select the risk form
    const form = document.getElementById("risk-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page refresh

        let riskScore = 0;

        // Get all selected answers and calculate risk score
        const questions = form.querySelectorAll(".question");
        questions.forEach((question) => {
            const selectedAnswer = question.querySelector("input:checked");
            if (selectedAnswer) {
                riskScore += parseInt(selectedAnswer.value); // Convert value to number
            }
        });

        console.log("Final Risk Score:", riskScore); // Debugging check

        // Save the risk score separately in localStorage
        localStorage.setItem("riskScore", riskScore);

        // Send the risk score to the Flask backend
        fetch("http://127.0.0.1:5000/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ score: riskScore }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Server responded with an error!");
            }
            return response.json();
        })
        .then(data => {
            console.log("Server Response:", data); // Debugging check

            // Store the full response in localStorage
            localStorage.setItem("riskProfileData", JSON.stringify(data));

            // Redirect to results page
            window.location.href = "results.html";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to connect to the server. Make sure Flask is running!");
        });
    });
});

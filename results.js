document.addEventListener("DOMContentLoaded", function () {
    console.log("Results Page Loaded");

    // Retrieve the saved score from localStorage
    let score = localStorage.getItem("riskScore");
    console.log("Retrieved Score from LocalStorage:", score);

    if (score === null) {
        console.error("Error: No risk score found in localStorage!");
        return;
    }

    score = parseInt(score);

    // Update the displayed score
    const scoreElement = document.getElementById("risk-score");
    if (scoreElement) {
        scoreElement.textContent = score;
    } else {
        console.error("Error: Element with ID 'risk-score' not found!");
    }

    // Calculate marker position (-10 to 10 mapped to 0% - 100%)
    let position = ((score + 10) / 20) * 100; 

    // Update marker position
    let marker = document.getElementById("score-marker");
    if (marker) {
        marker.style.left = position + "%";
        marker.style.transition = "left 0.5s ease-in-out";
    } else {
        console.error("Error: Element with ID 'score-marker' not found!");
    }

    console.log("Final Score:", score);
    console.log("Marker Position:", position + "%");
});

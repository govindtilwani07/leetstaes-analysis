document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");

    // Validate username using regex
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_]{3,16}$/;
        if (!regex.test(username)) {
            alert("Invalid username. It should be 3-16 characters long and can only contain letters, numbers, and underscores.");
            return false;
        }
        return true;
    }

    // Fetch user details from LeetCode API
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }

            const data = await response.json();
            console.log("Logging data:", data);

            displayUserData(data);

        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    // Display user stats correctly based on API response
    function displayUserData(data) {
        if (data.status !== "success") {
            console.error("Invalid API response:", data);
            return;
        }

        const totalQuestions = data.totalQuestions;
        const totalSolved = data.totalSolved;
        const easySolved = data.easySolved;
        const mediumSolved = data.mediumSolved;
        const hardSolved = data.hardSolved;

        console.log(`Total Questions: ${totalQuestions}, Solved: ${totalSolved}`);
        console.log(`Easy: ${easySolved}, Medium: ${mediumSolved}, Hard: ${hardSolved}`);

        // Update labels
        document.getElementById("easy-label").textContent = `Easy: ${easySolved}`;
        document.getElementById("medium-label").textContent = `Medium: ${mediumSolved}`;
        document.getElementById("hard-label").textContent = `Hard: ${hardSolved}`;

        // Update progress circles
        updateProgressCircle("total-progress", totalSolved, totalQuestions);
        updateProgressCircle("easy-progress", easySolved, totalQuestions);
        updateProgressCircle("medium-progress", mediumSolved, totalQuestions);
        updateProgressCircle("hard-progress", hardSolved, totalQuestions);
    }

    // Update circular progress bar
    function updateProgressCircle(id, solved, total) {
        const percentage = (solved / total) * 100;
        const circle = document.getElementById(id);

        if (circle) {
            circle.style.setProperty("--progress-degree", `${percentage}%`);
            circle.querySelector("span").textContent = `${solved}/${total}`;
        }
    }

    // Add event listener for search button
    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
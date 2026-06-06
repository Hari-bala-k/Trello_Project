// Workout set and reps data
const workoutData = {
    "Bench Press": "4 sets x 10 reps",
    "Dips": "3 sets x 12 reps",
    "Push-ups": "4 sets x 15 reps",
    "Deadlifts": "4 sets x 8 reps",
    "Pull-ups": "3 sets x 10 reps",
    "Barbell Rows": "4 sets x 12 reps",
    "Squats": "4 sets x 10 reps",
    "Lunges": "3 sets x 12 reps (each leg)",
    "Leg Press": "4 sets x 10 reps",
    "Shoulder Press": "4 sets x 12 reps",
    "Planks": "3 sets x 60 sec hold",
    "Hanging Leg Raises": "3 sets x 15 reps",
    "Russian Twists": "3 sets x 20 reps",
    "Running": "30 mins",
    "Jump Rope": "5 rounds x 3 mins",
    "Stretching": "10-15 mins",
    "Foam Rolling": "5-10 mins",
    "Yoga": "20-30 mins"
};

// Function to show workout details in a popup
function showWorkoutDetails(exercise) {
    const details = workoutData[exercise] || "Workout details not available.";
    alert(`${exercise} - ${details}`);
}

// Attach click event to all exercises in the table
document.addEventListener("DOMContentLoaded", () => {
    const tableCells = document.querySelectorAll("td");

    tableCells.forEach(cell => {
        if (workoutData[cell.textContent.trim()]) {
            cell.style.cursor = "pointer"; // Make it look clickable
            cell.style.color = "#ffcc00"; // Highlight clickable items

            cell.addEventListener("click", () => {
                showWorkoutDetails(cell.textContent.trim());
            });
        }
    });
});

// script.js

// Simulation state
let score = 0;
let feedbackEl = document.getElementById("feedback");
let scoreBar = document.getElementById("score-bar");
let perfLevel = document.getElementById("perf-level");

// Random fun facts about human memory and design
const funFacts = [
  "Working memory holds only ~4–7 items at once, so don’t overload your cockpit!",
  "Recognition is easier than recall – use clear labels and icons.",
  "Cluttered displays confuse novice pilots. Try removing unused instruments."
];

// Show a random fun fact in the info panel
function showRandomFact() {
  const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
  document.getElementById("fun-fact").textContent = "Fun Fact: " + fact;
}

// Handle performance updates
function updateScore(correct) {
  if (correct) {
    score += 10;
    feedbackEl.textContent = "Great job!";
  } else {
    score = Math.max(0, score - 5);
    feedbackEl.textContent = "Oops!";
  }

  scoreBar.textContent = "Score: " + score;

  // Simple performance bar (clamped to 0–100%)
  const width = Math.max(0, Math.min(score, 100));
  perfLevel.style.width = width + "%";

  // After every action, show a new fun fact
  showRandomFact();
}

// Set up task button: checks if gear is correct
document.getElementById("task-button").addEventListener("click", () => {
  // Example task: ensure gear is UP
  const gearDown = document
    .getElementById("gear-button")
    .textContent.includes("Down");
  updateScore(!gearDown);
});

// Toggle buttons for gear, lights, radio
["gear", "light", "radio"].forEach((id) => {
  const btn = document.getElementById(`${id}-button`);
  btn.addEventListener("click", () => {
    if (btn.textContent.includes("Down") || btn.textContent.includes("Off")) {
      // Turn ON / UP
      btn.textContent = btn.textContent.replace(
        /Down|Off/,
        id === "gear" ? "Up" : "On"
      );
    } else {
      // Turn OFF / DOWN
      btn.textContent = btn.textContent.replace(
        /Up|On/,
        id === "gear" ? "Down" : "Off"
      );
    }
    // You could add reaction-time tracking here if you want
  });
});

// Simulate a moving needle for speed (cosmetic)
let angle = 0;
setInterval(() => {
  angle = (angle + 15) % 360;
  const needle = document.querySelector("#speed-gauge .needle");
  if (needle) {
    needle.style.transform = `rotate(${angle}deg)`;
  }
}, 500);

// Drag-and-drop removal of gauges to demonstrate design changes
document.querySelectorAll(".draggable").forEach((elem) => {
  elem.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);
  });
});

const dropzone = document.querySelector(".dropzone");

dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
});

dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  const id = event.dataTransfer.getData("text/plain");
  const dragged = document.getElementById(id);

  if (dragged) {
    // Move instrument into redesign zone (remove from cockpit)
    event.target.appendChild(dragged);
    feedbackEl.textContent = "🛠 Removed " + id + " to reduce clutter!";
    // Reward the player for reducing clutter / cognitive load
    updateScore(true);
  }
});

// Initialize first fun fact
showRandomFact();

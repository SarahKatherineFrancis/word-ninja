// Select all elements with the class "scoreboard-letter"
const letters = document.querySelectorAll(".scoreboard-letter");

// Select the element with the class "info-bar"
const loadingDiv = document.querySelector(".info-bar");

// Define the length of the answer
const ANSWER_LENGTH = 5;

// Initialize the functionality
async function init() {
  // Initialize the current guess as an empty string
  let currentGuess = "";
  let currentRow = 0;

  // Function to add a letter to the current guess
  function addLetter(letter) {
    // If the current guess is not yet complete, add the letter to the end
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      // If the current guess is already complete, replace the last letter with the new letter
      currentGuess =
        currentGuess.substring(0, currentGuess.length - 1) + letter;
    }
    // Update the corresponding scoreboard letter with the new letter
    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText =
      letter;
  }

  async function commit() {
    if (currentGuess.length !== ANSWER_LENGTH) {
      // do nothing
      return;
    }
    currentRow++;
    currentGuess = "";
  }

  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
  }

  // Event listener for keydown events
  document.addEventListener("keydown", function handleKeyPress(event) {
    const action = event.key;
    if (action === "Enter") {
      // If the Enter key is pressed, perform the commit action
      commit();
    } else if (action === "Backspace") {
      // If the Backspace key is pressed, perform the backspace action
      backspace();
    } else if (isLetter(action)) {
      // If a letter key is pressed, add the letter to the current guess
      addLetter(action.toUpperCase());
    } else {
      // If any other key is pressed, do nothing
    }
  });
}

// Function to check if a character is a letter
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

// Call the init function to initialize the functionality
init();

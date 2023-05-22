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

  // Fetch the word of the day from the API
  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split("");

  // Set loading state to false
  setLoading(false);

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

  // Function to handle the commit action
  async function commit() {
    if (currentGuess.length !== ANSWER_LENGTH) {
      // do nothing
      return;
    }

    const guessParts = currentGuess.split("");

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        // do nothing
      } else if (wordParts.includes(guessParts[i])) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }

    currentRow++;
    currentGuess = "";
  }

  // Function to handle the backspace action
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

// Function to toggle the loading state
function setLoading(isLoading) {
  loadingDiv.classList.toggle("hidden", !isLoading);
}

// Call the init function to initialize the functionality
init();

// Select all elements with the class "scoreboard-letter"
const letters = document.querySelectorAll(".scoreboard-letter");

// Select the element with the class "info-bar"
const loadingDiv = document.querySelector(".info-bar");

// Define the length of the answer
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

// Initialize the functionality
async function init() {
  // Initialize the current guess as an empty string
  let currentGuess = "";
  let currentRow = 0;
  let isLoading = true;

  // Fetch the word of the day from the API
  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split("");
  let done = false;

  // Set loading state to false
  setLoading(false);
  isLoading = false;

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

    isLoading = true;
    setLoading(true);
    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: currentGuess }),
    });

    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts);

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessParts[i]]--;
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        // do nothing
      } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }

    currentRow++;

    if (currentGuess === word) {
      alert("You win");
      done = true;
      return;
    } else if (currentRow === ROUNDS) {
      alert(`You lose, the word was ${word}`);
      done = true;
    }
    currentGuess = "";
  }

  // Function to handle the backspace action
  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
  }

  // Event listener for keydown events
  document.addEventListener("keydown", function handleKeyPress(event) {
    if (done || isLoading) {
      return;
    }
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

function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i];
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }
  return obj;
}

// Call the init function to initialize the functionality
init();

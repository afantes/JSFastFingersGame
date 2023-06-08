// Title animation completion event
const titleElement = document.querySelector('.title');

titleElement.addEventListener('animationend', () => {
    titleElement.classList.add('hide-border-right');
});

// Levels 
const levels = [
    ['HTML', 'CSS', 'JavaScript', 'Python', 'Front-end', 'DevOps', 'Loop', 'Microservices', 'Array', 'Object'],

    ['Markup', 'CMS', 'Dependency', 'Package Manager', 'Scalability', 'Mobile App', 'Web Development', 'Variable', 'Back-end', 'Algorithm'],

    ['Hello World', 'IDE', 'Responsive Design', 'Prototype', 'Cybersecurity', 'Encryption', 'Deployment', 'Agile Development', 'Version Control', 'UX'],

    ['Testing', 'Server', 'Client', 'API Integration', 'Continuous Integration', 'Performance Optimization', 'UI', 'Cloud Computing', 'Function', 'Serverless'],

    ['Class', 'DOM', 'API', 'Database', 'SQL', 'Git', 'RESTful', 'Framework', 'MVC', 'Debugging'],
];

const levelTimes = [0, 0, 0, 0, 0];

let isGameActive = false;
let currentLevel = 0;
let currentWordIndex = 0;
let timeLeft = levelTimes[currentLevel];
let timer;
let score = 0;
let gameStartTime;
let gameTimer;
let gameElapsedTime = 0;
let totalDuration;

// HTML elements
const difficultySelect = document.getElementById('difficulty');
const startButton = document.querySelector('.start');
const levelElement = document.querySelector('.level');
const secondsElement = document.querySelector('.time');
const wordToTypeElement = document.querySelector('.word-to-type');
const inputElement = document.querySelector('.input');
const upcomingWordsElement = document.querySelector('.upcoming-words');
const timeLeftElement = document.querySelector('.time-left');
const scoreElement = document.querySelector('.score');
const gameDurationElement = document.querySelector('.game-duration');

// Shuffle an array randomly
function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

// Event listener for difficulty select change
difficultySelect.addEventListener('change', () => {
    const selectedDifficulty = difficultySelect.value;
    updateDifficulty(selectedDifficulty);
});

// Function to update the difficulty level
function updateDifficulty(difficulty) {

    if (difficulty === 'beginner') {
        levelTimes.splice(0, levelTimes.length, ...[26, 24, 22, 20, 18]);
    } else if (difficulty === 'medium') {
        levelTimes.splice(0, levelTimes.length, ...[18, 16, 14, 12, 10]);
    } else if (difficulty === 'expert') {
        levelTimes.splice(0, levelTimes.length, ...[10, 8, 7, 6, 5]);
    }

    timeLeft = levelTimes[currentLevel];
    timeLeftElement.textContent = timeLeft;
    secondsElement.textContent = `Seconds to type the word: ${levelTimes[currentLevel]}`;
}

// Event to start the game when clicking the "Start Playing" button
startButton.addEventListener('click', () => {
    if (!isGameActive) {
        startGame();
    }
});

// Function to start the game
function startGame() {

    isGameActive = true;

    startButton.classList.add('hide');

    inputElement.value = '';
    inputElement.focus();

    score = 0;
    scoreElement.textContent = score;

    currentLevel = 0;
    timeLeft = levelTimes[currentLevel];
    timeLeftElement.textContent = timeLeft;

    wordsRemaining = [...levels[currentLevel]];
    shuffleArray(wordsRemaining);

    showNextWord();

    countdown();

    levelElement.textContent = `You are playing at level : ${currentLevel + 1}`;
    secondsElement.textContent = `Seconds to type the word : ${levelTimes[currentLevel]}`;

    const selectedDifficulty = difficultySelect.value;
    updateDifficulty(selectedDifficulty);
    difficultySelect.disabled = true;

    gameStartTime = Date.now();
    gameDurationElement.classList.remove('hide');
    startGameTimer();
}

// Function to show the next word
function showNextWord() {

    if (currentWordIndex >= wordsRemaining.length) {

        if (currentLevel < levels.length - 1) {

            currentWordIndex = 0;
            nextLevel();
            return;

        } else {

            finishGame();
            return;
        }
    }

    wordToTypeElement.textContent = wordsRemaining[currentWordIndex];
    currentWordIndex++;
    updateUpcomingWords();
}

// Function to update the upcoming words
function updateUpcomingWords() {

    upcomingWordsElement.innerHTML = '';

    for (let i = currentWordIndex; i < wordsRemaining.length; i++) {

        const word = wordsRemaining[i];
        const wordElement = document.createElement('div');
        wordElement.textContent = word;
        upcomingWordsElement.appendChild(wordElement);
    }
}

// Event to handle user input
inputElement.addEventListener('input', handleInput);

// Function to handle user input
function handleInput() {

    if (!isGameActive) {
        return;
    }

    const typedWord = inputElement.value.trim();
    const currentWord = wordsRemaining[currentWordIndex];

    if ((currentWordIndex === 0 && typedWord === currentWord) ||
        (currentWordIndex > 0 && typedWord === wordsRemaining[currentWordIndex - 1])) {

        score++;
        scoreElement.textContent = score;
        inputElement.value = '';
        showNextWord();
        resetCountdown();

        if (score === 50) {
            finishGame(true);
            return;
        }
    }
}

// Function to start the game timer
function startGameTimer() {

    gameTimer = setInterval(() => {
        gameElapsedTime = Math.floor((new Date() - gameStartTime) / 1000);
        gameDurationElement.textContent = formatTime(gameElapsedTime);
    }, 1000);
}

// Function to format time
function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);
    const Seconds = seconds % 60;

    return `${minutes < 10 ? '0' : ''}${minutes}:${Seconds < 10 ? '0' : ''}${Seconds}`;
}

// Function for the countdown
function countdown() {

    timer = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);
            finishGame();
        }
    }, 1000);
}

// Function to reset the countdown
function resetCountdown() {

    clearInterval(timer);
    timeLeft = levelTimes[currentLevel];
    timeLeftElement.textContent = timeLeft;
    countdown();
}

// Function to move to the next level
function nextLevel() {

    currentLevel++;

    if (currentLevel >= levels.length) {

        finishGame();
        return;
    }

    timeLeft = levelTimes[currentLevel];
    timeLeftElement.textContent = timeLeft;

    wordsRemaining = [...levels[currentLevel]];
    shuffleArray(wordsRemaining);

    showNextWord();

    resetCountdown();

    levelElement.textContent = `You are playing at level: ${currentLevel + 1}`;
    secondsElement.textContent = `Seconds to type the word: ${levelTimes[currentLevel]}`;
}

// Function to finish the game
function finishGame(allLevelsCompleted = false) {

    try {

        isGameActive = false;
        currentLevel = 0;
        currentWordIndex = 0;
        wordToTypeElement.textContent = '';
        updateUpcomingWords();

        clearInterval(gameTimer);
        gameDurationElement.textContent = "";
        gameDurationElement.classList.add('hide');

        totalDuration = (Date.now() - gameStartTime) / 1000;

        if (allLevelsCompleted) {

            clearInterval(timer);

            swal({
                title: "Congratulations!",
                text: `
                You have completed all levels with a final score of ${score} points
                Total duration is ${Math.floor(totalDuration)} seconds`,
                icon: "success",
                button: "OK",
            }).then(() => {
                resetGame();
            });

        } else {

            swal({
                title: "Game Over!",
                text: `
                Your final score is ${score} points
                Total duration is ${Math.floor(totalDuration)} seconds`,
                icon: "error",
                button: "OK",
            }).then(() => {
                resetGame();
            });
        }

    } catch (error) {

        console.error("An error occurred in finishGame: ", error);
    }
}

// Function to reset the game to initial state
function resetGame() {

    startButton.classList.remove('hide');
    gameDurationElement.classList.add('hide');

    score = 0;
    scoreElement.textContent = "";
    timeLeftElement.textContent = "";
    upcomingWordsElement.innerHTML = "Upcoming Words ...";
    levelElement.textContent = "";
    secondsElement.textContent = "";
    difficultySelect.disabled = true;
}
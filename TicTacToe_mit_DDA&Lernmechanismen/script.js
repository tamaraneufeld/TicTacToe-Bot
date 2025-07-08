const statusDisplay = document.getElementById("status");
const feedbackDisplay = document.getElementById("feedback");
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let currentPlayer = "X";
let skillLevel = 1;
let playerWins = 0;
let botWins = 0;
let gameTimer;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const boardElement = document.querySelector(".board");

function createBoard() {
    boardElement.innerHTML = "";
    gameState.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.addEventListener("click", () => handleCellClick(index));
        cellElement.innerHTML = cell;
        boardElement.append(cellElement);
    });
    updateStatus();
    updateProgressBar();
    startGameTimer(); // Startet den Timer bei Spielstart
}

// Überprüfen, ob jemand gewonnen hat
function checkWinner(player) {
    return winningConditions.some(condition => {
        return condition.every(index => gameState[index] === player);
    });
}

function startGameTimer() {
    clearTimeout(gameTimer); // Stellt sicher, dass kein alter Timer läuft
    gameTimer = setTimeout(() => {
        gameActive = false;
        updateStatus("Die Zeit ist abgelaufen! Das Spiel ist beendet.");
        alert("Die Zeit ist abgelaufen! Das Spiel ist beendet.");
    }, 240000); // Setzt den Timer auf 4 Minuten
}
// Status aktualisieren
function updateStatus() {
    if (!gameActive) return;
    statusDisplay.innerHTML = `Spiel läuft... Spieler ${currentPlayer} ist dran. Schwierigkeitsgrad: ${skillLevel}. Spieler X Siege: ${playerWins}, Bot Siege: ${botWins}`;
}

function updateProgressBar() {
    const maxWinsToFillBar = 10;
    let progressPercentage = (playerWins / maxWinsToFillBar) * 100;
    progressPercentage = Math.min(progressPercentage, 100);
    const progressBar = document.getElementById("progressBar");
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.innerText = `${Math.floor(progressPercentage)}%`;
}

function handleCellClick(index) {
    if (gameState[index] !== "" || !gameActive) {
        return;
    }
    gameState[index] = currentPlayer;
    createBoard();

    if (checkWinner(currentPlayer)) {
        playerWins++;
        updateProgressBar();
        if (playerWins % 2 === 0) {
            skillLevel = Math.min(3, skillLevel + 1);
        }
        statusDisplay.innerHTML = `Spieler X gewinnt! Spieler X Siege: ${playerWins}, Bot Siege: ${botWins}. Schwierigkeitsgrad: ${skillLevel}`;
        giveFeedback("X");
        gameActive = false;
    } else if (!gameState.includes("")) {
        statusDisplay.innerHTML = "Unentschieden!";
        gameActive = false;
    } else {
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
        if (currentPlayer === "O") {
            setTimeout(botMove, 500);
        }
    }
}
// Botzug mit dynamischem Schwierigkeitsgrad
function botMove() {
    let botIndex;
    if (skillLevel === 1) {
        botIndex = getRandomMove();
    } else if (skillLevel === 2) {
        botIndex = getBestMove(false);
    } else {
        botIndex = getBestMove(true);
    }

    gameState[botIndex] = "O";
    createBoard();

    if (checkWinner("O")) {
        botWins++;
        skillLevel = Math.max(1, skillLevel - 1);
        statusDisplay.innerHTML = `Bot gewinnt! Spieler X Siege: ${playerWins}, Bot Siege: ${botWins}. Schwierigkeitsgrad: ${skillLevel}`;
        giveFeedback("O");
        gameActive = false;
        clearTimeout(gameTimer);
    } else if (!gameState.includes("")) {
        statusDisplay.innerHTML = "Unentschieden!";
        gameActive = false;
        clearTimeout(gameTimer);
    } else {
        currentPlayer = "X";
        updateStatus();
    }
}

function getRandomMove() {
    let emptyCells = gameState.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getBestMove() {
    if (skillLevel < 3) {
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === "") {
                gameState[i] = "O";
                if (checkWinner("O")) {
                    gameState[i] = "";
                    return i;
                }
                gameState[i] = "";
            }
        }
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === "") {
                gameState[i] = "X";
                if (checkWinner("X")) {
                    gameState[i] = "";
                    return i;
                }
                gameState[i] = "";
            }
        }
        return getRandomMove();
    }

    return minimax(gameState, 0, true).index;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner("O")) {
        return { score: 10 - depth };
    } else if (checkWinner("X")) {
        return { score: depth - 10 };
    } else if (!board.includes("")) {
        return { score: 0 };
    }

    let bestMove;
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let result = minimax(board, depth + 1, false);
                board[i] = "";
                if (result.score > bestScore) {
                    bestScore = result.score;
                    bestMove = i;
                }
            }
        }
        return { score: bestScore, index: bestMove };
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let result = minimax(board, depth + 1, true);
                board[i] = "";
                if (result.score < bestScore) {
                    bestScore = result.score;
                    bestMove = i;
                }
            }
        }
        return { score: bestScore, index: bestMove };
    }
}



function giveFeedback(winner) {
    if (winner === "X") {   
        feedbackDisplay.style.color = "green"; // Grün, wenn der Spieler X gewinnt
        const messages = [
            "Fantastische Arbeit! Du hast gewonnen! 🎉",
            "Tolle Strategie! Du hast den Bot besiegt! 💪",
            "Wow! Du bist wirklich gut! Mach weiter so! 👍"
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        feedbackDisplay.innerHTML = message;
    } else {
          // Rot, wenn der Bot gewinnt
        feedbackDisplay.style.color = "red";
        const botStrategies = [
            "Der Bot hat dich mit einer cleveren Strategie überlistet.",
            "Der Bot hat dich blockiert, um zu gewinnen.",
            "Der Bot hat geschickt blockiert, als du im Vorteil warst."
        ];
        const suggestion = "Versuche beim nächsten Mal, die Züge des Bots mehr zu beobachten und deine Strategie anzupassen!";
        const message = botStrategies[Math.floor(Math.random() * botStrategies.length)];
        feedbackDisplay.innerHTML = `${message} ${suggestion}`;
    }
}



document.getElementById("restartButton").addEventListener("click", restartGame);

// Spiel neustarten
document.getElementById("restartButton").addEventListener("click", restartGame);

function restartGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    feedbackDisplay.innerHTML = ""; // Feedback zurücksetzen
    // Farbe zurücksetzen, damit Feedback bei neuem Spiel neutral ist
    feedbackDisplay.style.color = "";
    createBoard();
    startGameTimer(); // Starte den Timer neu, wenn das Spiel neugestartet wird
}

// Spielfeld initialisieren
createBoard();


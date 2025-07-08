const statusDisplay = document.getElementById("status");
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let currentPlayer = "X";
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
}

function startGameTimer() {
    clearTimeout(gameTimer); // Stellt sicher, dass kein alter Timer läuft
    gameTimer = setTimeout(() => {
        gameActive = false;
        updateStatus("Die Zeit ist abgelaufen! Das Spiel ist beendet.");
        alert("Die Zeit ist abgelaufen! Das Spiel ist beendet.");
    }, 240000); // Setzt den Timer auf 4 Minuten
}

function checkWinner(player) {
    return winningConditions.some(condition => {
        return condition.every(index => gameState[index] === player);
    });
}

function updateStatus() {
    if (!gameActive) return;
    statusDisplay.innerHTML = `Spiel läuft... Spieler ${currentPlayer} ist dran. Spieler X Siege: ${playerWins}, Bot Siege: ${botWins}`;
}

function handleCellClick(index) {
    if (gameState[index] !== "" || !gameActive) {
        return;
    }
    gameState[index] = currentPlayer;
    createBoard();

    if (checkWinner(currentPlayer)) {
        if (currentPlayer === "X") {
            playerWins++;
            statusDisplay.innerHTML = `Spieler X gewinnt! Spieler X Siege: ${playerWins}, Bot Siege: ${botWins}`;
        }
        gameActive = false;
    } else if (!gameState.includes("")) {
        statusDisplay.innerHTML = "Unentschieden!";
        gameActive = false;
    } else {
        currentPlayer = "O";
        setTimeout(botMove, 500);
    }
}

function botMove() {
    let emptyCells = gameState
        .map((cell, index) => (cell === "" ? index : null))
        .filter(index => index !== null);

    const botIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[botIndex] = "O";
    createBoard();

    if (checkWinner("O")) {
        botWins++;
        statusDisplay.innerHTML = `Bot gewinnt! Spieler X Siege: ${playerWins}, Bot Siege: ${botWins}`;
        gameActive = false;
    } else if (!gameState.includes("")) {
        statusDisplay.innerHTML = "Unentschieden!";
        gameActive = false;
    } else {
        currentPlayer = "X";
        updateStatus();
    }
}


function endTest() {
    gameActive = false;
    statusDisplay.innerHTML = "Testdauer abgelaufen! Danke fürs Spielen.";
}

document.getElementById("restartButton").addEventListener("click", restartGame);

function restartGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    createBoard();
    startGameTimer(); // Starte den Timer neu, wenn das Spiel neugestartet wird
}

createBoard();

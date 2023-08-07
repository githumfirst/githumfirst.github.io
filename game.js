// Soldier class representing a soldier with rank and status (alive or dead)
class Soldier {
    constructor(rank) {
        this.rank = rank;
        this.isAlive = true;
    }
}

// Global variables for armies
let army1 = [];
let army2 = [];
let currentPlayer = 1; // 1 for player 1 (Army 1) and 2 for player 2 (Army 2)

// Function to create the game board and soldiers for each army
function createBoard() {
    const board = document.getElementById('board');
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell_${i}_${j}`;
            board.appendChild(cell);
        }
    }
}

// Function to place soldiers on the board for each army
function placeSoldiers(army1, army2) {
    for (let i = 0; i < 8; i++) {
        const army1Cell = document.getElementById(`cell_${0}_${i}`);
        const army2Cell = document.getElementById(`cell_${7}_${i}`);
        army1Cell.textContent = `COM - Rank ${army1[i].rank}`;
        army2Cell.textContent = `My Army - Rank ${army2[i].rank}`;
    }
}

// Function to simulate a battle between two soldiers
function battle(attacker, defender) {
    if (attacker.rank === defender.rank) {
        attacker.isAlive = false;
        defender.isAlive = false;
    } else if (attacker.rank > defender.rank) {
        defender.isAlive = false;
    } else {
        attacker.isAlive = false;
    }
}

let selectedSoldier = null;

// Function to handle soldier selection
function selectSoldier(event) {
    const cell = event.target;
    if (cell.textContent !== '') {
        // Check if the selected soldier belongs to the current player (My Army)
        const currentPlayerPrefix = currentPlayer === 1 ? 'My Army' : 'COM';
        if (cell.textContent.includes(currentPlayerPrefix)) {
            if (selectedSoldier) {
                // Deselect the previously selected soldier (remove orange color)
                selectedSoldier.style.backgroundColor = '';
            }
            selectedSoldier = cell;
            // Mark the selected soldier with an orange color
            selectedSoldier.style.backgroundColor = 'orange';
        } else {
            alert('You can only move your own soldiers.');
        }
    } else {
        alert('Please select a valid soldier to move.');
    }
}

function addClickListeners() {
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        // Check if the cell contains the current player's soldier (My Army)
        const currentPlayerPrefix = currentPlayer === 1 ? 'My Army' : 'COM';
        if (cell.textContent.includes(currentPlayerPrefix)) {
            cell.addEventListener('click', selectSoldier);
        }
    }
}

// Function to remove click event listeners from soldier cells
function removeClickListeners() {
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.removeEventListener('click', selectSoldier);
    }
}

// Function to check if two soldiers are adjacent
function areAdjacent(cell1, cell2) {
    const row1 = parseInt(cell1.id.split('_')[1]);
    const col1 = parseInt(cell1.id.split('_')[2]);
    const row2 = parseInt(cell2.id.split('_')[1]);
    const col2 = parseInt(cell2.id.split('_')[2]);

    // Check if the two soldiers are in the same row or column and are one cell away from each other
    return (row1 === row2 && Math.abs(col1 - col2) === 1) || (col1 === col2 && Math.abs(row1 - row2) === 1);
}

// Function to handle the attack
function boom() {
    if (!selectedSoldier) {
        alert("Please select a soldier before attacking.");
        return;
    }

    // Find the opponent's soldiers
    const opponentCells = document.getElementsByClassName('cell');
    const opponentSoldiers = [];
    for (let cell of opponentCells) {
        if (cell.textContent.includes("Army 2") && cell.textContent !== '') {
            opponentSoldiers.push(cell);
        }
    }

    // Check if the selected soldier is adjacent to any opponent's soldier
    let canAttack = false;
    for (let opponentSoldier of opponentSoldiers) {
        if (areAdjacent(selectedSoldier, opponentSoldier)) {
            canAttack = true;
            break;
        }
    }

    if (!canAttack) {
        alert("Cannot attack. Your soldier is not in contact with the opponent's soldier.");
        return;
    }

    // Find the soldier from the army array corresponding to the selected cell
    const attackingArmy = selectedSoldier.textContent.includes("COM") ? army1 : army2;
    const attackingSoldier = attackingArmy.find(soldier => `COM - Rank ${soldier.rank}` === selectedSoldier.textContent);

    // Perform the attack
    for (let opponentSoldier of opponentSoldiers) {
        if (areAdjacent(selectedSoldier, opponentSoldier)) {
            // Find the soldier from the opponent's army array corresponding to the cell
            const defendingArmy = opponentSoldier.textContent.includes("COM") ? army1 : army2;
            const defendingSoldier = defendingArmy.find(soldier => `COM - Rank ${soldier.rank}` === opponentSoldier.textContent);

            // Perform the battle between the two soldiers
            battle(attackingSoldier, defendingSoldier);

            // Update the soldier display on the board after the battle
            updateSoldierDisplay(selectedSoldier, attackingSoldier);
            updateSoldierDisplay(opponentSoldier, defendingSoldier);
        }
    }

    // Check if the game is over
    if (isGameOver()) {
        endGame();
    } else {
        // Allow the player to move again (player's turn)
        playerTurn();
    }
}

// Function to update the soldier display on the board after the battle
function updateSoldierDisplay(cell, soldier) {
    if (soldier.isAlive) {
        cell.textContent = `${cell.textContent.includes("COM") ? "COM" : "My Army"} - Rank ${soldier.rank}`;
    } else {
        cell.textContent = '';
    }
}

// Function to handle soldier movement
function move(direction) {
    // Check if a soldier is selected
    if (!selectedSoldier) {
        alert("Please select a soldier before moving.");
        return;
    }

    // Find the selected soldier's cell
    const soldierCell = selectedSoldier;

    // Get the current row and column of the soldier
    const row = parseInt(soldierCell.id.split('_')[1]);
    const col = parseInt(soldierCell.id.split('_')[2]);

    // Calculate the target row and column based on the selected direction
    let targetRow = row;
    let targetCol = col;

    switch (direction) {
        case 'forward':
            targetRow = row - 1;
            break;
        case 'backward':
            targetRow = row + 1;
            break;
        case 'left':
            targetCol = col - 1;
            break;
        case 'right':
            targetCol = col + 1;
            break;
        default:
            return;
    }

    // Check if the target cell is within the board boundaries
    if (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
        const targetCell = document.getElementById(`cell_${targetRow}_${targetCol}`);

        // Check if the target cell is empty
        if (targetCell.textContent === '') {
            // Move the soldier to the new cell
            targetCell.textContent = soldierCell.textContent;
            soldierCell.textContent = '';

            // Clear the selection (remove orange color) from the previously selected soldier
            selectedSoldier.style.backgroundColor = '';

            // Update the selectedSoldier to the new cell
            selectedSoldier = targetCell;

            // Mark the newly moved soldier as selected with an orange color
            selectedSoldier.style.backgroundColor = 'orange';

            // Update currentPlayer to 2 (computer's turn) after the player makes a move
            currentPlayer = 2;

            // Remove click listeners from soldiers after moving
            removeClickListeners();

            // Check if the game is over
            if (isGameOver()) {
                endGame();
            } else {
                // Let the computer move its soldiers after the player's turn
                opponentTurn();
            }
        } else {
            // If the target cell is occupied, perform a battle
            boom();
        }
    } else {
        alert("Cannot move. The target cell is outside the board boundaries.");
    }
}


// Function to check if a soldier is present in the target cell
function isSoldierPresent(targetRow, targetCol) {
    const targetCell = document.getElementById(`cell_${targetRow}_${targetCol}`);
    return targetCell.textContent !== '';
}

// Function to show the "Thinking..." sign
function showThinkingSign() {
    const thinkingSign = document.getElementById('thinkingSign');
    thinkingSign.style.display = 'block';
}

// Function to hide the "Thinking..." sign
function hideThinkingSign() {
    const thinkingSign = document.getElementById('thinkingSign');
    thinkingSign.style.display = 'none';
}

// Function to handle the opponent player's turn (AI move)
function opponentTurn() {
    // Show the "Thinking..." sign
    showThinkingSign();

    // Disable the boom button during the computer's turn
    removeBoomButtonListener();

    // Introduce a delay to simulate "thinking" for the computer (1 second)
    setTimeout(() => {
        // Find all the computer's soldiers
        const opponentCells = document.getElementsByClassName('cell');
        const opponentSoldiers = [];
        for (let cell of opponentCells) {
            if (cell.textContent.includes("COM") && cell.textContent !== '') {
                opponentSoldiers.push(cell);
            }
        }

        // Randomly choose a soldier to move
        const randomIndex = Math.floor(Math.random() * opponentSoldiers.length);
        const selectedOpponentSoldier = opponentSoldiers[randomIndex];

    // Randomly choose a direction to move the soldier
        const directions = ['forward', 'backward', 'left', 'right'];
        const randomDirectionIndex = Math.floor(Math.random() * directions.length);
        const selectedDirection = directions[randomDirectionIndex];

        // Move the selected soldier
        moveSoldier(selectedOpponentSoldier, selectedDirection);

        // Hide the "Thinking..." sign after the move is done
        hideThinkingSign();
    }, 1000);
}

// Function to handle the player's turn
function playerTurn() {
    currentPlayer = 1; // Set the current player to 1 (player's turn)

    // Enable the boom button during the player's turn
    addBoomButtonListener();

    // The player can move their soldiers by clicking
    addClickListeners();

    // Show a message indicating it's the player's turn
    const turnMessage = document.getElementById('turnMessage');
    turnMessage.textContent = "Your Turn";
}

// Function to add click event listener to the boom button
function addBoomButtonListener() {
    const boomButton = document.getElementById('boom-button');
    boomButton.addEventListener('click', boom);
}

// Function to remove click event listener from the boom button during the player's turn
function removeBoomButtonListener() {
    const boomButton = document.getElementById('boom-button');
    boomButton.removeEventListener('click', boom);
}

// Function to check if the game is over
function isGameOver() {
    // The game is over if all soldiers of one army are defeated
    if (army1.every(soldier => !soldier.isAlive)) {
        return 1; // Player 1 (Army 1) wins
    } else if (army2.every(soldier => !soldier.isAlive)) {
        return 2; // Player 2 (Army 2) wins
    } else {
        return 0; // Game is not over yet
    }
}

// Function to end the game and display the result
function endGame(winner) {
    // Display the result
    const result = document.getElementById('result');
    if (winner === 1) {
        result.textContent = 'Game Over! My Army wins!';
    } else if (winner === 2) {
        result.textContent = 'Game Over! COM wins!';
    } else {
        result.textContent = 'Game Over! It\'s a tie!';
    }

    // Disable the boom button and remove click listeners from soldiers
    const boomButton = document.getElementById('boom-button');
    boomButton.disabled = true;
    removeClickListeners();
}

// Function to handle soldier movement
function moveSoldier(soldierCell, direction) {
    // Find the soldier from the army array corresponding to the selected cell
    const army = soldierCell.textContent.includes("Army 1") ? army1 : army2;
    const soldier = army.find(soldier => `Army ${army === army1 ? 1 : 2} - Rank ${soldier.rank}` === soldierCell.textContent);

    let row = parseInt(soldierCell.id.split('_')[1]);
    let col = parseInt(soldierCell.id.split('_')[2]);

    let targetRow = row;
    let targetCol = col;

    switch (direction) {
        case 'forward':
            if (row > 0) targetRow = row - 1;
            break;
        case 'backward':
            if (row < 7) targetRow = row + 1;
            break;
        case 'left':
            if (col > 0) targetCol = col - 1;
            break;
        case 'right':
            if (col < 7) targetCol = col + 1;
            break;
        default:
            return;
    }

    const targetCell = document.getElementById(`cell_${targetRow}_${targetCol}`);

    if (targetCell.textContent === '') {
        // Move the soldier to the new cell
        targetCell.textContent = soldierCell.textContent;
        soldierCell.textContent = '';
        selectedSoldier = targetCell; // Update the selectedSoldier to the new cell
        selectedSoldier.style.backgroundColor = 'orange'; // Mark the newly moved soldier as selected with an orange color

        // Update currentPlayer to 2 (computer's turn) after the player makes a move
        currentPlayer = 2;

        // Remove click listeners from soldiers after moving
        removeClickListeners();

        // Check if the game is over
        if (isGameOver()) {
            endGame();
        } else {
            // If the current player is the computer, it's the computer's turn (opponent's turn)
            if (currentPlayer === 2) {
                opponentTurn();
            } else {
                // Otherwise, it's the player's turn
                playerTurn();
            }
        }
    } else {
        // If the target cell is occupied, perform a battle
        battle(soldier, army.find(s => s.rank === parseInt(targetCell.textContent.split(' ')[3])));
        updateSoldierDisplay(soldierCell, soldier);
        updateSoldierDisplay(targetCell, army.find(s => s.rank === parseInt(targetCell.textContent.split(' ')[3])));

        // Check if the game is over
        if (isGameOver()) {
            endGame();
        } else {
            // Allow the player to move again (player's turn)
            playerTurn();
        }
    }
}

// Function to start the battle
function startGame() {
    army1 = [];
    army2 = [];

    // Populate the armies with soldiers
    for (let i = 0; i < 8; i++) {
        army1.push(new Soldier(i + 1));
        army2.push(new Soldier(i + 1));
    }

    // Perform the battle between the two armies
    for (let i = 0; i < 8; i++) {
        battle(army1[i], army2[i]);
    }

    // Update the game board based on the battle results
    placeSoldiers(army1, army2);

    // Start the player's turn
    playerTurn();
}

// Initialize the game board and soldiers when the page loads
createBoard();

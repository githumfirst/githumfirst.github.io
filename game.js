// Soldier class representing a soldier with rank and status (alive or dead);
class Soldier {
    constructor(rank) {
        this.rank = rank;
        this.isAlive = true;
    }
}

class AISoldier {
    constructor(rank, row, col) {
        this.rank = rank;
        this.isAlive = true;
        this.row = row;
        this.col = col;
    }
}

// background music
// const playButton = document.getElementById('playButton');
// const backgroundMusic = document.getElementById('backgroundMusic');

// Rank names
const rankNames = ['병사', '중위', '소령', '중령', '대령', '대장', 'MP', '대통령'];

// Global variables for armies
let userArmy = [];
let aiArmy = [];
let currentPlayer = 1; // Initialize currentPlayer to 1 (User's turn)

let selectedSoldier = null;

// Function to create the game board and soldiers for each army
function createBoard() {
    console.log('createboard!!');
    const board = document.getElementById('board');
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell_${i}_${j}`;
            board.appendChild(cell);
        }
    }

    startGame();
}

// Function to place soldiers on the board for each army
// Modify the placeSoldiers and placeAISoldiers functions like this:

function placeSoldiers(userArmy) {
    for (let i = 0; i < 8; i++) {
        const userArmyCell = document.getElementById(`cell_${7}_${i}`);

        userArmyCell.textContent = `User - ${rankNames[userArmy[i].rank - 1]}`;
        userArmyCell.setAttribute('data-army', 'User');
        userArmyCell.setAttribute('data-rank', userArmy[i].rank);
        userArmyCell.classList.add('user-soldier'); // Add a class to distinguish user soldiers
        
    }
}

function placeAISoldiers(aiArmy) {
    for (let i = 0; i < 8; i++) {
        const aiArmyCell = document.getElementById(`cell_${0}_${i}`);

        const aiSoldier = new AISoldier(i + 1, 0, i);
        aiArmy.push(aiSoldier);

        aiArmyCell.textContent = `A.I - ${rankNames[aiSoldier.rank - 1]}`;
        aiArmyCell.setAttribute('data-army', 'A.I');
        aiArmyCell.setAttribute('data-rank', aiSoldier.rank);
        aiArmyCell.classList.add('ai-soldier'); // Add a class to distinguish AI soldiers
    }
}


function battle(userRank, aiRank) {
    if (userRank == aiRank) {
        showDraw();

        // time delay display thime
        setTimeout(function() {
            console.log("This message appears after 2 seconds.");
            hideDraw();
            // You can put any code you want to delay here
        }, 5000); // 2000 milliseconds = 2 seconds
        return 'draw';
    }
    // user MP beats ai President
    if (userRank == 7 && aiRank == 8) {
        showUserWin();
        return 'user';
    }

    // ai MP beats user President
    if (userRank == 8 && aiRank == 7) {
        showAiWin();
        return 'ai';
    }

    if (userRank == 7 && aiRank != 8) {
        showAiWin();
        return 'ai';
    }

    if (userRank != 8 && aiRank == 7) {
        showUserWin();
        return 'user';
    }

    if (userRank > aiRank) {
        showUserWin();        
        return 'user';
    }

    if (userRank < aiRank) {
        showAiWin();
        return 'ai';
    }
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

function showDraw() {
    const drawSign = document.getElementById('drawSign');
    drawSign.style.display = 'block';
}

function showUserWin() {
    const userWinSign = document.getElementById('userWinSign');
    userWinSign.style.display = 'block';
}

function showAiWin() {
    const aiWinSign = document.getElementById('aiWinSign');
    aiWinSign.style.display = 'block';
}

function showDoAgain() {
    const doAgain = document.getElementById('doAgain');
    doAgain.style.display = 'block';
}

// Function to hide the "win/loss..." sign
function hideDraw() {
    const drawSign = document.getElementById('drawSign');
    drawSign.style.display = 'none';
}

function hideUserWin() {
    const userWinSign = document.getElementById('userWinSign');
    userWinSign.style.display = 'none';
}

function hideAiWin() {
    const aiWinSign = document.getElementById('aiWinSign');
    aiWinSign.style.display = 'none';
}

function hideDoAgain() {
    const doAgain = document.getElementById('doAgain');
    doAgain.style.display = 'none';
}

// Function to handle soldier selection
function selectSoldier(event) {
    const cell = event.target;
    const cellContent = cell.textContent;

    // Check if the cell contains a soldier
    if (cellContent.includes("A.I") || cellContent.includes("User")) {
        // Extract the army and rank from the cell's data attributes
        const army = cell.getAttribute('data-army');
        const rank = parseInt(cell.getAttribute('data-rank'));
        
        // Determine if the soldier belongs to the current player (User)
        if ((currentPlayer === 1 && army === 'User') || (currentPlayer === 1 && cell.textContent.includes("User")  )) {
            if (selectedSoldier) {
                // Deselect the previously selected soldier (remove orange color)
                selectedSoldier.style.backgroundColor = '';
            }
            selectedSoldier = event.target;
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
        cell.addEventListener('click', selectSoldier);
    }
}

// Function to remove click event listeners from soldier cells
function removeClickListeners() {
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.removeEventListener('click', selectSoldier);
    }
}

function findAdjacentAiSoldiers(aiSoldiers, selectedSoldier) {
    const selectedId = selectedSoldier.id;
    const selectedCoords = selectedId.match(/cell_(\d+)_(\d+)/).slice(1, 3).map(Number);
  
    const adjacentSoldiers = aiSoldiers.filter(soldier => {
      const soldierId = soldier.id;
      const soldierCoords = soldierId.match(/cell_(\d+)_(\d+)/).slice(1, 3).map(Number);
  
      const rowDiff = Math.abs(selectedCoords[0] - soldierCoords[0]);
      const colDiff = Math.abs(selectedCoords[1] - soldierCoords[1]);
  
      // Soldiers are adjacent if they are in the same row or column and have a difference of 1 in the other dimension
      return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    });
  
    return adjacentSoldiers;
  }

// Function to handle the attack
function boom() {
    try {   
        console.log('who calls boom function'); 
        if (!selectedSoldier) {
            alert("Please select a soldier before attacking.");
            return;
        }

        // Find the opponent's soldiers
        const opponentCells = document.getElementsByClassName('cell');
        const aiSoldiers = [];
        for (let cell of opponentCells) {
            if (cell.textContent.includes("A.I") && cell.textContent !== '') {
                aiSoldiers.push(cell);
            }
        }

        // Find the selected user soldier    
        const soldierCell = selectedSoldier;

        // Get the current row and column of the soldier
        const row = parseInt(soldierCell.id.split('_')[1]);
        const col = parseInt(soldierCell.id.split('_')[2]);

        // Get the Army and Rank of User
        const userSoldierContent = soldierCell.innerHTML;
        const army = userSoldierContent.split('-')[0];
        const cleanArmy = army.replace(" ", "");
        const userSoldierRank = userSoldierContent.split('-')[1];
        const cleanRank = userSoldierRank.replace(" ", "");

        // convert rank to Number
        let userRankNumber = 0;
        userRankNumber = rankToNumber(cleanRank);
    
        // const selectedUserSoldier = userArmy.find(soldier => soldier.rank === cleanRank);
        let fightingUserSoldier = userArmy.find(soldier => soldier.rank === userRankNumber);
        
        // const selectedUserSoldier = userArmy.find(soldier => soldier.rank === selectedUserSoldierRank);

        // Find adjacent AI soldiers
        // const adjacentAISoldiers = aiSoldiers.filter(aiSoldier => areAdjacent(fightingUserSoldier, aiSoldier));
        const adjacentAISoldiers = findAdjacentAiSoldiers(aiSoldiers, selectedSoldier);

        if (adjacentAISoldiers.length === 0) {
            alert("Cannot attack. Your soldier is not in contact with any opponent's soldier.");
            return;
        } else if (adjacentAISoldiers.length === 1) {
            // Only one adjacent AI soldier, attack without asking
            const aiSoldierCell = adjacentAISoldiers[0];

            // Get rank and army of AI
            const aiSoldierContent = aiSoldierCell.innerHTML;
            const aiArmyID = aiSoldierContent.split('-')[0];
            const cleanAiArmy = aiArmyID.replace(" ", "");
            const aiRank = aiSoldierContent.split('-')[1];
            const cleanAiRank = aiRank.replace(" ", "");
            
            // convert rank to Number
            let aiRankNumber = 0;
            aiRankNumber = rankToNumber(cleanAiRank);
            // const aiSoldierRank = parseInt(aiSoldierCell.getAttribute('data-rank'));
            const fightingAiSoldier = aiArmy.find(soldier => soldier.rank === aiRankNumber);
            
            
            let result = battle(userRankNumber, aiRankNumber);        
                
            // winner is user, then remove ai soldier
            if (result == 'user') {
                aiSoldierCell.style.backgroundColor = '';
                aiSoldierCell.innerHTML = '';
                aiSoldierCell.classList.remove('ai-soldier'); // remove a class to distinguish AI soldiers
                
                // time delay display thime
                setTimeout(function() {
                    console.log("This message appears after 2 seconds.");
                    hideUserWin();
                    // You can put any code you want to delay here
                }, 3000); // 2000 milliseconds = 2 seconds
                

                return;
            }

            // winner is A.I, then remove User soldier
            if (result == 'ai') {
                soldierCell.style.backgroundColor = '';
                soldierCell.classList.remove('user-soldier'); // remove a class to distinguish user soldiers
                soldierCell.innerHTML = '';
                
                // time delay display thime
                setTimeout(function() {
                    console.log("This message appears after 2 seconds.");
                    hideAiWin();
                    // You can put any code you want to delay here
                }, 3000); // 2000 milliseconds = 2 seconds
            
                return;
            }

            // winner is A.I, then remove User soldier
            if (result == 'draw') {
                
                setTimeout(function() {
                    console.log("This message appears after 2 seconds.");
                    hideDraw();
                    // You can put any code you want to delay here
                }, 3000); // 2000 milliseconds = 2 seconds
                
                return;
            }
            
            return;

            // Update the soldier display on the board after the battle
            // updateSoldierDisplay(selectedSoldier, selectedUserSoldier);
            // updateSoldierDisplay(aiSoldierCell, aiSoldier);
        } else {
            // Multiple adjacent AI soldiers, ask the user which one to attack
            const attackOptions = adjacentAISoldiers.map(aiSoldierCell => {
                const aiSoldierRank = parseInt(aiSoldierCell.getAttribute('data-rank'));
                const aiSoldier = aiArmy.find(soldier => soldier.rank === aiSoldierRank);
                return `${aiSoldierCell.textContent} (Rank: ${rankNames[aiSoldier.rank - 1]})`;
            });

            const selectedOption = prompt(`Select an opponent soldier to attack:\n\n${attackOptions.join('\n')}`);

            if (selectedOption === null) {
                // User cancelled the prompt
                return;
            }

            const selectedAIIndex = attackOptions.findIndex(option => option === selectedOption);
            if (selectedAIIndex === -1) {
                alert("Invalid selection.");
                return;
            }

            const selectedAISoldierCell = adjacentAISoldiers[selectedAIIndex];
            const selectedAISoldierRank = parseInt(selectedAISoldierCell.getAttribute('data-rank'));
            const selectedAISoldier = aiArmy.find(soldier => soldier.rank === selectedAISoldierRank);
            console.log(selectedAISoldier);

            battle(selectedUserSoldier, selectedAISoldier);

            // Update the soldier display on the board after the battle
            updateSoldierDisplay(selectedSoldier, selectedUserSoldier);
            updateSoldierDisplay(selectedAISoldierCell, selectedAISoldier);
        }

        // Check if the game is over
        if (isGameOver()) {
            endGame();
        } else {
            // Allow the player to move again (player's turn)
            playerTurn();
            return;  // it does not finish with return !!!
        }
        
        hideAiWin();
        hideDraw();
        hideUserWin();
    }   catch (error) {
        showDoAgain();

        // time delay display thime
        setTimeout(function() {
            console.log("This message appears after 2 seconds.");
            hideDoAgain();
            // You can put any code you want to delay here
        }, 3000); // 2000 milliseconds = 2 seconds
    }    
}


// Function to update the soldier display on the board after the battle
// function updateSoldierDisplay(cell, soldier) {
//     if (soldier.isAlive) {
//         cell.textContent = `${cell.getAttribute('data-army')} - ${rankNames[soldier.rank - 1]}`;
//         cell.setAttribute('data-rank', soldier.rank); // Add this line
//     } else {
//         cell.textContent = '';
//         cell.removeAttribute('data-army'); // Remove this line if present
//         cell.removeAttribute('data-rank'); // Add this line
//     }
// }

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
            selectedSoldier.classList.remove('user-soldier'); // Add a class to distinguish user soldiers


            // Update the selectedSoldier to the new cell
            selectedSoldier = targetCell;

            // Mark the newly moved soldier as selected with an orange color
            selectedSoldier.classList.add('user-soldier'); // Add a class to distinguish user soldiers
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
                aiTurn();
            }
        } else {
            // If the target cell is occupied, perform a battle
            boom();
        }
    } else {
        alert("Cannot move. The target cell is outside the board boundaries.");
    }
    playUserSound();
}


// Function to check if a soldier is present in the target cell
function isSoldierPresent(targetRow, targetCol) {
    const targetCell = document.getElementById(`cell_${targetRow}_${targetCol}`);
    return targetCell.textContent !== '';
}

// Function to handle the opponent player's turn (AI move)
function aiTurn() {
    // Show the "Thinking..." sign
    showThinkingSign();

    // Disable the boom button during the computer's turn
    removeBoomButtonListener();

    // Introduce a delay to simulate "thinking" for the computer (1 second)
    setTimeout(() => {
        // Find all the computer's soldiers
        // const aiSoldiers = aiArmy.filter(soldier => soldier.isAlive);
        // Find the opponent's soldiers
        const opponentCells = document.getElementsByClassName('cell');
        const aiSoldiers = [];
        for (let cell of opponentCells) {
            console.log("it stops here");
            if (cell.textContent.includes("A.I") && cell.textContent !== '') {
                aiSoldiers.push(cell);
            }
        }

        // Randomly choose a soldier to move
        const randomIndex = Math.floor(Math.random() * aiSoldiers.length);
        const selectedAISoldier = aiSoldiers[randomIndex];
        
        // Randomly choose a direction to move the soldier
        const directions = ['forward', 'backward', 'left', 'right'];
        const randomDirectionIndex = Math.floor(Math.random() * directions.length);
        const selectedAIDirection = directions[randomDirectionIndex];

        // Move the selected soldier
        moveAI(selectedAISoldier, selectedAIDirection);

        // Hide the "Thinking..." sign after the move is done
        hideThinkingSign();

        // Call startNextTurn to initiate the player's turn after the opponent's turn
        startNextTurn();

    }, 1000);
}

// Function to start the next turn (player's turn or opponent's turn)
function startNextTurn() {
    // Update currentPlayer to the next player's turn
    // currentPlayer = currentPlayer === 1 ? 2 : 1;

    // Add click listeners for only user turn
    if (currentPlayer == 1) {
        addClickListeners();
    } else {         
            // If it's ai's turn, initiate the ai's turn
            if (currentPlayer === 2) {
                aiTurn();
            }
        }
}

// Function to handle the player's turn
function playerTurn() {
    currentPlayer = 1; // Set the current player to 1 (player's turn)

    // Enable the boom button during the player's turn
    addBoomButtonListener();

    // Add click listeners back after the player makes a move
    addClickListeners();

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
    if (userArmy.every(soldier => !soldier.isAlive)) {
        return 1; // Player 1 (Army 1) wins
    } else if (aiArmy.every(soldier => !soldier.isAlive)) {
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
function moveAI(aiSoldierCell, aiDirection) {

    // Find the selected user soldier    
    const toMoveAiSoldierCell = aiSoldierCell;

    // Get the current row and column of the soldier
    let targetRow = parseInt(toMoveAiSoldierCell.id.split('_')[1]);
    let targetCol = parseInt(toMoveAiSoldierCell.id.split('_')[2]);

    // Get the Army and Rank of User
    const aiSoldierContent = toMoveAiSoldierCell.innerHTML;
    const aiID = aiSoldierContent.split('-')[0];
    const cleanAiArmy = aiID.replace(" ", "");
    const aiSoldierRank = aiSoldierContent.split('-')[1];
    const aicleanRank = aiSoldierRank.replace(" ", "");

    // convert rank to Number
    let aiRankNumber = 0;
    aiRankNumber = rankToNumber(aicleanRank);

    // const aiSoldierRank = aiSoldierCell.rank;
    const aiSoldier =  aiArmy.find(aiSoldier => aiSoldier.rank === aiRankNumber);

    // let targetRow = aiSoldier.row;
    // let targetCol = aiSoldier.col;

    // data matching
    const currentCell = document.getElementById(`cell_${targetRow}_${targetCol}`);

    switch (aiDirection) {
        case 'forward':
            if (targetRow > 0) targetRow--;
            break;
        case 'backward':
            if (targetRow < 7) targetRow++;
            break;
        case 'left':
            if (targetCol > 0) targetCol--;
            break;
        case 'right':
            if (targetCol < 7) targetCol++;
            break;
        default:
            return;
    }

    const targetCell = document.getElementById(`cell_${targetRow}_${targetCol}`);
    
    // Check targetCell is empty, yes -> go to targetCell
    if (targetCell.textContent === '') {

        targetCell.textContent = currentCell.textContent;
        targetCell.classList.add('ai-soldier'); // Add a class to distinguish AI soldiers

        currentCell.textContent = '';
        currentCell.classList.remove('ai-soldier'); // Add a class to distinguish AI soldiers

        // Update currentPlayer to 1 (user's turn) after the player makes a move
        currentPlayer = 1;

        // Remove click listeners from soldiers after moving
        removeClickListeners();

        // Check if the game is over
        if (isGameOver()) {
            endGame();
        } else {
            // If the current player is the computer, it's the computer's turn (opponent's turn)
            if (currentPlayer === 2) {
                aiTurn();
            } else {
                // Otherwise, it's the player's turn
                playerTurn();
            }
        }
    } else {
        // Check if the target cell belongs to the AI's army
        const targetCellArmy = targetCell.getAttribute('data-army');
        if (targetCellArmy === 'A.I') {
 
            // Find an empty adjacent cell to move to
            const adjacentCells = [];

            // Check forward
            if (targetRow > 0 && !isSoldierPresent(targetRow - 1, targetCol)) {
                adjacentCells.push(document.getElementById(`cell_${targetRow - 1}_${targetCol}`));
            }

            // Check backward
            if (targetRow < 7 && !isSoldierPresent(targetRow + 1, targetCol)) {
                adjacentCells.push(document.getElementById(`cell_${targetRow + 1}_${targetCol}`));
            }

            // Check left
            if (targetCol > 0 && !isSoldierPresent(targetRow, targetCol - 1)) {
                adjacentCells.push(document.getElementById(`cell_${targetRow}_${targetCol - 1}`));
            }

            // Check right
            if (targetCol < 7 && !isSoldierPresent(targetRow, targetCol + 1)) {
                adjacentCells.push(document.getElementById(`cell_${targetRow}_${targetCol + 1}`));
            }

            if (adjacentCells.length > 0) {
                const randomAdjacentCell = adjacentCells[Math.floor(Math.random() * adjacentCells.length)];

                moveAItoAdjacent(aiSoldierCell, randomAdjacentCell);                
            } else {
                // If no empty adjacent cell is available, end the turn
                aiTurn();
            }

        } else {
            // If the target cell is occupied by an opponent soldier, perform a battle
            battle(aiSoldier, aiArmy.find(s => s.row === targetRow && s.col === targetCol));
            // updateSoldierDisplay(aiSoldierCell, aiSoldier);
            // updateSoldierDisplay(targetCell, aiArmy.find(s => s.row === targetRow && s.col === targetCol));

            // Check if the game is over
            if (isGameOver()) {
                endGame();
            } else {
                // Allow the player to move again (player's turn)
                playerTurn();
            }
        }
    }
    playUserSound();
}

// move ai soldier to adjacent with the targetcell
function moveAItoAdjacent(aiSoldierCell, targetCell) {
    // *************************
    // Find the selected user soldier    
    const adjacentAiSoldierCell = aiSoldierCell;

    // Get the current row and column of the soldier
    let adjacentTargetRow = parseInt(adjacentAiSoldierCell.id.split('_')[1]);
    let adjacentTargetCol = parseInt(adjacentAiSoldierCell.id.split('_')[2]);

    // Get the Army and Rank of User
    const adjacentAiSoldierContent = adjacentAiSoldierCell.innerHTML;
    const adjacentAiID = adjacentAiSoldierContent.split('-')[0];
    const adjacentCleanAiArmy = adjacentAiID.replace(" ", "");
    const adjacentAiSoldierCellRank = adjacentAiSoldierContent.split('-')[1];
    const adjacentAicleanRank = adjacentAiSoldierCellRank.replace(" ", "");

    // convert rank to Number
    let adjacentAiRankNumber = 0;
    adjacentAiRankNumber = rankToNumber(adjacentAicleanRank);

    // const aiSoldierRank = aiSoldierCell.rank;
    const aiSoldier =  aiArmy.find(aiSoldier => aiSoldier.rank === adjacentAiRankNumber);

    // **************************
    // 
    const aiSoldierRank = aiSoldierCell.rank;
    // const aiSoldier = aiArmy.find(soldier => soldier.rank === aiSoldierRank);

    // Get the current row and column of the AI soldier
    const currentRow = aiSoldier.row;
    const currentCol = aiSoldier.col;

    // Get the target row and column of the adjacent cell
    const targetRow = parseInt(targetCell.id.split('_')[1]);
    const targetCol = parseInt(targetCell.id.split('_')[2]);

    // Update the AI soldier's position
    aiSoldier.row = targetRow;
    aiSoldier.col = targetCol;

    // data matching
    const currentCell = document.getElementById(`cell_${currentRow}_${currentCol}`);

    // Update the AI soldier's display on the board
    targetCell.textContent = currentCell.textContent;
    targetCell.classList.add('ai-soldier'); // Add a class to distinguish AI soldiers

    currentCell.textContent = '';
    currentCell.classList.remove('ai-soldier'); // Add a class to distinguish AI soldiers
    

    // Clear the selection (remove orange color) from the previously selected AI soldier
    currentCell.style.backgroundColor = '';
    currentCell.classList.remove('ai-soldier'); // Add a class to distinguish AI soldiers

    // Update currentPlayer to 1 (user's turn) after the AI makes a move
    currentPlayer = 1;

    // Remove click listeners from soldiers after moving
    removeClickListeners();

    // Check if the game is over
    if (isGameOver()) {
        endGame();
    } else {
        // If the current player is the computer, it's the computer's turn (ai's turn)
        if (currentPlayer === 2) {
            aiTurn();
        } else {
            // Otherwise, it's the player's turn
            playerTurn();
        }
    }
}

// Function to start the battle
function startGame() {
    
    userArmy = [];
    aiArmy = [];        

    // Populate the armies with soldiers
    for (let i = 0; i < 8; i++) {
        userArmy.push(new Soldier(i + 1));
        // aiArmy.push(new Soldier(i + 1));
    }

    // Update the game board based on the battle results
    placeSoldiers(userArmy);
    placeAISoldiers(aiArmy);

    // Add this line to add click listeners after placing soldiers
    addClickListeners();

    // Start the player's turn
    playerTurn();
}

// convert rank to number
function rankToNumber(rank) {
    const rankNames = ['병사', '중위', '소령', '중령', '대령', '대장', 'MP', '대통령'];
     let rankNumber = 0;
    switch (rank) {
        case '병사':
            return rankNumber = 1; 
            break;          
        case '중위':
            return rankNumber = 2;
            break;
        case '소령':
            return rankNumber = 3;
            break;
        case '중령':
            return rankNumber = 4; 
            break;          
        case '대령':
            return rankNumber = 5;
            break;
        case '대장':
            return rankNumber = 6;
            break;
        case 'MP':
            return rankNumber = 7;
            break;
        case '대통령':
            return rankNumber = 8;
            break;
        default:
            return;
    }

}

// new game
function refreshPage() {
    location.reload();
}

function playUserSound() {
    const userSound = document.getElementById('userSound');
    userSound.play(); // This plays the audio
}

// Initialize the game board and soldiers when the page loads
createBoard();


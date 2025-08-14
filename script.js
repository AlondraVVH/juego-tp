document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const runButton = document.getElementById('run-button');
    const resetButton = document.getElementById('reset-button');
    const messageDisplay = document.getElementById('message');
    const instructionMessage = document.getElementById('current-instruction');
    const commandButtons = document.querySelectorAll('.arrow-button');
    
    const boardSize = 10;
    let commands = [];
    let playerPosition = { row: 0, col: 0 };
    let checkpoints = { flag1: false, flag2: false };

    const startPosition = { row: 0, col: 0 };
    const flag1Position = { row: 8, col: 2 };
    const flag2Position = { row: 4, col: 7 };
    const targetPosition = { row: 9, col: 9 };
    
    function createBoard() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < boardSize * boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            gameBoard.appendChild(cell);
        }
        updateBoard();
    }

    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        
        cells.forEach(cell => cell.innerHTML = '');

        const playerCellIndex = playerPosition.row * boardSize + playerPosition.col;
        const playerElement = document.createElement('div');
        playerElement.id = 'player';
        cells[playerCellIndex].appendChild(playerElement);

        const flag1CellIndex = flag1Position.row * boardSize + flag1Position.col;
        const flag1Element = document.createElement('div');
        flag1Element.id = 'flag1';
        flag1Element.classList.add('flag');
        if (checkpoints.flag1) flag1Element.classList.add('reached');
        cells[flag1CellIndex].appendChild(flag1Element);

        const flag2CellIndex = flag2Position.row * boardSize + flag2Position.col;
        const flag2Element = document.createElement('div');
        flag2Element.id = 'flag2';
        flag2Element.classList.add('flag');
        if (checkpoints.flag2) flag2Element.classList.add('reached');
        cells[flag2CellIndex].appendChild(flag2Element);
        
        const targetCellIndex = targetPosition.row * boardSize + targetPosition.col;
        const targetElement = document.createElement('div');
        targetElement.id = 'target';
        cells[targetCellIndex].appendChild(targetElement);
    }

    function addCommand(command) {
        commands.push(command);
    }

    function checkCollision(pos, targetPos) {
        return pos.row === targetPos.row && pos.col === targetPos.col;
    }

    async function runCommands() {
        messageDisplay.textContent = 'Ejecutando...';
        
        let currentRow = playerPosition.row;
        let currentCol = playerPosition.col;

        for (const command of commands) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let newRow = currentRow;
            let newCol = currentCol;

            if (command === 'arriba') newRow--;
            if (command === 'abajo') newRow++;
            if (command === 'izquierda') newCol--;
            if (command === 'derecha') newCol++;
            
            if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) {
                messageDisplay.textContent = '¡Te saliste del tablero! Intenta de nuevo. 😞';
                resetGame();
                return;
            }

            currentRow = newRow;
            currentCol = newCol;
            playerPosition = { row: currentRow, col: currentCol };
            updateBoard();
        }
        
        checkWinCondition();
    }

    function checkWinCondition() {
        if (!checkpoints.flag1 && checkCollision(playerPosition, flag1Position)) {
            messageDisplay.textContent = '¡Muy bien! Has llegado a la Bandera 1(Roja). 🎉';
            checkpoints.flag1 = true;
            resetCommands();
            updateBoard();
            instructionMessage.textContent = 'Ahora, ve a la Bandera 2 (naranja).';
        } else if (checkpoints.flag1 && !checkpoints.flag2 && checkCollision(playerPosition, flag2Position)) {
            messageDisplay.textContent = '¡Excelente! Bandera 2 alcanzada. 🏆';
            checkpoints.flag2 = true;
            resetCommands();
            updateBoard();
            instructionMessage.textContent = 'Avanza hacia la meta.';
        } else if (checkpoints.flag1 && checkpoints.flag2 && checkCollision(playerPosition, targetPosition)) {
            messageDisplay.textContent = '¡Felicidades, has completado el desafío! 🥳';
            resetCommands();
            instructionMessage.textContent = '¡Juego completado!';
        } else {
            messageDisplay.textContent = 'El algoritmo ha terminado y no has llegado al punto esperado. 😔';
        }
    }

    function resetCommands() {
        commands = [];
    }

    function resetGame() {
        resetCommands();
        checkpoints = { flag1: false, flag2: false };
        playerPosition = { ...startPosition };
        createBoard();
        messageDisplay.textContent = 'Juego reiniciado. ¡A programar! 💪';
        instructionMessage.textContent = '¡Bienvenido! Ve a la Bandera 1 (Roja).';
    }

    commandButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            addCommand(e.target.dataset.command);
        });
    });

    runButton.addEventListener('click', runCommands);
    resetButton.addEventListener('click', resetGame);
    
    resetGame();
});
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
        messageDisplay.textContent = 'EJECUTANDO...';
        
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
                messageDisplay.textContent = '¡TE SALISTE DEL TABLERO! INTENTA DE NUEVO.';
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
            messageDisplay.textContent = '¡MUY BIEN! HAS LLEGADO A LA BANDERA 1. ';
            checkpoints.flag1 = true;
            resetCommands();
            updateBoard();
            instructionMessage.textContent = 'AHORA, VE A LA BANDERA 2.(Naranja)';
        } else if (checkpoints.flag1 && !checkpoints.flag2 && checkCollision(playerPosition, flag2Position)) {
            messageDisplay.textContent = '¡EXCELENTE! BANDERA 2 ALCANZADA. ';
            checkpoints.flag2 = true;
            resetCommands();
            updateBoard();
            instructionMessage.textContent = 'AVANZA HACIA LA META.';
        } else if (checkpoints.flag1 && checkpoints.flag2 && checkCollision(playerPosition, targetPosition)) {
            messageDisplay.textContent = '¡FELICIDADES, HAS COMPLETADO EL DESAFÍO!';
            resetCommands();
            instructionMessage.textContent = '¡JUEGO COMPLETADO!';
        } else {
            messageDisplay.textContent = 'EL ALGORITMO HA TERMINADO Y NO HAS LLEGADO AL PUNTO ESPERADO. ';
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
        messageDisplay.textContent = 'JUEGO REINICIADO. ¡A PROGRAMAR! ';
        instructionMessage.textContent = '¡BIENVENIDO! VE A LA BANDERA 1.(Rojo)';
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

let gridSize = 5;
let boardState = [];
let gameOver = false;

function initGame(size) {
    gridSize = size;
    gameOver = false;
    document.getElementById('message').textContent = '';
    
    const letters = document.querySelectorAll('.letter');
    letters.forEach(l => l.classList.remove('active'));

    const board = document.getElementById('board');
    board.innerHTML = '';
    
    let sizeClass = 'board-5x5';
    if (gridSize === 7) sizeClass = 'board-7x7';
    if (gridSize === 10) sizeClass = 'board-10x10';

    board.className = 'bingo-board ' + sizeClass;
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const totalNumbers = gridSize * gridSize;
    const numbers = [];
    for (let i = 1; i <= totalNumbers; i++) {
        numbers.push(i);
    }
    
    const shuffled = numbers.sort(() => 0.5 - Math.random());
    boardState = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));

    for (let i = 0; i < totalNumbers; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = shuffled[i];
        cell.dataset.row = row;
        cell.dataset.col = col;

        cell.addEventListener('click', () => handleCellClick(cell, row, col));
        board.appendChild(cell);
    }
}

function handleCellClick(cell, row, col) {
    if (gameOver) return;

    if (boardState[row][col]) {
        // If already marked, confirm before undoing the circle
        const confirmRemove = confirm(`Are you sure you want to remove the selection for ${cell.textContent}?`);
        if (confirmRemove) {
            cell.classList.remove('marked');
            boardState[row][col] = false;
            updateTracking();
        }
    } else {
        // Mark cell
        cell.classList.add('marked');
        boardState[row][col] = true;
        updateTracking();
    }
}

function updateTracking() {
    const completedLinesCount = countCompletedLines();
    
    const letters = document.querySelectorAll('.letter');
    letters.forEach((letterSpan, index) => {
        if (index < completedLinesCount) {
            letterSpan.classList.add('active');
        } else {
            letterSpan.classList.remove('active');
        }
    });

    if (completedLinesCount >= 5) {
        document.getElementById('message').textContent = 'Perfect Bingo! 🎉 Game Completed!';
        gameOver = true;
    } else {
        document.getElementById('message').textContent = '';
    }
}

function countCompletedLines() {
    let lines = 0;

    // Rows
    for (let r = 0; r < gridSize; r++) {
        if (boardState[r].every(cell => cell)) lines++;
    }

    // Columns
    for (let c = 0; c < gridSize; c++) {
        let colWin = true;
        for (let r = 0; r < gridSize; r++) {
            if (!boardState[r][c]) {
                colWin = false;
                break;
            }
        }
        if (colWin) lines++;
    }

    // Main Diagonal
    let mainDiagWin = true;
    for (let i = 0; i < gridSize; i++) {
        if (!boardState[i][i]) {
            mainDiagWin = false;
            break;
        }
    }
    if (mainDiagWin) lines++;

    // Anti Diagonal
    let antiDiagWin = true;
    for (let i = 0; i < gridSize; i++) {
        if (!boardState[i][gridSize - 1 - i]) {
            antiDiagWin = false;
            break;
        }
    }
    if (antiDiagWin) lines++;

    return lines;
}

initGame(5);

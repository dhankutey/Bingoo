Let gridSize = 5;
Let boardState = [];
Let gameOver = false;

Function initGame(size) {
    gridSize = size;
    gameOver = false;
    document.getElementById(‘message’).textContent = ‘’;
    
    const letters = document.querySelectorAll(‘.letter’);
    letters.forEach(l => l.classList.remove(‘active’));

    const board = document.getElementById(‘board’);
    board.innerHTML = ‘’;
    
    // Set dynamic layout class based on size selection
    Let sizeClass = ‘board-5x5’;
    If (gridSize === 7) sizeClass = ‘board-7x7’;
    If (gridSize === 10) sizeClass = ‘board-10x10’;

    Board.className = ‘bingo-board ‘ + sizeClass;
    Board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    Const totalNumbers = gridSize * gridSize;
    Const numbers = [];
    For (let I = 1; I <= totalNumbers; i++) {
        Numbers.push(i);
    }
    
    Const shuffled = numbers.sort(() => 0.5 – Math.random());
    boardState = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));

    for (let I = 0; I < totalNumbers; i++) {
        const row = Math.floor(I / gridSize);
        const col = I % gridSize;

        const cell = document.createElement(‘div’);
        cell.classList.add(‘cell’);
        cell.textContent = shuffled[i];
        cell.dataset.row = row;
        cell.dataset.col = col;

        cell.addEventListener(‘click’, () => handleCellClick(cell, row, col));
        board.appendChild(cell);
    }
}

Function handleCellClick(cell, row, col) {
    If (gameOver) return;

    // If the cell is already marked, handle the removal logic
    If (boardState[row][col]) {
        Const number = cell.textContent;
        Const confirmRemove = confirm(`Are you sure you want to remove the mark from ${number}?`);
        
        If (confirmRemove) {
            Cell.classList.remove(‘marked’);
            boardState[row][col] = false;
            
            // Recalculate line counts to update BINGO letters
            Const completedLinesCount = countCompletedLines();
            Const letters = document.querySelectorAll(‘.letter’);
            Letters.forEach((letterSpan, index) => {
                If (index < completedLinesCount) {
                    letterSpan.classList.add(‘active’);
                } else {
                    letterSpan.classList.remove(‘active’);
                }
            });
        }
        Return; // Stop processing further so it doesn’t get marked again immediately
    }

    // Normal marking logic for unmarked cells
    Cell.classList.add(‘marked’);
    boardState[row][col] = true;

    const completedLinesCount = countCompletedLines();
    
    const letters = document.querySelectorAll(‘.letter’);
    letters.forEach((letterSpan, index) => {
        if (index < completedLinesCount) {
            letterSpan.classList.add(‘active’);
        } else {
            letterSpan.classList.remove(‘active’);
        }
    });

    If (completedLinesCount >= 5) {
        Document.getElementById(‘message’).textContent = ‘Perfect Bingo! 🎉 Game Completed!’;
        gameOver = true;
    }
}

Function countCompletedLines() {
    Let lines = 0;

    // Rows
    For (let r = 0; r < gridSize; r++) {
        If (boardState[r].every(cell => cell)) lines++;
    }

    // Columns
    For (let c = 0; c < gridSize; c++) {
        Let colWin = true;
        For (let r = 0; r < gridSize; r++) {
            If (!boardState[r][c]) {
                colWin = false;
                break;
            }
        }
        If (colWin) lines++;
    }

    // Main Diagonal
    Let mainDiagWin = true;
    For (let I = 0; I < gridSize; i++) {
        If (!boardState[i][i]) {
            mainDiagWin = false;
            break;
        }
    }
    If (mainDiagWin) lines++;

    // Anti Diagonal
    Let antiDiagWin = true;
    For (let I = 0; I < gridSize; i++) {
        If (!boardState[i][gridSize – 1 – i]) {
            antiDiagWin = false;
            break;
        }
    }
    If (antiDiagWin) lines++;

    Return lines;
}

// Start with a standard 5x5 board by default
initGame(5);




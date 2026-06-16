let size = 5;
let gridMatrix = [];
let selectedMatrix = [];

const gridSizeSelect = document.getElementById('gridSize');
const winModal = document.getElementById('winModal');
const playAgainBtn = document.getElementById('playAgainBtn');
const gridElement = document.getElementById('grid');

gridSizeSelect.addEventListener('change', initGame);
playAgainBtn.addEventListener('click', initGame);

function initGame() {
    size = parseInt(gridSizeSelect.value);
    winModal.style.display = 'none';
    
    for(let i = 0; i < 5; i++) {
        document.getElementById(`l-${i}`).classList.remove('glow');
    }

    const maxNum = size * size;
    const numbers = Array.from({length: maxNum}, (_, i) => i + 1);
    
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    gridMatrix = [];
    selectedMatrix = Array.from({length: size}, () => Array(size).fill(false));
    
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    const cellSize = size === 5 ? '60px' : size === 7 ? '45px' : '35px';
    const fontSize = size === 5 ? '1.2rem' : size === 7 ? '1rem' : '0.8rem';

    for (let r = 0; r < size; r++) {
        gridMatrix[r] = [];
        for (let c = 0; c < size; c++) {
            const num = numbers[r * size + c];
            gridMatrix[r][c] = num;

            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.innerText = num;
            cell.style.width = cellSize;
            cell.style.height = cellSize;
            cell.style.fontSize = fontSize;
            
            cell.addEventListener('click', () => handleCellClick(r, c, cell));
            gridElement.appendChild(cell);
        }
    }
}

function handleCellClick(r, c, cellElement) {
    if (selectedMatrix[r][c]) {
        const confirmRemove = confirm(`Are you sure you want to remove the selection for ${gridMatrix[r][c]}?`);
        if (confirmRemove) {
            selectedMatrix[r][c] = false;
            cellElement.classList.remove('selected');
            checkBingoLines();
        }
    } else {
        selectedMatrix[r][c] = true;
        cellElement.classList.add('selected');
        checkBingoLines();
    }
}

function checkBingoLines() {
    let lines = 0;

    for (let r = 0; r < size; r++) {
        if (selectedMatrix[r].every(val => val)) lines++;
    }

    for (let c = 0; c < size; c++) {
        let colWin = true;
        for (let r = 0; r < size; r++) {
            if (!selectedMatrix[r][c]) {
                colWin = false;
                break;
            }
        }
        if (colWin) lines++;
    }

    let diag1Win = true;
    for (let i = 0; i < size; i++) {
        if (!selectedMatrix[i][i]) {
            diag1Win = false;
            break;
        }
    }
    if (diag1Win) lines++;

    let diag2Win = true;
    for (let i = 0; i < size; i++) {
        if (!selectedMatrix[i][size - 1 - i]) {
            diag2Win = false;
            break;
        }
    }
    if (diag2Win) lines++;

    for (let i = 0; i < 5; i++) {
        const letterElement = document.getElementById(`l-${i}`);
        if (i < lines) {
            letterElement.classList.add('glow');
        } else {
            letterElement.classList.remove('glow');
        }
    }

    if (lines >= 5) {
        setTimeout(() => {
            winModal.style.display = 'flex';
        }, 300);
    }
}

window.onload = initGame;

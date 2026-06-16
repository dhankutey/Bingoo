const state = {
  size: 5,
  mode: 'bingo',
  grid: [],
  marked: new Set(),
  lines: 0,
  won: false,
};

const boardEl      = document.getElementById('board');
const bingoLetters = document.getElementById('bingoLetters');
const progressBar  = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const winBanner    = document.getElementById('winBanner');
const winTitle     = document.getElementById('winTitle');
const winSubtitle  = document.getElementById('winSubtitle');
const undoModal    = document.getElementById('undoModal');
const undoNum      = document.getElementById('undoNum');
const undoYes      = document.getElementById('undoYes');
const undoNo       = document.getElementById('undoNo');
const statMarked   = document.getElementById('statMarked');
const statLines    = document.getElementById('statLines');
const statNeeded   = document.getElementById('statNeeded');

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildGrid(size) {
  const nums = shuffle(Array.from({ length: size * size }, (_, i) => i + 1));
  const grid = [];
  for (let r = 0; r < size; r++) grid.push(nums.slice(r * size, r * size + size));
  return grid;
}

function applyCellSize(size) {
  const vw = Math.min(window.innerWidth, 780);
  const gap = (size - 1) * 6;
  let cell = Math.floor((vw - 24 - gap) / size);
  cell = Math.max(cell, 28);
  const font = cell < 38 ? '.65rem' : cell < 48 ? '.8rem' : cell < 58 ? '.95rem' : '1.1rem';
  document.documentElement.style.setProperty('--cell-size', cell + 'px');
  document.documentElement.style.setProperty('--font-size', font);
  boardEl.style.gridTemplateColumns = `repeat(${size}, var(--cell-size))`;
}

const WORD_MAP = { bingo: 'BINGO', bingoo: 'BINGOO' };

function buildLetters(mode) {
  bingoLetters.innerHTML = '';
  for (const ch of WORD_MAP[mode]) {
    const span = document.createElement('span');
    span.className = 'bingo-letter';
    span.textContent = ch;
    bingoLetters.appendChild(span);
  }
}

function updateLetters(lines) {
  bingoLetters.querySelectorAll('.bingo-letter')
    .forEach((el, i) => el.classList.toggle('lit', i < lines));
}

function getLines(grid, marked, size) {
  const ok = n => marked.has(n);
  const lines = [];
  for (let r = 0; r < size; r++)
    if (grid[r].every(ok)) lines.push({ type: 'row', index: r });
  for (let c = 0; c < size; c++)
    if (grid.every(row => ok(row[c]))) lines.push({ type: 'col', index: c });
  if (grid.every((row, i) => ok(row[i])))
    lines.push({ type: 'diag', index: 0 });
  if (grid.every((row, i) => ok(row[size - 1 - i])))
    lines.push({ type: 'diag', index: 1 });
  return lines;
}

function getCellsInLines(lines, size) {
  const cells = new Set();
  for (const ln of lines) {
    if (ln.type === 'row')                    for (let c = 0; c < size; c++) cells.add(`${ln.index},${c}`);
    if (ln.type === 'col')                    for (let r = 0; r < size; r++) cells.add(`${r},${ln.index}`);
    if (ln.type === 'diag' && ln.index === 0) for (let i = 0; i < size; i++) cells.add(`${i},${i}`);
    if (ln.type === 'diag' && ln.index === 1) for (let i = 0; i < size; i++) cells.add(`${i},${size - 1 - i}`);
  }
  return cells;
}

function renderBoard(popNum = null) {
  const { grid, marked, size, mode } = state;
  const needed = mode === 'bingo' ? 5 : 6;
  const completedLines = getLines(grid, marked, size);
  const completeCells  = getCellsInLines(completedLines, size);
  const lineCount      = completedLines.length;

  boardEl.innerHTML = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const num = grid[r][c];
      const key = `${r},${c}`;
      const div = document.createElement('div');
      div.className = 'cell';
      div.textContent = num;
      if (marked.has(num))        div.classList.add('marked');
      if (completeCells.has(key)) div.classList.add('complete-cell');
      if (num === popNum)         div.classList.add('pop');
      div.addEventListener('click', () => onCellClick(num));
      boardEl.appendChild(div);
    }
  }

  updateLetters(lineCount);

  const pct = Math.min((lineCount / needed) * 100, 100);
  progressBar.style.setProperty('--p', pct + '%');
  progressText.textContent = `${lineCount} / ${needed} lines completed`;
  statMarked.textContent = marked.size;
  statLines.textContent  = lineCount;
  statNeeded.textContent = needed;

  if (!state.won && lineCount >= needed) {
    state.won = true;
    const word = WORD_MAP[mode];
    winTitle.textContent    = word + '!';
    winSubtitle.textContent = `All ${needed} lines completed! 🎊`;
    setTimeout(() => winBanner.classList.remove('hidden'), 500);
  }
}

function onCellClick(num) {
  if (state.won) return;
  if (state.marked.has(num)) {
    undoNum.textContent = num;
    undoModal.classList.remove('hidden');
    undoYes.onclick = () => {
      undoModal.classList.add('hidden');
      state.marked.delete(num);
      renderBoard();
    };
    undoNo.onclick = () => undoModal.classList.add('hidden');
  } else {
    state.marked.add(num);
    renderBoard(num);
  }
}

function newGame() {
  state.grid   = buildGrid(state.size);
  state.marked = new Set();
  state.won    = false;
  winBanner.classList.add('hidden');
  applyCellSize(state.size);
  buildLetters(state.mode);
  renderBoard();
}

document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.size = parseInt(btn.dataset.size, 10);
    newGame();
  });
});

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.mode = btn.dataset.mode;
    newGame();
  });
});

document.getElementById('newGameBtn').addEventListener('click', newGame);
document.getElementById('playAgainBtn').addEventListener('click', newGame);
undoModal.addEventListener('click', e => { if (e.target === undoModal) undoModal.classList.add('hidden'); });
window.addEventListener('resize', () => applyCellSize(state.size));

newGame();

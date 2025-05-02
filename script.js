
const wordPaths = {'DESK': [17, 11, 5, 4], 'PRINTER': [3, 2, 7, 1, 0, 6, 12], 'PAPER': [18, 13, 8, 9, 10], 'CHAIR': [16, 15, 14, 19, 20], 'PEN': [21, 22, 23], 'DESKTOP': [32, 27, 26, 25, 31, 30, 24], 'OFFICE': [36, 37, 38, 33, 28, 29], 'MOUSE': [34, 35, 40, 41, 47], 'MARKER': [46, 45, 39, 44, 43, 42]};
const spangram = "OFFICE";
const rows = 8;
const cols = 6;
let selected = [];
let isDragging = false;

function drawGrid() {
  const letters = [
    "T","N","R","P","K","S",
    "E","I","P","E","R","E",
    "R","A","A","H","C","D",
    "P","I","R","P","E","N",
    "P","K","S","E","C","E",
    "O","T","D","I","M","O",
    "O","F","F","R","U","S",
    "R","E","K","A","M","E"
  ];

  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  for (let i = 0; i < letters.length; i++) {
    const cell = document.createElement("div");
    cell.textContent = letters[i];
    cell.className = "cell";
    cell.dataset.index = i;
    cell.dataset.row = Math.floor(i / cols);
    cell.dataset.col = i % cols;
    grid.appendChild(cell);
  }

  const gridElement = document.getElementById("grid");
  gridElement.addEventListener("touchstart", handleStart, { passive: false });
  gridElement.addEventListener("touchmove", handleMove, { passive: false });
  gridElement.addEventListener("touchend", handleEnd);
  gridElement.addEventListener("mousedown", handleStart);
  gridElement.addEventListener("mousemove", handleMove);
  gridElement.addEventListener("mouseup", handleEnd);
}

function getCellFromPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  return el && el.classList.contains("cell") ? el : null;
}

function handleStart(e) {
  e.preventDefault();
  selected = [];
  isDragging = true;
  const point = e.touches ? e.touches[0] : e;
  const cell = getCellFromPoint(point.clientX, point.clientY);
  if (cell) selectCell(cell);
}

function handleMove(e) {
  if (!isDragging) return;
  const point = e.touches ? e.touches[0] : e;
  const cell = getCellFromPoint(point.clientX, point.clientY);
  if (cell && !selected.includes(cell)) {
    const last = selected[selected.length - 1];
    if (!last || isAdjacent(last, cell)) {
      selectCell(cell);
    }
  }
}

function handleEnd() {
  isDragging = false;
  const indexes = selected.map(c => parseInt(c.dataset.index));
  console.log("Selected path:", indexes);
  const word = Object.entries(wordPaths).find(([w, path]) =>
    JSON.stringify(path) === JSON.stringify(indexes)
  );
  if (word) {
    console.log("Found word:", word[0]);
    selected.forEach(c => {
      c.classList.remove("selected");
      c.classList.add(word[0] === spangram ? "found-spangram" : "found");
    });
  } else {
    console.warn("No match for:", indexes);
    selected.forEach(c => c.classList.remove("selected"));
  }
  selected = [];
}

function selectCell(cell) {
  cell.classList.add("selected");
  selected.push(cell);
}

function isAdjacent(a, b) {
  const r1 = parseInt(a.dataset.row), c1 = parseInt(a.dataset.col);
  const r2 = parseInt(b.dataset.row), c2 = parseInt(b.dataset.col);
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
}

drawGrid();

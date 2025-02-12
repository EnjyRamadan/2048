const gridSize = 4;
let grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
let score = 0;

// Initialize game
function initGame() {
    score = 0;
    grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    addRandomTile();
    addRandomTile();
    updateGrid();
}
// Reset the game when "New Game" button is clicked
function resetGame() {
    initGame();
}
// Add a random tile (2 or 4)
function addRandomTile() {
    let emptyTiles = [];
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === 0) emptyTiles.push({ r, c });
        }
    }
    if (emptyTiles.length > 0) {
        let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Update the game grid visually
function updateGrid() {
    let gridElement = document.getElementById("grid");
    gridElement.innerHTML = "";

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            let tile = document.createElement("div");
            tile.classList.add("tile");
            if (grid[r][c] !== 0) {
                tile.textContent = grid[r][c];
                tile.classList.add(`tile-${grid[r][c]}`);
            }
            gridElement.appendChild(tile);
        }
    }
    document.getElementById("score").textContent = `Score: ${score}`;
}

// Move tiles in a given direction
function move(direction) {
    let moved = false;

    if (direction === "left") moved = moveTiles(0, 1, 0, 1);
    else if (direction === "right") moved = moveTiles(0, 1, gridSize - 1, -1);
    else if (direction === "up") moved = moveTiles(1, 0, 0, 1);
    else if (direction === "down") moved = moveTiles(1, 0, gridSize - 1, -1);

    if (moved) {
        addRandomTile();
        updateGrid();
        if (isGameOver()) alert("Game Over!");
    }
}

// Shift and merge tiles
function moveTiles(rowInc, colInc, start, step) {
    let changed = false;

    for (let i = 0; i < gridSize; i++) {
        let line = [];
        for (let j = 0; j < gridSize; j++) {
            let r = rowInc ? start + j * step : i;
            let c = colInc ? start + j * step : i;
            if (grid[r][c] !== 0) line.push(grid[r][c]);
        }

        for (let j = 0; j < line.length - 1; j++) {
            if (line[j] === line[j + 1]) {
                line[j] *= 2;
                score += line[j];
                line.splice(j + 1, 1);
            }
        }

        while (line.length < gridSize) line.push(0);

        for (let j = 0; j < gridSize; j++) {
            let r = rowInc ? start + j * step : i;
            let c = colInc ? start + j * step : i;
            if (grid[r][c] !== line[j]) {
                grid[r][c] = line[j];
                changed = true;
            }
        }
    }

    return changed;
}

// Check if game is over
function isGameOver() {
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === 0) return false;
            if (c < gridSize - 1 && grid[r][c] === grid[r][c + 1]) return false;
            if (r < gridSize - 1 && grid[r][c] === grid[r + 1][c]) return false;
        }
    }
    return true;
}

// Handle arrow key events
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") move("left");
    else if (event.key === "ArrowRight") move("right");
    else if (event.key === "ArrowUp") move("up");
    else if (event.key === "ArrowDown") move("down");
});

// Start the game
initGame();

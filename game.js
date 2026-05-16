// ============================================
// MAZE GAME - Main Game Logic
// ============================================

class MazeGame {
    constructor(canvasId, mazeKey = DEFAULT_MAZE) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Get all maze keys and track levels
        this.allMazeKeys = Object.keys(MAZES);
        this.totalLevels = this.allMazeKeys.length;
        this.currentLevelIndex = this.allMazeKeys.indexOf(mazeKey);
        
        // Load maze and configuration
        this.loadMaze(mazeKey);
        this.loadConfig();
        
        // Game state
        this.keys = {};
        this.gameWon = false;
        this.startTime = Date.now();
        this.finishTime = null;
        this.currentMazeKey = mazeKey;
        this.showingEndScreen = false;
        
        // Setup event listeners and start game loop
        this.setupEventListeners();
        this.gameLoop();
    }
    
    loadMaze(mazeKey) {
        if (!MAZES[mazeKey]) {
            console.error(`Maze '${mazeKey}' not found!`);
            console.log('Available mazes:', Object.keys(MAZES));
            mazeKey = DEFAULT_MAZE;
        }
        
        const maze = MAZES[mazeKey];
        this.layout = maze.layout;
        this.mazeName = maze.name;
        this.rows = this.layout.length;
        this.cols = this.layout[0].length;
    }
    
    loadConfig() {
        this.cellSize = GAME_CONFIG.cellSize;
        this.playerSpeed = GAME_CONFIG.playerSpeed;
        this.colors = GAME_CONFIG.colors;
        this.playerRadius = GAME_CONFIG.playerRadius;
        
        // Set canvas dimensions based on maze size
        this.canvas.width = this.cols * this.cellSize;
        this.canvas.height = this.rows * this.cellSize;
        
        // Find start and end positions
        this.findPositions();
        
        // Initialize player
        this.initPlayer();
    }
    
    findPositions() {
        this.startPos = null;
        this.endPos = null;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.layout[row][col] === 2) {
                    this.startPos = { x: col, y: row };
                }
                if (this.layout[row][col] === 3) {
                    this.endPos = { x: col, y: row };
                }
            }
        }
        
        if (!this.startPos || !this.endPos) {
            console.error('Maze must have a start (2) and end (3) position!');
        }
    }
    
    initPlayer() {
        if (!this.startPos) return;
        
        // Player stored as grid position, not pixels
        this.player = {
            gridX: this.startPos.x,
            gridY: this.startPos.y,
            radius: this.playerRadius
        };
        
        this.lastMoveTime = 0;
        this.moveDelay = 100; // milliseconds between moves (adjust for speed)
        
        this.gameWon = false;
        this.startTime = Date.now();
        this.finishTime = null;
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Allow Enter or Space to proceed from end screen
            if (this.showingEndScreen && (e.key === 'Enter' || e.key === ' ')) {
                this.proceedToNextLevel();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.initPlayer();
        });
        
        // Maze selector
        document.getElementById('mazeSelect').addEventListener('change', (e) => {
            this.switchMaze(e.target.value);
        });
        
        // End screen button
        document.getElementById('nextLevelBtn').addEventListener('click', () => {
            this.proceedToNextLevel();
        });
    }
    
    switchMaze(mazeKey) {
        this.loadMaze(mazeKey);
        this.loadConfig();
        this.currentMazeKey = mazeKey;
        this.currentLevelIndex = this.allMazeKeys.indexOf(mazeKey);
    }
    
    isCellWalkable(col, row) {
        // Check bounds
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return false;
        }
        
        // Wall (1) is not walkable
        return this.layout[row][col] !== 1;
    }
    
    
    update() {
        if (this.gameWon || this.showingEndScreen) return;
        
        // Check if enough time has passed since last move
        const currentTime = Date.now();
        if (currentTime - this.lastMoveTime < this.moveDelay) {
            return; // Not enough time has passed
        }
        
        const keys = this.keys;
        let newGridX = this.player.gridX;
        let newGridY = this.player.gridY;
        let moved = false;
        
        // Check input and try to move to adjacent cell
        if (keys['arrowup'] || keys['w']) {
            if (this.isCellWalkable(this.player.gridX, this.player.gridY - 1)) {
                newGridY = this.player.gridY - 1;
                moved = true;
            }
        } else if (keys['arrowdown'] || keys['s']) {
            if (this.isCellWalkable(this.player.gridX, this.player.gridY + 1)) {
                newGridY = this.player.gridY + 1;
                moved = true;
            }
        } else if (keys['arrowleft'] || keys['a']) {
            if (this.isCellWalkable(this.player.gridX - 1, this.player.gridY)) {
                newGridX = this.player.gridX - 1;
                moved = true;
            }
        } else if (keys['arrowright'] || keys['d']) {
            if (this.isCellWalkable(this.player.gridX + 1, this.player.gridY)) {
                newGridX = this.player.gridX + 1;
                moved = true;
            }
        }
        
        // Update lastMoveTime every 200ms to register key press
        this.lastMoveTime = currentTime;
        
        // Apply movement if valid
        if (moved) {
            this.player.gridX = newGridX;
            this.player.gridY = newGridY;
            
            // Check if player reached the end
            if (this.player.gridX === this.endPos.x && this.player.gridY === this.endPos.y) {
                this.gameWon = true;
                this.finishTime = Date.now();
                this.showWinMessage();
            }
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.path;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cellType = this.layout[row][col];
                const x = col * this.cellSize;
                const y = row * this.cellSize;
                
                if (cellType === 1) { // Wall
                    this.ctx.fillStyle = this.colors.wall;
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                } else if (cellType === 2) { // Start
                    this.ctx.fillStyle = this.colors.start;
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                } else if (cellType === 3) { // End
                    this.ctx.fillStyle = this.colors.end;
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                }
            }
        }
        
        // Draw player at grid cell center
        const playerPixelX = this.player.gridX * this.cellSize + this.cellSize / 2;
        const playerPixelY = this.player.gridY * this.cellSize + this.cellSize / 2;
        
        this.ctx.fillStyle = this.colors.player;
        this.ctx.beginPath();
        this.ctx.arc(playerPixelX, playerPixelY, this.player.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.strokeStyle = this.colors.playerBorder;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw border
        this.ctx.strokeStyle = this.colors.border;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    gameLoop() {
        this.update();
        this.draw();
        this.updateTimer();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateTimer() {
        let elapsed;
        
        if (this.finishTime) {
            elapsed = Math.floor((this.finishTime - this.startTime) / 1000);
        } else {
            elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        }
        
        document.getElementById('timer').textContent = `⏱️ Time: ${elapsed}s`;
    }
    
    showWinMessage() {
        this.showingEndScreen = true;
        const timeSeconds = Math.floor((this.finishTime - this.startTime) / 1000);
        const currentLevelNum = this.currentLevelIndex + 1;
        const isLastLevel = this.currentLevelIndex === this.totalLevels - 1;
        
        const endScreen = document.getElementById('endScreen');
        const endContent = document.getElementById('endContent');
        
        if (isLastLevel) {
            endContent.innerHTML = `
                <h2>🎉 GAME COMPLETED! 🎉</h2>
                <p>You've completed all ${this.totalLevels} levels!</p>
                <p class="time-display">Final Time: ${timeSeconds}s</p>
                <p>Great job! Well done!</p>
            `;
            document.getElementById('nextLevelBtn').textContent = 'Restart Game';
        } else {
            endContent.innerHTML = `
                <h2>✅ Level ${currentLevelNum} Complete!</h2>
                <p>Time: ${timeSeconds}s</p>
                <p>Level ${currentLevelNum} of ${this.totalLevels}</p>
            `;
            document.getElementById('nextLevelBtn').textContent = 'Next Level (Press Enter or Click)';
        }
        
        endScreen.style.display = 'flex';
    }
    
    proceedToNextLevel() {
        const endScreen = document.getElementById('endScreen');
        endScreen.style.display = 'none';
        this.showingEndScreen = false;
        
        const isLastLevel = this.currentLevelIndex === this.totalLevels - 1;
        
        if (isLastLevel) {
            // Restart from first level
            this.currentLevelIndex = 0;
            const firstLevelKey = this.allMazeKeys[0];
            this.switchMaze(firstLevelKey);
            document.getElementById('mazeSelect').value = firstLevelKey;
        } else {
            // Go to next level
            this.currentLevelIndex++;
            const nextLevelKey = this.allMazeKeys[this.currentLevelIndex];
            this.switchMaze(nextLevelKey);
            document.getElementById('mazeSelect').value = nextLevelKey;
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new MazeGame('mazeCanvas', DEFAULT_MAZE);
});

// ============================================
// MAZE GAME - Main Game Logic
// ============================================

class MazeGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Load configuration
        this.layout = MAZE_CONFIG.layout;
        this.cellSize = MAZE_CONFIG.cellSize;
        this.playerSpeed = MAZE_CONFIG.playerSpeed;
        this.colors = MAZE_CONFIG.colors;
        
        // Set canvas dimensions
        this.cols = this.layout[0].length;
        this.rows = this.layout.length;
        this.canvas.width = this.cols * this.cellSize;
        this.canvas.height = this.rows * this.cellSize;
        
        // Initialize player and game state
        this.initGame();
        
        // Input handling
        this.keys = {};
        this.setupEventListeners();
        
        // Game loop
        this.startTime = Date.now();
        this.gameWon = false;
        this.gameLoop();
    }
    
    initGame() {
        // Find start and end positions
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
            return;
        }
        
        // Player position (in pixels, centered in cell)
        this.player = {
            x: this.startPos.x * this.cellSize + this.cellSize / 2,
            y: this.startPos.y * this.cellSize + this.cellSize / 2,
            radius: this.cellSize / 3
        };
        
        this.gameWon = false;
        this.startTime = Date.now();
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.initGame();
        });
    }
    
    getGridPosition(pixelX, pixelY) {
        const col = Math.floor(pixelX / this.cellSize);
        const row = Math.floor(pixelY / this.cellSize);
        return { col, row };
    }
    
    isWalkable(pixelX, pixelY) {
        const { col, row } = this.getGridPosition(pixelX, pixelY);
        
        // Check bounds
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return false;
        }
        
        // Check if it's a wall (1) - not walkable
        const cellType = this.layout[row][col];
        return cellType !== 1;
    }
    
    updatePlayer() {
        if (this.gameWon) return;
        
        let newX = this.player.x;
        let newY = this.player.y;
        
        // Handle movement inputs
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
            newY -= this.playerSpeed;
        }
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
            newY += this.playerSpeed;
        }
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            newX -= this.playerSpeed;
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            newX += this.playerSpeed;
        }
        
        // Collision detection - check if new position is valid
        if (this.isWalkable(newX, newY)) {
            this.player.x = newX;
            this.player.y = newY;
        }
        
        // Check if player reached the end
        const endPixelX = this.endPos.x * this.cellSize + this.cellSize / 2;
        const endPixelY = this.endPos.y * this.cellSize + this.cellSize / 2;
        const distance = Math.sqrt(
            (this.player.x - endPixelX) ** 2 + 
            (this.player.y - endPixelY) ** 2
        );
        
        if (distance < this.cellSize / 2) {
            this.gameWon = true;
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.path;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = col * this.cellSize;
                const y = row * this.cellSize;
                const cellType = this.layout[row][col];
                
                if (cellType === 1) {
                    // Draw wall
                    this.ctx.fillStyle = this.colors.wall;
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                } else if (cellType === 2) {
                    // Draw start position
                    this.ctx.fillStyle = this.colors.start;
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                } else if (cellType === 3) {
                    // Draw end position
                    this.ctx.fillStyle = this.colors.end;
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                }
            }
        }
        
        // Draw grid lines (optional - helps see cells)
        this.ctx.strokeStyle = '#BDC3C7';
        this.ctx.lineWidth = 0.5;
        for (let col = 0; col <= this.cols; col++) {
            this.ctx.beginPath();
            this.ctx.moveTo(col * this.cellSize, 0);
            this.ctx.lineTo(col * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let row = 0; row <= this.rows; row++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, row * this.cellSize);
            this.ctx.lineTo(this.canvas.width, row * this.cellSize);
            this.ctx.stroke();
        }
        
        // Draw player
        this.ctx.fillStyle = this.colors.player;
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw win message
        if (this.gameWon) {
            const elapsedTime = Math.round((Date.now() - this.startTime) / 1000);
            this.drawWinMessage(elapsedTime);
        }
    }
    
    drawWinMessage(time) {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Win text
        this.ctx.fillStyle = '#2ECC71';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🎉 YOU WIN! 🎉', this.canvas.width / 2, this.canvas.height / 2 - 40);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '28px Arial';
        this.ctx.fillText(`Time: ${time}s`, this.canvas.width / 2, this.canvas.height / 2 + 30);
    }
    
    gameLoop() {
        this.updatePlayer();
        this.draw();
        this.updateTimer();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateTimer() {
        if (!this.gameWon) {
            const elapsed = Math.round((Date.now() - this.startTime) / 1000);
            document.getElementById('timer').textContent = `Time: ${elapsed}s`;
        }
    }
}

// ============================================
// Initialize Game
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new MazeGame('mazeCanvas');
});

// ============================================
// GAME CONFIGURATION
// ============================================
// This object contains all configurable game settings.
// Modify these values to adjust gameplay, appearance, and behavior.

const GAME_CONFIG = {
    // Grid cell size in pixels - determines maze scale and player size
    cellSize: 40,
    
    // Player movement speed (not currently used but available for future features)
    playerSpeed: 5,
    
    // Color scheme for all game elements
    colors: {
        wall: '#2C3E50',        // Dark maze walls
        path: '#ECF0F1',        // Light walkable paths
        player: '#3498DB',      // Player circle color
        playerBorder: '#2980B9',// Player circle outline
        start: '#2ECC71',       // Green starting position
        end: '#E74C3C',         // Red ending/goal position
        border: '#000000'       // Canvas border
    },
    
    // Visual and gameplay settings
    playerRadius: null,  // Set to null to auto-calculate (1/3 of cellSize)
    wallThickness: 2,    // Wall line thickness in pixels (for future use)
    
    // Game behavior
    allowDiagonalMovement: false,  // Only allow 4-directional movement
    moveDelay: 100  // Milliseconds between each cell-by-cell move (controls speed)
};

// Auto-calculate player radius as 1/3 of cell size for proportional scaling
if (GAME_CONFIG.playerRadius === null) {
    GAME_CONFIG.playerRadius = GAME_CONFIG.cellSize / 3;
}

// ============================================
// MAZE GAME - Main Game Logic
// ============================================
// The MazeGame class handles all game logic including:
// - Maze loading and rendering
// - Player movement and collision detection
// - Game state management (win conditions, level progression)
// - Canvas drawing and animation loop
// - Event handling for keyboard input and UI controls

class MazeGame {
    /**
     * Constructor - Initializes a new maze game instance
     * @param {string} canvasId - HTML canvas element ID to render the game
     * @param {number} levelIndex - Starting maze level (0-indexed)
     */
    constructor(canvasId, levelIndex = DEFAULT_MAZE_INDEX) {
        // Get canvas and 2D rendering context
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Track level progression
        this.totalLevels = MAZES.length;  // Total number of available mazes
        this.currentLevelIndex = levelIndex;  // Current level being played
        
        // Load maze and configuration
        this.loadMaze(levelIndex);
        this.loadConfig();
        
        // Game state tracking
        this.keys = {};              // Currently pressed keyboard keys
        this.gameWon = false;        // Whether player reached the goal
        this.startTime = Date.now(); // When the level started
        this.finishTime = null;      // When the level was completed
        this.showingEndScreen = false;  // Whether end screen is displayed
        this.levelTimes = [];        // Array of {level, time} for all completed levels
        
        // Setup event listeners and start game loop
        this.setupEventListeners();
        this.gameLoop();  // Start the main game loop
    }
    
    /**
     * Load maze from MAZES array and store maze dimensions
     * @param {number} levelIndex - Index of maze to load
     * Maze layout format: 0=path, 1=wall, 2=start, 3=end
     */
    loadMaze(levelIndex) {
        // Validate level index and fall back to default if invalid
        if (levelIndex < 0 || levelIndex >= MAZES.length) {
            console.error(`Level ${levelIndex} not found!`);
            levelIndex = DEFAULT_MAZE_INDEX;
        }
        
        this.layout = MAZES[levelIndex];  // 2D array representing maze grid
        this.rows = this.layout.length;   // Number of rows in maze
        this.cols = this.layout[0].length;  // Number of columns in maze
    }
    
    /**
     * Load game configuration based on maze size
     * Sets up canvas, finds start/end positions, and initializes player
     */
    loadConfig() {
        // Set canvas dimensions to fit the maze (width = cols × cellSize, height = rows × cellSize)
        this.canvas.width = this.cols * GAME_CONFIG.cellSize;
        this.canvas.height = this.rows * GAME_CONFIG.cellSize;
        
        // Scan maze to find starting position (2) and ending position (3)
        this.findPositions();
        
        // Reset player to starting position and game state
        this.initPlayer();
    }
    
    /**
     * Scan maze to find starting and ending positions
     * Searches for cell types: 2 = start, 3 = end
     */
    findPositions() {
        this.startPos = null;  // {x, y} grid coordinates of start
        this.endPos = null;    // {x, y} grid coordinates of end
        
        // Iterate through all maze cells
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                // Cell type 2 marks the starting position
                if (this.layout[row][col] === 2) {
                    this.startPos = { x: col, y: row };
                }
                // Cell type 3 marks the ending/goal position
                if (this.layout[row][col] === 3) {
                    this.endPos = { x: col, y: row };
                }
            }
        }
        
        // Validate that maze has both start and end positions
        if (!this.startPos || !this.endPos) {
            console.error('Maze must have a start (2) and end (3) position!');
        }
    }
    
    /**
     * Initialize or reset the player at the starting position
     * Called at game start and when player resets
     */
    initPlayer() {
        if (!this.startPos) return;  // Exit if start position not found
        
        // Player object stores grid position (not pixel coordinates)
        // Grid position is converted to pixels during rendering
        this.player = {
            gridX: this.startPos.x,      // Column on grid (0 to cols-1)
            gridY: this.startPos.y,      // Row on grid (0 to rows-1)
            radius: GAME_CONFIG.playerRadius  // Circle radius for rendering
        };
        
        // Movement timing - tracks when last move was made
        this.lastMoveTime = 0;  // Timestamp of last move
        
        // Reset game state for new level
        this.gameWon = false;      // Player hasn't reached goal yet
        this.startTime = Date.now();  // Record when level started
        this.finishTime = null;    // Not finished yet
    }
    
    /**
     * Attach keyboard and UI event listeners
     * Handles: keyboard input, reset button, maze selector, next level button
     */
    setupEventListeners() {
        // Track keyboard state for arrow keys and WASD
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            // Allow skipping end screen with Enter or Space
            if (this.showingEndScreen && (e.key === 'Enter' || e.key === ' ')) {
                this.proceedToNextLevel();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Reset button - restarts current level
        document.getElementById('resetBtn').addEventListener('click', () => this.initPlayer());
        
        // Maze selector - allows choosing different levels
        document.getElementById('mazeSelect').addEventListener('change', (e) => this.switchMaze(parseInt(e.target.value)));
        
        // Next level button - shown on end screen
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.proceedToNextLevel());
        
        // Setup Virtual D-Pad for mobile devices
        this.setupDPad();
    }
    
    /**
     * Setup Virtual D-Pad button event listeners
     * Simulates keyboard input when D-Pad buttons are pressed on mobile devices
     * Maps D-Pad buttons to arrow key inputs for movement control
     */
    setupDPad() {
        // Map D-Pad button IDs to keyboard key names
        const dpadButtons = {
            'dpadUp': 'arrowup',
            'dpadDown': 'arrowdown',
            'dpadLeft': 'arrowleft',
            'dpadRight': 'arrowright'
        };
        
        // Setup touch and mouse event listeners for each D-Pad button
        Object.entries(dpadButtons).forEach(([buttonId, keyName]) => {
            const button = document.getElementById(buttonId);
            if (!button) return;  // Skip if button element not found
            
            // Mouse down - simulate key press
            button.addEventListener('mousedown', () => {
                this.keys[keyName] = true;
            });
            
            // Touch start - simulate key press with touch
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();  // Prevent default touch behaviors (scrolling, zoom)
                this.keys[keyName] = true;
            });
            
            // Mouse up - simulate key release
            button.addEventListener('mouseup', () => {
                this.keys[keyName] = false;
            });
            
            // Touch end - simulate key release
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys[keyName] = false;
            });
            
            // Mouse leave - release key if finger leaves button while pressed
            button.addEventListener('mouseleave', () => {
                this.keys[keyName] = false;
            });
            
            // Touch cancel - release key on unexpected touch cancellation
            button.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.keys[keyName] = false;
            });
        });
    }
    
    /**
     * Switch to a different maze level
     * @param {number} levelIndex - Index of maze to load
     */
    switchMaze(levelIndex) {
        // Load new maze layout and update canvas size
        this.loadMaze(levelIndex);
        this.loadConfig();  // This also calls initPlayer()
        this.currentLevelIndex = levelIndex;  // Track current level
    }
    
    /**
     * Check if a grid cell is walkable (not a wall)
     * @param {number} col - Column coordinate
     * @param {number} row - Row coordinate
     * @returns {boolean} True if cell is walkable, false if out of bounds or wall
     * Cell types: 0=path, 1=wall, 2=start, 3=end
     */
    isCellWalkable(col, row) {
        // Check if coordinates are within maze bounds
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return false;  // Out of bounds - not walkable
        }
        
        // Cell type 1 is a wall - not walkable. All other types (0,2,3) are walkable
        return this.layout[row][col] !== 1;
    }
    
    /**
     * Update game state each frame
     * Handles: player movement, collision detection, win condition
     * Movement is limited by moveDelay to create cell-by-cell stepping
     */
    update() {
        // Don't update if game is won or end screen is showing
        if (this.gameWon || this.showingEndScreen) return;
        
        // Get current time and check if enough time has passed since last move
        const currentTime = Date.now();
        if (currentTime - this.lastMoveTime < GAME_CONFIG.moveDelay) {
            return;  // Not enough time elapsed - skip this frame's movement
        }
        
        const keys = this.keys;  // Current keyboard state
        let newGridX = this.player.gridX;  // Proposed new X position
        let newGridY = this.player.gridY;  // Proposed new Y position
        let moved = false;  // Whether player actually moved
        
        // Check input for all 4 cardinal directions
        // Arrow keys and WASD are both supported
        
        // UP: Arrow Up or W
        if (keys['arrowup'] || keys['w']) {
            if (this.isCellWalkable(this.player.gridX, this.player.gridY - 1)) {
                newGridY = this.player.gridY - 1;  // Move up one cell
                moved = true;
            }
        }
        // DOWN: Arrow Down or S
        else if (keys['arrowdown'] || keys['s']) {
            if (this.isCellWalkable(this.player.gridX, this.player.gridY + 1)) {
                newGridY = this.player.gridY + 1;  // Move down one cell
                moved = true;
            }
        }
        // LEFT: Arrow Left or A
        else if (keys['arrowleft'] || keys['a']) {
            if (this.isCellWalkable(this.player.gridX - 1, this.player.gridY)) {
                newGridX = this.player.gridX - 1;  // Move left one cell
                moved = true;
            }
        }
        // RIGHT: Arrow Right or D
        else if (keys['arrowright'] || keys['d']) {
            if (this.isCellWalkable(this.player.gridX + 1, this.player.gridY)) {
                newGridX = this.player.gridX + 1;  // Move right one cell
                moved = true;
            }
        }
        
        // Update timing for next move check
        this.lastMoveTime = currentTime;
        
        // Apply movement if valid cell was found
        if (moved) {
            this.player.gridX = newGridX;
            this.player.gridY = newGridY;
            
            // Check if player reached the goal (end position)
            if (this.player.gridX === this.endPos.x && this.player.gridY === this.endPos.y) {
                this.gameWon = true;  // Level complete!
                this.finishTime = Date.now();  // Record completion time
                this.showWinMessage();  // Display end screen
            }
        }
    }
    
    /**
     * Render the game on canvas each frame
     * Draws: background, maze walls, start/end positions, player circle, border
     */
    draw() {
        const { colors, cellSize } = GAME_CONFIG;  // Get config values
        
        // Clear canvas with background color (all paths)
        this.ctx.fillStyle = colors.path;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze cells (walls, start, end)
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cellType = this.layout[row][col];  // Get cell type
                const x = col * cellSize;  // Convert grid to pixel coordinates
                const y = row * cellSize;
                
                // Select color based on cell type
                if (cellType === 1) {          // Wall
                    this.ctx.fillStyle = colors.wall;
                } else if (cellType === 2) {   // Start position
                    this.ctx.fillStyle = colors.start;
                } else if (cellType === 3) {   // End position
                    this.ctx.fillStyle = colors.end;
                } else continue;  // Skip paths (they're already the background color)
                
                // Draw the cell as a square
                this.ctx.fillRect(x, y, cellSize, cellSize);
            }
        }
        
        // Draw player as a circle at grid cell center
        // Convert grid position to pixel position, adding half-cell offset for center
        const playerPixelX = this.player.gridX * cellSize + cellSize / 2;
        const playerPixelY = this.player.gridY * cellSize + cellSize / 2;
        
        // Draw filled circle
        this.ctx.fillStyle = colors.player;
        this.ctx.beginPath();
        this.ctx.arc(playerPixelX, playerPixelY, this.player.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw circle outline/border
        this.ctx.strokeStyle = colors.playerBorder;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw canvas border rectangle
        this.ctx.strokeStyle = colors.border;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Main game loop - called every frame using requestAnimationFrame
     * Updates game state, renders frame, and updates timer display
     */
    gameLoop() {
        this.update();      // Process player input and movement
        this.draw();        // Render maze and player to canvas
        this.updateTimer(); // Update time display
        
        // Schedule next frame (60 FPS on most displays)
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Update elapsed time display in UI
     * Shows time remaining until level completion (if not finished)
     * Or shows final completion time (if level won)
     */
    updateTimer() {
        // Calculate elapsed time in seconds
        // Use finishTime if level is complete, otherwise use current time
        const elapsed = Math.floor(((this.finishTime || Date.now()) - this.startTime) / 1000);
        
        // Update timer element in HTML
        document.getElementById('timer').textContent = `⏱️ Time: ${elapsed}s`;
    }
    
    /**
     * Display end-of-level screen with results
     * Shows level completion message, time taken, and level progress
     * On final level: displays summary table of all times with total
     */
    showWinMessage() {
        this.showingEndScreen = true;  // Pause gameplay
        
        // Calculate completion time in seconds
        const timeSeconds = Math.floor((this.finishTime - this.startTime) / 1000);
        const currentLevelNum = this.currentLevelIndex + 1;  // Convert 0-index to 1-index
        const isLastLevel = this.currentLevelIndex === this.totalLevels - 1;
        
        // Store this level's completion time
        this.levelTimes.push({
            level: currentLevelNum,
            time: timeSeconds
        });
        
        // Get end screen elements from HTML
        const endScreen = document.getElementById('endScreen');
        const endContent = document.getElementById('endContent');
        
        if (isLastLevel) {
            // Build HTML table showing all level completion times
            let timesHTML = '<table class="times-table"><tr><th>Level</th><th>Time</th></tr>';
            let totalTime = 0;
            
            // Add row for each completed level
            this.levelTimes.forEach(levelTime => {
                timesHTML += `<tr><td>Level ${levelTime.level}</td><td>${levelTime.time}s</td></tr>`;
                totalTime += levelTime.time;  // Sum all times
            });
            
            // Add total row at bottom
            timesHTML += `<tr class="total-row"><td>Total</td><td>${totalTime}s</td></tr></table>`;
            
            // Show game completion message with times table
            endContent.innerHTML = `
                <h2>🎉 GAME COMPLETED! 🎉</h2>
                <p>You've completed all ${this.totalLevels} levels!</p>
                <h3>📊 Level Times:</h3>
                ${timesHTML}
                <p class="time-display">Great job! Well done!</p>
            `;
            document.getElementById('nextLevelBtn').textContent = 'Play Again';
        } else {
            // Show single level completion message
            endContent.innerHTML = `
                <h2>✅ Level ${currentLevelNum} Complete!</h2>
                <p>Time: ${timeSeconds}s</p>
                <p>Level ${currentLevelNum} of ${this.totalLevels}</p>
            `;
            document.getElementById('nextLevelBtn').textContent = 'Next Level (Press Enter or Click)';
        }
        
        // Display end screen overlay
        endScreen.style.display = 'flex';
    }
    
    /**
     * Handle progression to next level or restart game
     * Called when player clicks "Next Level" button or presses Enter on end screen
     */
    proceedToNextLevel() {
        // Hide end screen and resume gameplay
        const endScreen = document.getElementById('endScreen');
        endScreen.style.display = 'none';
        this.showingEndScreen = false;
        
        // Check if all levels are completed
        const isLastLevel = this.currentLevelIndex === this.totalLevels - 1;
        
        if (isLastLevel) {
            // Game is complete - reset to first level and clear level times for new game
            this.currentLevelIndex = 0;
            this.levelTimes = [];  // Clear previous game's times
            this.switchMaze(0);
            document.getElementById('mazeSelect').value = '0';
        } else {
            // Load next level
            this.currentLevelIndex++;
            this.switchMaze(this.currentLevelIndex);
            document.getElementById('mazeSelect').value = String(this.currentLevelIndex);
        }
    }
}

// ============================================
// GAME INITIALIZATION
// ============================================
// Start the game when HTML document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create and start new game instance using default starting level
    const game = new MazeGame('mazeCanvas', DEFAULT_MAZE_INDEX);
});

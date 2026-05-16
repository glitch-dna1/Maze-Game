// ============================================
// GAME CONFIGURATION
// ============================================

const GAME_CONFIG = {
    // Cell size in pixels
    cellSize: 40,
    
    // Player movement speed (pixels per frame)
    playerSpeed: 5,
    
    // Colors configuration
    colors: {
        wall: '#2C3E50',
        path: '#ECF0F1',
        player: '#3498DB',
        playerBorder: '#2980B9',
        start: '#2ECC71',
        end: '#E74C3C',
        border: '#000000'
    },
    
    // Visual settings
    playerRadius: null,  // Set to null to auto-calculate (1/3 of cellSize)
    wallThickness: 2,
    
    // Game behavior
    allowDiagonalMovement: false
};

// Auto-calculate player radius if not set
if (GAME_CONFIG.playerRadius === null) {
    GAME_CONFIG.playerRadius = GAME_CONFIG.cellSize / 3;
}

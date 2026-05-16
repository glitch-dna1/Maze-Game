# 🎮 Maze Game v2

An interactive **grid-based maze game** with **5 progressive levels**, automatic level progression, and **easily customizable maze designs**.

## Features

✅ **Grid-based movement** - Player moves cell-by-cell (stays centered in cells)
✅ **5 progressively complex levels** - Automatically load from mazes.js
✅ **End screen system** - Shows completion time after each level
✅ **Auto-progression** - Press Enter/Click to move to next level
✅ **Game completion screen** - Special message when all levels are completed
✅ **Automatic level counting** - No hardcoding, calculates from mazes.js
✅ **Smooth controls** - 100ms movement for precise gameplay
✅ **Responsive design** - Works on desktop and mobile

## How to Play

1. Open `index.html` in a web browser
2. Use **Arrow Keys** or **WASD** to move through the maze
3. Reach the **red square** to complete the level
4. When you finish a level, an end screen appears showing your time
5. Press **Enter**, **Space**, or click **"Next Level"** button to proceed
6. After completing all 5 levels, you'll see a "Game Completed!" message
7. The game restarts from Level 1

### Color Legend
- 🟢 **Green** = Start position
- 🔴 **Red** = Goal (reach to win)
- 🟦 **Blue** = Your player
- ⬛ **Dark Gray** = Walls (blocks)
- ⬜ **Light Gray** = Paths (walkable)

## File Structure

```
v2/
├── index.html         - Main HTML with UI
├── style.css          - Game styling & animations
├── config.js          - Game settings (speed, colors, sizes)
├── mazes.js           - Level definitions (EASY TO MODIFY!)
├── game.js            - Core game logic & progression
└── README.md          - This file
```

## 🛠️ Customizing Mazes

### Changing Existing Levels

Open `mazes.js` and edit any level's `layout` array:

```javascript
level_1: {
    layout: [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 0, 0, 0, 1],  // 2 = start, 0 = path
        [1, 0, 1, 1, 1, 0, 1],  // 1 = wall
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 3, 1],  // 3 = goal/end
        [1, 1, 1, 1, 1, 1, 1]
    ]
}
```

### Adding New Levels

Just add a new level object to the `MAZES` object:

```javascript
const MAZES = {
    level_1: { /* ... */ },
    level_2: { /* ... */ },
    // ... existing levels ...
    
    level_6: {  // New level automatically detected!
        layout: [
            [1, 1, 1, 1, 1],
            [1, 2, 0, 0, 1],
            [1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 3, 1]
        ]
    }
};
```

**Important:** The game automatically detects all levels and counts them. No need to update HTML or config files!

### Maze Design Rules

- **Use only 4 values:** `0`, `1`, `2`, `3`
- **Exactly one `2`:** Starting position (required)
- **Exactly one `3`:** Goal position (required)
- **Surround with `1`s:** Create a border of walls
- **Use `0` for paths:** Walkable areas
- **Use `1` for walls:** Obstacles

### Tips for Good Mazes

1. **Increase difficulty gradually** - Level 1 small, Level 5 larger/more complex
2. **Create unique paths** - Mix corridors, dead ends, and open areas
3. **Avoid trivial solutions** - Make players think about their route
4. **Test it first** - Always check that mazes are solvable!

## ⚙️ Game Configuration

Edit `config.js` to customize gameplay:

```javascript
const GAME_CONFIG = {
    cellSize: 40,           // Size of each maze cell (pixels)
    playerSpeed: 5,         // NOT USED (grid-based movement)
    
    colors: {
        wall: '#2C3E50',    // Wall color
        path: '#ECF0F1',    // Path/background
        player: '#3498DB',  // Player circle
        playerBorder: '#2980B9',  // Player outline
        start: '#2ECC71',   // Start cell
        end: '#E74C3C',     // Goal cell
        border: '#000000'   // Canvas border
    },
    
    allowDiagonalMovement: false  // Currently not used
};
```

### Changing Movement Speed

Edit `game.js` in the `initPlayer()` method:

```javascript
this.moveDelay = 100;  // milliseconds between moves
// Lower = faster (e.g., 50ms)
// Higher = slower (e.g., 200ms)
```

## 🎮 Game Mechanics

### Level Progression
- **Total levels:** Automatically calculated from `mazes.js`
- **Current level:** Shown in end screen (e.g., "Level 1 of 5")
- **Auto-progression:** After reaching goal, end screen waits for input
- **Input methods:** Enter key, Space bar, or click "Next Level" button

### Player Movement
- **Grid-based:** Moves exactly one cell at a time
- **100ms delay:** Between each move for precise control
- **No wall collision:** Can't move into walls, stays in current cell
- **Immediate direction change:** Responds to new input on next tick

### Win Condition
- **Goal reached:** When player's grid position matches goal position
- **Timer stops:** Shows elapsed time on end screen
- **Level progression:** Waits for user input before proceeding

## 📊 Current Levels

| Level | Difficulty | Size | Features |
|-------|-----------|------|----------|
| Level 1 | Easy | 11x12 | Basic maze, few branching paths |
| Level 2 | Easy-Medium | 13x12 | More open areas, more choices |
| Level 3 | Medium | 15x12 | Complex layout, multiple dead ends |
| Level 4 | Medium | 17x12 | Wider maze, intricate passages |
| Level 5 | Hard | 19x12 | Largest maze, most complex paths |

## 🐛 Troubleshooting

**Game won't load?**
- Check browser console (F12) for errors
- Ensure all script files are in the same folder
- Verify maze has both start (2) and goal (3)

**Player stuck in walls?**
- Check maze layout for incorrect values
- Ensure walls (1) properly block paths
- Verify start position (2) is not surrounded by walls

**Level won't change?**
- Make sure mazes.js has valid syntax
- Verify level keys match in both files
- Check browser console for JavaScript errors

**Movement feels wrong?**
- Adjust `moveDelay` in game.js
- Try different `cellSize` values
- Check keyboard responsiveness

## 📝 Level Design Guidelines

### Recommended Sizes
- **Easy:** 7-9 wide × 8-10 tall
- **Medium:** 11-15 wide × 10-14 tall  
- **Hard:** 15-21 wide × 12-16 tall

### Balanced Difficulty
1. **Open sections:** Let players explore
2. **Dead ends:** Create decision points
3. **Tight corridors:** Add challenge
4. **One clear path:** Ensure it's always solvable

### Example: Simple 5×5 Maze
```javascript
simple: {
    layout: [
        [1, 1, 1, 1, 1],
        [1, 2, 0, 0, 1],  // Start top-left
        [1, 0, 1, 0, 1],  // Walls in middle
        [1, 0, 0, 0, 1],  // Open bottom
        [1, 1, 1, 3, 1]   // Goal bottom-right
    ]
}
```

## 🎯 Next Steps

1. **Test the game** - Open `index.html` and play all 5 levels
2. **Modify levels** - Edit `mazes.js` to change difficulty or paths
3. **Add new levels** - Create level_6, level_7, etc.
4. **Customize colors** - Update `config.js` for your preferred theme
5. **Adjust speed** - Change `moveDelay` for your preferred pace

## 📄 License

Free to use and modify!

---

**Happy maze playing! 🎮**

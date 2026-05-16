# 🎮 Maze Game

A simple, configurable maze game built with HTML, CSS, and JavaScript.

## 🎯 Features

- **Easily Configurable Maze Design** - Modify maze layouts directly in `config.js`
- **Multiple Difficulty Levels** - Easy, Medium, and Hard mazes included
- **Timer System** - Track how long it takes to complete the maze
- **Smooth Player Movement** - Responsive controls with arrow keys or WASD
- **Win Detection** - Automatic celebration when you reach the goal
- **Responsive Design** - Works on desktop and mobile devices

## 📁 Project Structure

```
Maze-Game/
├── index.html      # Main HTML file
├── style.css       # Styling and layout
├── game.js         # Game logic and engine
├── config.js       # Maze configuration (CUSTOMIZE HERE)
└── README.md       # This file
```

## 🕹️ How to Play

1. Open `index.html` in your web browser
2. Use **Arrow Keys** or **WASD** to navigate through the maze
3. Reach the **red square** (goal) to complete the level
4. Click **Reset Game** to restart anytime

## 🛠️ How to Configure the Maze

### Method 1: Edit the Default Maze

Open `config.js` and modify the `MAZE_CONFIG.layout` array:

```javascript
const MAZE_CONFIG = {
    layout: [
        [1, 1, 1, 1, 1],
        [1, 2, 0, 3, 1],
        [1, 1, 1, 1, 1]
    ],
    // ... other settings
};
```

### Maze Legend

- `0` = Walkable path (white)
- `1` = Wall (dark gray)
- `2` = Start position (green) - Player spawns here
- `3` = End position (red) - Goal to reach

### Method 2: Use Pre-configured Mazes

Commented maze layouts are provided in `config.js`:
- `EASY_MAZE` - Small 6x7 maze
- `MEDIUM_MAZE` - Medium 7x10 maze
- `HARD_MAZE` - Large 12x20 complex maze

To use them, uncomment the layout and replace `MAZE_CONFIG.layout`:

```javascript
// Uncomment one of these
MAZE_CONFIG.layout = EASY_MAZE;
// MAZE_CONFIG.layout = MEDIUM_MAZE;
// MAZE_CONFIG.layout = HARD_MAZE;
```

## ⚙️ Game Settings

Customize game behavior in `config.js`:

```javascript
const MAZE_CONFIG = {
    cellSize: 40,           // Size of each cell in pixels (larger = bigger maze)
    playerSpeed: 5,         // Movement speed (higher = faster)
    
    colors: {
        wall: '#2C3E50',    // Wall color
        path: '#ECF0F1',    // Path color
        player: '#3498DB',  // Player color (blue circle)
        start: '#2ECC71',   // Start position color
        end: '#E74C3C',     // End position color
        border: '#000000'   // Border color
    }
};
```

## 🎨 Creating a Custom Maze

1. Decide on dimensions (rows and columns)
2. Create a 2D array where:
   - Surround with `1` for borders
   - Use `0` for paths
   - Place exactly one `2` for start
   - Place exactly one `3` for end
3. Paste it into `config.js` and load it

### Example: Simple 5x5 Maze

```javascript
const MY_CUSTOM_MAZE = [
    [1, 1, 1, 1, 1],
    [1, 2, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 3, 1],
    [1, 1, 1, 1, 1]
];

// Use it:
MAZE_CONFIG.layout = MY_CUSTOM_MAZE;
```

## 🚀 Tips for Maze Design

- **Keep Start and End Apart** - Too close makes it too easy
- **Balance Paths** - Mix wide corridors with tight passages
- **Add Loops** - Circular paths make navigation trickier
- **Test Solvability** - Make sure there's always a path to the end
- **Use Symmetry** (optional) - Creates interesting visual patterns

## 🔧 Technical Details

- **Canvas-based Rendering** - Smooth performance
- **Pixel-perfect Collision Detection** - Accurate player movement
- **Configurable Cell Size** - Scale the entire maze easily
- **No Dependencies** - Pure JavaScript, works anywhere

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 📝 License

Feel free to use and modify this game for personal or educational purposes.

---

**Enjoy the game! Happy maze solving! 🎉**

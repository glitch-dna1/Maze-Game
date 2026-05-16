# 🎮 Maze Game v2

An interactive maze game with **easily customizable maze designs**.

## Features

✅ Multiple difficulty levels (Easy, Medium, Hard)
✅ Smooth player movement with collision detection
✅ Timer and win condition
✅ Maze selector to switch between different mazes
✅ Clean, modular code structure
✅ **Super easy to modify maze designs**

## File Structure

```
v2/
├── index.html      - Main HTML file with game interface
├── style.css       - Game styling and responsive design
├── config.js       - Game settings (speed, colors, sizes)
├── mazes.js        - All maze definitions (EASY TO MODIFY!)
├── game.js         - Core game logic and rendering
└── README.md       - This file
```

## How to Play

1. Open `index.html` in a web browser
2. Select a maze from the dropdown menu
3. Use **Arrow Keys** or **WASD** to move
4. Reach the **red square** to win!
5. Click **Reset Game** to restart

## 🛠️ How to Customize Mazes

### Adding a New Maze

Open `mazes.js` and add a new maze definition to the `MAZES` object:

```javascript
const MAZES = {
    // ... existing mazes ...
    
    my_custom_maze: {
        name: 'My Custom Maze',
        layout: [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 2, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 3, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ]
    }
};
```

### Maze Layout Guide

Each maze is a 2D array where each number represents:

- **`0`** = Walkable path (white)
- **`1`** = Wall (dark gray)
- **`2`** = Start position (green) - where player spawns
- **`3`** = End position (red) - goal to reach

### Tips for Designing Mazes

1. **Border with walls**: Surround your maze with `1`s for a border
2. **One start and one end**: Make sure you have exactly one `2` and one `3`
3. **Paths**: Use `0` for walkable areas
4. **Test it**: Save and refresh to see your maze in action
5. **Vary difficulty**: More walls = harder maze, more open paths = easier

### Examples

**Simple 5x5 Maze:**
```javascript
simple: {
    name: 'Simple 5x5',
    layout: [
        [1, 1, 1, 1, 1],
        [1, 2, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 3, 1]
    ]
}
```

## 🎨 Customizing Colors & Settings

Edit `config.js` to change game behavior:

```javascript
const GAME_CONFIG = {
    cellSize: 40,           // Size of each maze cell (pixels)
    playerSpeed: 5,         // Movement speed
    
    colors: {
        wall: '#2C3E50',    // Wall color
        path: '#ECF0F1',    // Path color
        player: '#3498DB',  // Player color
        start: '#2ECC71',   // Start marker (green)
        end: '#E74C3C',     // End marker (red)
    },
    
    allowDiagonalMovement: false  // Allow moving diagonally?
};
```

## 🚀 How to Use as Default Maze

In `mazes.js`, change the `DEFAULT_MAZE` variable:

```javascript
// At the bottom of mazes.js
const DEFAULT_MAZE = 'my_custom_maze';  // Change to your maze key
```

Then update `index.html` to add your maze to the selector:

```html
<select id="mazeSelect">
    <option value="my_custom_maze" selected>My Custom Maze</option>
    <!-- ... other mazes ... -->
</select>
```

## 📊 Recommended Maze Sizes

- **Small:** 7-9 cells wide x 8-10 cells tall
- **Medium:** 11-15 cells wide x 12-14 cells tall
- **Large:** 15-21 cells wide x 12-16 cells tall

## 🐛 Troubleshooting

**Game won't load?**
- Check browser console for errors
- Make sure all script files are loaded in the correct order
- Verify your maze has both a start (2) and end (3)

**Player can move through walls?**
- Check your maze layout for incorrect values
- Make sure you're only using 0, 1, 2, or 3

**Maze not appearing in selector?**
- Add it to the `<select>` dropdown in `index.html`
- Make sure the value matches the key in `mazes.js`

## 📝 License

Free to use and modify!

---

**Happy maze designing! 🎮**

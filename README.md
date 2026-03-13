# 🍄 New 1-UP

A fun, retro-styled browser game built with vanilla HTML, CSS, and JavaScript. Catch falling mushrooms to score points and earn extra lives!

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🎮 How to Play

1. Press **Start Game** to begin.
2. Use the **← →** arrow keys (or **A / D**) to move your basket.
3. Catch falling 🍄 mushrooms to earn **10 points** each.
4. Every **100 points** you earn a **1-UP** (extra life).
5. Miss a mushroom and you **lose a life**.
6. The game ends when all lives are gone.

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- (Optional) [Node.js](https://nodejs.org/) for the local dev server

### Run Locally

**Option A — open the file directly:**

```bash
open src/index.html      # macOS
xdg-open src/index.html  # Linux
start src/index.html      # Windows
```

**Option B — use the dev server:**

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
new-1up/
├── src/
│   ├── css/
│   │   └── style.css       # Game styling
│   ├── js/
│   │   └── game.js         # Game logic
│   ├── assets/              # Images & sounds (add your own!)
│   └── index.html           # Entry point
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Ideas for Improvement

- [ ] Add sound effects (coin collect, game over)
- [ ] Add multiple mushroom types with different point values
- [ ] Implement difficulty levels (easy / medium / hard)
- [ ] Add mobile touch controls
- [ ] Track and display a leaderboard
- [ ] Add power-ups (speed boost, magnet, shield)
- [ ] Create a start-screen and animations

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
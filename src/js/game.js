(function () {
  "use strict";

  // --- DOM Elements ---
  var canvas = document.getElementById("game-canvas");
  var ctx = canvas.getContext("2d");
  var scoreEl = document.getElementById("score");
  var livesEl = document.getElementById("lives");
  var highScoreEl = document.getElementById("high-score");
  var startBtn = document.getElementById("start-btn");
  var resetBtn = document.getElementById("reset-btn");

  // --- Constants ---
  var PLAYER_WIDTH = 50;
  var PLAYER_HEIGHT = 16;
  var MUSHROOM_SIZE = 22;
  var INITIAL_LIVES = 3;
  var POINTS_PER_CATCH = 10;
  var EXTRA_LIFE_THRESHOLD = 100;
  var BASE_FALL_SPEED = 2;
  var SPAWN_INTERVAL_MS = 1200;
  var PLAYER_SPEED = 6;

  // --- Game State ---
  var state = {
    running: false,
    score: 0,
    lives: INITIAL_LIVES,
    highScore: loadHighScore(),
    playerX: 0,
    mushrooms: [],
    keys: {},
    animationId: null,
    spawnTimer: null,
    nextExtraLife: EXTRA_LIFE_THRESHOLD,
  };

  // --- High-score persistence ---
  function loadHighScore() {
    try {
      return parseInt(localStorage.getItem("new1up_highscore"), 10) || 0;
    } catch (_e) {
      return 0;
    }
  }

  function saveHighScore(val) {
    try {
      localStorage.setItem("new1up_highscore", val);
    } catch (_e) {
      /* storage unavailable */
    }
  }

  // --- Helpers ---
  function resetState() {
    state.score = 0;
    state.lives = INITIAL_LIVES;
    state.mushrooms = [];
    state.playerX = (canvas.width - PLAYER_WIDTH) / 2;
    state.nextExtraLife = EXTRA_LIFE_THRESHOLD;
    updateUI();
  }

  function updateUI() {
    scoreEl.textContent = state.score;
    livesEl.textContent = state.lives;
    highScoreEl.textContent = state.highScore;
  }

  // --- Spawn mushroom ---
  function spawnMushroom() {
    if (!state.running) return;
    var x = Math.random() * (canvas.width - MUSHROOM_SIZE);
    state.mushrooms.push({ x: x, y: -MUSHROOM_SIZE });
  }

  // --- Drawing ---
  function drawPlayer() {
    ctx.fillStyle = "#e94560";
    ctx.beginPath();
    // Draw a small "basket" shape
    ctx.moveTo(state.playerX, canvas.height - 4);
    ctx.lineTo(state.playerX + PLAYER_WIDTH, canvas.height - 4);
    ctx.lineTo(state.playerX + PLAYER_WIDTH - 8, canvas.height - PLAYER_HEIGHT);
    ctx.lineTo(state.playerX + 8, canvas.height - PLAYER_HEIGHT);
    ctx.closePath();
    ctx.fill();
  }

  function drawMushroom(m) {
    ctx.font = MUSHROOM_SIZE + "px serif";
    ctx.textBaseline = "top";
    ctx.fillText("🍄", m.x, m.y);
  }

  // --- Game loop ---
  function tick() {
    if (!state.running) return;

    // Move player
    if (state.keys["ArrowLeft"] || state.keys["a"]) {
      state.playerX = Math.max(0, state.playerX - PLAYER_SPEED);
    }
    if (state.keys["ArrowRight"] || state.keys["d"]) {
      state.playerX = Math.min(
        canvas.width - PLAYER_WIDTH,
        state.playerX + PLAYER_SPEED
      );
    }

    // Speed increases slightly with score
    var fallSpeed = BASE_FALL_SPEED + state.score / 200;

    // Move & check mushrooms
    var alive = [];
    for (var i = 0; i < state.mushrooms.length; i++) {
      var m = state.mushrooms[i];
      m.y += fallSpeed;

      // Caught?
      if (
        m.y + MUSHROOM_SIZE >= canvas.height - PLAYER_HEIGHT &&
        m.x + MUSHROOM_SIZE >= state.playerX &&
        m.x <= state.playerX + PLAYER_WIDTH
      ) {
        state.score += POINTS_PER_CATCH;
        // Extra life check
        if (state.score >= state.nextExtraLife) {
          state.lives++;
          state.nextExtraLife += EXTRA_LIFE_THRESHOLD;
        }
        updateUI();
        continue;
      }

      // Missed?
      if (m.y > canvas.height) {
        state.lives--;
        updateUI();
        if (state.lives <= 0) {
          endGame();
          return;
        }
        continue;
      }

      alive.push(m);
    }
    state.mushrooms = alive;

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    for (var j = 0; j < state.mushrooms.length; j++) {
      drawMushroom(state.mushrooms[j]);
    }

    state.animationId = requestAnimationFrame(tick);
  }

  // --- Start / End ---
  function startGame() {
    if (state.running) return;
    resetState();
    state.running = true;
    startBtn.textContent = "Playing…";
    startBtn.disabled = true;
    state.spawnTimer = setInterval(spawnMushroom, SPAWN_INTERVAL_MS);
    tick();
  }

  function endGame() {
    state.running = false;
    cancelAnimationFrame(state.animationId);
    clearInterval(state.spawnTimer);
    startBtn.textContent = "Start Game";
    startBtn.disabled = false;

    if (state.score > state.highScore) {
      state.highScore = state.score;
      saveHighScore(state.highScore);
    }
    updateUI();

    // Game-over message on canvas
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e94560";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillStyle = "#eaeaea";
    ctx.font = "20px sans-serif";
    ctx.fillText(
      "Score: " + state.score,
      canvas.width / 2,
      canvas.height / 2 + 20
    );
  }

  // --- Event Listeners ---
  document.addEventListener("keydown", function (e) {
    state.keys[e.key] = true;
  });

  document.addEventListener("keyup", function (e) {
    state.keys[e.key] = false;
  });

  startBtn.addEventListener("click", startGame);
  resetBtn.addEventListener("click", function () {
    state.running = false;
    cancelAnimationFrame(state.animationId);
    clearInterval(state.spawnTimer);
    resetState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startBtn.textContent = "Start Game";
    startBtn.disabled = false;
  });

  // --- Init ---
  resetState();
})();

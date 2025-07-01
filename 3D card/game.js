const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  speed: 5,
  color: "#0f0"
};

let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
  ctx.fillStyle = "#ff0";
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function drawEnemies() {
  ctx.fillStyle = "#f00";
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function moveBullets() {
  bullets.forEach(bullet => bullet.y -= bullet.speed);
  bullets = bullets.filter(bullet => bullet.y > 0);
}

function moveEnemies() {
  enemies.forEach(enemy => enemy.y += enemy.speed);
  enemies = enemies.filter(enemy => enemy.y < canvas.height);
}

function spawnEnemy() {
  const width = 40;
  const height = 40;
  const x = Math.random() * (canvas.width - width);
  enemies.push({
    x,
    y: -height,
    width,
    height,
    speed: 2 + Math.random() * 2
  });
}

function checkCollisions() {
  // Bullet hits enemy
  bullets.forEach((bullet, bIdx) => {
    enemies.forEach((enemy, eIdx) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        bullets.splice(bIdx, 1);
        enemies.splice(eIdx, 1);
        score += 1;
      }
    });
  });

  // Enemy hits player
  enemies.forEach(enemy => {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      gameOver = true;
    }
  });
}

function drawGameOver() {
  ctx.fillStyle = "#fff";
  ctx.font = "40px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 110, canvas.height / 2);
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, canvas.width / 2 - 45, canvas.height / 2 + 40);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawScore();
    moveBullets();
    moveEnemies();
    checkCollisions();
    requestAnimationFrame(gameLoop);
  } else {
    drawGameOver();
  }
}

let keys = {};
document.addEventListener("keydown", e => {
  keys[e.code] = true;
  // Shoot
  if (e.code === "Space" && !gameOver) {
    bullets.push({
      x: player.x + player.width / 2 - 4,
      y: player.y,
      width: 8,
      height: 16,
      speed: 7
    });
  }
});
document.addEventListener("keyup", e => {
  keys[e.code] = false;
});

function handleInput() {
  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }
}

setInterval(() => {
  if (!gameOver) spawnEnemy();
}, 900);

function mainLoop() {
  handleInput();
  requestAnimationFrame(mainLoop);
}
mainLoop();
gameLoop();
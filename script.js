// Secret values
const SECRET_CONFESS_DATE = "1";
const SECRET_RELATION_DATE = "1";
const SECRET_NAME = "Nailong";

// Pages
const pages = {
  loading: document.getElementById("loading-screen"),
  brankas: document.getElementById("brankas-page"),
  surat: document.getElementById("surat-page"),
  game: document.getElementById("game-page"),
  end: document.getElementById("end-page"),
};

// Background handler
function applyBackground() {
  let bg = "bg-dekstop.png";
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    bg = "bg-mobile.png";
  }
  document.body.style.backgroundImage = `url('${bg}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
}

function clearBackground() {
  document.body.style.backgroundImage = "none";
  document.body.style.backgroundColor = "black";
}

// Page switcher
function showPage(page) {
  for (let key in pages) pages[key].classList.remove("active");
  pages[page].classList.add("active");

  if (page === "brankas" || page === "surat") {
    applyBackground();
  } else {
    clearBackground();
  }
}

// Loading screen -> Brankas
setTimeout(() => {
  showPage("brankas");
}, 2000);

// Unlock button
document.getElementById("unlock-btn").addEventListener("click", () => {
  const cDate = document.getElementById("confess-date").value.trim();
  const rDate = document.getElementById("relation-date").value.trim();
  const name = document.getElementById("partner-name").value.trim();

  if (
    cDate === SECRET_CONFESS_DATE &&
    rDate === SECRET_RELATION_DATE &&
    name.toLowerCase() === SECRET_NAME.toLowerCase()
  ) {
    // Animasi pintu brankas
    const door = document.getElementById("brankas-door");
    door.classList.add("open");
    setTimeout(() => {
      showPage("surat");
      document.getElementById("bg-music").play().catch(() => {});
    }, 2000); // ⏳ tunggu animasi 2 detik
  } else {
    document.getElementById("error-msg").innerText =
      "Jawaban salah, coba lagi!";
  }
});

// Play game button
document.getElementById("play-game-btn").addEventListener("click", () => {
  showPage("game");
  startGame();
});

// Retry & Back buttons
document.getElementById("retry-btn").addEventListener("click", () => {
  showPage("game");
  startGame();
});
document.getElementById("back-btn").addEventListener("click", () => {
  showPage("brankas");
});
// ======== TETRIS GAME SCRIPT ========

// Ambil canvas
const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(20, 20);

// Arena (papan permainan)
function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

const arena = createMatrix(12, 20);

// Shape balok Tetris
function createPiece(type) {
  if (type === "T") {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === "O") {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === "L") {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === "J") {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === "I") {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === "S") {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === "Z") {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
}

// Warna tiap piece
const colors = [
  null,
  "#FF0D72",
  "#0DC2FF",
  "#0DFF72",
  "#F538FF",
  "#FF8E0D",
  "#FFE138",
  "#3877FF",
];

// Player (balok aktif)
const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  score: 0,
};

// Cek tabrakan
function collide(arena, player) {
  const m = player.matrix;
  const o = player.pos;
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
          (arena[y + o.y] &&
           arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

// Merge balok ke arena
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

// Hapus baris penuh
function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y >= 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    y++;
    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

// Gambar balok
function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

// Gambar semua
function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

// Drop balok
function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

// Geser balok
function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

// Rotasi balok
function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

// Reset balok baru
function playerReset() {
  const pieces = "TJLOSZI";
  player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
  player.pos.y = 0;
  player.pos.x = ((arena[0].length / 2) | 0) -
                 ((player.matrix[0].length / 2) | 0);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

// Update score
function updateScore() {
  document.getElementById("score").innerText = player.score;
}

// Loop game
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}

// ======== CONTROL ========

// Start game
function startGame() {
  playerReset();
  updateScore();
  update();
}

// Keyboard
document.addEventListener("keydown", event => {
  if (event.keyCode === 37) {
    playerMove(-1);
  } else if (event.keyCode === 39) {
    playerMove(1);
  } else if (event.keyCode === 40) {
    playerDrop();
  } else if (event.keyCode === 81) {
    playerRotate(-1);
  } else if (event.keyCode === 87) {
    playerRotate(1);
  }
});

// 🎮 Mobile Controls
function moveLeft() { playerMove(-1); }
function moveRight() { playerMove(1); }
function rotate() { playerRotate(); }
function drop() { playerDrop(); }


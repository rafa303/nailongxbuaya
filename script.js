// Secret values
const SECRET_CONFESS_DATE = "26/06/2025";
const SECRET_RELATION_DATE = "09/08/2025";
const SECRET_NAME = "Rafa";

// Pages
const pages = {
  loading: document.getElementById("loading-screen"),
  brankas: document.getElementById("brankas-page"),
  surat: document.getElementById("surat-page"),
  game: document.getElementById("game-page"),
  end: document.getElementById("end-page"),
};

// ---------------- Background loader ----------------
function applyBackground() {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const src = isMobile ? "bg-mobile.png" : "bg-dekstop.png";

  document.body.style.backgroundImage = `url('${src}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
}

// Panggil applyBackground() di awal skrip agar loading screen juga memiliki latar belakang
applyBackground();

// Page switching
function showPage(page) {
  for (let key in pages) pages[key].classList.remove("active");
  pages[page].classList.add("active");

  if (page === "brankas" || page === "surat") {
    applyBackground();
  } else {
    // Pada halaman game dan end, latar belakang akan dihilangkan
  }
}

// initial flow: loading -> brankas
setTimeout(() => {
  showPage("brankas");
}, 2000);

// ---------------- Vault unlock ----------------
document.getElementById("unlock-btn").addEventListener("click", () => {
  const cDate = document.getElementById("confess-date").value.trim();
  const rDate = document.getElementById("relation-date").value.trim();
  const name = document.getElementById("partner-name").value.trim();

  if (
    cDate === SECRET_CONFESS_DATE &&
    rDate === SECRET_RELATION_DATE &&
    name.toLowerCase() === SECRET_NAME.toLowerCase()
  ) {
    // Animasi pintu brankas (CSS .open)
    const door = document.getElementById("brankas-door");
    door.classList.add("open");
    setTimeout(() => {
      showPage("surat");
      // try play audio (may require user gesture on some browsers)
      const bgAudio = document.getElementById("bg-music");
      if (bgAudio) bgAudio.play().catch(()=>{});
    }, 1400); // singkat saja; sesuaikan animasi CSS jika perlu
  } else {
    document.getElementById("error-msg").innerText = "Jawaban salah, coba lagi!";
  }
});

// go to game from surat
document.getElementById("play-game-btn").addEventListener("click", () => {
  showPage("game");
  startGame();
});

// Retry & Back buttons on End page
document.getElementById("retry-btn").addEventListener("click", () => {
  showPage("game");
  startGame();
});
document.getElementById("back-btn").addEventListener("click", () => {
  showPage("brankas");
});

// ---------------- TETRIS GAME SCRIPT ----------------
const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(20, 20);

// Arena
function createMatrix(w, h) {
  const matrix = [];
  while (h--) matrix.push(new Array(w).fill(0));
  return matrix;
}
const arena = createMatrix(12, 20);

// Pieces
function createPiece(type) {
  if (type === "T") return [[0,0,0],[1,1,1],[0,1,0]];
  if (type === "O") return [[2,2],[2,2]];
  if (type === "L") return [[0,3,0],[0,3,0],[0,3,3]];
  if (type === "J") return [[0,4,0],[0,4,0],[4,4,0]];
  if (type === "I") return [[0,5,0,0],[0,5,0,0],[0,5,0,0],[0,5,0,0]];
  if (type === "S") return [[0,6,6],[6,6,0],[0,0,0]];
  if (type === "Z") return [[7,7,0],[0,7,7],[0,0,0]];
}

const colors = [null,"#FF0D72","#0DC2FF","#0DFF72","#F538FF","#FF8E0D","#FFE138","#3877FF"];

// Player
const player = { pos:{x:0,y:0}, matrix:null, score:0 };

// Collision
function collide(arena, player) {
  const m = player.matrix;
  const o = player.pos;
  for (let y=0;y<m.length;y++){
    for (let x=0;x<m[y].length;x++){
      if (m[y][x] !== 0 && (arena[y+o.y] && arena[y+o.y][x+o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

// Merge
function merge(arena, player) {
  player.matrix.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

// Sweep
function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y >= 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) continue outer;
    }
    const row = arena.splice(y,1)[0].fill(0);
    arena.unshift(row);
    y++;
    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

// Draw helpers
function drawMatrix(matrix, offset) {
  matrix.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if (value !== 0){
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}
function draw() {
  context.fillStyle = "#000";
  context.fillRect(0,0,canvas.width,canvas.height);
  drawMatrix(arena, {x:0,y:0});
  if (player.matrix) drawMatrix(player.matrix, player.pos);
}

// Drop
function playerDrop(){
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    arenaSweep();
    updateScore();
    playerReset();
  }
  dropCounter = 0;
}

// Move
function playerMove(dir){
  player.pos.x += dir;
  if (collide(arena, player)) player.pos.x -= dir;
}

// ---- rename matrix-rotation to avoid name collision with UI rotate() ----
function rotateMatrix(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) matrix.forEach(row => row.reverse());
  else matrix.reverse();
}

function playerRotate(dir){
  const pos = player.pos.x;
  let offset = 1;
  rotateMatrix(player.matrix, dir);
  while (collide(arena, player)){
    player.pos.x += offset;
    offset = -(offset + (offset>0?1:-1));
    if (offset > player.matrix[0].length){
      rotateMatrix(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

// Reset (spawn)
function playerReset(){
  const pieces = "TJLOSZI";
  player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
  player.pos.y = 0;
  player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);

  if (collide(arena, player)){
    // GAME OVER
    document.getElementById("final-score").innerText = player.score;
    showPage("end");
    // clear arena for next start
    for (let y=0;y<arena.length;y++) arena[y].fill(0);
    return;
  }
}

// Score
function updateScore(){
  document.getElementById("score").innerText = player.score;
}

// Game loop variables
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0){
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) playerDrop();
  draw();
  // only continue loop if on game page
  if (pages.game.classList.contains("active")) requestAnimationFrame(update);
}

// Start
function startGame(){
  // reset arena & score
  for (let y=0;y<arena.length;y++) arena[y].fill(0);
  player.score = 0;
  updateScore();
  dropCounter = 0;
  lastTime = 0;
  playerReset();
  // kick off loop
  requestAnimationFrame(update);
}

// Keyboard controls
document.addEventListener("keydown", event=>{
  if (!pages.game.classList.contains("active")) return;
  if (event.key === "ArrowLeft") playerMove(-1);
  else if (event.key === "ArrowRight") playerMove(1);
  else if (event.key === "ArrowDown") playerDrop();
  else if (event.key === "q" || event.key === "Q") playerRotate(-1);
  else if (event.key === "w" || event.key === "W" || event.key === "ArrowUp") playerRotate(1);
});

// Mobile control wrappers (ke HTML onclick)
function moveLeft(){ playerMove(-1); }
function moveRight(){ playerMove(1); }
function rotate(){ playerRotate(1); } // rotate UI calls this
function drop(){ playerDrop(); }

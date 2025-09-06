
/* =====================
 - Simple romantic site with:
   - loading screen
   - vault page with background switching (phone/laptop)
   - inputs validation (change secrets below)
   - letter page with looping music
   - tetris classic game in-canvas
======================== */

/* ========== CONFIG: change these to the real secrets ========== */
const SECRET_CONFESS_DATE = "2020-01-01";
const SECRET_RELATION_DATE = "2020-02-14";
const SECRET_NAME = "Sayang";
/* ============================================================== */

// DOM
const loadingEl = document.getElementById('loading');
const appEl = document.getElementById('app');
const vaultEl = document.getElementById('vault');
const letterEl = document.getElementById('letter');
const gameEl = document.getElementById('gamepage');
const openBtn = document.getElementById('open-btn');
const hintBtn = document.getElementById('hint-btn');
const inputConfess = document.getElementById('input-confess');
const inputJadian = document.getElementById('input-jadian');
const inputName = document.getElementById('input-name');
const vaultPanel = document.querySelector('.vault-panel');
const vaultDoor = document.getElementById('vault-door');
const bgAudio = document.getElementById('bg-audio');

const letterTitle = document.getElementById('letter-title');
const letterBody = document.getElementById('letter-body');
const letterFrom = document.getElementById('letter-from');
const letterTo = document.getElementById('letter-to');
const toGameBtn = document.getElementById('to-game');
const backToVaultBtn = document.getElementById('back-to-vault');

const restartGameBtn = document.getElementById('restart-game');
const quitGameBtn = document.getElementById('quit-game');
const modal = document.getElementById('gameover');
const finalScoreEl = document.getElementById('final-score');
const modalRetry = document.getElementById('modal-retry');
const modalBack = document.getElementById('modal-back');
const scoreEl = document.getElementById('score');

// Apply background depending on device
function applyBackgrounds(){
  const isMobile = window.innerWidth <= 720;
  const img = isMobile ? 'assets/phone-bg.jpg' : 'assets/laptop-bg.jpg';
  // apply to vault panel and letter card pseudo via inline styles
  const beforeStyle = `url('${img}')`;
  // Use CSS variable via style property on pseudo not possible; so set background on elements directly
  document.querySelector('.vault-panel').style.backgroundImage = `linear-gradient(rgba(255,255,255,0.45), rgba(255,255,255,0.45)), ${beforeStyle}`;
  const letterCard = document.querySelector('.letter-card');
  if(letterCard) letterCard.style.backgroundImage = `linear-gradient(rgba(255,255,255,0.45), rgba(255,255,255,0.45)), ${beforeStyle}`;
}

// Loading sequence then show app
setTimeout(()=>{
  loadingEl.classList.add('hidden');
  appEl.classList.remove('hidden');
  applyBackgrounds();
}, 1400);

// Handle window resize to re-apply backgrounds
window.addEventListener('resize', applyBackgrounds);

// Vault open logic
openBtn.addEventListener('click', ()=>{
  const a = inputConfess.value.trim();
  const b = inputJadian.value.trim();
  const c = inputName.value.trim().toLowerCase();
  if(!a || !b || !c){ alert('Isi semua bidang dulu ya.'); return; }
  const ok = (a === SECRET_CONFESS_DATE) && (b === SECRET_RELATION_DATE) && (c === SECRET_NAME.toLowerCase());
  if(ok){
    // animate vault open
    document.querySelector('.vault-panel').classList.add('vault-open');
    // small delay then go to letter page
    setTimeout(()=>{
      showLetterPage();
    }, 1100);
  } else {
    // shake and hint
    vaultPanel.animate([{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:420});
    alert('Sepertinya salah. Coba ingat lagi moment kita : )');
  }
});

hintBtn.addEventListener('click', ()=>{
  alert('Hints: tanggal format YYYY-MM-DD. Kamu bisa ubah rahasianya di script.js (konstanta SECRET_...).');
});

function showLetterPage(){
  vaultEl.classList.add('hidden');
  letterEl.classList.remove('hidden');
  // set letter content (for now static; you can change below)
  letterTitle.innerText = 'Untukmu, sayang.';
  letterBody.innerHTML = `<p>Halo sayangku, ini cuma surat kecil untuk bilang aku rindu&nbsp;dan&nbsp;selalu memikirkanmu setiap hari. Semoga setiap detik yang kita lewati penuh tawa.&nbsp;💌</p><p>Jangan lupa senyum hari ini!</p>`;
  letterFrom.innerText = 'Aku';
  letterTo.innerText = 'Kamu';
  // apply background to letter card (re-apply)
  applyBackgrounds();
  // play music (muted autoplay may be blocked; require user gesture)
  try{ bgAudio.play().catch(()=>{}); }catch(e){}
}

backToVaultBtn.addEventListener('click', ()=>{
  letterEl.classList.add('hidden');
  vaultEl.classList.remove('hidden');
  // stop audio
  try{ bgAudio.pause(); bgAudio.currentTime=0; }catch(e){}
});

// ================== TETRIS GAME ===================
// A compact tetris implementation for canvas
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20,20);

const arena = createMatrix(12, 24);
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let player = {
  pos: {x:0,y:0},
  matrix: null,
  score:0
};

function createMatrix(w,h){
  const m = [];
  while(h--) m.push(new Array(w).fill(0));
  return m;
}

function createPiece(type){
  if(type === 'T') return [[0,0,0],[1,1,1],[0,1,0]];
  if(type === 'O') return [[2,2],[2,2]];
  if(type === 'L') return [[0,3,0],[0,3,0],[0,3,3]];
  if(type === 'J') return [[0,4,0],[0,4,0],[4,4,0]];
  if(type === 'I') return [[0,5,0,0],[0,5,0,0],[0,5,0,0],[0,5,0,0]];
  if(type === 'S') return [[0,6,6],[6,6,0],[0,0,0]];
  if(type === 'Z') return [[7,7,0],[0,7,7],[0,0,0]];
}

function drawMatrix(matrix, offset){
  matrix.forEach((row, y)=>{
    row.forEach((value, x)=>{
      if(value !== 0){
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function merge(arena, player){
  player.matrix.forEach((row, y)=>{
    row.forEach((value, x)=>{
      if(value !== 0){
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function collide(arena, player){
  const m = player.matrix;
  const o = player.pos;
  for(let y=0;y<m.length;y++){
    for(let x=0;x<m[y].length;x++){
      if(m[y][x] !== 0 && (arena[y+o.y] && arena[y+o.y][x+o.x]) !== 0){
        return true;
      }
    }
  }
  return false;
}

function playerDrop(){
  player.pos.y++;
  if(collide(arena, player)){
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

function playerMove(dir){
  player.pos.x += dir;
  if(collide(arena, player)) player.pos.x -= dir;
}

function rotate(matrix, dir){
  for(let y=0;y<matrix.length;y++){
    for(let x=0;x<y;x++){
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if(dir > 0) matrix.forEach(row => row.reverse());
  else matrix.reverse();
}

function playerRotate(dir){
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while(collide(arena, player)){
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if(offset > player.matrix[0].length){
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function playerReset(){
  const pieces = 'TJLOSZI';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  if(collide(arena, player)){
    arena.forEach(row => row.fill(0));
    gameOver();
  }
}

function arenaSweep(){
  let rowCount = 1;
  outer: for(let y = arena.length -1; y>0; --y){
    for(let x=0;x<arena[y].length;++x){
      if(arena[y][x] === 0) continue outer;
    }
    const row = arena.splice(y,1)[0].fill(0);
    arena.unshift(row);
    ++y;
    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

function updateScore(){
  scoreEl.innerText = player.score;
}

function draw(){
  context.fillStyle = '#0b1220';
  context.fillRect(0,0, canvas.width, canvas.height);
  drawMatrix(arena, {x:0,y:0});
  drawMatrix(player.matrix, player.pos);
}

function update(time = 0){
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if(dropCounter > dropInterval){
    playerDrop();
  }
  draw();
  if(!isGameOver) requestAnimationFrame(update);
}

// Colors (index matches matrix values)
const colors = [
  null,
  '#ff6b81', // T
  '#ffd166', // O
  '#f66bff', // L
  '#6bd4ff', // J
  '#ffb3c6', // I
  '#b3ffbb', // S
  '#d6b3ff'  // Z
];

// Controls
document.addEventListener('keydown', event => {
  if(isGameOver) return;
  if(event.keyCode === 37){ playerMove(-1); } // left
  else if(event.keyCode === 39){ playerMove(1); } // right
  else if(event.keyCode === 40){ playerDrop(); } // down
  else if(event.keyCode === 81){ playerRotate(-1); } // q
  else if(event.keyCode === 38 || event.keyCode === 87){ playerRotate(1); } // up or w
  else if(event.code === 'Space'){ hardDrop(); }
});

function hardDrop(){
  while(!collide(arena, player)){
    player.pos.y++;
  }
  player.pos.y--;
  merge(arena, player);
  playerReset();
  arenaSweep();
  updateScore();
}

// Game lifecycle
let isGameOver = false;
function startGame(){
  // reset arena and player
  for(let y=0;y<arena.length;y++) arena[y].fill(0);
  player.score = 0;
  updateScore();
  playerReset();
  dropInterval = 1000;
  isGameOver = false;
  modal.classList.add('hidden');
  requestAnimationFrame(update);
}

function gameOver(){
  isGameOver = true;
  finalScoreEl.innerText = player.score;
  modal.classList.remove('hidden');
  // stop audio to avoid overlap
  try{ bgAudio.pause(); }catch(e){}
}

restartGameBtn.addEventListener('click', ()=>{
  startGame();
  // ensure visible
  gameEl.classList.remove('hidden');
});

quitGameBtn.addEventListener('click', ()=>{
  // go back to vault
  gameEl.classList.add('hidden');
  vaultEl.classList.remove('hidden');
  // stop and reset audio
  try{ bgAudio.pause(); bgAudio.currentTime = 0; }catch(e){}
});

modalRetry.addEventListener('click', ()=>{
  modal.classList.add('hidden');
  startGame();
  // try resume audio
  try{ bgAudio.play().catch(()=>{}); }catch(e){};
});
modalBack.addEventListener('click', ()=>{
  modal.classList.add('hidden');
  gameEl.classList.add('hidden');
  vaultEl.classList.remove('hidden');
});

toGameBtn.addEventListener('click', ()=>{
  letterEl.classList.add('hidden');
  gameEl.classList.remove('hidden');
  // start tetris
  startGame();
  try{ bgAudio.play().catch(()=>{}); }catch(e){};
});

// Also allow small controls for mobile (touch)
let touchStartX=0, touchStartY=0;
canvas.addEventListener('touchstart', (e)=>{
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
canvas.addEventListener('touchend', (e)=>{
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if(Math.abs(dx) > Math.abs(dy)){
    if(dx > 20) playerMove(1); else if(dx < -20) playerMove(-1);
  } else {
    if(dy > 20) playerDrop(); else playerRotate(1);
  }
});

/* initial */
applyBackgrounds();


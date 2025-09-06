// Secret values
const SECRET_CONFESS_DATE = "2023-05-01";
const SECRET_RELATION_DATE = "2023-06-01";
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
  let bg = "bg-laptop.jpg";
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    bg = "bg-mobile.jpg";
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
    showPage("surat");
    document.getElementById("bg-music").play().catch(() => {});
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

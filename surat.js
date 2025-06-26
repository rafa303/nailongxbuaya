const triggerKata = {
  // isi jika ada kata dan gambar trigger
};

function bukaSurat() {
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      const namaDitemukan = "Crush";
      const { isi, penutup } = data[namaDitemukan];

      document.getElementById("nama").innerText = namaDitemukan;
      document.getElementById("isiSurat").innerText = isi;
      document.getElementById("penutupCustom").innerText = penutup;

      document.getElementById("formContainer").classList.add("hidden");
      document.getElementById("suratContainer").classList.remove("hidden");
      document.body.classList.add("surat-bg");

      const musik = document.getElementById("musikLatar");
      musik.currentTime = 0;
      musik.play();

      const vn = document.getElementById("voiceNote");
      if (vn) {
        vn.style.display = "flex";
        vn.style.margin = "20px auto";
        vn.style.justifyContent = "center";

        // Volume sync
        vn.addEventListener("play", () => musik.volume = 0.3);
        vn.addEventListener("pause", () => musik.volume = 1);
      }

      setTimeout(() => {
        const sfx = document.getElementById("suaraConfetti");
        sfx.play().catch(() => {});
        jalankanConfetti();
      }, 500);

      tampilkanGambarKunci(isi);
    });
}

function tampilkanGambarKunci(isi) {
  const dimunculkan = new Set();
  let gambarIndex = 0;

  Object.keys(triggerKata).forEach(kunci => {
    if (isi.includes(kunci) && !dimunculkan.has(kunci)) {
      const img = document.createElement("img");
      img.src = triggerKata[kunci];
      img.classList.add("gambar-konten");

      const surat = document.querySelector('.surat');
      const arah = Math.random() > 0.5 ? "left" : "right";
      const jarakPinggir = -80;
      const topPos = 100 + gambarIndex * 120;

      if (arah === "left") img.style.left = `${jarakPinggir}px`;
      else img.style.right = `${jarakPinggir}px`;

      img.style.top = `${topPos}px`;
      img.style.transform = `rotate(${Math.floor(Math.random() * 31) - 15}deg)`;
      img.onclick = () => img.classList.toggle("zoomed");

      surat.appendChild(img);
      dimunculkan.add(kunci);
      gambarIndex++;
    }
  });
}

function jalankanConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  (function frame() {
    confetti(Object.assign({}, defaults, {
      particleCount: 5,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    }));
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function kembali() {
  document.getElementById("suratContainer").classList.add("hidden");
  document.getElementById("formContainer").classList.remove("hidden");

  const musik = document.getElementById("musikLatar");
  musik.pause();
  musik.currentTime = 0;

  const vn = document.getElementById("voiceNote");
  if (vn) vn.style.display = "none";
}

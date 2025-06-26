const triggerKata = {
  // kamu bisa tambahkan keyword & gambar kalau mau
};

function bukaSurat() {
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      const namaDitemukan = "Crush"; // Ganti sesuai key yang tersedia di data.json
      const { isi, penutup } = data[namaDitemukan];

      document.getElementById("nama").innerText = namaDitemukan;
      document.getElementById("isiSurat").innerText = isi;
      document.getElementById("penutupCustom").innerText = penutup;

      // Tampilkan surat
      document.getElementById("formContainer").classList.add("hidden");
      document.getElementById("suratContainer").classList.remove("hidden");
      document.body.classList.add("surat-bg");

      // Mainkan musik
      const musik = document.getElementById("musikLatar");
      musik.currentTime = 0;
      musik.play();

      // Mainkan confetti dan sfx
      setTimeout(() => {
        const sfx = document.getElementById("suaraConfetti");
        sfx.play().catch(() => {});
        jalankanConfetti();
      }, 500);

      // Tampilkan voice note
      const vn = document.getElementById("voiceNote");
      if (vn) vn.style.display = "block";

      // (Opsional) tampilkan gambar terkait kata (jika triggerKata diisi)
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

      if (arah === "left") {
        img.style.left = `${jarakPinggir}px`;
      } else {
        img.style.right = `${jarakPinggir}px`;
      }
      img.style.top = `${topPos}px`;

      const derajat = Math.floor(Math.random() * 31) - 15;
      img.style.transform = `rotate(${derajat}deg)`;

      img.onclick = () => {
        img.classList.toggle("zoomed");
      };

      surat.appendChild(img);
      dimunculkan.add(kunci);
      gambarIndex++;
    }
  });
}

function kembali() {
  document.getElementById("suratContainer").classList.add("hidden");
  document.getElementById("formContainer").classList.remove("hidden");

  // Hentikan musik
  const musik = document.getElementById("musikLatar");
  musik.pause();
  musik.currentTime = 0;

  // Sembunyikan voice note
  const vn = document.getElementById("voiceNote");
  if (vn) vn.style.display = "none";
}

function cetakSebagaiGambar() {
  const surat = document.querySelector('.surat');
  const tombolSementara = document.querySelectorAll('.non-printable');
  tombolSementara.forEach(el => el.style.display = "none");

  const originalStyles = {
    background: surat.style.background,
    color: surat.style.color
  };

  const allChildren = surat.querySelectorAll("*");
  const originalTextColors = [];

  allChildren.forEach(el => {
    originalTextColors.push(el.style.color);
    el.style.color = "#000";
    el.style.background = "transparent";
  });

  const dekoratif = surat.querySelectorAll('.gambar-konten');
  dekoratif.forEach(img => {
    img.style.display = "none";
  });

  surat.style.background = "#ffffff";
  surat.style.color = "#000000";

  html2canvas(surat, { scale: 2 }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'surat-kelulusan.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    surat.style.background = originalStyles.background;
    surat.style.color = originalStyles.color;
    tombolSementara.forEach(el => el.style.display = "");

    allChildren.forEach((el, i) => {
      el.style.color = originalTextColors[i];
      el.style.background = "";
    });

    dekoratif.forEach(img => {
      img.style.display = "";
    });
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

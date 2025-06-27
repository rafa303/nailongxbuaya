const video = document.getElementById('reelVideo');
const videoContainer = document.getElementById('videoContainer');
const pptContainer = document.getElementById('pptContainer');
const rotateNotice = document.getElementById('rotateNotice');
const musik = document.getElementById('musikLatar');
const loadingScreen = document.getElementById('loadingScreen');

// Mulai dengan video disembunyikan
video.pause();
video.style.display = "none";

// Saat halaman selesai dimuat
window.addEventListener("load", () => {
  // Tampilkan loading selama 3 detik
  setTimeout(() => {
    // Hilangkan loading screen dengan transisi
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";

      // Tampilkan dan mainkan video reel
      video.style.display = "block";
      video.muted = false;
      video.play().catch(() => {});
    }, 800);
  }, 3000);
});

// Setelah video selesai diputar
video.addEventListener('ended', () => {
  // Sembunyikan video dengan transisi
  videoContainer.style.opacity = "0";

  setTimeout(() => {
    videoContainer.style.display = "none";

    // Jika pengguna di HP & potrait
    if (window.innerWidth < 600 && window.innerHeight > window.innerWidth) {
      rotateNotice.classList.remove("hidden");

      setTimeout(() => {
        rotateNotice.classList.add("hidden");
        pptContainer.classList.remove("hidden");

        // Mainkan musik latar
        if (musik) musik.play().catch(() => {});
      }, 3000);
    } else {
      pptContainer.classList.remove("hidden");

      // Mainkan musik latar
      if (musik) musik.play().catch(() => {});
    }
  }, 1000); // Delay untuk transisi opacity
});

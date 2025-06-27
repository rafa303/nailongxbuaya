const video = document.getElementById('reelVideo');
const loadingScreen = document.getElementById("loadingScreen");
const videoContainer = document.getElementById('videoContainer');
const pptContainer = document.getElementById('pptContainer');
const rotateNotice = document.getElementById('rotateNotice');
const musik = document.getElementById("musikLatar");

// Play video saat halaman dibuka
video.muted = false;
video.play().catch(() => {});

video.addEventListener('ended', () => {
  // Fade out video
  videoContainer.style.opacity = "0";

  setTimeout(() => {
    videoContainer.style.display = "none";

    // Jika di HP potrait, tampilkan notice dulu
    if (window.innerWidth < 600 && window.innerHeight > window.innerWidth) {
      rotateNotice.classList.remove("hidden");

      setTimeout(() => {
        rotateNotice.classList.add("hidden");
        pptContainer.classList.remove("hidden");
        if (musik) musik.play().catch(() => {});
      }, 3000);
    } else {
      pptContainer.classList.remove("hidden");
      if (musik) musik.play().catch(() => {});
    }
  }, 1000);
});

window.onload = () => {
  const video = document.getElementById('reelVideo');
  const videoContainer = document.getElementById('videoContainer');
  const pptContainer = document.getElementById('pptContainer');
  const rotateNotice = document.getElementById('rotateNotice');
  const musik = document.getElementById('musikLatar');
  const loadingScreen = document.getElementById('loadingScreen');

  // Pastikan elemen video ditemukan
  if (!video) {
    console.error("❌ Video tidak ditemukan!");
    return;
  }

  // Sembunyikan video dulu
  video.pause();
  video.style.display = "none";

  // Setelah semua resource dimuat (termasuk video)
  setTimeout(() => {
    // Hilangkan loading screen
    loadingScreen.style.opacity = "0";

    setTimeout(() => {
      loadingScreen.style.display = "none";

      // Tampilkan dan mainkan video
      video.style.display = "block";
      video.muted = false;
      video.play().catch(err => console.warn("⚠️ Gagal memutar video:", err));
    }, 800);

  }, 2000); // Waktu loading bisa kamu ubah (dalam ms)

  // Jika video selesai
  video.addEventListener('ended', () => {
    videoContainer.style.opacity = "0";

    setTimeout(() => {
      videoContainer.style.display = "none";

      // Jika di HP & potrait
      if (window.innerWidth < 600 && window.innerHeight > window.innerWidth) {
        rotateNotice.classList.remove("hidden");

        const checkRotate = () => {
          if (window.innerWidth > window.innerHeight) {
            rotateNotice.classList.add("hidden");
            pptContainer.classList.remove("hidden");
            musik.play().catch(() => {});
            window.removeEventListener("resize", checkRotate);
          }
        };

        window.addEventListener("resize", checkRotate);
      } else {
        pptContainer.classList.remove("hidden");
        musik.play().catch(() => {});
      }

    }, 1000);
  });
};

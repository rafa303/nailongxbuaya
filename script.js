document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById('reelVideo');
  const videoContainer = document.getElementById('videoContainer');
  const pptContainer = document.getElementById('pptContainer');
  const rotateNotice = document.getElementById('rotateNotice');
  const musik = document.getElementById('musikLatar');
  const loadingScreen = document.getElementById('loadingScreen');

  // Sembunyikan video dulu
  video.pause();
  video.style.display = "none";

  // Tunggu hingga video siap
  video.addEventListener("canplay", () => {
    setTimeout(() => {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";

        video.style.display = "block";
        video.muted = false;
        video.play().catch(err => console.log("Gagal memutar video:", err));
      }, 800);
    }, 1000); // Delay agar transisi mulus
  });

  // Setelah video selesai
  video.addEventListener('ended', () => {
    videoContainer.style.opacity = "0";

    setTimeout(() => {
      videoContainer.style.display = "none";

      // Jika di HP potrait → tampilkan notice
      if (window.innerWidth < 600 && window.innerHeight > window.innerWidth) {
        rotateNotice.classList.remove("hidden");

        // Tunggu sampai user benar-benar memutar HP ke landscape
        const checkRotate = () => {
          if (window.innerWidth > window.innerHeight) {
            rotateNotice.classList.add("hidden");
            pptContainer.classList.remove("hidden");
            if (musik) musik.play().catch(() => {});
            window.removeEventListener("resize", checkRotate);
          }
        };

        window.addEventListener("resize", checkRotate);
      } else {
        pptContainer.classList.remove("hidden");
        if (musik) musik.play().catch(() => {});
      }
    }, 1000);
  });
});

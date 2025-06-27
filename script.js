const video = document.getElementById('reelVideo');
const videoContainer = document.getElementById('videoContainer');
const rotateNotice = document.getElementById('rotateNotice');
const pptContainer = document.getElementById('pptContainer');
const pptSlide = document.getElementById('pptSlide');

let slideIndex = 1;
const totalSlides = 5; // Ganti sesuai jumlah slide kamu
video.muted = false;
video.play().catch(() => {}); // Biarkan silent autoplay jalan

video.addEventListener('ended', () => {
  videoContainer.style.display = 'none';

  // Cek apakah di HP (layar kecil & portrait)
  if (window.innerWidth < 600 && window.innerHeight > window.innerWidth) {
    rotateNotice.classList.remove('hidden');
    setTimeout(() => {
      rotateNotice.classList.add('hidden');
      pptContainer.classList.remove('hidden');
    }, 3000); // kasih waktu 3 detik
  } else {
    pptContainer.classList.remove('hidden');
  }
});

function nextSlide() {
  slideIndex++;
  if (slideIndex > totalSlides) slideIndex = 1;
  pptSlide.src = `slide${slideIndex}.png`;
}

function prevSlide() {
  slideIndex--;
  if (slideIndex < 1) slideIndex = totalSlides;
  pptSlide.src = `slide${slideIndex}.png`;
}

let startTime = 0;
let timer = null;
let timerRunning = false;
let isPaused = false;
let pauseTime = 0;

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  timeDisplay.textContent =
    String(minutes).padStart(2, "0") +
    "." +
    String(seconds).padStart(2, "0");
}


const timeDisplay = document.getElementById("time");
const overlay = document.getElementById("startOverlay");
const playButton = overlay.querySelector(".play");
const closeButton = overlay.querySelector(".close");
const shuffleOverlay = document.getElementById("shuffleOverlay");
const loaderBar = document.querySelector(".loader-bar");
const pauseButton = document.querySelector(".pause");
const soundCorrect = new Audio("sounds/260210_correct_sound.mp3");
const soundWrong = new Audio("sounds/260210_wrong_sound.mp3");



soundCorrect.volume = 0.5;
soundWrong.volume = 0.5;





playButton.addEventListener("click", () => {
  overlay.classList.add("hidden");

  cards.forEach(card => {
    card.open = true;
  });

  previewMode = true;
});



closeButton.addEventListener("click", () => {
  if (history.length > 1) {
    history.back();
  } else {
    location.href = "/";
  }
});





const cards = document.querySelectorAll(".card");

let openCards = [];
let lockBoard = false;

cards.forEach(card => {
  card.addEventListener("toggle", () => {

    if (previewMode) {
      card.open = true;
      return;
    }

    if (lockBoard) {
      card.open = false;
      return;
    }

    if (!card.open) return;
    if (openCards.includes(card)) return;

    openCards.push(card);





if (!timerRunning) {
  timerRunning = true;
  isPaused = false;
  startTime = Date.now();
  timer = setInterval(updateTimer, 100);
}



    if (openCards.length === 2) {
      lockBoard = true;

      const [card1, card2] = openCards;

      if (card1.dataset.pair === card2.dataset.pair) {

        soundCorrect.currentTime = 0;
        soundCorrect.play();


        card1.classList.add("matched");
        card2.classList.add("matched");

        openCards = [];
        lockBoard = false;

      } else {

        soundWrong.currentTime = 0;
        soundWrong.play();

        setTimeout(() => {
          card1.open = false;
          card2.open = false;

          openCards = [];
          lockBoard = false;
        }, 1500);
      }
    }
  });
});



const shuffleButton = document.querySelector(".shuffle");

shuffleButton.addEventListener("click", shuffleCards);

function shuffleCards() {

  loaderBar.style.animation = "none";
  loaderBar.offsetHeight;
  loaderBar.style.animation = "";

  shuffleOverlay.classList.add("active");

  setTimeout(() => {

    previewMode = false;
    openCards = [];
    lockBoard = false;

    clearInterval(timer);
    timerRunning = false;
    startTime = null;
    timeDisplay.textContent = "00.00";

    cards.forEach(card => {
      card.open = false;
      card.classList.remove("matched");
      card.style.order = Math.floor(Math.random() * cards.length);
    });

    shuffleOverlay.classList.remove("active");

  }, 3200);
}

pauseButton.addEventListener("click", () => {

  if (!timerRunning) return;

  if (!isPaused) {
    isPaused = true;
    pauseTime = Date.now();
    clearInterval(timer);
    pauseButton.textContent = "▶ Resume";
    return;
  }

  isPaused = false;

  startTime = startTime + (Date.now() - pauseTime);

  timer = setInterval(updateTimer, 100);
  pauseButton.textContent = "⏸ Pause";
});







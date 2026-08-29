let canvas;
let world;
let keyboard = new Keyboard();
let soundOn = true;
let sounds = {};
let highscore = 0;

function init() {
  canvas = document.getElementById("canvas");
  createSounds();
  updateSoundIcon();
  loadHighscore();
  initTouchControls();
}

function createSounds() {
  sounds = {
    bossFirst: new Audio("audio/boss-first-sound.mp3"),
    bossJump: new Audio("audio/boss-jump.mp3"),
    pepe1: new Audio("audio/pepe-1.mp3"),
    pepeWin: new Audio("audio/pepe-win.mp3"),
    bottlePickup: new Audio("audio/bottle-pickup.mp3"),
    bottleSmash: new Audio("audio/bottle-smash.wav"),
    bottleThrow: new Audio("audio/bottle-throw.wav"),
    characterDeath: new Audio("audio/character-death.mp3"),
    click: new Audio("audio/click.wav"),
    coinPickup: new Audio("audio/coin-pickup.wav"),
    desert: new Audio("audio/desert.wav"),
    hurt: new Audio("audio/hurt.wav"),
    jump: new Audio("audio/jump.wav"),
    land: new Audio("audio/land.wav"),
    stompedChicken: new Audio("audio/stumped-chicken.mp3"),
    walk: new Audio("audio/walk.wav"),
  };

  sounds.desert.loop = true;
  sounds.desert.volume = 0.25;

  sounds.walk.loop = true;
  sounds.walk.volume = 0.35;
}

function playSound(soundName) {
  if (!soundOn || !sounds[soundName]) {
    return;
  }

  sounds[soundName].currentTime = 0;
  sounds[soundName].play();
}

function startBackgroundMusic() {
  if (!soundOn) {
    return;
  }

  sounds.desert.play();
}

function stopBackgroundMusic() {
  sounds.desert.pause();
  sounds.desert.currentTime = 0;
}

function startWalkSound() {
  if (!soundOn || !sounds.walk.paused) {
    return;
  }

  sounds.walk.play();
}

function stopWalkSound() {
  sounds.walk.pause();
  sounds.walk.currentTime = 0;
}

function loadHighscore() {
  const saved = localStorage.getItem("elPolloLocoHighscore");
  highscore = saved ? parseInt(saved, 10) : 0;
  updateHighscoreDisplay();
}

function saveHighscoreIfNeeded(score) {
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("elPolloLocoHighscore", highscore);
  }
  updateHighscoreDisplay();
}

function updateHighscoreDisplay() {
  const highscoreElement = document.getElementById("highscoreDisplay");
  if (highscoreElement) {
    highscoreElement.textContent = "Highscore: " + highscore;
  }
}

function showPlayAgainButton() {
  const winScreenActions = document.getElementById("winScreenActions");
  if (winScreenActions) {
    winScreenActions.classList.remove("d-none");
  }
}

function hidePlayAgainButton() {
  const winScreenActions = document.getElementById("winScreenActions");
  if (winScreenActions) {
    winScreenActions.classList.add("d-none");
  }
}

function playAgain() {
  hidePlayAgainButton();
  startGame();
}

function startGame() {
  playSound("click");

  if (world) {
    world.stop();
  }

  document.getElementById("startScreen").classList.add("d-none");
  canvas.classList.remove("d-none");
  document.getElementById("gameControls").classList.remove("d-none");
  document.getElementById("touchControls").classList.remove("d-none");
  updateSoundIcon();

  initLevel();
  world = new World(canvas, keyboard);
  world.muted = !soundOn;

  startBackgroundMusic();
}

function toggleSound() {
  if (soundOn) {
    playSound("click");
  }

  soundOn = !soundOn;
  updateSoundIcon();

  if (world) {
    world.muted = !soundOn;
  }

  if (soundOn) {
    playSound("click");

    if (world) {
      startBackgroundMusic();
    }
  } else {
    sounds.desert.pause();
    stopWalkSound();
  }
}

function updateSoundIcon() {
  const soundIcon = document.getElementById("soundIcon");

  if (soundOn) {
    soundIcon.src = "img/icons/sound/sound-on.png";
    soundIcon.alt = "Sound an";
  } else {
    soundIcon.src = "img/icons/sound/mute.png";
    soundIcon.alt = "Sound aus";
  }
}

function initTouchControls() {
  bindTouchButton("touchLeft", "LEFT");
  bindTouchButton("touchRight", "RIGHT");
  bindTouchButton("touchJump", "UP");
  bindTouchButton("touchThrow", "D");
}

function bindTouchButton(buttonId, key) {
  const button = document.getElementById(buttonId);

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    keyboard[key] = true;
    button.classList.add("active");

    button.setPointerCapture(event.pointerId);
  });

  function releaseButton(event) {
    keyboard[key] = false;
    button.classList.remove("active");

    if (button.hasPointerCapture(event.pointerId)) {
      button.releasePointerCapture(event.pointerId);
    }
  }

  button.addEventListener("pointerup", releaseButton);
  button.addEventListener("pointercancel", releaseButton);
}

function backToMenu() {
  playSound("click");
  stopBackgroundMusic();
  stopWalkSound();
  hidePlayAgainButton();

  if (world) {
    world.stop();
    world = null;
  }

  canvas.classList.add("d-none");
  document.getElementById("gameControls").classList.add("d-none");
  document.getElementById("startScreen").classList.remove("d-none");
  document.getElementById("touchControls").classList.add("d-none");
  updateHighscoreDisplay();
}

function showGameInfo() {
  playSound("click");
  document.getElementById("gameInfo").classList.remove("d-none");
}

function hideGameInfo() {
  playSound("click");
  document.getElementById("gameInfo").classList.add("d-none");
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39 || e.key == "ArrowRight") keyboard.RIGHT = true;
  if (e.keyCode == 37 || e.key == "ArrowLeft") keyboard.LEFT = true;
  if (e.keyCode == 38 || e.key == "ArrowUp") keyboard.UP = true;
  if (e.keyCode == 40 || e.key == "ArrowDown") keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68 || e.key == "d" || e.key == "D") keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39 || e.key == "ArrowRight") keyboard.RIGHT = false;
  if (e.keyCode == 37 || e.key == "ArrowLeft") keyboard.LEFT = false;
  if (e.keyCode == 38 || e.key == "ArrowUp") keyboard.UP = false;
  if (e.keyCode == 40 || e.key == "ArrowDown") keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68 || e.key == "d" || e.key == "D") keyboard.D = false;
});
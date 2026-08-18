let canvas;
let world;
let keyboard = new Keyboard();
let soundOn = true;
let sounds = {};

function init() {
  canvas = document.getElementById("canvas");
  createSounds();
  updateSoundIcon();
}

function createSounds() {
  sounds = {
    bossFirst: new Audio("audio/boss-first-sound.mp3"),
    bottlePickup: new Audio("audio/bottle-pickup.mp3"),
    bottleSmash: new Audio("audio/bottle-smash.wav"),
    bottleThrow: new Audio("audio/bottle-throw.wav"),
    characterDeath: new Audio("audio/character-death.mp3"),
    click: new Audio("audio/click.mp3"),
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

function startGame() {
  playSound("click");

  // Startscreen ausblenden und Canvas erst beim Start sichtbar machen.
  document.getElementById("startScreen").classList.add("d-none");
  canvas.classList.remove("d-none");
  document.getElementById("gameControls").classList.remove("d-none");
  updateSoundIcon();

  // Level wird erst hier erstellt, damit Chicken vorher nicht loslaufen.
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

/**
 * Beendet das laufende Spiel (inkl. aller Intervalle und des
 * requestAnimationFrame-Loops) und kehrt zum Startbildschirm zurück.
 */
function backToMenu() {
  playSound("click");
  stopBackgroundMusic();
  stopWalkSound();

  if (world) {
    world.stop();
    world = null;
  }

  canvas.classList.add("d-none");
  document.getElementById("gameControls").classList.add("d-none");
  document.getElementById("startScreen").classList.remove("d-none");
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
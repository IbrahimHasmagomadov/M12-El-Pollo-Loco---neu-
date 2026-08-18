let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
}

function startGame() {
  // Startscreen ausblenden und Canvas erst beim Start sichtbar machen.
  document.getElementById("startScreen").classList.add("d-none");
  canvas.classList.remove("d-none");

  // Level wird erst hier erstellt, damit Chicken vorher nicht loslaufen.
  initLevel();
  world = new World(canvas, keyboard);
}

function showGameInfo() {
  document.getElementById("gameInfo").classList.remove("d-none");
}

function hideGameInfo() {
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
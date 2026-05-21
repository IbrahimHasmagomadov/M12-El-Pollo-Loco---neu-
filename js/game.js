let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39 || e.key == 'ArrowRight') keyboard.RIGHT = true;
  if (e.keyCode == 37 || e.key == 'ArrowLeft') keyboard.LEFT = true;
  if (e.keyCode == 38 || e.key == 'ArrowUp') keyboard.UP = true;
  if (e.keyCode == 40 || e.key == 'ArrowDown') keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68 || e.key == 'd' || e.key == 'D') keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39 || e.key == 'ArrowRight') keyboard.RIGHT = false;
  if (e.keyCode == 37 || e.key == 'ArrowLeft') keyboard.LEFT = false;
  if (e.keyCode == 38 || e.key == 'ArrowUp') keyboard.UP = false;
  if (e.keyCode == 40 || e.key == 'ArrowDown') keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68 || e.key == 'd' || e.key == 'D') keyboard.D = false;
});
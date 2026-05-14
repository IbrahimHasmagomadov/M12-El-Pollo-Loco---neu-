class MovableObject {
  x = 120;
  y = 270;
  img;
  height = 150;
  width = 100;


  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
    this.img.onload = () => {
    };
  }

  moveRight() {
    console.log('Moving right');
  }

  moveLeft() {

  }
}

class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;
  speedFactor = 1;

  constructor(imagePath, x, speedFactor = 1) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
    this.speedFactor = speedFactor;
  }
}

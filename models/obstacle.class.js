class Obstacle extends DrawableObject {
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  constructor(imagePath, x, y, width, height) {
    super().loadImage(imagePath);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
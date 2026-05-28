class ThrowableObject extends MovableObject {
  constructor(x, y) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");

    this.width = 50;
    this.height = 50;

    this.x = x;
    this.y = y;

    this.speedY = 20;
    this.acceleration = 1.2;

    this.throw();
  }

  throw() {
    setInterval(() => {
      this.x += 10;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    }, 25);
  }
}
class SmallChicken extends MovableObject {
  y = 370;
  height = 50;
  width = 50;
  speed = 0.5;
  offset = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  };
  isDead = false;

  IMAGE_DEAD = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  constructor(x) {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    let deadImage = new Image();
    deadImage.src = this.IMAGE_DEAD;
    this.imageCache[this.IMAGE_DEAD] = deadImage;
    if (x !== undefined) {
      this.x = x;
    } else {
      this.x = 700 + Math.random() * 500;
    }
    this.speed = this.speed + Math.random() * 0.3;
    this.animate();
  }

  kill() {
    this.isDead = true;
    this.img = this.imageCache[this.IMAGE_DEAD];
  }

  animate() {
    setInterval(() => {
      if (!this.isDead) {
        this.moveLeft();
      }
    }, 1000 / 60);
    setInterval(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }

  jump() {}
}

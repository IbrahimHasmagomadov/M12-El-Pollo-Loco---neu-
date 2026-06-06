class Chicken extends MovableObject {
  y = 360;
  height = 60;
  width = 60;
  speed = 0.3;
  offset = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
  };
  isDead = false;

  IMAGE_DEAD = "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  currentImage = 0;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    let deadImage = new Image();
    deadImage.src = this.IMAGE_DEAD;
    this.imageCache[this.IMAGE_DEAD] = deadImage;
    this.x = 500 + Math.random() * 500;
    this.speed = this.speed + Math.random() * 0.2;
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

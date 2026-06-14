class Endboss extends MovableObject {
  y = 55;
  height = 400;
  width = 250;
  offset = {
    top: 80,
    left: 30,
    right: 30,
    bottom: 20,
  };
  energy = 100;
  isDead = false;
  isActive = false;
  speed = 2;
  minX = 3350;
  maxX = 4550;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/2_alert/G11.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = 4100;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 260);
  }

  activate() {
    this.isActive = true;
  }

  moveToCharacter(character) {
    if (!this.isActive || this.isDead) {
      return;
    }

    if (character.x < this.x && this.x > this.minX) {
      this.x -= this.speed;
      this.otherDirection = false;
    }

    if (character.x > this.x && this.x < this.maxX) {
      this.x += this.speed;
      this.otherDirection = true;
    }
  }

  hit(damage) {
    this.energy -= damage;

    if (this.energy <= 0) {
      this.energy = 0;
      this.isDead = true;
    }
  }
}

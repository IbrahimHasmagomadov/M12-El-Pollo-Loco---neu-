class Endboss extends MovableObject {
  y = 150;
  height = 300;
  width = 200;

  offset = {
    top: 80,
    left: 30,
    right: 30,
    bottom: 20,
  };
  energy = 100;
  isDead = false;
  isActive = false;
  isMoving = false;
  speed = 1.2;
  minX = 3350;
  maxX = 4550;
  groundY = 55;
  currentGroundY = 55;
  lastJump = 0;
  jumpInterval = 3000;
  jumpDirection = -1;

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/2_alert/G11.png");
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 4100;
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isMoving) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }, 240);
  }

  activate() {
    this.isActive = true;
  }

  moveToCharacter(character) {
    this.isMoving = false;

    if (!this.isActive || this.isDead) {
      return;
    }

    if (character.x < this.x && this.x > this.minX) {
      this.x -= this.speed;
      this.otherDirection = false;
      this.isMoving = true;
    }

    if (character.x > this.x && this.x < this.maxX) {
      this.x += this.speed;
      this.otherDirection = true;
      this.isMoving = true;
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

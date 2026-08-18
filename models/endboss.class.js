class Endboss extends MovableObject {
  y = 120;
  height = 330;
  width = 220;

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
  speed = 3;
  minX = 3350;
  maxX = 4550;
  groundY = 55;
  currentGroundY = 125;
  lastJump = 0;
  jumpInterval = 3000;
  jumpDirection = -1;
  hasJumpedToCactus = false;
  hasHitCactus = false;
  hasJumpedBackRight = false;
  isReturningAfterCactus = false;
  jumpBackTriggerX = 3700;
  returnCompleteX = 3750;
  jumpMoveSpeed = 9.5;
  isHurt = false;
  hurtUntil = 0;
  deadAnimationFrame = 0;
  deadAnimationPlayed = false;

  IMAGES_ALERT = [
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
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
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
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 4100;
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isDead) {
        this.playDeadAnimation();
      } else if (this.isHurt) {
        this.playAnimation(this.IMAGES_HURT);

        if (new Date().getTime() > this.hurtUntil) {
          this.isHurt = false;
        }
      } else if (this.isAboveGround() && this.hasJumpedToCactus) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else if (this.isMoving) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }, 240);
  }

  playDeadAnimation() {
    if (this.deadAnimationPlayed) {
      this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
      return;
    }

    if (this.deadAnimationFrame < this.IMAGES_DEAD.length) {
      let path = this.IMAGES_DEAD[this.deadAnimationFrame];
      this.img = this.imageCache[path];
      this.deadAnimationFrame++;
    } else {
      this.deadAnimationPlayed = true;
    }
  }

  activate() {
    this.isActive = true;
  }

  moveToCharacter(character) {
    this.isMoving = false;

    if (!this.isActive || this.isDead || this.isAboveGround()) {
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

  shouldJumpToCactus(character) {
    return (
      this.isActive &&
      !this.isDead &&
      !this.isAboveGround() &&
      !this.hasJumpedToCactus &&
      character.x < this.x &&
      this.x < 3600
    );
  }

  jumpToCactus() {
    this.speedY = 26;
    this.acceleration = 1.4;
    this.jumpDirection = -1;
    this.hasJumpedToCactus = true;
    this.otherDirection = false;
  }

  shouldJumpBackRight() {
    return (
      this.isReturningAfterCactus &&
      !this.isDead &&
      !this.isAboveGround() &&
      !this.hasJumpedBackRight &&
      this.x > this.jumpBackTriggerX
    );
  }

  jumpBackRight() {
    this.speedY = 26;
    this.acceleration = 1.4;
    this.jumpDirection = 1; // springt nach rechts
    this.hasJumpedBackRight = true;
    this.otherDirection = true;
  }

  moveBackRightAfterCactus() {
    if (!this.isReturningAfterCactus) return;

    this.isMoving = false;

    if (!this.isAboveGround()) {
      // Laufend zurück nach rechts bis zur Rückkehr-Schwelle
      if (this.x < this.returnCompleteX && !this.isDead) {
        this.x += this.speed;
        this.otherDirection = true;
        this.isMoving = true;
      }
    }

    // Wenn er in der Luft ist, übernimmt moveDuringJump() die horizontale Bewegung
  }

  moveDuringJump() {
    if (this.isAboveGround()) {
      this.x += this.jumpDirection * this.jumpMoveSpeed;
    }
  }

  resetCactusJumpIfBackRight() {
    if (!this.isAboveGround() && this.x > this.returnCompleteX) {
      this.hasJumpedToCactus = false;
      this.hasHitCactus = false;
      this.hasJumpedBackRight = false;
      this.isReturningAfterCactus = false;
    }
  }

  hit(damage) {
    this.energy -= damage;
    this.isHurt = true;
    this.hurtUntil = new Date().getTime() + 600;

    if (this.energy <= 0) {
      this.energy = 0;
      this.isDead = true;
      this.isHurt = false;
    }
  }
}

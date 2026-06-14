class Character extends MovableObject {
  height = 250;
  width = 120;
  y = 180;
  speed = 6;
  groundY = 180;
  currentGroundY = 180;

  offset = {
    top: 100,
    left: 20,
    right: 20,
    bottom: 10,
  };
  lastThrow = 0;
  isKnockback = false;
  knockbackEnd = 0;
  knockbackDirection = 0;

  idleStartTime = new Date().getTime();
  animationFrame = 0;
  deadAnimationPlayed = false;
  landingAnimationUntil = 0;
  wasAboveGround = false;
  isThrowing = false;
  throwAnimationFrame = 0;

  IMAGE_RIP = "img/You won, you lost/RIP.png";

  IMAGES_IDLE = Array.from(
    { length: 10 },
    (_, i) => `img/2_character_pepe/1_idle/idle/I-${i + 1}.png`,
  );

  IMAGES_LONG_IDLE = Array.from(
    { length: 10 },
    (_, i) => `img/2_character_pepe/1_idle/long_idle/I-${i + 11}.png`,
  );

  IMAGES_WALKING = Array.from(
    { length: 6 },
    (_, i) => `img/2_character_pepe/2_walk/W-${i + 21}.png`,
  );

  IMAGES_THROW = Array.from(
    { length: 2 },
    (_, i) => `img/2_character_pepe/6_throw/throw-${i + 1}.png`,
  );

  IMAGES_JUMPING = Array.from(
    { length: 9 },
    (_, i) => `img/2_character_pepe/3_jump/J-${i + 31}.png`,
  );

  IMAGES_DEAD = Array.from(
    { length: 7 },
    (_, i) => `img/2_character_pepe/5_dead/D-${i + 51}.png`,
  );

  IMAGES_HURT = Array.from(
    { length: 3 },
    (_, i) => `img/2_character_pepe/4_hurt/H-${i + 41}.png`,
  );

  world;

  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");

    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_THROW);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);

    let ripImage = new Image();
    ripImage.src = this.IMAGE_RIP;
    this.imageCache[this.IMAGE_RIP] = ripImage;

    this.x = 100;
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.handleAnimation(), 1000 / 10);
  }

  handleMovement() {
    if (this.isDead()) return;
    if (this.isKnockback) {
      this.x += this.knockbackDirection * 4;
      this.world.camera_x = -this.x + 100;
      if (new Date().getTime() > this.knockbackEnd) {
        this.isKnockback = false;
      }
      return;
    }
    if (
      this.world.keyboard.RIGHT &&
      this.x < this.world.level.level_end_x &&
      !this.world.isObstacleBlocking("right")
    ) {
      this.moveRight();
      this.otherDirection = false;
      this.idleStartTime = new Date().getTime();
    }
    if (
      this.world.keyboard.LEFT &&
      this.x > -250 &&
      !this.world.isObstacleBlocking("left")
    ) {
      this.moveLeft();
      this.otherDirection = true;
      this.idleStartTime = new Date().getTime();
    }
    if (
      (this.world.keyboard.SPACE || this.world.keyboard.UP) &&
      !this.isAboveGround()
    ) {
      this.jump();
      this.idleStartTime = new Date().getTime();
    }
    if (this.wasAboveGround && !this.isAboveGround()) {
      this.landingAnimationUntil = new Date().getTime() + 250;
    }
    this.wasAboveGround = this.isAboveGround();
    this.world.camera_x = -this.x + 100;
  }

  handleAnimation() {
    if (this.isDead()) {
      this.playDeadAnimation();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.idleStartTime = new Date().getTime();
    } else if (this.isThrowing) {
      this.playThrowAnimation();
    } else if (this.isAboveGround()) {
      this.playJumpAnimation();
    } else if (
      new Date().getTime() < this.landingAnimationUntil &&
      !this.world.keyboard.RIGHT &&
      !this.world.keyboard.LEFT
    ) {
      this.img = this.imageCache["img/2_character_pepe/3_jump/J-38.png"];
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (this.isLongIdle()) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  isLongIdle() {
    let timePassed = new Date().getTime() - this.idleStartTime;
    return timePassed > 5000;
  }

  playJumpAnimation() {
    if (this.speedY > 15) {
      this.img = this.imageCache["img/2_character_pepe/3_jump/J-34.png"];
    } else if (this.speedY > 8) {
      this.img = this.imageCache["img/2_character_pepe/3_jump/J-32.png"];
    } else if (this.speedY > 0) {
      this.img = this.imageCache["img/2_character_pepe/3_jump/J-35.png"];
    } else if (this.speedY > -12) {
      this.img = this.imageCache["img/2_character_pepe/3_jump/J-36.png"];
    } else {
      this.img = this.imageCache["img/2_character_pepe/3_jump/J-37.png"];
    }
  }

  jump() {
    this.speedY = 25;
  }

  canThrow() {
    let timePassed = new Date().getTime() - this.lastThrow;
    return timePassed > 900;
  }

  throw() {
    this.isThrowing = true;
    this.throwAnimationFrame = 0;
    this.idleStartTime = new Date().getTime();
    this.lastThrow = new Date().getTime();
  }

  playThrowAnimation() {
    if (this.throwAnimationFrame < this.IMAGES_THROW.length) {
      let path = this.IMAGES_THROW[Math.floor(this.throwAnimationFrame)];
      this.img = this.imageCache[path];
      this.throwAnimationFrame += 1.8;
    } else {
      this.isThrowing = false;
    }
  }

  startKnockback(direction) {
    this.isKnockback = true;
    this.knockbackEnd = new Date().getTime() + 400;
    this.knockbackDirection = direction;
    this.speedY = 8;
  }

  playDeadAnimation() {
    if (this.deadAnimationPlayed) {
      this.img = this.imageCache[this.IMAGE_RIP];
      return;
    }

    if (this.animationFrame < this.IMAGES_DEAD.length) {
      let path = this.IMAGES_DEAD[this.animationFrame];
      this.img = this.imageCache[path];
      this.animationFrame++;
    } else {
      this.deadAnimationPlayed = true;
      this.width = 100;
      this.height = 120;
      this.groundY = 310;
      this.y = this.groundY;
      this.speedY = 0;
      this.img = this.imageCache[this.IMAGE_RIP];
      this.otherDirection = false;
    }
  }
}

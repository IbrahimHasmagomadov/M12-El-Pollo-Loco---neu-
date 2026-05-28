class Character extends MovableObject {
  height = 250;
  width = 120;
  y = 175;
  speed = 6;
  groundY = 180;

  offset = {
    top: 100,
    left: 20,
    right: 20,
    bottom: 10,
  };

  idleStartTime = new Date().getTime();
  animationFrame = 0;
  deadAnimationPlayed = false;
  landingAnimationUntil = 0;
  wasAboveGround = false;
  isThrowing = false;
  throwAnimationFrame = 0;

  IMAGE_RIP = "img/You won, you lost/RIP.png";

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_THROW = [
    "img/2_character_pepe/6_throw/throw-1.png",
    "img/2_character_pepe/6_throw/throw-2.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

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
    setInterval(() => {
      if (this.isDead()) {
        return;
      }

      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
        this.idleStartTime = new Date().getTime();
      }

      if (this.world.keyboard.LEFT && this.x > -50) {
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

      if (this.world.keyboard.D && !this.isThrowing) {
        this.throw();
      }

      if (this.wasAboveGround && !this.isAboveGround()) {
        this.landingAnimationUntil = new Date().getTime() + 250;
      }

      this.wasAboveGround = this.isAboveGround();
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
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
    }, 1000/10);
  }

  isLongIdle() {
    let timePassed = new Date().getTime() - this.idleStartTime;
    return timePassed > 5000;
  }

  playJumpAnimation() {
    if (this.speedY > 15) {
      this.img = this.imageCache["img/2_character_pepe/3_jump/J-31.png"];
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

  throw() {
    this.isThrowing = true;
    this.throwAnimationFrame = 0;
    this.idleStartTime = new Date().getTime();
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
      this.height = 150;
      this.y = 290;
      this.img = this.imageCache[this.IMAGE_RIP];
      this.otherDirection = false;
    }
  }
}

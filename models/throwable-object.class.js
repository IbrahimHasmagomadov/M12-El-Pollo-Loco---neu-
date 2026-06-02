class ThrowableObject extends MovableObject {
  rotation = 0;
  isSplashing = false;
  splashFrame = 0;
  hasHit = false;
  splashFinished = false;
  groundY = 370;

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y, otherDirection) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.loadImages(this.IMAGES_SPLASH);
    this.otherDirection = otherDirection;
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
      if (this.isSplashing) {
        this.playSplashAnimation();
      } else {
        if (this.otherDirection) {
          this.x -= 10;
        } else {
          this.x += 10;
        }

        this.y -= this.speedY;
        this.speedY -= this.acceleration;

        if (this.y >= this.groundY) {
          this.bottleSplash();
        }
      }
    }, 25);
  }

  bottleSplash() {
    this.hasHit = true;
    this.isSplashing = true;
    this.splashFrame = 0;
  }

  playSplashAnimation() {
    if (this.splashFrame < this.IMAGES_SPLASH.length) {
      let path = this.IMAGES_SPLASH[this.splashFrame];
      this.img = this.imageCache[path];
      this.splashFrame++;
    } else {
      this.isSplashing = false;
      this.splashFinished = true;
    }
  }
}

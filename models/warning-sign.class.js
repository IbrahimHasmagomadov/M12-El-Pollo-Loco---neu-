class WarningSign extends DrawableObject {
  constructor(x) {
    super().loadImage("img/4_enemie_boss_chicken/warning_sign.png");

    this.x = x;
    this.y = 315;
    this.width = 120;
    this.height = 100;
  }
}
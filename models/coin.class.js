class Coin extends CollectableObject {
  y = 340;
  width = 40;
  height = 40;
  offset = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  };

  IMAGES_COIN = [
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png",
  ];

  constructor(x, y) {
    super();
    this.loadImages(this.IMAGES_COIN);
    this.x = x;
    this.y = y !== undefined ? y : 340;
    this.width = 80;
    this.height = 80;
    this.currentImage = 0;
    this.img = this.imageCache[this.IMAGES_COIN[0]];
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.currentImage = (this.currentImage + 1) % this.IMAGES_COIN.length;
      this.img = this.imageCache[this.IMAGES_COIN[this.currentImage]];
    }, 200);
  }
}

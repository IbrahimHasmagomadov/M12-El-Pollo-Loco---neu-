class Bottle extends CollectableObject {
  IMAGE_PATHS = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  constructor(x) {
    super();
    const path =
      this.IMAGE_PATHS[Math.floor(Math.random() * this.IMAGE_PATHS.length)];
    this.loadImage(path);
    this.x = x;
    this.y = 360;
    this.width = 40;
    this.height = 60;
    this.offset = {
      top: 5,
      left: 5,
      right: 5,
      bottom: 5,
    };
  }
}

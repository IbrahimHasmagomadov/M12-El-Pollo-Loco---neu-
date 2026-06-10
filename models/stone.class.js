class Stone extends Obstacle {
  constructor(x, type = "small") {
    if (type === "big") {
      super(
        "img/10_Obstacle/stone/big_stone.png",
        x,
        -25,
        620,
        460
      );

      this.offset = {
        top: 0,
        left: 35,
        right: 0,
        bottom: 0,
      };
    } else {
      super(
        "img/10_Obstacle/stone/small_stone.png",
        x,
        355,
        120,
        80
      );

      this.offset = {
        top: 27,
        left: 35,
        right: 40,
        bottom: 0,
      };
    }
  }
}
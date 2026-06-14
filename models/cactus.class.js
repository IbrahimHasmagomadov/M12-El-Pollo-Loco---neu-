class Cactus extends Obstacle {
  constructor(x, type = "small") {
    if (type === "big") {
      super(
        "img/10_Obstacle/cactus/1big_cactus_.png",
        x,
        235,
        100,
        195
      );

      this.offset = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 10,
      };
    } else {
      super(
        "img/10_Obstacle/cactus/small_cactus.png",
        x,
        325,
        80,
        100
      );

      this.offset = {
        top: 15,
        left: 15,
        right: 15,
        bottom: 5,
      };
    }
  }
}
function createBottles(amount) {
    let bottles = [];
    let x = 400;

    for (let i = 0; i < amount; i++) {
      x += 100 + Math.random() * 250;
      bottles.push(new Bottle(x));
    }

    return bottles;
  };

function createChickens(amount) {
  let chickens = [];
  let x = 500;

  for (let i = 0; i < amount; i++) {
    x += 200 + Math.random() * 220;
    chickens.push(new Chicken(x));
  }

  return chickens;
}

function createSmallChickens(amount) {
  let chickens = [];
  let x = 700;

  for (let i = 0; i < amount; i++) {
    x += 250 + Math.random() * 210;
    chickens.push(new SmallChicken(x));
  }

  return chickens;
}

function createCoins(amount) {
  let coins = [];
  let x = 450;

  for (let i = 0; i < amount; i++) {
    x += 300 + Math.random() * 180;
    coins.push(new Coin(x));
  }

  return coins;
}

const level1 = new Level(
  [...createChickens(15), ...createSmallChickens(10), new Endboss()],
  [...createBottles(30), ...createCoins(12)],
  [
    new Stone(2350),
    new Cactus(1400),
    new Stone(4000, "big"),
    new Cactus(2500, "big"),
  ],
  [new Cloud()],
  [
    new BackgroundObject("img/5_background/layers/air.png", -719),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),
    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/air.png", 719),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/1.png",
      719 * 2,
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/1.png",
      719 * 2,
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/1.png",
      719 * 2,
    ),
    new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/2.png",
      719 * 3,
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/2.png",
      719 * 3,
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/2.png",
      719 * 3,
    ),
  ],
);

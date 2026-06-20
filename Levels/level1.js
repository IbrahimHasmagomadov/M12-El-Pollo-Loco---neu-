function createBottles(amount) {
  let bottles = [];
  let x = 400;

  for (let i = 0; i < amount; i++) {
    x += 250 + Math.random() * 250;
    bottles.push(new Bottle(x));
  }

  return bottles;
}

function createChickens(amount) {
  let chickens = [];
  let x = 500;

  for (let i = 0; i < amount; i++) {
    x += 20 + Math.random() * 20;
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
    x += 80 + Math.random() * 280;
    coins.push(new Coin(x));
  }

  return coins;
}

const level1 = new Level(
  [...createChickens(0), ...createSmallChickens(0), new Endboss()],
  [...createBottles(20), ...createCoins(100)],

  [
    new Stone(3050), //3050
    new Cactus(970),
    new Cactus(1750),
    new Stone(4470, "big"), 
    new Cactus(3220, "big"), //3200 + 20
    new WarningSign(3420),
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
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png",719 * 2),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png",719 * 2),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png",719 * 2),
    new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png",719 * 3),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png",719 * 3),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png",719 * 3),
    new BackgroundObject("img/5_background/layers/air.png", 719 * 4),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png",719 * 4),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png",719 * 4),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png",719 * 4),
    new BackgroundObject("img/5_background/layers/air.png", 719 * 5),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png",719 * 5),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png",719 * 5),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png",719 * 5),
    new BackgroundObject("img/5_background/layers/air.png", 719 * 6),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png",719 * 6),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png",719 * 6),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png",719 * 6),
  ],
);

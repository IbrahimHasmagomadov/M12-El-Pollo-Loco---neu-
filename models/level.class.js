class Level {
  enemies;
  collectableObjects;
  obstacles;
  clouds;
  backgroundObjects;
  level_end_x = 719 * 4;

  constructor(enemies, collectableObjects, obstacles, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.collectableObjects = collectableObjects || [];
    this.obstacles = obstacles || [];
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
  }
}
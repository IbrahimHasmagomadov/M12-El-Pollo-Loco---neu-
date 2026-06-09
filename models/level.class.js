class Level {
    enemies;
    collectableObjects;
    clouds;
    backgroundObjects;
    level_end_x = 719 * 4;

    constructor(enemies, collectableObjects, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.collectableObjects = collectableObjects || [];
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}
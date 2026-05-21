class ThrowableObject extends MovableObject {
    constructor() {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.width = 50;
        this.height = 50;
        this.y = 360;
        this.x = 100; // Startposition, kann angepasst werden
        this.speedY = 10;
        this.gravity = 0.5;
    }
}
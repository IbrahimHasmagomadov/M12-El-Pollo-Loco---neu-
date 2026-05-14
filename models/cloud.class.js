class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;

  constructor(){
    super().loadImage('img/5_background/layers/4_clouds/1.png');

    this.x = Math.random() * 500; 
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.x -= 0.15; // Wolken langsam nach links bewegen
    }, 1000/60); // ca. 60 FPS
  }
}

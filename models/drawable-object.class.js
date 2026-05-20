class DrawableObject {
  img;
  x = 120;
  y = 270;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
    this.img.onload = () => {};
  }

    /**
   *
   * @param {Array} arr 
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}

class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusbar = new Statusbar();
  throwableObjects = [];
  canThrow = true;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
    this.checkThrowObjects();
  }

  setWorld() {
    this.character.world = this;
    this.statusbar.setPercentage(this.character.energy);
  }

  checkCollisions() {
    setInterval(() => {
      // Character vs Enemies
      for (const enemy of this.level.enemies) {
        if (
          this.character.isColliding(enemy) &&
          !this.character.isDead() &&
          !this.character.isHurt()
        ) {
          // Chicken separat behandeln
          if (enemy instanceof Chicken && !enemy.isDead) {
            const characterBottom =
              this.character.y +
              this.character.height -
              this.character.offset.bottom;

            const enemyTop = enemy.y + enemy.offset.top;

            const isJumpingOnEnemy =
              this.character.speedY < 0 && characterBottom <= enemyTop + 45;

            if (isJumpingOnEnemy) {
              enemy.kill();
              this.character.speedY = 15;

              setTimeout(() => {
                let index = this.level.enemies.indexOf(enemy);
                this.level.enemies.splice(index, 1);
              }, 1000);

             break; //nach einem gekillten Chicken keine weiteren Gegner prüfen
            } else {
              this.character.hit();
              this.statusbar.setPercentage(this.character.energy);

              break;
            }
          }

          // Endboss verletzt Pepe bei Berührung
          if (enemy instanceof Endboss) {
            this.character.hit();
            this.statusbar.setPercentage(this.character.energy);

            break;
          }
        }
      }

      // Bottle vs Chicken
      this.throwableObjects.forEach((bottle) => {
        this.level.enemies.forEach((enemy) => {
          if (
            enemy instanceof Chicken &&
            bottle.isColliding(enemy) &&
            !enemy.isDead &&
            !bottle.hasHit
          ) {
            enemy.kill();
            bottle.bottleSplash();

            setTimeout(() => {
              let index = this.level.enemies.indexOf(enemy);
              this.level.enemies.splice(index, 1);
            }, 1000);
          }
        });
      });

      // Fertige Splash-Flaschen entfernen
      this.throwableObjects = this.throwableObjects.filter((bottle) => {
        return !bottle.splashFinished;
      });
    }, 50);
  }

  checkThrowObjects() {
    setInterval(() => {
      if (this.keyboard.D && this.canThrow && !this.character.isHurt()) {
        let bottle = new ThrowableObject(
          this.character.otherDirection
            ? this.character.x
            : this.character.x + 100,
          this.character.y + 100,
          this.character.otherDirection,
        );

        this.throwableObjects.push(bottle);

        this.canThrow = false;
        setTimeout(() => {
          this.canThrow = true;
        }, 900);
      }
    }, 100);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusbar);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo instanceof ThrowableObject) {
      // Bottle rotation logic
      this.ctx.save();

      // Translate to center of bottle for rotation
      this.ctx.translate(mo.x + mo.width / 2, mo.y + mo.height / 2);

      // Flip horizontally if throwing left
      if (mo.otherDirection) {
        this.ctx.scale(-1, 1);
      }

      // Rotate bottle around its center
      this.ctx.rotate((mo.rotation * Math.PI) / 100);

      // Draw from center
      this.ctx.drawImage(
        mo.img,
        -mo.width / 2,
        -mo.height / 2,
        mo.width,
        mo.height,
      );

      this.ctx.restore();
    } else {
      // logic for all other objects (Character, Chicken, Endboss)
      if (mo.otherDirection) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
      }
      this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
      this.drawDebugBox(mo);
      if (mo.otherDirection) {
        mo.x = mo.x * -1;
        this.ctx.restore();
      }
    }
  }
  drawDebugBox(mo) {
    if (
      mo instanceof Character ||
      mo instanceof Chicken ||
      mo instanceof Endboss
    ) {
      this.ctx.save();
      this.ctx.strokeStyle = "red";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        mo.x + mo.offset.left,
        mo.y + mo.offset.top,
        mo.width - mo.offset.left - mo.offset.right,
        mo.height - mo.offset.top - mo.offset.bottom,
      );
      this.ctx.restore();
    }
  }
}

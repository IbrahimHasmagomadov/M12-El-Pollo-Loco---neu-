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

  isChicken(enemy) {
    return enemy instanceof Chicken || enemy instanceof SmallChicken;
  }

  checkCollisions() {
    setInterval(() => {
      this.checkCharacterEnemyCollision();
      this.checkBottleChickenCollision();
      this.removeFinishedBottles();
    }, 50);
  }

checkCharacterEnemyCollision() {
    const collidingEnemies = this.getCollidingEnemies();

    if (this.checkChickenJump(collidingEnemies)) return;
    if (this.checkEndbossCollision(collidingEnemies)) return;

    this.checkChickenCollision(collidingEnemies);
}

  checkChickenJump(collidingEnemies) {
    const stompedChicken = this.findStompedChicken(collidingEnemies);
    if (stompedChicken) {
      this.killChickenByJump(stompedChicken);
      return true;
    }
    return false;
  }

  checkEndbossCollision(collidingEnemies) {
    const endboss = collidingEnemies.find(
      (enemy) => enemy instanceof Endboss
    ); 
    if (endboss) {
      this.hitCharacter();
      return true;
    }
    return false;
  } 

  checkChickenCollision(collidingEnemies) {
    const chicken = collidingEnemies.find(
      (enemy) => this.isChicken(enemy) && !enemy.isDead
    );
    if (chicken) {
      this.hitCharacter();
    }
  } 

  getCollidingEnemies() {
    return this.level.enemies.filter((enemy) => {
      return (
        this.character.isColliding(enemy) &&
        !this.character.isDead() &&
        !this.character.isHurt()
      );
    });
  }

  findStompedChicken(collidingEnemies) {
    return collidingEnemies.find((enemy) => {
      if (!this.isChicken(enemy) || enemy.isDead) {
        return false;
      }

      const characterBottom =
        this.character.y + this.character.height - this.character.offset.bottom;

      const enemyTop = enemy.y + enemy.offset.top;

      return this.character.speedY < 0 && characterBottom <= enemyTop + 45;
    });
  }

  killChickenByJump(chicken) {
    chicken.kill();
    this.character.speedY = 20;

    setTimeout(() => {
      let index = this.level.enemies.indexOf(chicken);
      this.level.enemies.splice(index, 1);
    }, 1000);
  }

  hitCharacter() {
    this.character.hit();
    this.statusbar.setPercentage(this.character.energy);
  }

  checkBottleChickenCollision() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (
          this.isChicken(enemy) &&
          bottle.isColliding(enemy) &&
          !enemy.isDead &&
          !bottle.hasHit
        ) {
          this.killChickenWithBottle(enemy, bottle);
        }
      });
    });
  }

  killChickenWithBottle(chicken, bottle) {
    chicken.kill();
    bottle.bottleSplash();

    setTimeout(() => {
      let index = this.level.enemies.indexOf(chicken);
      this.level.enemies.splice(index, 1);
    }, 1000);
  }

  removeFinishedBottles() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => {
      return !bottle.splashFinished;
    });
  }

  checkThrowObjects() {
    setInterval(() => {
      if (
        this.keyboard.D &&
        this.canThrow &&
        !this.character.isHurt() &&
        !this.character.isThrowing
      ) {
        this.character.throw();
        setTimeout(() => {
          let bottle = new ThrowableObject(
            this.character.otherDirection
              ? this.character.x
              : this.character.x + 100,
            this.character.y + 100,
            this.character.otherDirection,
          );
          this.throwableObjects.push(bottle);
        }, 160);
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
      this.addThrowableObjectToMap(mo);
    } else {
      this.addMovableObjectToMap(mo);
    }
  }

  addThrowableObjectToMap(mo) {
    this.ctx.save();

    this.ctx.translate(mo.x + mo.width / 2, mo.y + mo.height / 2);

    if (mo.otherDirection) {
      this.ctx.scale(-1, 1);
    }

    this.ctx.rotate((mo.rotation * Math.PI) / 100);

    this.ctx.drawImage(
      mo.img,
      -mo.width / 2,
      -mo.height / 2,
      mo.width,
      mo.height,
    );

    this.ctx.restore();
  }

  addMovableObjectToMap(mo) {
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

  drawDebugBox(mo) {
    if (
      mo instanceof Character ||
      this.isChicken(mo) ||
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

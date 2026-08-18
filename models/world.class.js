class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusbar = new Statusbar();
  bottleStatusbar = new BottleStatusbar();
  coinStatusbar = new CoinStatusbar();
  endbossStatusbar = new EndbossStatusbar();
  showEndbossStatusbar = false;
  throwableObjects = [];
  canThrow = true;
  collectedBottles = 0;
  collectedCoins = 0;
  bottleCounterImage = new Image();
  coinCounterImage = new Image();
  winScreenImage = new Image();
  debugZoom = 1; //tetweise
  gameWon = false;
  muted = false;
  running = true;
  intervalIds = [];
  animationFrameId = null;
  characterDeathSoundPlayed = false;
  score = 0;
  pointsPerCoin = 10;
  pointsPerChicken = 15;
  pointsPerSmallChicken = 20;
  pointsPerEndbossDefeat = 200;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.bottleCounterImage.src = "img/6_salsa_bottle/salsa_bottle.png";
    this.coinCounterImage.src = "img/8_coin/coin_1.png";
    this.winScreenImage.src = "img/You won, you lost/You won A.png";
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
    const intervalId = setInterval(() => {
      if (this.gameWon) {
        return;
      }
      this.checkCharacterEnemyCollision();
      this.checkBottleChickenCollision();
      this.checkCollectableObjectCollision();
      this.removeFinishedBottles();
      this.checkBottleEndbossCollision();
      this.checkEndbossActivation();
      this.checkEndbossBehavior();
      this.checkCactusCollision();
      this.checkEndbossCactusCollision();
      this.checkGameWon();
      this.checkStoneTopCollision();
      this.resetGroundYIfNotOnStone();
    }, 1000 / 30);
    this.intervalIds.push(intervalId);
  }

  checkCharacterEnemyCollision() {
    const collidingEnemies = this.getCollidingEnemies();
    if (this.checkChickenJump(collidingEnemies)) return;
    if (this.checkEndbossCollision(collidingEnemies)) return;
    this.checkChickenCollision(collidingEnemies);
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
  checkCollectableObjectCollision() {
    this.level.collectableObjects = this.level.collectableObjects.filter(
      (object) => {
        if (this.character.isColliding(object)) {
          return !this.collectObject(object);
        }

        return true;
      },
    );
  }
  removeFinishedBottles() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => {
      return !bottle.splashFinished;
    });
  }
  checkBottleEndbossCollision() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (
          enemy instanceof Endboss &&
          bottle.isColliding(enemy) &&
          !enemy.isDead &&
          !bottle.hasHit
        ) {
          enemy.hit(10);
          bottle.bottleSplash();
          playSound("stompedChicken");
          playSound("bottleSmash");
          this.endbossStatusbar.setPercentage(enemy.energy);
        }
      });
    });
  }
  checkEndbossActivation() {
    const endboss = this.level.enemies.find((enemy) => {
      return enemy instanceof Endboss;
    });
    if (!endboss) {
      return;
    }
    if (this.character.x > 3400 && !endboss.isActive) {
      endboss.activate();
      this.showEndbossStatusbar = true;
      playSound("bossFirst");
      playSound("pepe1");
    }
  }

  checkEndbossBehavior() {
    const endboss = this.level.enemies.find((enemy) => {
      return enemy instanceof Endboss;
    });

    if (!endboss) {
      return;
    }

    endboss.moveDuringJump();
    endboss.resetCactusJumpIfBackRight();

    if (endboss.shouldJumpBackRight()) {
      endboss.jumpBackRight();
      return;
    }

    if (endboss.isReturningAfterCactus) {
      endboss.moveBackRightAfterCactus();
      return;
    }

    endboss.moveToCharacter(this.character);

    if (endboss.shouldJumpToCactus(this.character)) {
      endboss.jumpToCactus();
    }
  }

  checkCactusCollision() {
    this.level.obstacles.forEach((obstacle) => {
      if (
        obstacle instanceof Cactus &&
        this.character.isColliding(obstacle) &&
        !this.character.isHurt()
      ) {
        const direction = this.character.x < obstacle.x ? -1 : 1;

        this.hitCharacter();
        this.character.startKnockback(direction);
      }
    });
  }

  checkEndbossCactusCollision() {
    const endboss = this.level.enemies.find((enemy) => {
      return enemy instanceof Endboss;
    });

    if (!endboss || endboss.isDead || endboss.hasHitCactus) {
      return;
    }

    this.level.obstacles.forEach((obstacle) => {
      if (obstacle instanceof Cactus && endboss.isColliding(obstacle)) {
        endboss.hit(20);
        playSound("stompedChicken");
        endboss.hasHitCactus = true;
        // Start return phase: boss goes back to the right instead of chasing the character
        endboss.isReturningAfterCactus = true;
        this.endbossStatusbar.setPercentage(endboss.energy);
      }
    });
  }

  checkGameWon() {
    const endboss = this.level.enemies.find((enemy) => {
      return enemy instanceof Endboss;
    });

    if (endboss && endboss.deadAnimationPlayed) {
      if (!this.winSoundPlayed) {
        this.score += this.pointsPerEndbossDefeat;
        playSound("pepeWin");
        this.winSoundPlayed = true;
        saveHighscoreIfNeeded(this.score);
        showPlayAgainButton();
      }
      this.gameWon = true;
    }
  }

  checkStoneTopCollision() {
    this.level.obstacles.forEach((obstacle) => {
      if (!(obstacle instanceof Stone)) {
        return;
      }

      const characterBottom =
        this.character.y + this.character.height - this.character.offset.bottom;

      const stoneTop = obstacle.y + obstacle.offset.top;

      if (
        this.character.isColliding(obstacle) &&
        this.character.speedY <= 0 &&
        characterBottom <= stoneTop + 30
      ) {
        this.character.currentGroundY =
          stoneTop - this.character.height + this.character.offset.bottom;
        this.character.y = this.character.currentGroundY;
        this.character.speedY = 0;
      }
    });
  }
  resetGroundYIfNotOnStone() {
    const onStone = this.level.obstacles.some((obstacle) => {
      if (!(obstacle instanceof Stone)) return false;

      const characterBottom =
        this.character.y + this.character.height - this.character.offset.bottom;
      const stoneTop = obstacle.y + obstacle.offset.top;

      return (
        this.character.x + this.character.width - this.character.offset.right >
          obstacle.x + obstacle.offset.left &&
        this.character.x + this.character.offset.left <
          obstacle.x + obstacle.width - obstacle.offset.right &&
        this.character.speedY <= 0 &&
        characterBottom >= stoneTop &&
        characterBottom <= stoneTop + 30
      );
    });

    if (!onStone) {
      this.character.currentGroundY = this.character.groundY;
    }
  }

  isObstacleBlocking(direction) {
    return this.level.obstacles.some((obstacle) => {
      if (!(obstacle instanceof Stone || obstacle instanceof Cactus)) {
        return false;
      }
      if (!this.character.isColliding(obstacle)) {
        return false;
      }
      if (direction === "right") {
        return this.character.x < obstacle.x;
      }
      if (direction === "left") {
        return this.character.x > obstacle.x;
      }
      return false;
    });
  }

  collectObject(object) {
    if (object instanceof Bottle) {
      if (this.collectedBottles < 10) {
        this.collectedBottles++;
        playSound("bottlePickup");
        this.bottleStatusbar.setPercentage(this.collectedBottles * 10);
        return true;
      }

      return false;
    }

    if (object instanceof Coin) {
      this.collectedCoins++;
      this.score += this.pointsPerCoin;
      playSound("coinPickup");
      this.coinStatusbar.setPercentage(this.collectedCoins * 10);
      return true;
    }

    return false;
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
      (enemy) => enemy instanceof Endboss && !enemy.isDead,
    );
    if (endboss) {
      this.hitCharacter();
      return true;
    }
    return false;
  }

  checkChickenCollision(collidingEnemies) {
    const chicken = collidingEnemies.find(
      (enemy) => this.isChicken(enemy) && !enemy.isDead,
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
    playSound("stompedChicken");
    this.addChickenPoints(chicken);
    this.character.speedY = 20;

    setTimeout(() => {
      let index = this.level.enemies.indexOf(chicken);
      this.level.enemies.splice(index, 1);
    }, 1000);
  }

  /**
   * Vergibt Punkte für ein besiegtes Chicken. Kleine Chicken geben
   * mehr Punkte als normale, weil sie schwerer zu treffen sind.
   * @param {Chicken|SmallChicken} chicken
   */
  addChickenPoints(chicken) {
    if (chicken instanceof SmallChicken) {
      this.score += this.pointsPerSmallChicken;
    } else {
      this.score += this.pointsPerChicken;
    }
  }

  hitCharacter() {
    if (this.character.isDead()) {
      return;
    }

    this.character.hit();
    this.statusbar.setPercentage(this.character.energy);

    if (this.character.isDead() && !this.characterDeathSoundPlayed) {
      playSound("characterDeath");
      stopWalkSound();
      this.characterDeathSoundPlayed = true;
      saveHighscoreIfNeeded(this.score);
      return;
    }

    playSound("hurt");
  }

  killChickenWithBottle(chicken, bottle) {
    chicken.kill();
    bottle.bottleSplash();
    playSound("stompedChicken");
    playSound("bottleSmash");
    this.addChickenPoints(chicken);

    setTimeout(() => {
      let index = this.level.enemies.indexOf(chicken);
      this.level.enemies.splice(index, 1);
    }, 1000);
  }

  checkThrowObjects() {
    const intervalId = setInterval(() => {
      if (this.gameWon) {
        return;
      }
      if (
        this.keyboard.D &&
        this.canThrow &&
        this.collectedBottles > 0 &&
        !this.character.isHurt() &&
        !this.character.isThrowing
      ) {
        this.character.throw();
        playSound("bottleThrow");
        setTimeout(() => {
          let bottle = new ThrowableObject(
            this.character.otherDirection
              ? this.character.x
              : this.character.x + 100,
            this.character.y + 100,
            this.character.otherDirection,
          );
          this.throwableObjects.push(bottle);
          this.collectedBottles--;
          this.bottleStatusbar.setPercentage(this.collectedBottles * 10);
        }, 160);
        this.canThrow = false;
        setTimeout(() => {
          this.canThrow = true;
        }, 900);
      }
    }, 100);
    this.intervalIds.push(intervalId);
  }

  draw() {
    if (!this.running) {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save(); //testweise
    this.ctx.scale(this.debugZoom, this.debugZoom); //testweise

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.collectableObjects);
    this.addObjectsToMap(this.level.obstacles);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);

    this.ctx.restore(); //testweise

    this.addToMap(this.statusbar);
    this.drawCollectableCounters();
    if (this.showEndbossStatusbar) {
      this.endbossStatusbar.slideIn();
      this.addToMap(this.endbossStatusbar);
    }
    if (this.gameWon) {
      this.drawWinScreen();
    }

    let self = this;
    this.animationFrameId = requestAnimationFrame(function () {
      self.draw();
    });
  }

  stop() {
    this.running = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];
  }

  drawWinScreen() {
    // Dunkler Overlay über dem ganzen Spiel, damit der Winscreen besser lesbar ist.
    this.ctx.save();
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    // Das Winscreen-Bild selbst nur noch in einer kleineren Box in der Mitte zeigen.
    const boxWidth = 500;
    const boxHeight = 260;
    const boxX = (this.canvas.width - boxWidth) / 2;
    const boxY = (this.canvas.height - boxHeight) / 2;

    this.ctx.drawImage(this.winScreenImage, boxX, boxY, boxWidth, boxHeight);

    this.drawWinScreenScore(boxX, boxY, boxWidth, boxHeight);
  }

  /**
   * Zeigt den aktuellen Punktestand und den gespeicherten Highscore
   * unterhalb des Winscreen-Bildes an. "highscore" kommt aus game.js.
   */
  drawWinScreenScore(boxX, boxY, boxWidth, boxHeight) {
    this.ctx.save();
    this.ctx.font = "bold 22px Comic Sans MS";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";

    const centerX = boxX + boxWidth / 2;
    this.ctx.fillText("Punkte: " + this.score, centerX, boxY + boxHeight + 0);
    this.ctx.fillText("Highscore: " + highscore, centerX, boxY + boxHeight + 32);

    this.ctx.restore();
  }

  drawCollectableCounters() {
    this.ctx.font = "bold 32px Comic Sans MS";
    this.ctx.fillStyle = "white";

    this.ctx.drawImage(this.bottleCounterImage, 8, 55, 50, 55);
    this.ctx.fillText(this.collectedBottles, 60, 95);

    this.ctx.drawImage(this.coinCounterImage, 95, 45, 80, 80);
    this.ctx.fillText(this.collectedCoins, 165, 95);

    this.drawScore();
  }

  drawScore() {
    this.ctx.font = "bold 22px Comic Sans MS";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Punkte: " + this.score, 30, 145);
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
      mo instanceof Endboss ||
      mo instanceof Obstacle
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
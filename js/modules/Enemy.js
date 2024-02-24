import { EnemyBullet } from "./EnemyBullet.js";

export class Enemy {
  constructor(game) {
    this.game = game;
    this.element = document.createElement("div");
    this.element.className = "game-object game-object__enemy-tank";
    this.element.style.position = "absolute";
    this.element.style.width = "60px";
    this.element.style.height = "60px";
    this.bullets = [];
    this.speed = 3;
    this.shootingInterval = setInterval(() => this.shoot(), 1000);
    this.direction = this.getRandomDirection();
    this.moveInterval = setInterval(() => this.move(), 50);
    this.marked = false;
  }

  getRandomDirection() {
    const directions = [1, 2, 3, 4];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  hit() {
    console.log("GOT HIT HELP PLS AAAA 💥");
    clearInterval(this.moveInterval);
    clearInterval(this.shootingInterval);
    this.marked = true;
    this.element.remove();
    this.bullets.forEach((bullet) => {
      bullet.marked = true;
      bullet.element.remove();
    })
    this.bullets = this.bullets.filter((bullet) => !bullet.marked);
    this.game.enemies = this.game.enemies.filter((enemy) => !enemy.marked);
    this.game.points++;
    this.game.pointsElement.innerHTML = `Points: ${this.game.points}`;
  }

  move() {
    let newX = parseInt(this.element.style.left) || 0;
    let newY = parseInt(this.element.style.top) || 0;

    switch (this.direction) {
      case 1:
        newY -= this.speed;
        this.element.style.rotate = "0deg";
        break;
      case 2:
        newY += this.speed;
        this.element.style.rotate = "180deg";
        break;
      case 3:
        newX -= this.speed;
        this.element.style.rotate = "270deg";
        break;
      case 4:
        newX += this.speed;
        this.element.style.rotate = "90deg";
        break;
    }

    if (
      newY <= 0 ||
      newY >= this.game.height - this.element.offsetHeight ||
      newX <= 0 ||
      newX >= this.game.width - this.element.offsetWidth
    ) {
      this.direction = this.getRandomDirection();
    }

    if (this.canMoveTo(newX, newY)) {
      // console.log(this.canMoveTo(newX, newY));
      this.element.style.left = `${newX}px`;
      this.element.style.top = `${newY}px`;
    } else {
      // console.log("can't move");
      this.direction = this.getRandomDirection();
    }

    this.bullets.forEach((bullet) => {
      bullet.update();
    });
    if (this.bullets.length > 0) {
      this.bullets.forEach((bullet) => {
        if (bullet.marked) {
          bullet.element.remove();
          this.bullets = this.bullets.filter((bullet) => !bullet.marked);
        }
      });
    }
  }

  canMoveTo(newX, newY) {
    const { width, height } = this.game;
    const { element } = this;
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    if (newY < 0 || newY + elementHeight > height) {
      return false;
    }

    if (newX < 0 || newX + elementWidth > width) {
      return false;
    }

    for (const wall of this.game.ui.walls) {
      const wallX = parseInt(wall.x, 10);
      const wallY = parseInt(wall.y, 10);
      if (
        newX < wallX + wall.width &&
        newX + elementWidth > wallX &&
        newY < wallY + wall.height &&
        newY + elementHeight > wallY
      ) {
        return false;
      }
    }

    const playerX = this.game.player.element.offsetLeft;
    const playerY = this.game.player.element.offsetTop;
    const playerWidth = this.game.player.element.offsetWidth;
    const playerHeight = this.game.player.element.offsetHeight;

    if (
      newX < playerX + playerWidth &&
      newX + elementWidth > playerX &&
      newY < playerY + playerHeight &&
      newY + elementHeight > playerY
    ) {
      return false;
    }

    for (const enemy of this.game.enemies) {
      if (enemy !== this && !enemy.marked) {
          const enemyX = parseInt(enemy.element.style.left) || 0;
          const enemyY = parseInt(enemy.element.style.top) || 0;
          const enemyWidth = enemy.element.offsetWidth;
          const enemyHeight = enemy.element.offsetHeight;

          if (
              newX < enemyX + enemyWidth &&
              newX + elementWidth > enemyX &&
              newY < enemyY + enemyHeight &&
              newY + elementHeight > enemyY
          ) {
              return false;
          }
      }
  }

    return true;
  }

  shoot() {
    const bullet = new EnemyBullet(
      this.game,
      this.element.offsetLeft + 32,
      this.element.offsetTop + 32,
      this.direction
    );
    this.bullets.push(bullet);
    bullet.draw(this.game.container);
  }

  draw(container) {
    container.appendChild(this.element);

    this.bullets.forEach((bullet) => {
      bullet.update();
      bullet.draw(this.game.container);
      // console.log(bullet.marked);
      if (bullet.marked) {
        bullet.element.remove();
      }
    });
  }
}

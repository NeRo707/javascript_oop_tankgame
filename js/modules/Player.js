import { PLAYER_SPEED } from "../main.js";
import { Bullet } from "./Bullet.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.element = document.getElementById("player-tank");
    this.element.style.position = "relative";
    this.element.style.left = "200px";
    this.element.style.top = "800px";
    this.element.style.width = "60px";
    this.element.style.height = "60px";
    this.bullets = [];
    this.direction = 1;
  }

  hit() {
    console.log(this.game.hp);
    // console.log("hit");
    this.game.hp--;
    this.element.style.left = "200px";
    this.element.style.top = "800px";
    const hearts = document.getElementById("hearts");
    hearts.innerHTML = `player tank ${"❤️".repeat(this.game.hp)}`;
  }

  move() {
    let newX = parseInt(this.element.style.left, 10) || 0;
    let newY = parseInt(this.element.style.top, 10) || 0;

    // console.log(newX, newY);
    if (newY < 0) {
      newY = 0;
    }
    if (newY > this.game.height - this.element.offsetHeight) {
      newY = this.game.height - this.element.offsetHeight;
    }
    if (newX < 0) {
      newX = 0;
    }
    if (newX > this.game.width - this.element.offsetWidth) {
      newX = this.game.width - this.element.offsetWidth;
    }

    if (
      this.game.keys.includes("ArrowUp") &&
      !this.game.keys.includes("ArrowLeft") &&
      !this.game.keys.includes("ArrowRight")
    ) {
      newY -= PLAYER_SPEED;
      this.element.style.rotate = "0deg";
      this.direction = 1;
    }
    if (
      this.game.keys.includes("ArrowDown") &&
      !this.game.keys.includes("ArrowLeft") &&
      !this.game.keys.includes("ArrowRight")
    ) {
      newY += PLAYER_SPEED;
      this.element.style.rotate = "180deg";
      this.direction = 2;
    }
    if (
      this.game.keys.includes("ArrowLeft") &&
      !this.game.keys.includes("ArrowUp") &&
      !this.game.keys.includes("ArrowDown")
    ) {
      newX -= PLAYER_SPEED;
      this.element.style.rotate = "270deg";
      this.direction = 3;
    }
    if (
      this.game.keys.includes("ArrowRight") &&
      !this.game.keys.includes("ArrowUp") &&
      !this.game.keys.includes("ArrowDown")
    ) {
      newX += PLAYER_SPEED;
      this.element.style.rotate = "90deg";
      this.direction = 4;
    }

    if (this.canMoveTo(newX, newY)) {
      // console.log(this.canMoveTo(newX, newY));
      this.element.style.left = `${newX}px`;
      this.element.style.top = `${newY}px`;
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

  draw() {
    this.bullets.forEach((bullet) => {
      bullet.update();
      bullet.draw(this.game.container);
      // console.log(bullet.marked);
      if (bullet.marked) {
        bullet.element.remove();
      }
    });
  }

  shoot() {
    // console.log(this.bullets);
    if (this.bullets.length == 0)
      this.bullets.push(
        new Bullet(
          this.game,
          this.x + this.width / 2.5,
          this.y + this.height / 2.5,
          this.direction
        )
      );
  }

  canMoveTo(newX, newY) {
    const elementWidth = this.element.offsetWidth;
    const elementHeight = this.element.offsetHeight;

    for (const wall of this.game.ui.walls) {
      if (
        newX < wall.x + wall.width &&
        newX + elementWidth > wall.x &&
        newY < wall.y + wall.height &&
        newY + elementHeight > wall.y
      ) {
        return false;
      }
    }

    const enemies = this.game.enemies;
    for (const enemy of enemies) {
      const enemyX = enemy.element.offsetLeft;
      const enemyY = enemy.element.offsetTop;
      const enemyWidth = enemy.element.offsetWidth;
      const enemyHeight = enemy.element.offsetHeight;

      if (
        newX < enemyX + enemyWidth &&
        newX + elementWidth > enemyX &&
        newY < enemyY + enemyHeight &&
        newY + elementHeight > enemyY
      ) {
        console.log("enemy-touch");
        return false;
      }
    }

    return true;
  }
}

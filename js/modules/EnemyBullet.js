export class EnemyBullet {
  constructor(game, x, y, direction) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.speed = 20;
    this.marked = false;
    this.direction = direction;
    this.element = document.createElement("div");

    // this.x = this.game.enemy.element.offsetLeft + 32;
    // this.y = this.game.enemy.element.offsetTop + 32;
  }

  update() {
    switch (this.direction) {
      case 1:
        this.y -= this.speed;
        if (this.y < 0 || !this.canMoveTo(this.x, this.y)) {
          // console.log(this.y < 0 || !this.canMoveTo(this.x, this.y));
          this.marked = true;
        }
        break;
      case 2:
        this.y += this.speed;
        if (this.y > this.game.height || !this.canMoveTo(this.x, this.y)) {
          this.marked = true;
        }
        break;
      case 3:
        this.x -= this.speed;
        if (this.x < 0 || !this.canMoveTo(this.x, this.y)) {
          this.marked = true;
        }
        break;
      case 4:
        this.x += this.speed;
        if (this.x > this.game.width || !this.canMoveTo(this.x, this.y)) {
          this.marked = true;
        }
        break;
      default:
        break;
    }
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    for (const wall of this.game.ui.walls) {
      if (this.collidesWith(wall)) {
        console.log("hit");
        wall.hit();
        this.marked = true;
      }
    }

    const player = this.game.player;
    // console.log(player);

    const playerX = player.element.offsetLeft;
    const playerY = player.element.offsetTop;
    const playerWidth = player.element.offsetWidth;
    const playerHeight = player.element.offsetHeight;

    if (
      this.x < playerX + playerWidth &&
      this.x + this.width > playerX &&
      this.y < playerY + playerHeight &&
      this.y + this.height > playerY
    ) {
      player.hit();
      this.marked = true;
      console.log("player-hit");
    }
  }

  collidesWith(object) {
    return (
      this.x < object.x + object.width &&
      this.x + this.width > object.x &&
      this.y < object.y + object.height &&
      this.y + this.height > object.y
    );
  }

  draw(container) {
    // console.log(container);
    const bulletDiv = this.element;
    bulletDiv.className = "game-object game-object__bullet_enemy";
    bulletDiv.style.position = "absolute";
    bulletDiv.style.width = "10px";
    bulletDiv.style.height = "10px";
    bulletDiv.style.backgroundColor = "red";

    bulletDiv.style.left = `${this.x}px`;
    bulletDiv.style.top = `${this.y}px`;

    container.appendChild(bulletDiv);

    this.element = bulletDiv;
  }

  canMoveTo(newX, newY) {
    for (const wall of this.game.ui.walls) {
      if (
        newX < wall.x + wall.width &&
        newX + this.width > wall.x &&
        newY < wall.y + wall.height &&
        newY + this.height > wall.y
      ) {
        return false;
      }
    }
    return true;
  }

  remove() {
    this.element.remove();
    this.marked = true;
  }
}
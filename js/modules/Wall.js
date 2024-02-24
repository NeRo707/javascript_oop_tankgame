import { MAP } from "../map.js";

export class Wall {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;
    this.wallClass = "game-object game-object__wall";
    this.hp = 3;
    this.opacity = 1;

    this.element = this.createDivElement();
  }

  createDivElement() {
    const wallDiv = document.createElement("div");
    wallDiv.className = this.wallClass;
    wallDiv.style.position = "absolute";
    wallDiv.style.left = `${this.x}px`;
    wallDiv.style.top = `${this.y}px`;
    wallDiv.style.width = `${this.width}px`;
    wallDiv.style.height = `${this.height}px`;
    wallDiv.style.opacity = `${this.opacity}`;

    wallDiv.setAttribute("data-x", this.x);
    wallDiv.setAttribute("data-y", this.y);

    return wallDiv;
  }

  hit() {
    this.hp--;
    this.opacity -= 0.2;
    if (this.hp <= 0) {
      this.remove();
    } else {
      this.element.style.opacity = this.opacity;
    }
  }

  remove() {
    this.element.remove();

    this.game.ui.walls = this.game.ui.walls.filter((wall) => wall !== this);

    const mapX = this.x / 64;
    const mapY = this.y / 64;
    MAP[mapY][mapX] = 0;
  }

  draw(container) {
    container.appendChild(this.element);
  }
}

import { MAP, MAP_LEGEND } from "../map.js";
import { Wall } from "../modules/Wall.js";

export class UI {
  constructor(game) {
    this.game = game;
    this.game.map = game.container;
    this.walls = [];
  }

  initializeWalls(container = this.game.map) {
    // console.log(container);
    container.style.position = "relative";
    for (let y = 0; y < MAP.length; y++) {
      for (let x = 0; x < MAP[y].length; x++) {
        if (MAP[y][x] === MAP_LEGEND.WALL) {
          const wall = new Wall(this.game, x * 64, y * 64);
          this.walls.push(wall);
          wall.draw(container);
        }
      }
    }
  }

  removeWall() {
    this.walls.forEach((wall) => {
      wall.remove();
    });
    this.walls = [];
  }
}

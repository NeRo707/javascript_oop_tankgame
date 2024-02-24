import { MAP, MAP_LEGEND } from "./map.js";
import { Player } from "./modules/Player.js";
import { InputHandler } from "./modules/InputHandler.js";
import { UI } from "./modules/UI.js";
import { Enemy } from "./modules/Enemy.js";

const GAME_TIMER_INTERVAL = 50;
const IS_GAME_OVER = false;

export const PLAYER_SPEED = 5;

class Game {
  constructor() {
    this.container = document.getElementById("game-map");
    this.pointsElement = document.getElementById("points");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.ui = new UI(this);
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.keys = [];
    this.enemies = [];
    this.hp = 3;
    this.points = 0;
  }

  createEnemiesFromMap() {
    for (let y = 0; y < MAP.length; y++) {
      for (let x = 0; x < MAP[y].length; x++) {
        if (MAP[y][x] === MAP_LEGEND.ENEMY_BASE) {
          const enemy = new Enemy(this);
          enemy.element.style.left = `${x * 64}px`;
          enemy.element.style.top = `${y * 64}px`;
          this.enemies.push(enemy);
        }
      }
    }
  }

  update() {
    this.player.draw();
    this.player.move();
    this.enemies.forEach((enemy) => {
      enemy.move();
    });
    // console.log(this.points);
    if (this.points >= 24) { // change to 3 or 1 if you want to test it
      alert("YOU WIN!");
      window.location.reload();
    }

    if (this.hp <= 0) {
      alert("YOU LOSE!");
      window.location.reload();
    }
  }
  draw() {
    this.ui.initializeWalls(this.container);
    this.enemies.forEach((enemy) => {
      enemy.draw(this.container);
    });
  }
}

const game = new Game();

game.createEnemiesFromMap();
game.draw();

function animate() {
  if (IS_GAME_OVER !== true) {
    game.update();
    // console.log(game.enemies.length);
    if (game.enemies.length < 3) {
      const enemy = new Enemy(game);

      const positions = [
        { x: 6, y: 0 },
        { x: 1, y: 1 },
        { x: 11, y: 1 },
      ];

      const getRandomPos = (positions) => {
        const pos = Math.floor(Math.random() * positions.length);
        return positions[pos];
      };

      // console.log(getRandomPos(positions));

      const { x, y } = getRandomPos(positions);
      enemy.element.style.left = `${x * 64}px`;
      enemy.element.style.top = `${y * 64}px`;
      enemy.draw(game.container);
      game.enemies.push(enemy);
    }
    setTimeout(animate, GAME_TIMER_INTERVAL);
  }
}
animate();

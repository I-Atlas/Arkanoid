import Draw from "./utils/draw";
import Input from "./utils/input";

// GAME PARAMS
export const game = {
  SIDE: 0.03,
  BALL_SPEED: 0.5,
  BALL_SPIN: 0.2,
  PADDLE_SPEED: 0.6,
  PADDLE_WIDTH: 0.11,
  BRICK_ROWS: 2,
  BRICK_COLUMN: 6,
  BRICK_GAP: 0.3,
  BRICK_MARGIN: 6,
  MAXIMUM_LEVEL: 10,
  LIVES: 3,
  SCORE: 0,
  ENHANCEMENT_CHANCE: 0.2,
  ENHANCEMENT_SPEED: 0.15,
};

// ENHANCEMENT TYPES
export const enhancement = {
  /* LIFE ENHANCEMENT
    An enhancement that adds 1 life.
    If the number of lives is more than 3, then this enhancement gives an additional 10 points.
    (#DB4437 (red) color)
    */
  LIFE: {
    color: "rgb(219,68,55)",
    symbol: "❤️", // L : ❤️
  },

  /* DEATH ENHANCEMENT*
    An enhancement* (in fact it is anti enhancement) that removes 1 life.
    If the number of lives is less than 1, then game over.
    (#D3D3D3 (lightgray) color)
    */
  DEATH: {
    color: "rgb(109,7,26)",
    symbol: "☠️", // D : ☠️
  },

  /* GLUE ENHANCEMENT
    An enhancement that gives adhesion to the ball to the platform.
    (#4285F4 (yellow) color)
    */
  GLUE: {
    color: "rgb(244,160,0)",
    symbol: "🔒", // G : 🔒
  },

  /* SUPER ENHANCEMENT
    An enhancement that gives the ball the ability to not bounce off bricks.
    (#4285F4 (blue) color)
    */
  SUPER: {
    color: "rgb(66,133,244)",
    symbol: "🌀", // S : 🌀
  },

  /* EXTENSION ENHANCEMENT
    An enhancement that doubles the platform width.
    (#0f9d58 (green) color)
    */
  EXTENSION: {
    color: "rgb(15,157,88)",
    symbol: "✳️", // E : ✳️
  },
};

// CALL CLASSES
export const draw = new Draw();
export const input = new Input();

// CANVAS AND CONTEXT
export const canvas = document.getElementById("arkanoid");
export const ctx = canvas.getContext("2d");

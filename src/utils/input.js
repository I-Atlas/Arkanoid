import {
  ballStart,
  paddleMove,
  startNewGame,
  gameOver,
  gameWin,
} from "../functions";

/* INPUT CLASS
The class responsible for managing the platform.
*/
export default class Input {
  constructor() {
    this.left = 0;
    this.right = 1;
    this.stop = 2;

    // KEY DOWN HANDLER
    document.addEventListener("keydown", (event) => {
      switch (event.keyCode) {
        case 32: // SPACE BAR STARTS THE BALL
          ballStart();
          if (gameOver == true || gameWin == true) {
            startNewGame();
          }
          break;
        case 37: // LEFT ARROW MOVES PADDLE LEFT
          paddleMove(this.left);
          break;
        case 39: // RIGHT ARROW MOVES PADDLE RIGHT
          paddleMove(this.right);
          break;
      }
    });

    // KEY UP HANDLER
    document.addEventListener("keyup", (event) => {
      switch (event.keyCode) {
        case 37: // LEFT ARROW STOPS MOVING
        case 39: // RIGHT ARROW STOPS MOVING
          paddleMove(this.stop);
          break;
      }
    });
  }
}

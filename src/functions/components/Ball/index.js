import { game } from "../../../constants";
import { paddle, height, side } from "../..";

/* BALL CLASS
The class responsible for the ball.
*/
export default class Ball {
  constructor() {
    this.width = side / 1.5;
    this.height = side / 1.5;
    this.x = paddle.x;
    this.y = paddle.y - paddle.height / 2 - this.height / 2;
    this.speed = game.BALL_SPEED * height;
    this.speedX = 0;
    this.speedY = 0;
  }
}

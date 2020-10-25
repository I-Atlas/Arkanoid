import { game } from "../../../constants";
import { height } from "../..";

/* ENHANCEMENT CLASS
The class responsible for the enhancements.
*/
export default class Enhancement {
  constructor(x, y, size, type) {
    this.width = size;
    this.height = size;
    this.x = x;
    this.y = y;
    this.type = type;
    this.speedY = game.ENHANCEMENT_SPEED * height;
  }
}

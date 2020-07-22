import { game } from "../constants"
import { width, height, side } from "./functions"

/* PADDLE CLASS
The class responsible for the platform.
*/
export default class Paddle {
    constructor() {
        this.width = game.PADDLE_WIDTH * width
        this.height = side
        this.x = width / 2
        this.y = height - this.height * 3
        this.speed = game.PADDLE_SPEED * width
        this.speedX = 0
    }
}
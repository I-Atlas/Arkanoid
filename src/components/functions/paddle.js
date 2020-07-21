import { game, input, paddle, side, width, height } from "../constants"

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

// PADDLE MOVEMENT HANDLER
export const paddleMove = (event) => {
    switch (event) {
        case input.left:
            paddle.speedX = -paddle.speed
            break
        case input.right:
            paddle.speedX = paddle.speed
            break
        case input.stop:
            paddle.speedX = 0
            break
    }
}

// PADDLE UPDATE HANDLER
export const paddleUpdate = (delta) => {
    paddle.x += paddle.speedX * delta
    
    // PLATFORM STOPS AT SIDES
    if (paddle.x < side + paddle.width * 0.5) {
        paddle.x = side + paddle.width * 0.5
    } else if (paddle.x > width - side - paddle.width * 0.5) {
        paddle.x = width - side - paddle.width * 0.5
    }
}
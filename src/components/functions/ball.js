import { game, paddle, ball, width, height, side } from "../constants"
import { startNewGame } from "../../new"

/* BALL CLASS
The class responsible for the ball.
*/
export default class Ball {
    constructor() {
        this.width = side / 1.5
        this.height = side / 1.5
        this.x = paddle.x
        this.y = paddle.y - paddle.height / 2 - this.height / 2
        this.speed = game.BALL_SPEED * height
        this.speedX = 0
        this.speedY = 0
    }
}

// BALL SPEED HANDLER
const ballSpeed = (angle) => {
    // KEEPS ANGLE BETWEEN 30° AND 150°
    if (angle < Math.PI / 6) {
        angle = Math.PI / 6
    } else if (angle > Math.PI * 5 / 6) {
        angle = Math.PI * 5 / 6
    }
    // UPDATES THE SPEED OF THE BALL MOVEMENT IN THE X AND Y COORDINATES
    ball.speedX = ball.speed * Math.cos(angle)
    ball.speedY = -ball.speed * Math.sin(angle)
}

// BALL START HANDLER
export const ballStart = () => {
    // IF BALL IN MOTION
    if (ball.speedY != 0) {
        return false
    }

    // RANDOM BALL MOVEMENT ANGLE BETWEEN 60° AND 150°
    let angle = Math.random() * Math.PI / 2 + Math.PI / 3
    ballSpeed(angle)
    return true
}

// BALL UPDATE HANDLER
export const ballUpdate = (delta) => {
    ball.x += ball.speedX * delta
    ball.y += ball.speedY * delta

    // BALL BOUNCE OFF THE SIDES
    if (ball.x < side + ball.width * 0.5) {
        ball.x = side + ball.width * 0.5
        ball.speedX = -ball.speedX
    } else if (ball.x > width - side - ball.width * 0.5) {
        ball.x = width - side - ball.width * 0.5
        ball.speedX = -ball.speedX
    } else if (ball.y < side + ball.height * 0.5) {
        ball.y = side + ball.height * 0.5
        ball.speedY = -ball.speedY
    }

    // BALL BOUNCE OFF THE PLATFORM
    if (ball.y > paddle.y - paddle.height * 0.5 - ball.height * 0.5
        && ball.y < paddle.y
        && ball.x > paddle.x - paddle.width * 0.5 - ball.width * 0.5
        && ball.x < paddle.x + paddle.width * 0.5 + ball.width * 0.5) {
            ball.y = paddle.y - paddle.height * 0.5 - ball.height * 0.5
            ball.speedY = -ball.speedY

            // CHANGES THE BALL BOUNCE ANGLE (BASED ON THE BALL SPIN)
            let angle = Math.atan2(-ball.speedY, ball.speedX)
            angle += (Math.random() * Math.PI / 2 - Math.PI / 4) * game.BALL_SPIN
            ballSpeed(angle)
    }

    // OUT OF BOUNDS HANDLER
    if (ball.y > height) {
        startNewGame()
        // start.newGame
    }

    // MOVES THE BALL ALONG WITH THE PLATFORM (WHEN IT IS STATIC)
    if (ball.speedY == 0) {
        ball.x = paddle.x
    }
}
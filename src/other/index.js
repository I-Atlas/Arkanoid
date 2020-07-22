import Draw from "./draw"
import Input from "./input"
import { game } from "./constants"

// CANVAS
const canvas = document.getElementById("arkanoid")
export const ctx = canvas.getContext("2d")

// DIMENSIONS
export let width, height, side

// GAME VARIABLES
export let ball, paddle, bricks = [], level

/* BALL CLASS
The class responsible for the ball.
*/
class Ball {
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

/* PADDLE CLASS
The class responsible for the platform.
*/
class Paddle {
    constructor() {
        this.width = game.PADDLE_WIDTH * width
        this.height = side
        this.x = width / 2
        this.y = height - this.height * 3
        this.speed = game.PADDLE_SPEED * width
        this.speedX = 0
    }
}

/* BRICK CLASS
The class responsible for the bricks.
*/
class Brick {
    constructor(left, top, width, height, color) {
        this.width = width
        this.height = height
        this.bottom = top + height
        this.left = left
        this.right = left + width
        this.top = top
        this.color = color
    }
}

// CALL THE CLASSES
const input = new Input()
const draw = new Draw()

/* RESPONSIVE CANVAS DESIGN FUNCTION
The function responsible for the responsiveness of the canvas.
*/
const responsive = () => {
    height = window.innerHeight
    width = window.innerWidth
    side = game.SIDE * (height < width ? height : width)
    canvas.width = width
    canvas.height = height
    ctx.lineWidth = side
    startNewGame()
}
window.addEventListener("resize", responsive)

// START NEW GAME HANDLER
export const startNewGame = () => {
    paddle = new Paddle()
    ball = new Ball()
    level = 0
    createBricks()
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
    }

    // MOVES THE BALL ALONG WITH THE PLATFORM (WHEN IT IS STATIC)
    if (ball.speedY == 0) {
        ball.x = paddle.x
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

/* CREATE BRICKS FUNCTION
The function responsible for the bricks creation.
*/
export const createBricks = () => {

    // ROW DIMENTIONS
    let minimumLevelY = side
    let maximumLevelY = ball.y - ball.height * 3.5
    let totalSpaceY = maximumLevelY - minimumLevelY
    let totalRows = game.BRICK_MARGIN + game.BRICK_ROWS + game.GAME_LEVEL
    let rowHeight = totalSpaceY / totalRows
    let gap = side * game.BRICK_GAP
    let brickHeight = rowHeight - gap

    //COLUMN DIMENTIONS
    let totalSpaceX = width - side * 2
    let columnWidth = (totalSpaceX - gap) / game.BRICK_COLUMN
    let brickWidth = columnWidth - gap

    // POPULATE THE BRICKS ARRAY
    bricks = []
    let columns = game.BRICK_COLUMN
    let rows = game.BRICK_ROWS + level * 2
    let color, left, top;
    for (let i = 0; i < rows; i++) {
        bricks[i] = []
        color = "rgb(252, 155, 55)"
        top = side + (game.BRICK_MARGIN + i) * rowHeight
        for (let j = 0; j < columns; j++) {
            left = side + gap + j * columnWidth
            bricks[i][j] = new Brick(left, top, brickWidth, brickHeight, color)
        }
    }    
}

// CREATE NEW GAME HANDLER
const createNewGame = () => {
    requestAnimationFrame(draw.drawGame)
    responsive()
}

createNewGame()
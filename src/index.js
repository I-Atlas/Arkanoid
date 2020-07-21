// import Draw from "./draw"
import Input from "./input"

// CANVAS
const canvas = document.getElementById("arkanoid")
export const ctx = canvas.getContext("2d")

// GAME PARAMS
const game = {
    SIDE: 0.03,
    BALL_SPEED: 0.6,
    BALL_SPIN: 0.2,
    PADDLE_SPEED: 0.6,
    PADDLE_WIDTH: 0.1,
    BRICK_ROWS: 8,
    BRICK_COLUMN: 9,
    BRICK_GAP: 0.3,
    BRICK_MARGIN: 6,
    GAME_LEVEL: 10
}

// DIMENSIONS
export let width, height, side

// GAME VARIABLES
export let ball, paddle, bricks = [], level

/* BALL CLASS
The class responsible for the ball.
*/
class Ball {
    constructor() {
        this.width = side
        this.height = side
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
        this.bot = top + height
        this.left = left
        this.right = left + width
        this.top = top
        this.color = color
    }
}

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
const startNewGame = () => {
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

export const createBricks = () => {

    // ROW DIMENTIONS
    let minimumLevelY = side
    let maximumLevelY = ball.y - ball.height * 3.5
    let totalSpaceY = maximumLevelY - minimumLevelY
    let totalRows = game.BRICK_MARGIN + game.BRICK_ROWS + game.GAME_LEVEL * 2
    let rowHeight = totalSpaceY / totalRows
    let gap = side * game.BRICK_GAP
    let height = rowHeight - gap

    //COLUMN DIMENTIONS
    let totalSpaceX = width - side * 2
    let columnWidth = (totalSpaceX - gap) / game.BRICK_COLUMN
    let width = columnWidth - gap

    // POPULATE THE BRICKS ARRAY
    bricks = []
    let columns = game.BRICK_COLUMN
    let rows = game.BRICK_ROWS + level * 2
    let color, left, top;
    for (let i = 0; i < rows; i++) {
        bricks[i] = []
        color = "white"
        top = side + (game.BRICK_MARGIN + i) * rowHeight
        for (let j = 0; j < columns; j++) {
            left = side + gap + j * columnWidth
            bricks[i][j] = new Brick(left, top, width, height, color)
        }
    }
    
}

export default class Draw {
    constructor() {
        // COLORS
        this.backgroundColor = "rgb(0, 0, 0)"
        this.sideColor = "rgb(94, 94, 94)"
        this.ballColor = "rgb(255, 255, 255)"
        this.paddleColor = "rgb(255, 255, 255)"

        // DRAW GAME VARIABLES
        this.deltaTime
        this.lastTime
    }

    /* DRAW BACKGROUND FUNCTION
    The function that is responsible for drawing the background of the game.
    (#000000 (black) color)
    */
    drawBackground() {
        ctx.fillStyle = this.backgroundColor
        ctx.fillRect(0, 0, width, height)
    }

    /* DRAW SIDES FUNCTION
    The function that is responsible for drawing the sides of the game.
    (#5e5e5e (dark gray) color)
    */
    drawSides() {
    let sideHeight = side * 0.5
    ctx.strokeStyle = this.sideColor
    ctx.beginPath()
    ctx.moveTo(sideHeight, height)
    ctx.lineTo(sideHeight, sideHeight)
    ctx.lineTo(width - sideHeight, sideHeight)
    ctx.lineTo(width - sideHeight, height)
    ctx.stroke()
    }

    /* DRAW BALL FUNCTION
    The function that is responsible for drawing the ball of the game.
    (#ffffff (white) color)
    */
    drawBall() {
        ctx.fillStyle = this.ballColor
        ctx.fillRect(ball.x - ball.width * 0.5, ball.y - ball.height * 0.5, ball.width, ball.height)
    }

    /* DRAW PADDLE FUNCTION
    The function that is responsible for drawing the paddle of the game.
    (#ffffff (white) color)
    */
    drawPaddle() {
        ctx.fillStyle = this.paddleColor
        ctx.fillRect(paddle.x - paddle.width * 0.5, paddle.y - paddle.height * 0.5, paddle.width, paddle.height)
    }

    drawBricks() {
        for (let row of bricks) {
            for (let brick of row) {
                ctx.fillStyle = brick.color
                ctx.fillRect(brick.left, brick.top, brick.width, brick.height)
            }
        }
    }

    /* DRAW GAME FUNCTION
    The main game function,
    which is responsible for rendering and updating elements.
    */
    drawGame = (timestamp) => {
        if (!this.lastTime) {
            this.lastTime = timestamp
        }

        // TIME DIFFERENCE CALCULATION
        this.deltaTime = (timestamp - this.lastTime) * 0.001 // 0.001 - IS SECONDS
        this.lastTime = timestamp

        // UPDATE ELEMENTS
        paddleUpdate(this.deltaTime)
        ballUpdate(this.deltaTime)

        // GAME ELEMENTS
        this.drawBackground()
        this.drawSides()
        this.drawBall()
        this.drawPaddle()
        this.drawBricks()

        // CREATE NEXT GAME LOOP
        requestAnimationFrame(this.drawGame)
    }
}

// CALL CLASSES
const input = new Input()
const draw = new Draw()

// CREATE NEW GAME HANDLER
const createNewGame = () => {
    requestAnimationFrame(draw.drawGame)
    startNewGame()
    responsive()
}

createNewGame()
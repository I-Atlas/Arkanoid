const canvas = document.getElementById("arkanoid")
const ctx = canvas.getContext("2d")

// GAME PARAMS
const game = {
    SIDE: 0.03,
    BALL_SPEED: 0.6,
    BALL_SPIN: 0.2,
    PADDLE_SPEED: 0.6,
    PADDLE_WIDTH: 0.1
}

// DIMENSIONS
let width, height, side

// GAME VARIABLES
let ball, paddle

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

/* INPUT CLASS
The class responsible for managing the platform.
*/
class Input {
    constructor() {
        this.left =  0
        this.right = 1
        this.stop = 2

        document.addEventListener("keydown", event => {
            switch (event.keyCode) {
                case 32: // SPACE BAR STARTS THE BALL
                    ballStart()
                    break
                case 37: // LEFT ARROW MOVES PADDLE LEFT
                    paddleMove(this.left)
                    // console.log("37")
                    break
                case 39: // RIGHT ARROW MOVES PADDLE RIGHT
                    paddleMove(this.right)
                    break
            }
        })

        document.addEventListener("keyup", event => {
            switch (event.keyCode) {
                case 37: // LEFT ARROW STOPS MOVING
                case 39: // RIGHT ARROW STOPS MOVING
                    paddleMove(this.stop)
                    break
            }
        })
    }
}

/* DRAW CLASS
The class responsible for drawing elements.
*/
class Draw {
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

        // CREATE NEXT GAME LOOP
        requestAnimationFrame(this.drawGame)
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
    input = new Input()
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
const ballStart = () => {
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
const ballUpdate = (delta) => {
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
const paddleMove = (DIRECTION) => {
    switch (DIRECTION) {
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
const paddleUpdate = (delta) => {
    paddle.x += paddle.speedX * delta
    // stop paddle at sides
    if (paddle.x < side + paddle.width * 0.5) {
        paddle.x = side + paddle.width * 0.5
    } else if (paddle.x > width - side - paddle.width * 0.5) {
        paddle.x = width - side - paddle.width * 0.5
    }
}

// CALL DRAW CLASS
draw = new Draw()

// CREATE NEW GAME HANDLER
const createNewGame = () => {
    requestAnimationFrame(draw.drawGame)
    startNewGame()
    responsive()
}

createNewGame()
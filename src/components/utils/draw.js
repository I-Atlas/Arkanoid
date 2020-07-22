import { ctx } from "../constants"
import { ballUpdate, paddleUpdate, bricksUpdate, ball, paddle, bricks, width, height, side } from "../functions/functions"

/* DRAW CLASS
The class responsible for drawing elements.
*/
export default class Draw {
    constructor() {
        // COLORS
        this.backgroundColor = "rgb(11, 31, 42)"
        this.sideColor = "rgb(164, 170, 174)"
        this.ballColor = "rgb(255, 255, 255)"
        this.paddleColor = "rgb(66, 133, 244)"

        // DRAW GAME VARIABLES
        this.deltaTime
        this.lastTime
    }

    /* DRAW BACKGROUND FUNCTION
    The function that is responsible for drawing the background of the game.
    (#0B1F2A (deep blue) color)
    */
    drawBackground() {
        ctx.fillStyle = this.backgroundColor
        ctx.fillRect(0, 0, width, height)
    }

    /* DRAW SIDES FUNCTION
    The function that is responsible for drawing the sides of the game.
    (#A4AAAE (mercedes gray) color)
    */
    drawSides() {
    let sideHeight = side / 2
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
        ctx.fillRect(ball.x - ball.width / 2, ball.y - ball.height / 2, ball.width, ball.height)
    }

    /* DRAW PADDLE FUNCTION
    The function that is responsible for drawing the paddle of the game.
    (#4285F4 (blue) color)
    */
    drawPaddle() {
        ctx.fillStyle = this.paddleColor
        ctx.fillRect(paddle.x - paddle.width / 2, paddle.y - paddle.height / 2, paddle.width, paddle.height)
    }

    /* DRAW BRICKS FUNCTION
    The function that is responsible for drawing the bricks.
    (rgb (red to greeen) color)
    */
    drawBricks() {
        for (let row of bricks) {
            for (let brick of row) {
                if (brick === null) {
                    continue
                }
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
        bricksUpdate(this.deltaTime)


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
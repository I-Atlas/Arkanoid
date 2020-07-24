import { ctx, game } from "../constants"
import { ballUpdate, paddleUpdate, bricksUpdate,
         ball, paddle, bricks,
         width, height, side, margin,
         lives, level, score, bestScore,
         textHight, textWidth,
         gameOver, gameWin } from "../functions/functions"

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
        this.textColor = "rgb(255, 255, 255)"
        
        // TEXT
        this.fontText = "Roboto"
        this.levelText = "LEVEL"
        this.livesText = "LIVES"
        this.scoreText = "SCORE"
        this.bestScoreText = "BEST"
        this.gameOverText = "GAME OVER"
        this.gameWinText = "YOU WIN"

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

    /* DRAW BACKGROUND FUNCTION
    The function that is responsible for drawing all text of the game.
    (#ffffff (white) color)
    */
    drawText() {
        let labelSize = textHight / 2
        
        let levelX = width / 2.5
        let levelWidth = textWidth / 5

        let livesX = margin
        let livesWidth = textWidth / 4

        let scoreX = width / 1.7
        let scoreWidth = textWidth / 5

        let bestScoreX = width - margin
        let bestScoreWidth = textWidth / 4

        let label = side + labelSize
        let value = label + textHight
        
        ctx.fillStyle = this.textColor
        ctx.font = `${labelSize}px ${this.fontText}`
        ctx.textAlign = "center"

        ctx.fillText(this.levelText, levelX, label, levelWidth)
        ctx.fillText(level, levelX, value, levelWidth)

        ctx.fillText(this.livesText, livesX, label, livesWidth)
        ctx.fillText(`${lives}|${game.LIVES}`, livesX, value, livesWidth)

        ctx.fillText(this.scoreText, scoreX, label, scoreWidth)
        ctx.fillText(score, scoreX, value, scoreWidth)

        ctx.fillText(this.bestScoreText, bestScoreX, label, bestScoreWidth)
        ctx.fillText(bestScore, bestScoreX, value, bestScoreWidth)

        // (GAME OVER) OR (YOU WIN) TEXT
        if (gameOver == true || gameWin == true) {
            let gameText = gameOver ? this.gameOverText : this.gameWinText
            ctx.fillText(gameText, width / 2, paddle.y - textHight, textWidth)
        }
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
        if (gameOver == false || gameWin == false) {
            paddleUpdate(this.deltaTime)
            ballUpdate(this.deltaTime)
            bricksUpdate(this.deltaTime)
        }
        
        // GAME ELEMENTS
        this.drawBackground()
        this.drawText()
        this.drawSides()
        this.drawBall()
        this.drawPaddle()
        this.drawBricks()

        // CREATE NEXT GAME LOOP
        requestAnimationFrame(this.drawGame)
    }
}
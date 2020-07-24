import Ball from "./ball"
import Paddle from "./paddle"
import Brick from "./brick"
import { ctx, canvas, input, game } from "../constants"

// DIMENSIONS
export let width, height, side, margin

// GAME VARIABLES
export let ball, paddle, bricks = [], bricksCount,
           level, lives, score, bestScore,
           textHight, textWidth,
           gameOver, gameWin

           //let textWidth = width - margin * 2
           //let margin = side * 5
/* RESPONSIVE CANVAS DESIGN FUNCTION
The function responsible for the responsiveness of the canvas.
*/
export const responsive = () => {
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
    level = 3 // 0 -- game.MAXIMUM_LEVEL
    lives = game.LIVES
    score = 0

    gameOver = false
    gameWin = false

    let localScore = localStorage.getItem(game.SCORE)
    if (localScore == null) {
        bestScore = 0
    } else {
        bestScore = localScore
    }

    startNewLevel()
}

// START NEW LEVEL HANDLER
const startNewLevel = () => {
    playerUpdate()
    createBricks()
}

// PLAYER (BALL AND PADDLE) UPDATE HANDLER
const playerUpdate = () => {
    paddle = new Paddle()
    ball = new Ball()
}

// OUT OF BOTTOM BOUNDS HANDLER
const outOfBounds = () => {
    lives--
    if (lives == 0) {
        gameOver = true
    }
    playerUpdate()
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
    if (ball.x < side + ball.width / 2) {
        ball.x = side + ball.width / 2
        ball.speedX = -ball.speedX
    } else if (ball.x > width - side - ball.width / 2) {
        ball.x = width - side - ball.width / 2
        ball.speedX = -ball.speedX
    } else if (ball.y < side + ball.height / 2) {
        ball.y = side + ball.height / 2
        ball.speedY = -ball.speedY
    }

    // BALL BOUNCE OFF THE PLATFORM
    if (ball.y > paddle.y - paddle.height / 2 - ball.height / 2
        && ball.y < paddle.y
        && ball.x > paddle.x - paddle.width / 2 - ball.width / 2
        && ball.x < paddle.x + paddle.width / 2 + ball.width / 2) {
            ball.y = paddle.y - paddle.height / 2 - ball.height / 2
            ball.speedY = -ball.speedY

            // CHANGES THE BALL BOUNCE ANGLE (BASED ON THE BALL SPIN)
            let angle = Math.atan2(-ball.speedY, ball.speedX)
            angle += (Math.random() * Math.PI / 2 - Math.PI / 4) * game.BALL_SPIN
            ballSpeed(angle)
    }

    // OUT OF BOUNDS HANDLER
    if (ball.y > height) {
        outOfBounds()
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
    if (paddle.x < side + paddle.width / 2) {
        paddle.x = side + paddle.width / 2
    } else if (paddle.x > width - side - paddle.width / 2) {
        paddle.x = width - side - paddle.width / 2
    }
}

/* CREATE BRICKS FUNCTION
The function responsible for the bricks creation.
*/
const createBricks = () => {
    let minimumLevelY = side
    let maximumLevelY = ball.y - ball.height * 2.5

    let totalSpaceY = maximumLevelY - minimumLevelY
    let totalSpaceX = width - side * 2

    let totalRows = game.BRICK_MARGIN + game.BRICK_ROWS + game.MAXIMUM_LEVEL
    let rowHeight = totalSpaceY / totalRows

    let gap = side * game.BRICK_GAP
    let columns = game.BRICK_COLUMN
    let rows = game.BRICK_ROWS + level * 2 - 2

    let columnWidth = (totalSpaceX - gap) / game.BRICK_COLUMN

    let brickHeight = rowHeight - gap
    let brickWidth = columnWidth - gap
    
    let top, left, color, grade, supremeGrade, score

    // FILL THE BRICKS ARRAY
    for (let i = 0; i < rows; i++) {
        top = side + (game.BRICK_MARGIN + i) * rowHeight
        margin = side * 5

        grade = Math.floor(i / 2)
        supremeGrade = rows / 2

        textHight = rowHeight * game.BRICK_MARGIN / 2
        textWidth = width - margin * 2

        bricks[i] = []
        bricksCount = columns* rows

        color = brickColor(grade, supremeGrade)
        score = (supremeGrade - grade) * 2
        
        for (let j = 0; j < columns; j++) {
            left = side + gap + j * columnWidth

            bricks[i][j] = new Brick(left, top, brickWidth, brickHeight, color, score)
        }
    }    
}

/* BRICKS COLOR FUNCTION
The function responsible for the bricks color.
*/
const brickColor = (grade, supremeGrade) => {

    // grade = position, supremeGrade = max position
    let section = grade / supremeGrade

    // red = 0, orange = 0.33, yellow = 0.66, green = 1
    let red, green, blue

    if (section <= 0.67) {
        red = 255
        green = 255 * section / 0.67
        blue = 255 * section / 3

    } else {
        red = 255 * (1 - section) / 0.33
        green = 255
        blue = 255 * section / 2
    }

    return `rgb(${red}, ${green}, ${blue})`
}

/* BRICKS COLOR FUNCTION
The function responsible for the bricks and ball collision detection.
*/
export const bricksUpdate = () => {
    for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < game.BRICK_COLUMN; j++) {
            if (bricks[i][j] != null && bricks[i][j].collision(ball)) {
                scoreUpdate(bricks[i][j].score)
                bricks[i][j] = null
                bricksCount--
                ball.speedY = -ball.speedY
                break
            }
        }
    }

    if (bricksCount == 0) {
        if (level < game.MAXIMUM_LEVEL) {
            level++
            startNewLevel()
        } else {
            gameOver = false
            gameWin = true
            playerUpdate()
        }
    }
}

// SCORE UPDATE HANDLER
const scoreUpdate = (brickScore) => {
    score += brickScore

    if (score > bestScore) {
        bestScore = score
        localStorage.setItem(game.SCORE, bestScore)
    }
}
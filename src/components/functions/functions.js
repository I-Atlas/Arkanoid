import Ball from "./ball"
import Paddle from "./paddle"
import Brick from "./brick"
import Enhancement from "./enhancement"
import { canvas, input, game, enhancement } from "../constants"

// GAME VARIABLES AND DIMENSIONS
export let width, height, side, margin,
           ball, paddle, bricks = [], bricksCount,
           enhancements = [],enhancementGlue, enhancementSuper, enhancementExtension,
           level, lives, score, bestScore,
           textHight, textWidth,
           gameOver, gameWin

/* RESPONSIVE CANVAS DESIGN FUNCTION
The function responsible for the responsiveness of the canvas.
*/
export const responsive = () => {
    height = window.innerHeight
    width = window.innerWidth
    side = game.SIDE * (height < width ? height : width)
    
    canvas.width = width
    canvas.height = height

    startNewGame()
}

// RESIZE EVENT LISTENER
window.addEventListener("resize", responsive)

// START NEW GAME HANDLER
export const startNewGame = () => {
    level = 1 // 0 - test level, game.MAXIMUN_LEVEL - maximum level
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

// PLAYER (BALL, PADDLE AND ENHANCEMENTS) UPDATE HANDLER
const playerUpdate = () => {
    paddle = new Paddle()
    ball = new Ball()
    newEnhancements()
}

// ENHANCEMENTS UPDATER FOR EACH NEW LEVEL AND NEW GAME
const newEnhancements = () => {
    enhancementExtension = false
    enhancementSuper = false
    enhancementGlue = false
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

/* CREATE BRICKS FUNCTION
The function responsible for the bricks creation.
*/
const createBricks = () => {
    let minimumLevelY = side
    let maximumLevelY = ball.y - ball.height * 4.5

    let totalSpaceY = maximumLevelY - minimumLevelY
    let totalSpaceX = width - side * 2

    let totalRows = game.BRICK_MARGIN + game.BRICK_ROWS + game.MAXIMUM_LEVEL
    let rowHeight = totalSpaceY / totalRows

    let gap = side * game.BRICK_GAP
    let columns = game.BRICK_COLUMN
    let rows = game.BRICK_ROWS + level - 2

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
        bricksCount = columns * rows

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

    // RGB
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

            // GLUE ENHANCEMENT HANDLER
            if (enhancementGlue == true) {
                ball.speedX = 0
                ball.speedY = 0
            } else {
                ball.speedY = -ball.speedY

                // CHANGES THE BALL BOUNCE ANGLE (BASED ON THE BALL SPIN)
                let angle = Math.atan2(-ball.speedY, ball.speedX)
                angle += (Math.random() * Math.PI / 2 - Math.PI / 4) * game.BALL_SPIN
                ballSpeed(angle)
            }
        }   

    // OUT OF BOUNDS HANDLER
    if (ball.y > height) {
        outOfBounds()
    }
}

// PADDLE UPDATE HANDLER
export const paddleUpdate = (delta) => {
    const paddleX = paddle.x
    paddle.x += paddle.speedX * delta
    
    // PLATFORM STOPS AT SIDES
    if (paddle.x < side + paddle.width / 2) {
        paddle.x = side + paddle.width / 2
    } else if (paddle.x > width - side - paddle.width / 2) {
        paddle.x = width - side - paddle.width / 2
    }


    // MOVES THE BALL ALONG WITH THE PLATFORM (WHEN IT IS STATIC)
    if (ball.speedY == 0 && ball.speedY == 0) {
        ball.x += paddle.x - paddleX
    }

    /* COLLECT ENHANCEMENTS HANDLER
    An explanation how the enhancements works now is in the file constants.js
    */
    for (let i = enhancements.length - 1; i >= 0; i--) {
        if (enhancements[i].x + enhancements[i].width / 2 > paddle.x - paddle.width / 2
            && enhancements[i].x - enhancements[i].width / 2 < paddle.x + paddle.width / 2
            && enhancements[i].y + enhancements[i].height / 2 > paddle.y - paddle.height / 2
            && enhancements[i].y - enhancements[i].height / 2 < paddle.y + paddle.height / 2) {

                switch(enhancements[i].type) {

                    case enhancement.LIFE:
                        lives++
                        if (lives > 3) {
                            score += 5
                        }
                        break

                    case enhancement.DEATH:
                        lives--
                        if (lives == 0) {
                            gameOver = true
                        }
                        break    

                    case enhancement.GLUE:
                        if (enhancementGlue == true) {
                            score += 10
                        } else {
                            enhancementGlue = true
                        }
                        break

                    case enhancement.SUPER:
                        if (enhancementSuper == true) {
                            score += 15
                        } else {
                            enhancementSuper = true
                        }
                        break

                    case enhancement.EXTENSION:
                        if (enhancementExtension == true) {
                            score += 20
                        } else {
                            enhancementExtension = true
                            paddle.width *= 2
                        }
                        break
                }
            enhancements.splice(i, 1)
        }
    }
}

// BRICKS UPDATE HANDLER
export const bricksUpdate = () => {
    for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < game.BRICK_COLUMN; j++) {
            if (bricks[i][j] != null && bricks[i][j].collision(ball)) {
                scoreUpdate(bricks[i][j].score)

                // CREATE ENHANCEMENTS IN BRICKS
                if (Math.random() < game.ENHANCEMENT_CHANCE) {
                    let enhancementX = bricks[i][j].left + bricks[i][j].width / 2
                    let enhancementY = bricks[i][j].top + bricks[i][j].width / 2

                    let enhancementSize = bricks[i][j].width / 2

                    let enhancementKeys = Object.keys(enhancement)
                    let enhancementKey = enhancementKeys[Math.floor(Math.random() * enhancementKeys.length)]

                    enhancements.push(new Enhancement(enhancementX,
                                                      enhancementY,
                                                      enhancementSize,
                                                      enhancement[enhancementKey]))
                }

                if (enhancementSuper == false) {
                    ball.speedY = -ball.speedY
                }

                bricks[i][j] = null
                bricksCount--

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

// ENHANCEMENT UPDATE HANDLER
export const enhancementUpdate = (delta) => {
    for (let i = enhancements.length - 1; i >= 0; i--) {
        enhancements[i].y += enhancements[i].speedY * delta

        if (enhancements[i].y - enhancements[i].height / 2 > height) {
            enhancements.splice(i, 1)
        }
    }
}
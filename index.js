const canvas = document.getElementById("arkanoid")
const ctx = canvas.getContext("2d")

ctx.canvas.width = window.innerWidth
ctx.canvas.height = window.innerHeight

let score = 0
let lives = 3

const ballRadius = 10
const paddleHeight = 10, paddleWidth = 200

let rightPressed = false
let leftPressed = false

let paddleX = (canvas.width-paddleWidth)/2
let x = canvas.width/2, y = canvas.height/2
let dx = 2, dy = -2

let brickRowCount = 6
let brickColumnCount = 11
let brickWidth = 120
let brickHeight = 40
let brickPadding = 20
let brickOffsetTop = 30
let brickOffsetLeft = 30

let bricks = []
for (let column = 0; column < brickColumnCount; column++) {
    bricks[column] = []
    for (let row = 0; row < brickRowCount; row++) {
        bricks[column][row] = { 
            x: 0,
            y: 0,
            status: 1
        }
    }
}

const keyDownHandler = (e) => {
    if(e.keyCode == 39) {
        rightPressed = true
    }
    else if(e.keyCode == 37) {
        leftPressed = true
    }
}

const keyUpHandler = (e) => {
    if(e.keyCode == 39) {
        rightPressed = false
    }
    else if(e.keyCode == 37) {
        leftPressed = false
    }
}

const mouseMoveHandler = (e) => {
    let relativeX = e.clientX - canvas.offsetLeft
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2
    }
}

document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)
document.addEventListener("mousemove", mouseMoveHandler, false)

const collisionDetection = () => {
    for (let column = 0; column < brickColumnCount; column++) {
        for (let row = 0; row < brickRowCount; row++) {
            let brick = bricks[column][row]
            if (brick.status == 1) {
                if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
                    dy = -dy
                    brick.status = 0
                    score++
                    if (score == brickRowCount*brickColumnCount) {
                        alert("WIN")
                        document.location.reload()
                        // clearInterval(interval)
                    }
                }
            }
        }
    }
}

const drawBall = () => {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI*2)
    ctx.fillStyle = "#D9534F"
    ctx.fill()
    ctx.closePath()
}

const drawPaddle = () => {
    ctx.beginPath()
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight)
    ctx.fillStyle = "#F2C273"
    ctx.fill()
    ctx.closePath()
}

const drawBricks = () => {
    for(let column = 0; column < brickColumnCount; column++) {
        for(let row = 0; row < brickRowCount; row++) {
            if (bricks[column][row].status == 1) {
                let brickX = (column * (brickWidth + brickPadding)) + brickOffsetLeft
                let brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop

                bricks[column][row] = {
                    x: brickX,
                    y: brickY,
                    status: 1
                }

                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight)
                ctx.fillStyle = "#F81941"
                ctx.fill()
                ctx.closePath()
            }
        }
    }
}

const drawScore = () => {
    ctx.font = "20px Roboto"
    ctx.fillStyle = "black"
    ctx.fillText("Score: "+score, 15,25)
}

const drawLives = () => {
    ctx.font = "20px Roboto"
    ctx.fillStyle = "black"
    ctx.fillText("Lives: "+lives, canvas.width - 75,25)
}

const drawGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBricks()
    drawBall()
    drawPaddle()
    collisionDetection()
    drawScore()
    drawLives()
   
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx
    }
    
    if(y + dy < ballRadius + paddleHeight) {
        dy = -dy
    } else if (y + dx > canvas.height-ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy
        } else {
            lives--
            if (!lives) {
                alert("Game Over")
                document.location.reload()
                // clearInterval(interval)
            } else {
                x = canvas.width/2
                y = canvas.height-40
                dx = 2
                dy = -2
                paddleX = (canvas.width-paddleWidth)/2
            }

            // Swal.fire({
            //     title: `GAME OVER`,
            //     text: '',
            //     icon: 'error',
            //     })

            // alert("Game over")
            // document.location.reload()
            // clearInterval(interval)
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 10;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 10;
    }

    x += dx
    y += dy
    requestAnimationFrame(drawGame)
}

drawGame()
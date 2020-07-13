const canvas = document.getElementById("arkanoid")
const ctx = canvas.getContext("2d")

ctx.canvas.width = window.innerWidth
ctx.canvas.height = window.innerHeight

const ballRadius = 10
const paddleHeight = 20, paddleWidth = 200

let paddleX = (canvas.width-paddleWidth)/2
let x = canvas.width/2, y = canvas.height/2
let dx = 2, dy = -2

const drawBall = () => {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI*2)
    ctx.fillStyle = "#D9534F"
    ctx.fill()
    ctx.closePath()
}

function drawPaddle() {
    ctx.beginPath()
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight)
    ctx.fillStyle = "#F2C273"
    ctx.fill()
    ctx.closePath()
}

const drawGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBall()
    drawPaddle()
   
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx
    }
    
    if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
        dy = -dy
    }

    x += dx
    y += dy
}

setInterval(drawGame, 1)
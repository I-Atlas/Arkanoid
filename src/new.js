import { ctx, canvas, paddle, ball, draw, game, width as defaultWidth, height as defaultHeight, side as defaultSide, level as defaultLevel } from "./components/constants"
import Paddle from "./components/functions/paddle"
import Ball from "./components/functions/ball"
import { createBricks } from "./components/functions/bricks"

let width = defaultWidth
let height = defaultHeight
let side = defaultSide
let level = defaultLevel

/* CLASS Start
The class responsible for the responsive and new game functions.
*/
// export default class Start {
//     constructor() {
//         this.width = width
//         this.height = height
//         this.side = side
//         this.level = level
//     }
    
//     /* RESPONSIVE CANVAS DESIGN FUNCTION
//     The function responsible for the responsiveness of the canvas.
//     */
//     responsive() {
//         this.height = window.innerHeight
//         this.width = window.innerWidth
//         this.side = game.SIDE * (this.height < this.width ? this.height : this.width)
//         canvas.width = this.width
//         canvas.height = this.height
//         ctx.lineWidth = this.side
//         startNewGame()
//     }

//     newGame() {
//         paddle
//         ball
//         this.level = 0
//         createBricks()
//     }
// }

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

// CREATE NEW GAME HANDLER
const createNewGame = () => {
    requestAnimationFrame(draw.drawGame)
    responsive
}

// START GAME
createNewGame()
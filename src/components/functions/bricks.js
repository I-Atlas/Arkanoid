import { game, ball, bricks, width, side, level } from "../constants"

/* BRICK CLASS
The class responsible for the bricks.
*/
export default class Brick {
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

    // COLUMN DIMENTIONS
    let totalSpaceX = width - side * 2
    let columnWidth = (totalSpaceX - gap) / game.BRICK_COLUMN
    let brickWidth = columnWidth - gap

    // FILL THE BRICKS ARRAY
    // let bricks = [] // ?
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
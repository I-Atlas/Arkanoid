import Draw from "./utils/draw"
import Input from "./utils/input"

// GAME PARAMS
export const game = {
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

// CALL CLASSES
export const draw = new Draw()
export const input = new Input()

// CANVAS
export const canvas = document.getElementById("arkanoid")
export const ctx = canvas.getContext("2d")
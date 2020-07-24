/* BRICK CLASS
The class responsible for the bricks.
*/
export default class Brick {
    constructor(left, top, width, height, color, score) {
        this.width = width
        this.height = height
        this.bottom = top + height
        this.left = left
        this.right = left + width
        this.top = top
        this.color = color
        this.score = score

        this.collision = (ball) => {
            let ballTop = ball.y - ball.height / 2
            let ballBottom = ball.y + ball.height / 2
            let ballLeft = ball.x - ball.width / 2
            let ballRight = ball.x + ball.width / 2

            return ballTop < this.bottom && ballBottom > this.top && ballLeft < this.right &&  ballRight >  this.left
        }   
    }
}
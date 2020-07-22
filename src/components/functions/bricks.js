/* BRICK CLASS
The class responsible for the bricks.
*/
export default class Bricks {
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
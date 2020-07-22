import { draw } from "./components/constants"
import { responsive } from "./components/functions/functions"

// CREATE NEW GAME HANDLER
const createNewGame = () => {
    requestAnimationFrame(draw.drawGame)
    responsive()
}

// START GAME
createNewGame()
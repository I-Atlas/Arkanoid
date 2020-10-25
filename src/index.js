import { draw } from "./constants";
import { responsive } from "./functions";
import "./index.css";

// CREATE NEW GAME HANDLER
const createNewGame = () => {
  requestAnimationFrame(draw.drawGame);
  responsive();
};

// START GAME
createNewGame();

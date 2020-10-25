import { ctx, game, enhancement } from "../constants";
import {
  ballUpdate,
  paddleUpdate,
  bricksUpdate,
  enhancementUpdate,
  width,
  height,
  side,
  margin,
  ball,
  paddle,
  bricks,
  enhancements,
  enhancementSuper,
  enhancementGlue,
  lives,
  level,
  score,
  bestScore,
  textHight,
  textWidth,
  gameStart,
  gameOver,
  gameWin,
} from "../functions";

/* DRAW CLASS
The class responsible for drawing elements.
*/
export default class Draw {
  constructor() {
    // COLORS
    this.backgroundColor = "rgb(11, 31, 42)";
    this.sideColor = "rgb(164, 170, 174)";
    this.ballColor = "rgb(255, 255, 255)";
    this.paddleColor = "rgb(66, 133, 244)";
    this.textColor = "rgb(255, 255, 255)";

    // TEXT
    this.fontText = "Roboto";
    this.levelText = "LEVEL";
    this.livesText = "LIVES";
    this.scoreText = "SCORE";
    this.bestScoreText = "BEST";
    this.gameOverText = "GAME OVER";
    this.gameStartText = "PRESS SPACE TO START THE GAME";
    this.lifeEnhancementHint = "❤️ - ADDS 1 LIFE";
    this.deathEnhancementHint = "☠️ - REMOVES 1 LIFE";
    this.glueEnhancementHint = "🔒 - BALL STICKS TO PLATFORM";
    this.superEnhancementHint = "🌀 - BALL DOESN'T BOUNCE OFF BRICKS";
    this.extensionEnhancementHint = "✳️ - X2 PLATFORM WIDTH";
    this.gameWinText = "YOU WIN";

    // DRAW GAME VARIABLES
    this.deltaTime;
    this.lastTime;
  }

  /* DRAW BACKGROUND FUNCTION
    The function that is responsible for drawing the background of the game.
    (#0B1F2A (deep blue) color)
    */
  drawBackground() {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  /* DRAW BACKGROUND FUNCTION
    The function that is responsible for drawing all text of the game.
    (#ffffff (white) color)
    */
  drawText() {
    let allTextWidth = textWidth / 5;
    let labelSize = textHight / 2.5;

    let levelX = width / 2.5;
    let livesX = margin;
    let scoreX = width / 1.7;
    let bestScoreX = width - margin;

    let label = side + labelSize;
    let value = label + textHight;

    ctx.fillStyle = this.textColor;
    ctx.font = `${labelSize}px ${this.fontText}`;
    ctx.textAlign = "center";

    ctx.fillText(this.levelText, levelX, label, allTextWidth);
    ctx.fillText(level, levelX, value, allTextWidth);

    ctx.fillText(this.livesText, livesX, label, allTextWidth);
    ctx.fillText(`${lives}|${game.LIVES}`, livesX, value, allTextWidth);

    ctx.fillText(this.scoreText, scoreX, label, allTextWidth);
    ctx.fillText(score, scoreX, value, allTextWidth);

    ctx.fillText(this.bestScoreText, bestScoreX, label, allTextWidth);
    ctx.fillText(bestScore, bestScoreX, value, allTextWidth);

    // (GAME OVER) OR (YOU WIN) TEXT
    if (gameOver == true || gameWin == true) {
      let gameText = gameOver ? this.gameOverText : this.gameWinText;
      ctx.fillText(gameText, width / 2, paddle.y - textHight, textWidth);
    }

    // GAME START TEXT
    if (gameStart == true) {
      ctx.fillText(
        this.superEnhancementHint,
        width / 2,
        paddle.y - textHight - 300,
        textWidth
      );
      ctx.fillText(
        this.glueEnhancementHint,
        width / 2,
        paddle.y - textHight - 230,
        textWidth
      );
      ctx.fillText(
        this.extensionEnhancementHint,
        width / 2,
        paddle.y - textHight - 160,
        textWidth
      );
      ctx.fillText(
        this.deathEnhancementHint,
        width / 2,
        paddle.y - textHight - 90,
        textWidth
      );
      ctx.fillText(
        this.lifeEnhancementHint,
        width / 2,
        paddle.y - textHight - 20,
        textWidth
      );
      ctx.fillText(
        this.gameStartText,
        width / 2,
        paddle.y - textHight + 70,
        textWidth
      );
    }
  }

  /* DRAW SIDES FUNCTION
    The function that is responsible for drawing the sides of the game.
    (#A4AAAE (mercedes gray) color)
    */
  drawSides() {
    let sideHeight = side / 2;

    ctx.lineWidth = side;
    ctx.strokeStyle = this.sideColor;
    ctx.beginPath();
    ctx.moveTo(sideHeight, height);
    ctx.lineTo(sideHeight, sideHeight);
    ctx.lineTo(width - sideHeight, sideHeight);
    ctx.lineTo(width - sideHeight, height);
    ctx.stroke();
  }

  /* DRAW BALL FUNCTION
    The function that is responsible for drawing the ball of the game.
    (#ffffff (white) color)
    */
  drawBall() {
    ctx.fillStyle = enhancementSuper ? enhancement.SUPER.color : this.ballColor;
    ctx.fillRect(
      ball.x - ball.width / 2,
      ball.y - ball.height / 2,
      ball.width,
      ball.height
    );
  }

  /* DRAW PADDLE FUNCTION
    The function that is responsible for drawing the paddle of the game.
    (#4285F4 (blue) color)
    */
  drawPaddle() {
    ctx.fillStyle = enhancementGlue ? enhancement.GLUE.color : this.paddleColor;
    ctx.fillRect(
      paddle.x - paddle.width / 2,
      paddle.y - paddle.height / 2,
      paddle.width,
      paddle.height
    );
  }

  /* DRAW BRICKS FUNCTION
    The function that is responsible for drawing the bricks.
    (rgb (red to greeen) color)
    */
  drawBricks() {
    for (let row of bricks) {
      for (let brick of row) {
        if (brick == null) {
          continue;
        }

        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.left, brick.top, brick.width, brick.height);
      }
    }
  }

  /* DRAW ENHANCEMENT FUNCTION
    The function that is responsible for drawing the enhancements.
    (rgb (red to greeen) color)
    */
  drawEnhancements() {
    for (let enhancement of enhancements) {
      /* YOU CAN USE THE CODE BELOW IF THE ENHANCEMENT SYMBOLS ARE NOT EMOJI */

      // ctx.lineWidth = side / 2
      // ctx.fillStyle = enhancement.type.color
      // ctx.strokeStyle = enhancement.type.color
      // ctx.strokeRect(enhancement.x - enhancement.width / 4, enhancement.y - enhancement.height / 4, enhancement.width / 2, enhancement.height / 2)
      ctx.fillText(enhancement.type.symbol, enhancement.x, enhancement.y);
    }
  }

  /* DRAW GAME FUNCTION
    The main game function,
    which is responsible for rendering and updating elements.
    */
  drawGame = (timestamp) => {
    if (!this.lastTime) {
      this.lastTime = timestamp;
    }

    // TIME DIFFERENCE CALCULATION
    this.deltaTime = (timestamp - this.lastTime) * 0.001; // 0.001 - IS SECONDS
    this.lastTime = timestamp;

    // UPDATE ELEMENTS
    if (gameOver == false || gameWin == false) {
      paddleUpdate(this.deltaTime);
      ballUpdate(this.deltaTime);
      bricksUpdate(this.deltaTime);
      enhancementUpdate(this.deltaTime);
    }

    // GAME ELEMENTS
    this.drawBackground();
    this.drawText();
    this.drawSides();
    this.drawBall();
    this.drawPaddle();
    this.drawBricks();
    this.drawEnhancements();

    // CREATE NEXT GAME LOOP
    requestAnimationFrame(this.drawGame);
  };
}

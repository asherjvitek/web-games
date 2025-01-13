/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game");
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");
/** @type {HTMLImageElement} */
let svg = document.getElementById("food");

document.addEventListener("keydown", handleKeyPress);

/** The size of the grid that you would like the snake to be in */
const gridSize = 1000;
/** The size of the boxes in the grid. Should be something that is divisible by the gridSize */
const boxSize = 50;
const evenBoxes = boxSize * 2;
/** The time that the sanke waits to move in ms */
const startingSpeed = 500;
const speedIncrease = 10;
const maxSpeed = 150;
const logging = false;

/** @class Position
 * @field {int} x
 * @field {int} y
 */


/** The game state. Holds most of the information about where the snake is going and the position of the food.
 * @class
 * @field {string} direction
 * @field {Position} foodPos
 * @field {Position[]} snake
 */
let state = getDefaultState();

function getDefaultState() {
    return {
        direction: "right",
        foodPos: {
            x: 0,
            y: 0,
        },
        snake: [
            { x: 0, y: 0 },
            { x: 50, y: 0 },
            { x: 100, y: 0 },
            { x: 150, y: 0 },
        ],
        timeout: null,
        snakeSpeed: startingSpeed,
    }
}

//const snakeHead = {
//    "right": [0, 40, 40, 0],
//    "down": [0, 0, 40, 40],
//    "left": [40, 0, 0, 40],
//    "up": [40, 40, 0, 0],
//};

function makeBoard() {
    for (let y = 0; y < gridSize; y += boxSize) {
        for (let x = 0; x < gridSize; x += boxSize) {
            context.fillStyle = getFillStyle(x, y);
            context.fillRect(x, y, boxSize, boxSize);
        }
    }
}

function getFillStyle(x, y) {
    if (y % evenBoxes === 0) {
        if (x % evenBoxes === 0) {
            return "green";
        } else {
            return "lightgreen";
        }
    } else {
        if (x % evenBoxes === 0) {
            return "lightgreen";
        } else {
            return "green";
        }
    }
}

function drawSnake() {
    const snake = state.snake;
    for (let i = 0; i < snake.length; i++) {
        const e = snake[i];

        if (i === snake.length - 1) {
            context.fillStyle = "darkblue";
            context.fillRect(e.x, e.y, boxSize, boxSize);
        } else {
            context.fillStyle = "blue";
            context.fillRect(e.x, e.y, boxSize, boxSize);
        }
    }
}



function moveSnake() {
    let newHead = { x: state.snake[0].x, y: state.snake[0].y };

    context.fillStyle = getFillStyle(newHead.x, newHead.y)
    context.fillRect(newHead.x, newHead.y, boxSize, boxSize);

    let head = state.snake[state.snake.length - 1];
    newHead.x = head.x;
    newHead.y = head.y;

    switch (state.direction) {
        case "right":
            newHead.x += boxSize;
            if (newHead.x >= gridSize) {
                newHead.x = 0;
            }
            break;
        case "down":
            newHead.y += boxSize;
            if (newHead.y >= gridSize) {
                newHead.y = 0;
            }
            break;
        case "left":
            newHead.x -= boxSize;
            if (newHead.x < 0) {
                newHead.x = gridSize - boxSize;
            }
            break;
        case "up":
            newHead.y -= boxSize;
            if (newHead.y < 0) {
                newHead.y = gridSize - boxSize;
            }
            break;
        default:
            break;
    }

    if (state.snake.find(x => x.x === newHead.x && x.y === newHead.y) !== undefined) {
        alert(`Game Over. You ate ${state.snake.length - 4} strawberries!`);
        startGame();
        return;
    }

    state.snake.push(newHead);

    if (!(newHead.x == state.foodPos.x && newHead.y == state.foodPos.y)) {
        _ = state.snake.shift()
    } else {
        placeFood();
        state.snakeSpeed = Math.max(maxSpeed, state.snakeSpeed - speedIncrease);
    }

    drawSnake();

    state.timeout = setTimeout(() => {
        moveSnake();
    }, state.snakeSpeed)
}

/** @function 
 * @name handleKeyPress
 * @argument {KeyboardEvent} e */
function handleKeyPress(e) {
    log(e.key);
    switch (e.key) {
        case "a":
        case "ArrowLeft":
            if (state.direction == "right") {
                return;
            }

            state.direction = "left";
            break;
        case "s":
        case "ArrowDown":
            if (state.direction === "up") {
                return;
            }
            state.direction = "down";
            break;
        case "d":
        case "ArrowRight":
            if (state.direction === "left") {
                return;
            }
            state.direction = "right";
            break;
        case "w":
        case "ArrowUp":
            if (state.direction === "down") {
                return;
            }
            state.direction = "up";
            break;
        default:
            return;
    }

    clearTimeout(state.timeout);
    moveSnake();
}

function configureGamePad() {
    if (!("getGamepads" in navigator)) {
        console.info("The browser does not support the controllers API!.");
        return;
    }

    function update() {
        var gamePads = navigator.getGamepads();


        for (let i = 0; i < gamePads.length; i++) {
            const gp = gamePads[i];

            gp.buttons.forEach((button, index) => {
                if (button.pressed) {
                    log(`Button ${button}, ${index} was pressed`);
                    switch (index) {
                        case 12:
                            handleKeyPress({ key: "w" });
                            return;
                        case 13:
                            handleKeyPress({ key: "s" });
                            return;
                        case 14:
                            handleKeyPress({ key: "a" });
                            return;
                        case 15:
                            handleKeyPress({ key: "d" });
                            return;
                        default:
                            break;
                    }
                }
            });

            //gp.axes.forEach((axis, index) => {
            //    console.log(`Axis ${axis}, ${index} was pressed`);
            //});
        }

        setTimeout(() => {
            requestAnimationFrame(update);
        }, 80);
    }

    update();
}

function placeFood() {
    while (true) {
        state.foodPos.x = Math.floor(Math.random() * 999);
        state.foodPos.y = Math.floor(Math.random() * 999);

        state.foodPos.x -= state.foodPos.x % boxSize;
        state.foodPos.y -= state.foodPos.y % boxSize;

        if (state.snake.find(x => x.x === state.foodPos.x && x.y === state.foodPos.y) === undefined) {
            break;
        }
    }

    context.drawImage(svg, state.foodPos.x, state.foodPos.y, boxSize, boxSize);
}

function startGame() {
    state = getDefaultState();
    makeBoard();
    drawSnake();
    placeFood();

    //lets start this party!
    moveSnake();
}

function log(message) {
    if (log) {
        console.info(message);
    }
}

//function drawGameOver() {
//    context.beginPath();
//    context.roundRect(200, 200, 600, 200, [10]);
//    context.fillStyle = "White";
//    context.fill();
//
//    context.fillStyle = "black";
//    context.font = "40px Arial";
//    context.fillText("Game Over:", 400, 280, 600);
//
//    context.beginPath();
//    context.roundRect(250, 300, 100, 50, [10]);
//    context.fillStyle = "Orange";
//    context.fill();
//
//    context.fillStyle = "black";
//    context.font = "40px Arial";
//    context.fillText("Game Over:", 400, 280, 600);
//}


configureGamePad();
startGame();

//drawGameOver();

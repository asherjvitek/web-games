/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("game");
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

const colors = [
    //"red",
    //"orange",
    //"yellow",
    "green",
    "lightgreen",
    //"blue",
    //"purple",
];

const colorLookup = []
let colorIndex = 0;

const gridSize = 1000;
const boxSize = 50;

context.fillStyle = colors[colorIndex];
context.fillRect(0, 0, boxSize, boxSize);

colorLookup.push({ pos: { x: 0, y: 0 }, oldColor: context.fillStyle });

let direction = "right";

function makeBoard(x, y) {
    colorIndex += 1;

    if (colorIndex === colors.length) {
        colorIndex = 0;
    }

    if (direction == "right") {
        x += boxSize;
    } else {
        y += boxSize;
        x = 0;
        direction = "right";
        colorIndex += 1;

        if (colorIndex === colors.length) {
            colorIndex = 0;
        }
    }

    if (y > gridSize) {
        return;
    }

    context.fillStyle = colors[colorIndex];
    colorLookup.push({ pos: { x, y }, oldColor: context.fillStyle });
    context.fillRect(x, y, boxSize, boxSize);

    if (x > gridSize) {
        direction = "down";
    }

    makeBoard(x, y);
}

makeBoard(0, 0);

direction = "right";

let snake = [
    { x: 0, y: 0 },
    { x: 50, y: 0 },
    { x: 100, y: 0 },
    { x: 150, y: 0 },
];

//const snakeHead = {
//    "right": [0, 40, 40, 0],
//    "down": [0, 0, 40, 40],
//    "left": [40, 0, 0, 40],
//    "up": [40, 40, 0, 0],
//};


function drawSnake(snake) {
    context.fillStyle = "blue";

    for (let i = 0; i < snake.length; i++) {
        const e = snake[i];

        if (i === snake.length - 1) {
            //radii = snakeHead[direction]
            context.fillStyle = "darkblue";
            context.fillRect(e.x, e.y, boxSize, boxSize);
            //context.roundRect(e.x, e.y, boxSize, boxSize, radii)
            //context.fill();
        } else {
            context.fillRect(e.x, e.y, boxSize, boxSize);
        }
    }
}

drawSnake(snake);

function moveSnake() {
    let tail = snake.shift();

    if (tail.y % 100 === 0) {
        if (tail.x % 100 === 0) {
            context.fillStyle = "green";
        } else {
            context.fillStyle = "lightgreen";
        }
    } else {
        if (tail.x % 100 === 0) {
            context.fillStyle = "lightgreen";
        } else {
            context.fillStyle = "green";
        }
    }
    context.fillRect(tail.x, tail.y, boxSize, boxSize);

    let head = snake[snake.length - 1];
    tail.x = head.x;
    tail.y = head.y;

    switch (direction) {
        case "right":
            tail.x += boxSize;
            if (tail.x >= 1000) {
                tail.x = 0;
            }
            break;
        case "down":
            tail.y += boxSize;
            if (tail.y >= 1000) {
                tail.y = 0;
            }
            break;
        case "left":
            tail.x -= boxSize;
            if (tail.x < 0) {
                tail.x = 950;
            }
            break;
        case "up":
            tail.y -= boxSize;
            if (tail.y < 0) {
                tail.y = 950;
            }
            break;
        default:
            break;
    }

    if (tail.x > 1000 || tail.x < 0 || tail.y > 1000 || tail.y < 0) {

    }

    snake.push(tail);
    drawSnake(snake);

    setTimeout(() => {
        moveSnake();
    }, 500)
}

/** @function 
 * @name handleKeyPress
 * @argument {KeyboardEvent} e */
function handleKeyPress(e) {
    console.info(e.key);
    switch (e.key) {
        case "a":
        case "ArrowLeft":
            if (direction == "right") {
                return;
            }

            direction = "left";
            break;
        case "s":
        case "ArrowDown":
            if (direction === "up") {
                return;
            }
            direction = "down";
            break;
        case "d":
        case "ArrowRight":
            if (direction === "left") {
                return;
            }
            direction = "right";
            break;
        case "w":
        case "ArrowUp":
            if (direction === "down") {
                return;
            }
            direction = "up";
            break;
        default:
            return;
    }

    //moveSnake()
}

moveSnake();

document.addEventListener("keydown", handleKeyPress);

let svg = document.getElementById("food");

let foodPos = {
    x: Math.floor(Math.random() * 999),
    y: Math.floor(Math.random() * 999),
}

foodPos.x -= foodPos.x % boxSize;
foodPos.y -= foodPos.y % boxSize;

context.drawImage(svg, foodPos.x, foodPos.y, boxSize, boxSize);

//TODO
//do not put the fool on the snake
//we need to make the snake eat the food and grow
//we need to make the game over when the snake eats itself

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const axisThreshold = .5;
const width = canvas.width;
const height = canvas.height;
const floorHeight = 20;
const playerHeight = 30;
const playerWidth = 10;
const jumpHeight = playerHeight * 5;
/** @type {int} jumpSpeed pixels per second */
const jumpSpeed = 500;
/** @type {int} moveSpeed pixels per second */
const moveSpeed = 1000;
// const gravity = ;
const playerStart = { x: 20, y: height - floorHeight - playerHeight }

let state = {
    player: { ...playerStart },
    playerPrevious: { ...playerStart },
    heldKey: null,
    jumping: null,
    jumpStart: null,
}

function renderGame() {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, height - floorHeight, width, floorHeight);

    ctx.fillStyle = "red";
    ctx.fillRect(state.player.x, state.player.y, playerWidth, playerHeight);
}

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

function setJumping() {
    if (!state.jumping) {
        state.jumping = jumpSpeed * -1;
        state.jumpStart = state.player.y;
    }
}
/**
* @function
* @param {KeyboardEvent} ev
*/
function keydown(ev) {
    switch (ev.key) {
        case "l":
        case "a":
        case "ArrowRight":
        case "h":
        case "d":
        case "ArrowLeft":
            state.heldKey = ev.key;
            break;
        case " ":
            setJumping();
            break;
        default:
            break;
    }
}

/**
* @function
* @param {KeyboardEvent} ev
*/
function keyup(ev) {
    console.info(ev);
    if (ev.key === state.heldKey) {
        state.heldKey = null;
        return;
    }
}

let lastTime = performance.now();

renderGame();
window.requestAnimationFrame(gameLoop);

function gameLoop() {
    handleController();

    let currentTime = performance.now();
    let delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    let move = delta * moveSpeed;

    if (state.heldKey !== null) {
        state.playerPrevious.x = state.player.x;
        state.playerPrevious.y = state.player.y;

        switch (state.heldKey) {
            case "l":
            case "d":
            case "ArrowRight":
                state.player.x += move;
                break;
            case "h":
            case "a":
            case "ArrowLeft":
                state.player.x -= move;
                break;
            default:
                console.error("should not happen");
                break;
        }


        if (state.player.x < 0) {
            state.player.x = 0;
        }

        if (state.player.x > width - playerWidth) {
            state.player.x = width - playerWidth;
        }
    }

    if (state.jumping !== null) {
        const max = state.jumpStart - jumpHeight;

        if (state.player.y > max && state.jumping < 0) {
            state.player.y += delta * state.jumping;
            if (state.player.y <= max) {
                state.jumping *= -1;
            }
            // state.player.y = Math.max(max, state.player.y);
        } else {
            state.player.y += delta * state.jumping;
        }

        //this should be changed to check for any blocks but at the moment the floor is the only ones.
        if (state.player.y >= state.jumpStart) {
            state.player.y = state.jumpStart;
            state.jumping = null;
        }
    }

    renderGame();

    window.requestAnimationFrame(gameLoop);
}

function handleController() {
    var gamePads = navigator.getGamepads();

    for (let i = 0; i < gamePads.length; i++) {
        const gp = gamePads[i];

        gp.buttons.forEach((button, index) => {
            switch (index) {
                case 0:
                    if (button.pressed) {
                        setJumping();
                    }
                    break;
                case 14:
                    if (state.heldKey === "ArrowLeft" && !button.pressed) {
                        state.heldKey = null;
                    } else if (button.pressed) {
                        state.heldKey = "ArrowLeft";
                    }
                    break;
                case 15:
                    if (state.heldKey === "ArrowRight" && !button.pressed) {
                        state.heldKey = null;
                    } else if (button.pressed) {
                        state.heldKey = "ArrowRight";
                    }
                    break;
                default:
                    break;
            }
            if (button.pressed) {
                console.info(`Button ${button}, ${index} was pressed`);
            }
        });

        gp.axes.forEach((axis, index) => {
            //this is about half way on the joystick.
            if (axis > -axisThreshold && axis < axisThreshold) {
                return;
            }

            console.info(`Axis ${axis}, ${index} was pressed`);

            switch (index) {
                case 0:
                    if (axis < 0) {
                        state.heldKey = "ArrowLeft";
                    } else {
                        state.heldKey = "ArrowRight";
                    }
                    return;
                default:
                    break;
            }
        });

    }
}


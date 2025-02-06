/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");
const leftClick = 1;

let state = {
    card: {
        x: 50,
        y: 50,
        w: 100,
        h: 200
    },
    mouseClickPos: null
}

const canvasSpace = canvas.getBoundingClientRect()

context.fillStyle = "White";
context.fillRect(50, 50, 100, 200);

canvas.addEventListener("mousedown", mousedown);
canvas.addEventListener("mouseup", mouseup);
canvas.addEventListener("mousemove", mousemove);

/** @function
 * @name mousedown
* @argument {MouseEvent} ev
*/
function mousedown(ev) {
    console.info(ev.clientX, ev.clientY, ev.button);
    if (mounseInBox(ev.clientX, ev.clientY) && ev.buttons == leftClick) {
        console.info("In the box");
        state.mouseClickPos = { x: ev.clientX, y: ev.clientY }
    }
}

/** @function
* @argument {MouseEvent} ev
*/
function mouseup(ev) {
    if (ev.buttons == leftClick) {
        state.mouseClickPos = null;
    }
}

/** @function
* @argument {MouseEvent} ev
*/
function mousemove(ev) {
    if (ev.buttons != leftClick) {
        return;
    }

    //starting the movement
    if (state.mouseClickPos == null) {
        return
    }

    currentMousePos = {
        x: ev.clientX,
        y: ev.clientY
    }

    delta = {
        x: currentMousePos.x - state.mouseClickPos.x,
        y: currentMousePos.y - state.mouseClickPos.y
    }

    context.clearRect(state.card.x, state.card.y, state.card.w, state.card.h);

    state.card.x += delta.x;
    state.card.y += delta.y;

    context.fillRect(state.card.x, state.card.y, state.card.w, state.card.h);

    state.mouseClickPos = {
        x: ev.clientX,
        y: ev.clientY
    }
}

/** @function
 * argument {number} x
 * argument {number} x
*/
function mounseInBox(x, y) {
    return x >= state.card.x && y >= state.card.y && x <= state.card.x + state.card.w && y <= state.card.y + state.card.h;
}


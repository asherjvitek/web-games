/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");
const leftClick = 1;
const logInfo = false;
const cardWidth = 100;
const cardHeight = 170

function log(...data) {
    if (logInfo) {
        console.info(data)
    }
}

canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;

let state = {
    cards: [
        {
            x: 50,
            y: 50,
            w: cardWidth,
            h: cardHeight,
            color: "white"
        }, {
            x: 250,
            y: 250,
            w: cardWidth,
            h: cardHeight,
            color: "blue"
        }
    ],
    mouseClickPos: null
}

// const canvasSpace = canvas.getBoundingClientRect()

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

/** @function
 * @argument {object[]} cards
 */
function drawCards(cards) {
    for (let i = 0; i < cards.length; i++) {
        const card = state.cards[i];

        drawCard(card);
    }
}
function drawCard(card) {
    context.fillStyle = card.color;
    context.fillRect(card.x, card.y, card.w, card.h);
}

drawCards(state.cards);

canvas.addEventListener("mousedown", mousedown);
canvas.addEventListener("mouseup", mouseup);
canvas.addEventListener("mousemove", mousemove);

window.onresize = (ev) => {
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;
    drawCards(state.cards);
}

/** @function
 * @name mousedown
* @argument {MouseEvent} ev
*/
function mousedown(ev) {
    log(ev.clientX, ev.clientY, ev.button);
    if (mounseInCard(ev.clientX, ev.clientY) != null && ev.buttons == leftClick) {
        state.mouseClickPos = { x: ev.clientX, y: ev.clientY }
    }
}

/** @function
* @argument {MouseEvent} ev
*/
function mouseup(ev) {
    state.mouseClickPos = null;
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
    };

    delta = {
        x: currentMousePos.x - state.mouseClickPos.x,
        y: currentMousePos.y - state.mouseClickPos.y
    };


    const card = mounseInCard(ev.clientX, ev.clientY);

    card.x += delta.x;
    card.y += delta.y;

    clearCanvas();
    drawCards(state.cards);

    state.mouseClickPos = {
        x: ev.clientX,
        y: ev.clientY
    };
}

/** @function
 * argument {number} x
 * argument {number} x
*/
function mounseInCard(x, y) {
    for (let i = 0; i < state.cards.length; i++) {
        const card = state.cards[i];
        if (x >= card.x && y >= card.y && x <= card.x + card.w && y <= card.y + card.h) {
            return card;
        }
    }

    return null;
}


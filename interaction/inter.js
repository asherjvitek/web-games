/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");

canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

const leftClick = 1;
const logInfo = false;
const cardWidth = 100;
const cardHeight = 170;
const cardVertSpace = 30;
const cardHorizSpace = 30;

const suites = {
    heart: 0,
    spade: 1,
    club: 2,
    diamond: 3
};

const suiteColors = {
    heart: "red",
    diamond: "red",
    spade: "black",
    club: "black",
};


const letters = [
    "H",
    "S",
    "C",
    "D"
];

const locations = {
    draw: { x: 20, y: 20 },
    show: { x: 20, y: 40 + cardHeight },
};

const numbers = {
    ace: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    jack: 11,
    queen: 12,
    king: 12,
};

const numDisplay = {
    1: "A",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "J",
    12: "Q",
    12: "K",
};

let state = {
    //deck
    draw: [],
    show: [],
    hiddenShow: [],
    /** @type {[][]} piles */
    piles: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
    ],
    //completion piles
    hearts: [],
    spades: [],
    clubs: [],
    diamonds: [],
    mouseClickPos: null,
    grabbedCards: [],

};

function log(...data) {
    if (logInfo) {
        console.info(data)
    }
}

function populateDraw() {
    const suiteKeys = Object.keys(suites);
    const numberKeys = Object.keys(numbers);

    for (let si = 0; si < suiteKeys.length; si++) {
        const sk = suiteKeys[si];
        for (let ni = 0; ni < numberKeys.length; ni++) {
            const nk = numberKeys[ni];
            state.draw.push({
                number: numbers[nk],
                suite: suites[sk],
                x: locations.draw.x,
                y: locations.draw.y,
                w: cardWidth,
                h: cardHeight,
                color: suiteColors[suiteKeys[si]],
                show: false,
            });
        }
    }

    log(state.draw);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

/** @function
 * @argument {object[]} cards
 */
function renderGame() {
    clearCanvas()

    if (state.draw.length > 0) {
        state.draw[0].x = locations.draw.x;
        state.draw[0].y = locations.draw.y;
        drawCardBack(state.draw[0]);
    }

    if (state.show.length > 0) {
        y = locations.show.y;

        for (let i = 0; i < state.show.length; i++) {
            const card = state.show[i];

            if (state.grabbedCards.indexOf(card) > -1) {
                continue;
            }

            card.x = locations.show.x;
            card.y = y;

            drawCard(card);

            y += cardVertSpace;
        }
    }

    let pileX = locations.draw.x + cardWidth + cardHorizSpace;
    for (let i = 0; i < state.piles.length; i++) {
        const pile = state.piles[i];
        let y = locations.draw.y;

        for (let j = 0; j < pile.length; j++) {
            const card = pile[j];

            if (state.grabbedCards.indexOf(card) > -1) {
                continue;
            }

            card.x = pileX;
            card.y = y;

            if (j == pile.length - 1 && !card.show) {
                card.show = true;
            }

            if (card.show) {
                drawCard(card);
            } else {
                drawCardBack(card);
            }

            y += cardVertSpace;
        }

        pileX += cardWidth + cardHorizSpace;
    }

    for (let i = 0; i < state.grabbedCards.length; i++) {
        drawCard(state.grabbedCards[i]);
    }
}

function drawCardBack(card) {
    context.fillStyle = "Blue";
    context.fillRect(card.x, card.y, card.w, card.h);

    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.strokeRect(card.x, card.y, card.w, card.h);
}

function drawCard(card) {
    context.fillStyle = "White";
    context.fillRect(card.x, card.y, card.w, card.h);

    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.strokeRect(card.x, card.y, card.w, card.h);

    const number = numDisplay[card.number];

    context.font = "20px Arial";
    const numberWidth = context.measureText(number);
    const suiteWidth = context.measureText(letters[card.suite]);
    const textHeight = 12;
    const widthOffset = 7;
    const heightOffset = 10;

    context.fillStyle = card.color;
    context.fillText(number, card.x + widthOffset, card.y + heightOffset + textHeight);

    context.fillStyle = card.color;
    context.fillText(number, card.x + cardWidth - numberWidth.width - widthOffset, card.y + cardHeight - heightOffset);

    context.fillStyle = card.color;
    context.fillText(letters[card.suite], card.x + cardWidth - widthOffset - suiteWidth.width, card.y + heightOffset + textHeight);
}

function shuffleDraw() {
    const cards = state.draw;
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const item1 = cards[i];
        const item2 = cards[j];

        cards[i] = item2;
        cards[j] = item1;
    }
}

/** @function
 * @name mousedown
* @argument {MouseEvent} ev
*/
function mousedown(ev) {
    log(ev.clientX, ev.clientY, ev.button);

    if (ev.clientX >= locations.draw.x && ev.clientY >= locations.draw.y && ev.clientX <= locations.draw.x + cardWidth && ev.clientY <= locations.draw.y + cardHeight) {
        drawFromDraw();
        renderGame();
        return;
    }

    const cards = getCardsUnderMouse(ev.clientX, ev.clientY);
    if (cards.length > 0 && ev.buttons == leftClick) {
        // state.draw.splice(card.i, 1);
        // state.draw.push(card.card);
        state.mouseClickPos = { x: ev.clientX, y: ev.clientY };
        state.grabbedCards.push(...cards);
    }
}

function isOnValidCard(cards, ev) {
    let destPile = getPileUnderMouse(ev.clientX, ev.clientY);

    if (destPile.length == 0) {
        return false;
    }

    const lastCard = destPile[destPile.length - 1];

    if (lastCard.number - cards[0].number > 1) {
        return false;
    }

    if (lastCard.color == cards[0].color) {
        return false;
    }

    if (state.show.length > 0 && state.show[state.show.length - 1] == state.grabbedCards[0]) {
        state.show.pop();
        destPile.push(...state.grabbedCards);
        return true;
    }

    for (let i = 0; i < state.piles.length; i++) {
        let pile = state.piles[i];
        const index = pile.indexOf(state.grabbedCards[0]);

        if (index > -1) {
            pile.splice(index, state.grabbedCards.length);
            destPile.push(...state.grabbedCards);
        }
    }


    return true;
}

/** @function
* @argument {MouseEvent} ev
*/
function mouseup(ev) {

    if (state.grabbedCards.length > 0 && isOnValidCard(state.grabbedCards, ev)) {
        //move the cards onto the new stack...
        //1. remove from whatever stack they are on
        //2. move them to the stack they are hovering over?

    }


    state.grabbedCards = [];
    state.mouseClickPos = null;
    renderGame();
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

    for (let i = 0; i < state.grabbedCards.length; i++) {
        const card = state.grabbedCards[i];

        card.x += delta.x;
        card.y += delta.y;

        log(card.x, card.y);
    }


    renderGame();

    state.mouseClickPos = {
        x: ev.clientX,
        y: ev.clientY
    };
}

/** @function
 * argument {number} x
 * argument {number} x
*/
function getCardsUnderMouse(x, y) {
    let findCards = (cards) => {
        let result = [];

        for (let i = cards.length - 1; i >= 0; i--) {
            const card = cards[i];

            if (card.show && x >= card.x && y >= card.y && x <= card.x + card.w && y <= card.y + card.h) {
                for (let j = i; j < cards.length; j++) {
                    result.push(cards[j]);
                }

                return result;
            }
        }

        return result;
    }

    for (let pi = 0; pi < state.piles.length; pi++) {
        const pile = state.piles[pi];
        const cards = findCards(pile);

        if (cards.length > 0) {
            return cards;
        }
    }

    let findCards2 = (cards) => {
        let result = [];
        const card = cards[cards.length - 1];

        if (x >= card.x && y >= card.y && x <= card.x + card.w && y <= card.y + card.h) {
            result.push(card);
        }

        return result;
    }

    const cards = findCards2(state.show);

    if (cards.length > 0) {
        return [cards[cards.length - 1]];
    }

    return [];
}

function getPileUnderMouse(x, y) {
    let findCard = (cards) => {
        const card = cards[cards.length - 1];

        if (x >= card.x && y >= card.y && x <= card.x + card.w && y <= card.y + card.h) {
            return card;
        }

        return null;
    }

    for (let pi = 0; pi < state.piles.length; pi++) {
        const pile = state.piles[pi];
        const card = findCard(pile);

        if (card == state.grabbedCards[0]) {
            continue;
        }

        if (card != null) {
            return pile;
        }
    }

    return [];
}

function populatePiles() {
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < i + 1; j++) {
            let card = state.draw.pop();

            state.piles[i].push(card);
        }
    }
}


function drawFromDraw() {
    while (state.show.length > 0) {
        state.hiddenShow.push(state.show.shift());
    }

    if (state.draw.length == 0) {
        while (state.hiddenShow.length > 0) {
            state.draw.push(state.hiddenShow.pop());
        }
    }

    for (let i = 0; i < 3; i++) {
        if (state.draw.length > 0) {
            let card = state.draw.pop();
            card.show = true;
            state.show.push(card);
        }
    }

    console.info(state.hiddenShow, state.show, state.draw);

}

populateDraw();
shuffleDraw();
populatePiles();
drawFromDraw();

renderGame(state.draw);

canvas.addEventListener("mousedown", mousedown);
canvas.addEventListener("mouseup", mouseup);
canvas.addEventListener("mousemove", mousemove);

window.onresize = () => {
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;

    renderGame(state.draw);
}


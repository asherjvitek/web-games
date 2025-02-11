//WORKING NOTES:

//CURRENT ISSUES:
// Nothing?

//Do Better?: From what I have seen this is the way that most people would do this but I would think that there is possibly a better way. What is the way to do this without clearing the whole of the canvas?

//TODO:
//* We for sure need that fancy spread all the cards all over the place animation that you would get at the end of the game when you win.
//* I think that some sort of help thing on the double clicking and whatnot...

//DEBUG
const logInfo = false;
const allowShiftClickMoveToDraw = true;

//CONFIG:
let config = {
    drawNumber: 1,
}

/** @function
 * @param {HTMLSelectElement} ele
 */
function setDrawNumber(ele, resrtartGame) {
    config.drawNumber = ele.options[ele.selectedIndex].value;

    if (resrtartGame) {
        startGame();
    }
}

function log(...data) {
    if (logInfo) {
        console.info(data)
    }
}

//GAME STUFF

/** @class
 * @name Card
 * @property {int} number Like Ace
 * @property {int} suite 
 * property {int} x
 * property {int} y
 * property {int} w
 * property {int} h
 * property {string} color
 * property {boolean} show
 */
class Card {
    constructor(
        number,
        suite,
        x,
        y,
        w,
        h,
        color,
        show
    ) {
        this.number = number;
        this.suite = suite;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.show = show;
    }
}

Array.prototype.last = function() {
    return this[this.length - 1];
}

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");

canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext("2d");

const leftClick = 1;
const cardWidth = 100;
const cardHeight = 170;
const cardVertSpace = 30;
const cardHorizSpace = 30;
const drawPileMax = 3;

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

const heart_image = document.getElementById("heart");
const spade_image = document.getElementById("spade");
const club_image = document.getElementById("club");
const diamond_image = document.getElementById("diamond");

let images = [
    heart_image,
    spade_image,
    club_image,
    diamond_image,
]

const locations = {
    draw: { x: 20, y: 20 },
    show: { x: 20, y: 40 + cardHeight },
    completedStacks: {
        heart: { x: 20 + cardHorizSpace * 8 + cardWidth * 8, y: 20 },
        spade: { x: 20 + cardHorizSpace * 8 + cardWidth * 8, y: 20 * 2 + cardHeight },
        diamond: { x: 20 + cardHorizSpace * 8 + cardWidth * 8, y: 20 * 3 + cardHeight * 2 },
        club: { x: 20 + cardHorizSpace * 8 + cardWidth * 8, y: 20 * 4 + cardHeight * 3 },
    }
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
    king: 13,
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
    13: "K",
};

let state = {
    //deck
    /** @type {Card[]} draw */
    draw: [],
    /** @type {Card[]} draw */
    show: [],
    /** @type {Card[]} draw */
    hiddenShow: [],
    /** @type {[]} piles */
    piles: [
        /** @type {Card[]} draw */
        [],
        /** @type {Card[]} draw */
        [],
        /** @type {Card[]} draw */
        [],
        /** @type {Card[]} draw */
        [],
        /** @type {Card[]} draw */
        [],
        /** @type {Card[]} draw */
        [],
        /** @type {Card[]} draw */
        [],
    ],
    //completion piles
    /** @type {Card[]} draw */
    hearts: [],
    /** @type {Card[]} draw */
    spades: [],
    /** @type {Card[]} draw */
    clubs: [],
    /** @type {Card[]} draw */
    diamonds: [],
    /** @type {{x, y}} draw */
    mouseClickPos: null,
    /** @type {Card[]} draw */
    grabbedCards: [],
};

function initState() {
    state = {
        //deck
        /** @type {Card[]} draw */
        draw: [],
        /** @type {Card[]} draw */
        show: [],
        /** @type {Card[]} draw */
        hiddenShow: [],
        /** @type {[]} piles */
        piles: [
            /** @type {Card[]} draw */
            [],
            /** @type {Card[]} draw */
            [],
            /** @type {Card[]} draw */
            [],
            /** @type {Card[]} draw */
            [],
            /** @type {Card[]} draw */
            [],
            /** @type {Card[]} draw */
            [],
            /** @type {Card[]} draw */
            [],
        ],
        //completion piles
        /** @type {Card[]} draw */
        hearts: [],
        /** @type {Card[]} draw */
        spades: [],
        /** @type {Card[]} draw */
        clubs: [],
        /** @type {Card[]} draw */
        diamonds: [],
        /** @type {{x, y}} draw */
        mouseClickPos: null,
        /** @type {Card[]} draw */
        grabbedCards: [],
    };
}

function populateDraw() {
    const suiteKeys = Object.keys(suites);
    const numberKeys = Object.keys(numbers);

    for (let si = 0; si < suiteKeys.length; si++) {
        const sk = suiteKeys[si];
        for (let ni = 0; ni < numberKeys.length; ni++) {
            const nk = numberKeys[ni];
            state.draw.push(new Card(
                numbers[nk],
                suites[sk],
                locations.draw.x,
                locations.draw.y,
                cardWidth,
                cardHeight,
                suiteColors[suiteKeys[si]],
                false,
            ));
        }
    }

    log(state.draw);
}

function renderGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

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

    var completedKeys = Object.keys(suites);

    for (let i = 0; i < completedKeys.length; i++) {
        const suite = completedKeys[i];
        const completed = suite + "s";
        const emptyCard = new Card(
            null,
            suites[suite],
            locations.completedStacks[suite].x,
            locations.completedStacks[suite].y,
            cardWidth,
            cardHeight,
            suiteColors[suite],
            null
        );

        if (state[completed].length == 0) {
            drawEmpty(emptyCard);
            continue;
        }

        let card = state[completed].last();

        if (card == state.grabbedCards[0]) {
            if (state[completed].length > 1) {
                const comp = state[completed];
                card = comp[comp.length - 2];
            } else {
                drawEmpty(emptyCard);
                continue;
            }
        }

        card.x = locations.completedStacks[suite].x;
        card.y = locations.completedStacks[suite].y;
        drawCard(card);
    }

    for (let i = 0; i < state.grabbedCards.length; i++) {
        drawCard(state.grabbedCards[i]);
    }
}

/** @function
 * @param {Card} card
 */
function drawCardBack(card) {
    context.fillStyle = "Blue";
    context.fillRect(card.x, card.y, card.w, card.h);

    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.strokeRect(card.x, card.y, card.w, card.h);
}

/** @function
 * @param {Card} card
 */
function drawEmpty(card) {
    context.fillStyle = "rgba(255, 0, 0, 0)";
    context.fillRect(card.x, card.y, card.w, card.h);

    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.strokeRect(card.x, card.y, card.w, card.h);

    const image = images[card.suite];
    context.drawImage(image, card.x + cardWidth / 2 - 40, card.y + cardWidth / 2, 80, 80);
}

/** @function
 * @param {Card} card
 */
function drawCard(card) {
    context.fillStyle = "White";
    context.fillRect(card.x, card.y, card.w, card.h);

    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.strokeRect(card.x, card.y, card.w, card.h);

    const number = numDisplay[card.number];

    context.font = "20px Arial";
    const numberWidth = context.measureText(number);
    const textHeight = 12;
    const widthOffset = 7;
    const heightOffset = 10;

    context.fillStyle = card.color;
    context.fillText(number, card.x + widthOffset, card.y + heightOffset + textHeight);

    context.fillStyle = card.color;
    context.fillText(number, card.x + cardWidth - numberWidth.width - widthOffset, card.y + cardHeight - heightOffset);

    const image = images[card.suite];
    context.drawImage(image, card.x + cardWidth - widthOffset - 25, card.y + heightOffset - 5, 25, 25);
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
* @param {MouseEvent} ev
*/
function mousedown(ev) {
    log(ev.offsetX, ev.offsetY, ev.buttons, ev.shiftKey);

    if (ev.offsetX >= locations.draw.x && ev.offsetY >= locations.draw.y && ev.offsetX <= locations.draw.x + cardWidth && ev.offsetY <= locations.draw.y + cardHeight) {
        drawFromDraw();
        renderGame();
        return;
    }

    let cards = getCardsUnderMouse(ev.offsetX, ev.offsetY);
    if (ev.buttons == leftClick && ev.shiftKey && allowShiftClickMoveToDraw && cards.length > 0) {
        let pile = findSourcePile(cards);
        while (cards.length > 0) {
            let card = cards.pop();
            const index = pile.indexOf(card);
            pile.splice(index, 1);
            state.draw.unshift(card);
        }
    }

    if (cards.length > 0 && ev.buttons == leftClick) {
        state.mouseClickPos = { x: ev.offsetX, y: ev.offsetY };
        state.grabbedCards.push(...cards);
    }
}

/** @function
* @param {MouseEvent} ev
*/
function mouseup(ev) {
    moveCards(ev);

    if (state.show.length == 0 && state.hiddenShow.length > 0) {
        while (state.hiddenShow.length > 0 && state.show.length < drawPileMax) {
            state.show.push(state.hiddenShow.pop());
        }
    }

    if (state.spades.length == 13 && state.diamonds.length == 13 && state.clubs.length == 13 && state.hearts.length == 13) {
        renderGameEnd();
    }

    state.grabbedCards = [];
    state.mouseClickPos = null;
    renderGame();
}

/** @function
* @param {MouseEvent} ev
*/
function dblclick(ev) {
    log("double click", ev.offsetX, ev.offsetY);
    let cards = getCardsUnderMouse(ev.offsetX, ev.offsetY);

    if (cards.length != 1) {
        return;
    }

    let card = cards[0];
    const suiteKeys = Object.keys(suites);
    const pileKey = suiteKeys[card.suite] + "s";
    let completedPile = state[pileKey];

    if (canPlaceOnCompleted(cards, { pile: completedPile, suite: card.suite })) {
        let source = findSourcePile(cards);
        moveCards2(cards, source, completedPile);
        renderGame();
    }
}

function findSourcePile(cards) {
    if (state.show.indexOf(cards[0]) > -1) {
        return state.show;
    }

    for (let i = 0; i < state.piles.length; i++) {
        let pile = state.piles[i];
        const index = pile.indexOf(cards[0]);

        if (index > -1) {
            return pile;
        }
    }

    const completedKeys = Object.keys(suites);

    for (let i = 0; i < completedKeys.length; i++) {
        const key = completedKeys[i];
        if (state[key + "s"].indexOf(cards[0]) > -1) {
            return state[key + "s"];
        }
    }

    throw new Error("Should not be possible that the card does not belong to a pile");
}

/** @function
 * @name moveCards2
 * @param {Card[]} cards
 * @param {Card[]} source
 * @param {Card[]} dest
 */
function moveCards2(cards, source, dest) {
    while (cards.length > 0) {
        let card = cards.shift();

        var index = source.indexOf(card);
        source.splice(index, 1);

        dest.push(card);
    }
}

/** @function
 * @param {Card[]} cards
 * @param {{pile: Card[], suite: int}} dest
 */
function canPlaceOnCompleted(cards, dest) {
    if (cards.length > 1) {
        return false;
    }

    let grabbedCard = cards[0];

    if (grabbedCard.suite != dest.suite) {
        return false;
    }

    if (dest.pile.length == 0 && grabbedCard.number == numbers.ace) {
        return true;
    }

    const card = dest.pile.last();

    if (grabbedCard.number - card.number == 1) {
        return true;
    }
}

function moveCards(ev) {
    if (state.grabbedCards.length == 0) {
        return;
    }

    let completedPile = getCompletedPileUnderMouse(ev.offsetX, ev.offsetY);

    if (completedPile != null && canPlaceOnCompleted(state.grabbedCards, completedPile)) {
        let source = findSourcePile(state.grabbedCards);
        moveCards2(state.grabbedCards, source, completedPile.pile);

        return;
    }

    let destPile = getPileUnderMouse(ev.offsetX, ev.offsetY);

    if (!canPlaceOnCard(state.grabbedCards, destPile)) {
        return;
    }

    let source = findSourcePile(state.grabbedCards);
    moveCards2(state.grabbedCards, source, destPile);
}

/** @function
 * @description This will get the current pile that the cursor is over. 
 * @param {int} x
 * @param {int} y
 * return {Card[]}
*/
function getPileUnderMouse(x, y) {
    let findCard = (cards, index) => {
        if (cards.length == 0) {
            const card = new Card(
                null,
                null,
                locations.draw.x + cardWidth * (index + 1) + cardHorizSpace * (index + 2),
                locations.draw.y,
                cardWidth,
                cardHeight,
                null,
                null
            )

            if (x >= card.x && y >= card.y && x <= card.x + card.w && y <= card.y + card.h) {
                return card;
            }

            return null;
        }

        const card = cards.last();

        if (x >= card.x && y >= card.y && x <= card.x + card.w && y <= card.y + card.h) {
            return card;
        }

        return null;
    }

    for (let pi = 0; pi < state.piles.length; pi++) {
        const pile = state.piles[pi];
        const card = findCard(pile, pi);

        if (card == state.grabbedCards[0]) {
            continue;
        }

        if (card != null) {
            return pile;
        }
    }

    const suiteKeys = Object.keys(suites);

    for (let i = 0; i < suiteKeys.length; i++) {
        const suite = suiteKeys[i];
        const location = locations.completedStacks[suite];

        if (x >= location.x && y >= location.y && x <= location.x + cardWidth && y <= location.y + cardHeight) {
            return state[suite + "s"];
        }
    }

    return null;
}

function getCompletedPileUnderMouse(x, y) {
    var completedStacks = Object.keys(locations.completedStacks);

    for (let i = 0; i < completedStacks.length; i++) {
        const key = completedStacks[i];

        if (x >= locations.completedStacks[key].x &&
            y >= locations.completedStacks[key].y &&
            x <= locations.completedStacks[key].x + cardWidth &&
            y <= locations.completedStacks[key].y + cardHeight) {
            let completedPile = state[`${key}s`];

            return { pile: completedPile, suite: suites[key] };
        }
    }

    return null;
}


/** @function
 * @name isOnValidCard
 * @param {Card[]} cards
 * @param {Card[]} pile
 */
function canPlaceOnCard(cards, pile) {
    if (pile == null) {
        return false;
    }

    if (pile.length == 0) {

        if (cards[0].number == numbers.king) {
            return true;
        }

        return false;
    }

    const lastCard = pile.last();

    if (lastCard.number - cards[0].number != 1) {
        return false;
    }

    if (lastCard.color == cards[0].color) {
        return false;
    }

    return true;
}


/** @function
* @param {MouseEvent} ev
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
        x: ev.offsetX,
        y: ev.offsetY
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
        x: ev.offsetX,
        y: ev.offsetY
    };
}

/** @function
 * @description This will get you all the cards that are currently under the mouse that you can grab.
 * @param {number} x
 * @param {number} x
 * @returns {Card[]}
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

    let findCardsInShow = (cards) => {
        let result = [];

        if (cards.length == 0) {
            return result;
        }

        const card = cards.last();

        if (x >= card.x && y >= card.y && x <= card.x + card.w && y <= card.y + card.h) {
            result.push(card);
        }

        return result;
    }

    const cards = findCardsInShow(state.show);

    if (cards.length > 0) {
        return [cards.last()];
    }

    const suiteKeys = Object.keys(suites);

    for (let i = 0; i < suiteKeys.length; i++) {
        const suite = suiteKeys[i];
        const location = locations.completedStacks[suite];
        const pile = state[suite + "s"];

        if (pile.length == 0) {
            continue;
        }

        if (x >= location.x && y >= location.y && x <= location.x + cardWidth && y <= location.y + cardHeight) {
            return [pile.last()]
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
    if (config.drawNumber == drawPileMax || state.show.length == drawPileMax) {
        while (state.show.length > 0) {
            state.hiddenShow.push(state.show.shift());
        }
    }

    if (state.draw.length == 0) {
        while (state.hiddenShow.length > 0) {
            state.draw.push(state.hiddenShow.pop());
        }
    }

    for (let i = 0; i < config.drawNumber; i++) {
        if (state.draw.length > 0) {
            let card = state.draw.pop();
            card.show = true;
            state.show.push(card);
        }
    }

    log(state.hiddenShow, state.show, state.draw);

}

function startGame() {
    initState();
    setDrawNumber(document.getElementById("drawNumber"), false);
    populateDraw();
    shuffleDraw();
    populatePiles();
    drawFromDraw();
    renderGame(state.draw);
}

function renderGameEnd() {
    const suiteKeys = Object.keys(suites);
    let allCards = [];

    for (let i = 0; i < suiteKeys.length - 1; i++) {
        const key = suiteKeys[i] + "s";
        const cards = state[key];

        for (let s = cards.length - 1; s >= 0; s--) {
            let c = cards[s];
            c.x = locations.completedStacks[suiteKeys[i]].x;
            c.y = locations.completedStacks[suiteKeys[i]].y;
            allCards.push({ ...c });
        }
    }

    renderGameEndCardMove(allCards, 0, -5, 8, 0, 200, 100);
}

function renderGameEndCardMove(cards, i, x, y, totalY, down, up) {
    if (i == cards.length - 1) {
        return;
    }

    let card = cards[i];

    if (card.x <= 0 || card.y >= canvas.height - cardHeight) {
        i++;
        x = Math.floor(Math.random() * (-2 - -10 + 1)) + -10;
        y = Math.floor(Math.random() * (20 - 3 + 1)) + 1;
        down = Math.floor(Math.random() * (250 - 150 + 1)) + 150;
        up = Math.floor(down / 2);
        renderGameEndCardMove(cards, i, x, y, totalY, down, up);
        return;
    }

    card.x += x;
    card.y += y;
    totalY += Math.abs(y);

    if ((y > 0 && totalY > down) || (y < 0 && totalY > up)) {
        y *= -1;
        totalY = 0;
    }

    drawCard(card);
    requestAnimationFrame(() => renderGameEndCardMove(cards, i, x, y, totalY, down, up));
}

function putGameIntoWin() {
    initState();
    populateDraw();
    const suiteKeys = Object.keys(suites);
    const numberKeys = Object.keys(numbers);

    for (let si = 0; si < suiteKeys.length; si++) {
        const sk = suiteKeys[si];
        for (let ni = 0; ni < numberKeys.length; ni++) {
            const nk = numberKeys[ni];
            state[sk + "s"].push(new Card(
                numbers[nk],
                suites[sk],
                locations.draw.x,
                locations.draw.y,
                cardWidth,
                cardHeight,
                suiteColors[suiteKeys[si]],
                false,
            ));
        }
    }

    log(state.draw);
    renderGameEnd();
}


canvas.addEventListener("mousedown", mousedown);
canvas.addEventListener("mouseup", mouseup);
canvas.addEventListener("mousemove", mousemove);
canvas.addEventListener("dblclick", dblclick);

window.onresize = () => {
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;

    // renderGame(state.draw);
}

//Make sure that the SVG images have loaded all the way before trying to render the game.
document.addEventListener("DOMContentLoaded", function() {
    startGame();
});

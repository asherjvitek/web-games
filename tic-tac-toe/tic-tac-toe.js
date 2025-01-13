const boxes = document.getElementsByClassName("col");
const playerTurn = document.getElementById("playerTurn");

for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];

    box.onclick = () => clickBox(box);
}

function clickBox(element) {
    if (element.innerText !== "" || gameOver(boxes)) {
        return;
    }

    element.innerText = playerTurn.innerText;

    if (gameOver(boxes)) {
        setTimeout(() => alert(`Player ${playerTurn.innerText} Wins!`), 10);
        return;
    }

    if (playerTurn.innerText === "X") {
        playerTurn.innerText = "O";
    } else {
        playerTurn.innerText = "X";
    }
}

/** @function
    * @param {HTMLCollectionOf<Element>} boxes
    */
function gameOver(boxes) {

    var arr = [...boxes].sort(x => parseInt(x.attributes["position"]));

    check = function(one, two, three) {
        if (arr[one].innerText === "" || arr[two].innerText === "" || arr[three].innerText === "") {
            return false;
        }

        return arr[one].innerText === arr[two].innerText && arr[one].innerText === arr[three].innerText;
    }

    return check(0, 1, 2) ||
        check(3, 4, 5) ||
        check(6, 7, 8) ||
        check(0, 3, 6) ||
        check(1, 4, 7) ||
        check(2, 5, 8) ||
        check(0, 4, 8) ||
        check(6, 4, 2)
}

function newGame() {

    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        box.innerText = "";
    }

    playerTurn.innerText = "X";
}

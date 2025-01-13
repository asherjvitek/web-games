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

function gameOver(boxes) {

    var grid = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        const split = box.attributes["position"].value.split(",");

        grid[parseInt(split[0])][parseInt(split[1])] = box.innerText;
    }

    if (grid[0][0] !== "" && grid[0][0] === grid[0][1] && grid[0][0] === grid[0][2]) {
        return true;
    }

    if (grid[1][0] !== "" && grid[1][0] === grid[1][1] && grid[1][0] === grid[1][2]) {
        return true;
    }

    if (grid[2][0] !== "" && grid[2][0] === grid[2][1] && grid[2][0] === grid[2][2]) {
        return true;
    }

    if (grid[0][0] !== "" && grid[0][0] === grid[1][0] && grid[0][0] === grid[2][0]) {
        return true;
    }

    if (grid[0][1] !== "" && grid[0][1] === grid[1][1] && grid[0][2] === grid[2][1]) {
        return true;
    }

    if (grid[0][2] !== "" && grid[0][2] === grid[1][2] && grid[0][2] === grid[2][2]) {
        return true;
    }

    if (grid[0][0] !== "" && grid[0][0] === grid[1][1] && grid[0][0] === grid[2][2]) {
        return true;
    }

    if (grid[0][2] !== "" && grid[0][2] === grid[1][1] && grid[0][2] === grid[0][2]) {
        return true;
    }

    return false;
}

function newGame() {
    
    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        box.innerText = "";
    }

    playerTurn.innerText = "X";
}

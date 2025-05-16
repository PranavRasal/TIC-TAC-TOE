let boxs = document.querySelectorAll(".element");
let resetbutton = document.querySelector("#reset");
let para = document.querySelector(".para");
let newgamebutton = document.querySelector("#newgame");
let msg = document.querySelector(".msg");
let modeBtns = document.querySelectorAll(".mode-btn");
let diffBtns = document.querySelectorAll(".diff-btn");
let difficultySelect = document.querySelector(".difficulty-select");

let turn = true;
let number = "1";
let gameMode = "two-player";
let difficulty = "easy";
let isComputerTurn = false;
para.innerHTML = "";


const winning = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

// Mode selection
modeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        modeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        gameMode = btn.dataset.mode;
        difficultySelect.classList.toggle("hide", gameMode === "two-player");
        resetGame();
    });
});

// Difficulty selection
diffBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        diffBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        difficulty = btn.dataset.diff;
        resetGame();
    });
});

const getEmptyCells = () => {
    return Array.from(boxs).reduce((acc, box, index) => {
        if (box.innerText === "") acc.push(index);
        return acc;
    }, []);
};

const makeComputerMove = () => {
    if (isComputerTurn) {
        let move;
        switch (difficulty) {
            case "easy":
                move = makeRandomMove();
                break;
            case "medium":
                move = Math.random() < 0.6 ? makeSmartMove() : makeRandomMove();
                break;
            case "hard":
                move = makeSmartMove();
                break;
        }
        if (move !== undefined) {
            setTimeout(() => {
                if (!boxs[move].disabled) {
                    boxs[move].innerText = "X";
                    boxs[move].disabled = true;
                    turn = true;
                    checkwinner();
                }
            }, 500);
        }
    }
};

const makeRandomMove = () => {
    const emptyCells = getEmptyCells();
    if (emptyCells.length > 0) {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
};

const makeSmartMove = () => {
    // Try to win
    const winningMove = findWinningMove("X");
    if (winningMove !== undefined) return winningMove;

    // Block opponent
    const blockingMove = findWinningMove("O");
    if (blockingMove !== undefined) return blockingMove;

    // Take center if available
    if (boxs[4].innerText === "") return 4;

    // Take corners
    const corners = [0, 2, 6, 8].filter(i => boxs[i].innerText === "");
    if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
    }

    // Take any available move
    return makeRandomMove();
};

const findWinningMove = (symbol) => {
    for (let pattern of winning) {
        const values = pattern.map(i => boxs[i].innerText);
        const empty = pattern.find(i => boxs[i].innerText === "");
        if (empty !== undefined && 
            values.filter(v => v === symbol).length === 2 && 
            values.includes("")) {
            return empty;
        }
    }
};

const disable = () => {
    for (let box of boxs) {
        box.disabled = true;
    }
};

const able = () => {
    resetGame();
    para.innerHTML = "";
    number = "1";
};

const able1 = () => {
    resetGame();
    msg.classList.remove("hide");
};

boxs.forEach((box) => {
    box.addEventListener("click", () => {
        if (box.disabled || isComputerTurn) return;
        
        if (turn) {
            box.innerText = "O";
            box.style.color = "blue";
            turn = false;
        } else {
            box.innerText = "X";
             box.style.color = "red";
            turn = true;
        }
        box.disabled = true;
        
        if (!checkwinner()) {  // Only make computer move if game hasn't ended
            if (gameMode === "computer" && !turn) {
                isComputerTurn = true;
                makeComputerMove();
                isComputerTurn = false;
            }
        }
    });
});

const checkDraw = () => {
    let allFilled = true;
    boxs.forEach(box => {
        if (box.innerText === "") {
            allFilled = false;
        }
    });
    if (allFilled) {
        // para.innerHTML = `It's a draw!`;
         para.innerHTML = para.innerHTML + `<br>Game ${number++}: it's a draw!`;
        msg.classList.remove("hide");
        disable();
        return true;
    }
    return false;
};


const winner = (win) => {
    if (win === "X") {
        para.style.color = "red";
    para.innerHTML = para.innerHTML + `<br>Game ${number++}: winner is ${win} `;
    msg.classList.remove("hide"); 
    }
    else if (win === "O") {
        para.style.color = "blue";
        para.innerHTML = para.innerHTML + `<br>Game ${number++}: winner is ${win} `;
        msg.classList.remove("hide");
    }
    disable();
    return true;
   };

const checkwinner = () => {
    for (let pattern of winning) {
        let a = boxs[pattern[0]].innerText;
        let b = boxs[pattern[1]].innerText;
        let c = boxs[pattern[2]].innerText;

        if (a !== "" && b !== "" && c !== "") {
            if (a === b && b === c) {
                return winner(a);
            }
        }
    }
    return checkDraw();
};

const resetGame = () => {
    // Reset game state
    turn = true;
    isComputerTurn = false;
    
    // Reset board
    boxs.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
    
    
    msg.classList.add("hide");
    
    // If in computer mode and it's computer's turn, make a move
    if (gameMode === "computer" && !turn) {
        isComputerTurn = true;
        makeComputerMove();
        isComputerTurn = false;
    }
};

resetbutton.addEventListener("click", able);
newgamebutton.addEventListener("click", able1);

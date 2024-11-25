let btnRef = document.querySelectorAll(".button-option");
let popupRef = document.querySelector(".popup");
let newgameBtn = document.getElementById("new-game");
let restartBtn = document.getElementById("restart");
let msgRef = document.getElementById("message");
//Winning Pattern Array
let winningPattern = [
  [0, 1, 2],
  [0, 3, 6],
  [2, 5, 8],
  [6, 7, 8],
  [3, 4, 5],
  [1, 4, 7],
  [0, 4, 8],
  [2, 4, 6],
];
//Player 'X' plays first
let xTurn = true;
let count = 0;

//Disable All Buttons
const disableButtons = () => {
  btnRef.forEach((element) => (element.disabled = true));
  //enable popup
  popupRef.classList.remove("hide");
};

//Enable all buttons (For New Game and Restart)
const enableButtons = () => {
  btnRef.forEach((element) => {
    element.innerText = "";
    element.disabled = false;
  });
  //disable popup
  popupRef.classList.add("hide");
};

//This function is executed when a player wins
const winFunction = (letter) => {
  disableButtons();
  if (letter == "X") {
    msgRef.innerHTML = "&#x1F389; <br> 'X' Wins";
  } else {
    msgRef.innerHTML = "&#x1F389; <br> 'O' Wins";
  }
};

//Function for draw
const drawFunction = () => {
  disableButtons();
  msgRef.innerHTML = "&#x1F60E; <br> It's a Draw";
};

//New Game
newgameBtn.addEventListener("click", () => {
  count = 0;
  enableButtons();
});
restartBtn.addEventListener("click", () => {
  count = 0;
  enableButtons();
});

//Win Logic
const winChecker = () => {
  //Loop through all win patterns
  for (let i of winningPattern) {
    let [element1, element2, element3] = [
      btnRef[i[0]].innerText,
      btnRef[i[1]].innerText,
      btnRef[i[2]].innerText,
    ];
    //Check if elements are filled
    //If 3 empty elements are same and would give win as would
    if (element1 != "" && (element2 != "") & (element3 != "")) {
      if (element1 == element2 && element2 == element3) {
        //If all 3 buttons have same values then pass the value to winFunction
        winFunction(element1);
      }
    }
  }
};

// AI Player
const makeAiMove = () => {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < btnRef.length; i++) {
    if (btnRef[i].innerText === "") {
      btnRef[i].innerText = "O";
      let score = minimax(btnRefToArray(), 0, false);
      btnRef[i].innerText = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  btnRef[bestMove].innerText = "O";
  btnRef[bestMove].disabled = true;

  count += 1;
  if (count == 9) {
    drawFunction();
  }
  winChecker();
  xTurn = true;
};

// Minimax Algorithm
const minimax = (board, depth, maximizingPlayer) => {
  if (checkWinningPattern(board, "X")) {
    return -1;
  } else if (checkWinningPattern(board, "O")) {
    return 1;
  } else if (isBoardFull(board)) {
    return 0;
  }

  if (maximizingPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

// Convert btnRef to array
const btnRefToArray = () => {
  let boardArray = [];
  btnRef.forEach((element) => boardArray.push(element.innerText));
  return boardArray;
};

// Check if a player has won
const checkWinningPattern = (board, player) => {
  for (let i = 0; i < winningPattern.length; i++) {
    let [a, b, c] = winningPattern[i];
    if (
      board[a] === player &&
      board[b] === player &&
      board[c] === player
    ) {
      return true;
    }
  }
  return false;
};

// Check if the board is full
const isBoardFull = (board) => {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      return false;
    }
  }
  return true;
};

// Display X/O on click
btnRef.forEach((element) => {
  element.addEventListener("click", () => {
    if (xTurn && element.innerText === "") {
      // Display X
      element.innerText = "X";
      element.disabled = true;

      count += 1;
      if (count == 9) {
        drawFunction();
      }
      winChecker();
      xTurn = false;

      setTimeout(() => {
        if (!checkWinningPattern(btnRefToArray(), "X") && count < 9) {
          makeAiMove();
        }
      }, 300);
    }
  });
});

// Enable Buttons and disable popup on page load
window.onload = enableButtons;

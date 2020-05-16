// set variables
let initBoard;
const user = "X";
const computer = "O";

// all possible combinations of a win on a tic tac toe board
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

//traversing the DOM to select the squares of the board
const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  // controlling when the replay button shows up
  document.querySelector(".endgame").style.display = "none";

  // set an array of 9 integers from 0-8 to the initBoard variable
  initBoard = Array.from(Array(9).keys());

  // loop to go through all the cells and delete its contents, remove background colour and allow clicking
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

// function to pass on the cell target id and the human user into the turn function,
// and then passes the return from the minimax algorithm & computer into the turn function
function turnClick(square) {
  if (typeof initBoard[square.target.id] == "number") {
    turn(square.target.id, user);
    if (!checkTie()) turn(bestSpot(), computer);
  }
}

// function to change the integers to the symbol of the player and to
// show which cell a player clicked on by displaying their symbol;
// also checks if the game is over via the checkWin function
function turn(squareId, player) {
  initBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(initBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  // reduce method used to find every spot a player has already chosen in their turn
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;

  // a loop to check if a player has played in all the spots of a winning array
  // if they have a winning combination then the gameWon variable is set to the winner's info
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  // loop to highlight all the winning cells chosen by the winning player
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == user ? "#83e85a" : "#f5587b";
  }

  // loop to disable clicking after the game has been won
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == user ? "You win!" : "You lose.");
}

// declares the winner by displaying the info
function declareWinner(who) {
  let promptColour;
  if (who == "You win!") {
    promptColour = "#83e85a";
  } else if (who == "You lose.") {
    promptColour = "#f5587b";
  } else {
    promptColour = "blueviolet";
  }
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame").style.background = promptColour;
  document.querySelector(".endgame .text").innerText = who;
}

// checks which spots are empty
function emptySquares() {
  return initBoard.filter((s) => typeof s == "number");
}

// the place the computer will click
function bestSpot() {
  return minimax(initBoard, computer).index;
}

// checks if all the spots are filled up and disables clicking
// then passes on the info into the declareWinner function
function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

// minimax algorithm implemented from https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37/
function minimax(newBoard, player) {
  var availSpots = emptySquares();

  if (checkWin(newBoard, user)) {
    return { score: -10 };
  } else if (checkWin(newBoard, computer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == computer) {
      var result = minimax(newBoard, user);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, computer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === computer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

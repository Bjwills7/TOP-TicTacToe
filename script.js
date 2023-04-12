const GameBoard = function () {
  const board = [];
  const reset = () => board.splice(0, board.length);
  const getBoard = () => board.map((x) => x);
  function isFull() {
    if (board.length === 9) {
      for (let i = 0; i < board.length; i++) {
        if (board[i] === undefined) return false;
      }
      return true;
    }
  }
  function updateArr(e, name) {
    if (board[e.target.dataset.index] !== undefined) return;
    board[e.target.dataset.index] = name;
  }
  return { updateArr, getBoard, reset, isFull };
};

const Game = function () {
  function reset() {
    gameBoard.reset();
    displayControl.reset();
  }
  function playGame() {
    reset();
    players.changePlayer();
  }
  function checkForWinner() {
    let board = gameBoard.getBoard();
    let c = players.getPlayer();
    for (let i = 0; i < board.length; i += 3) {
      if (board[i] === c && board[i + 1] === c && board[i + 2] === c) {
        displayControl.renderMessage(
          `${c} Wins! Press the reset button to play again.`
        );
        displayControl.disableClicks();
        return;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (board[i] === c && board[i + 3] === c && board[i + 6] === c) {
        displayControl.renderMessage(
          `${c} Wins! Press the reset button to play again.`
        );
        displayControl.disableClicks();
        return;
      }
    }
    if (
      (board[0] === c && board[4] === c && board[8] === c) ||
      (board[2] === c && board[4] === c && board[6] === c)
    ) {
      displayControl.renderMessage(`${c} wins!`);
      displayControl.disableClicks();
    } else if (gameBoard.isFull()) {
      displayControl.renderMessage(
        `It's a tie! Press the reset button to play again.`
      );
      displayControl.disableClicks();
    }
  }
  return { reset, playGame, checkForWinner };
};

const DisplayControl = function () {
  let cellNodes = Array.from(document.querySelector(".game-board").children);
  const reset = () => cellNodes.forEach((cell) => (cell.textContent = ""));
  function initListeners() {
    cellNodes.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        gameBoard.updateArr(e, players.getPlayer());
        render();
        game.checkForWinner();
        players.changePlayer();
      });
    });
    disableClicks();
  }
  function disableClicks() {
    cellNodes.forEach((cell) => {
      cell.style.pointerEvents = "none";
    });
  }
  function enableClicks() {
    cellNodes.forEach((cell) => {
      cell.style.pointerEvents = "auto";
    });
  }
  function render() {
    cellNodes.forEach((cell) => {
      cell.textContent = gameBoard.getBoard()[cell.dataset.index];
    });
  }
  function renderMessage(msg) {
    let display = document.querySelector(".message-text");
    display.textContent = msg;
  }
  function initButtons() {
    let playBtn = document.querySelector(".play");
    playBtn.addEventListener("click", () => {
      renderMessage();
      enableClicks();
      game.playGame();
    });
  }
  initListeners();
  initButtons();
  return { render, renderMessage, reset, disableClicks, enableClicks };
};

const Player = function () {
  let instances = [];
  let activePlayer;
  const getPlayer = () => activePlayer.name;
  const getPlayers = () => instances;
  function changePlayer() {
    activePlayer === instances[0]
      ? (activePlayer = instances[1])
      : (activePlayer = instances[0]);
  }
  // player constructor
  function add(name) {
    let instance = Object.create(this);
    instance.name = name;
    instances.push(instance);
    activePlayer = instances[0];
    return instance;
  }
  return { add, getPlayers, changePlayer, getPlayer };
};

const players = Player();
const player1 = players.add("x");
const player2 = players.add("o");
const gameBoard = GameBoard();
const game = Game();
const displayControl = DisplayControl();

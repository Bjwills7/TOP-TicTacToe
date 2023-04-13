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
  function updateArr(e, char) {
    if (board[e.target.dataset.index] !== undefined) return;
    board[e.target.dataset.index] = char;
  }
  return { updateArr, getBoard, reset, isFull };
};

const Game = function () {
  function reset() {
    gameBoard.reset();
    displayControl.reset();
  }
  function checkForWinner() {
    let board = gameBoard.getBoard();
    let c = players.getPlayerChar();
    let name = players.getPlayerName();
    for (let i = 0; i < board.length; i += 3) {
      if (board[i] === c && board[i + 1] === c && board[i + 2] === c) {
        displayControl.renderMessage(
          `${name} Wins! Press the reset button to play again.`
        );
        displayControl.disableClicks();
        return;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (board[i] === c && board[i + 3] === c && board[i + 6] === c) {
        displayControl.renderMessage(
          `${name} Wins! Press the reset button to play again.`
        );
        displayControl.disableClicks();
        return;
      }
    }
    if (
      (board[0] === c && board[4] === c && board[8] === c) ||
      (board[2] === c && board[4] === c && board[6] === c)
    ) {
      displayControl.renderMessage(`${name} wins!`);
      displayControl.disableClicks();
    } else if (gameBoard.isFull()) {
      displayControl.renderMessage(
        `It's a tie! Press the reset button to play again.`
      );
      displayControl.disableClicks();
    }
  }
  return { reset, checkForWinner };
};

const DisplayControl = function () {
  let cellNodes = Array.from(document.querySelector(".game-board").children);
  const reset = () => cellNodes.forEach((cell) => (cell.textContent = ""));
  function initListeners() {
    cellNodes.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        gameBoard.updateArr(e, players.getPlayerChar());
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
  function toggleForm() {
    let board = document.querySelector(".game-board");
    let form = document.querySelector(".modal");
    if (board.dataset.visible === "true") {
      board.style.display = "none";
      board.dataset.visible = "false";
      form.style.display = "grid";
      form.dataset.visible = "true";
    } else {
      board.style.display = "grid";
      board.dataset.visible = "true";
      form.style.display = "none";
      form.dataset.visible = "false";
    }
  }
  function getInput() {
    let nameInputOne = document.querySelector(".input-one").value;
    let nameInputTwo = document.querySelector(".input-two").value;
    return [nameInputOne, nameInputTwo];
  }
  function initButtons() {
    let playBtn = document.querySelector(".play");
    let submitPlayers = document.querySelector(".submit-players");
    playBtn.addEventListener("click", () => {
      toggleForm();
      renderMessage();
    });
    submitPlayers.addEventListener("click", (e) => {
      e.preventDefault();
      players.submitPlayers(getInput()[0], getInput()[1]);
      toggleForm();
      renderMessage();
      enableClicks();
      game.reset();
    });
  }
  initListeners();
  initButtons();
  return {
    render,
    renderMessage,
    reset,
    disableClicks,
    enableClicks,
    getInput,
  };
};

const Player = function () {
  let instances = [];
  let activePlayer;
  const getPlayerChar = () => activePlayer.char;
  const getPlayerName = () => activePlayer.name;
  const getPlayers = () => instances.map((x) => x);
  function changePlayer() {
    activePlayer === instances[0]
      ? (activePlayer = instances[1])
      : (activePlayer = instances[0]);
  }
  // player constructor
  function add(name) {
    let instance = Object.create(players);
    instance.name = name;
    instances.push(instance);
    activePlayer = instances[0];
    return instance;
  }
  function submitPlayers(name1, name2) {
    if (instances.length !== 0) {
      instances.splice(0, instances.length);
    }
    let player1 = add(name1);
    let player2 = add(name2);
    player1.char = "x";
    player2.char = "o";
  }
  return {
    submitPlayers,
    getPlayers,
    changePlayer,
    getPlayerChar,
    getPlayerName,
  };
};

const players = Player();
const gameBoard = GameBoard();
const game = Game();
const displayControl = DisplayControl();

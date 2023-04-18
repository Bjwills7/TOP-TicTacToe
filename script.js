const gameBoard = (function () {
  const board = [];
  const reset = () => board.splice(0, board.length);
  const getBoard = () => board.map((x) => x);
  const getPlayableCells = () => {
    let tempBoard = getBoard();
    let indexList = [];
    for (let i = 0; i < 9; i++) {
      if (tempBoard[i] === undefined) indexList.push(i);
    }
    return indexList;
  };
  function isFull() {
    if (board.length === 9) {
      for (let i = 0; i < board.length; i++) {
        if (board[i] === undefined) return false;
      }
      return true;
    }
  }
  function updateArr(index, char) {
    if (board[index] !== undefined) return;
    board[index] = char;
  }
  return { updateArr, getBoard, reset, isFull, getPlayableCells };
})();

const Game = function () {
  function reset() {
    gameBoard.reset();
    displayControl.reset();
  }
  function playRound() {
    let gameStatus = isGameOver(
      gameBoard.getBoard(),
      players.getPlayerChar(),
      players.getPlayerName()
    );
    if (gameStatus.gameOver) {
      displayControl.renderMessage(gameStatus.message);
      displayControl.disableClicks();
    } else {
      players.changePlayer();
      displayControl.renderMessage(`${players.getPlayerName()}'s turn!`);
    }
  }
  function isGameOver(board, c, name) {
    let message;
    for (let i = 0; i < board.length; i += 3) {
      if (board[i] === c && board[i + 1] === c && board[i + 2] === c) {
        message = `${name} Wins! Press the reset button to play again.`;
        return { gameOver: true, name, message };
      }
    }
    for (let i = 0; i < 3; i++) {
      if (board[i] === c && board[i + 3] === c && board[i + 6] === c) {
        message = `${name} Wins! Press the reset button to play again.`;
        return { gameOver: true, name, message };
      }
    }
    if (
      (board[0] === c && board[4] === c && board[8] === c) ||
      (board[2] === c && board[4] === c && board[6] === c)
    ) {
      message = `${name} Wins! Press the reset button to play again.`;
      return { gameOver: true, name, message };
    } else if (gameBoard.isFull()) {
      message = `It's a tie! Press the reset button to play again.`;
      return { gameOver: true, message };
    }
    return { gameOver: false };
  }
  return { reset, isGameOver, playRound };
};

const DisplayControl = function () {
  let cellNodes = Array.from(document.querySelector(".game-board").children);
  const reset = () => cellNodes.forEach((cell) => (cell.textContent = ""));
  function initListeners() {
    cellNodes.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        gameBoard.updateArr(e.target.dataset.index, players.getPlayerChar());
        render();
        game.playRound();
        players.aiHandler();
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
    let resetBtn = document.querySelector(".reset");
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
    resetBtn.addEventListener("click", () => {
      game.reset();
      enableClicks();
      renderMessage();
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

const players = (function () {
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
  function addAi(name) {
    let instance = Object.create(players);
    instance.name = name;
    instance.ai = true;
    instances.push(instance);
    return instance;
  }
  function minimax() {}
  function aiPlay() {
    let choice = gameBoard.getPlayableCells()[0];
    gameBoard.updateArr(choice, instances[1].char);
    displayControl.render();
    game.playRound();
  }
  function aiHandler() {
    if (activePlayer.ai) aiPlay();
  }
  function submitPlayers(name1, name2) {
    if (instances.length !== 0) {
      instances.splice(0, instances.length);
    }
    let player1 = add(name1);
    let player2 = addAi(name2);
    player1.char = "x";
    player2.char = "o";
  }
  return {
    submitPlayers,
    getPlayers,
    changePlayer,
    getPlayerChar,
    getPlayerName,
    aiHandler,
  };
})();

const game = Game();
const displayControl = DisplayControl();

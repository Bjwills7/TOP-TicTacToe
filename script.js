const GameBoard = function() {
    const board = [];
    const reset = () => board.splice(0, board.length);
    const getBoard = () => board;
    function isFull() {
        if (board.length === 9) {
            for (let i = 0; i < board.length; i++) {
                if (board[i] === undefined) return false;
            }
            return true
        }
    }
    function updateArr(e, name) {
        if (board[e.target.dataset.index] !== undefined) return;
        board[e.target.dataset.index] = name;
    };
    return {updateArr, getBoard, reset, isFull};
};

const Game = function() {
    let activePlayer;
    const getPlayer = () => activePlayer.name;
    function reset() {
        gameBoard.reset();
        displayControl.reset();
    }
    function changePlayer() {
        let instances = players.getPlayers();
        activePlayer === instances[0] ? activePlayer = instances[1] : activePlayer = instances[0]
    }
    function playGame() {
        reset();
        changePlayer();
    }
    function checkForWinner() {
        let board = gameBoard.getBoard();
        let c = getPlayer();
        for (let i = 0; i < board.length; i += 3) {
            if (board[i] === c && board[i+1] == c && board[i+2] == c) {
                console.log(`${c} wins!`);
                return
            }
        }
        for (let i = 0; i < 3; i++) {
            if (board[i] == c && board[i+3] == c && board[i+6] == c) {
                console.log(`${c} wins!`)  
                return              
            }
        }
        if ((board[0] == c && board[4] == c && board[8] == c) ||
            (board[2] == c && board[4] == c && board[6] == c)) {
                console.log(`${c} wins!`)
        } else if (gameBoard.isFull()) {
            console.log(`It's a tie!`);
        }
    }
    return {getPlayer, changePlayer, reset, playGame, checkForWinner}
}

const DisplayControl = function() {
    let cellNodes = Array.from(document.querySelector('.game-board').children);
    const reset = () => cellNodes.forEach( cell => cell.textContent = '');
    function initListeners() {
        cellNodes.forEach( cell => {
            cell.addEventListener('click', (e) => {
                gameBoard.updateArr(e, game.getPlayer());
                render();
                game.checkForWinner();
                game.changePlayer();
            })
        })
        disableClicks();
    };
    function disableClicks() {
        cellNodes.forEach( cell => {
            cell.style.pointerEvents = 'none'
        })
    }
    function enableClicks() {
        cellNodes.forEach( cell => {
            cell.style.pointerEvents = 'auto'
        })
    }
    function render() {
        cellNodes.forEach( cell => {
            cell.textContent = gameBoard.getBoard()[cell.dataset.index];
        })
    };
    function renderMessage(msg) {
        let display = document.querySelector('.message-text');
        display.textContent = msg;
    }
    function initButtons() {
        let playBtn = document.querySelector('.play');
        playBtn.addEventListener('click', () => {
            renderMessage();
            enableClicks();
            game.playGame()
        })
    }
    initListeners();
    initButtons();
    return {render, reset}
};

const Player = function() {
    let instances = [];
    const getPlayers = () => instances;
    // player constructor
    function add(name) {
        let instance = Object.create(this);
        instance.name = name;
        instances.push(instance);
        currentPlayer = instances[0];
        return instance;
    }
    function getName() {
        return currentPlayer.name;
    }
    return {add, getPlayers, getName};
};

const players = Player();
const player1 = players.add('x');
const player2 = players.add('o');
const gameBoard = GameBoard();
const game = Game();
const displayControl = DisplayControl();
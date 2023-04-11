const GameBoard = function() {
    const board = [];
    let cellNodes = Array.from(document.querySelector('.game-board').children);
    function updateArr(e, name) {
        board[e.target.dataset.index] = name;
    };
    function render() {
        cellNodes.forEach( cell => {
            cell.textContent = board[cell.dataset.index];
        })
    };
    function initListeners() {
        cellNodes.forEach( cell => {
            cell.addEventListener('click', (e) => {
                updateArr(e, players.getName());
                render();
                players.changePlayer();
            })
        })
    };
    return {initListeners, render};
};

const Game = function() {
    
}

const Player = function() {
    let instances = [];
    let currentPlayer;
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
    function changePlayer() {
        if (currentPlayer === instances[0]) {
            currentPlayer = instances[1]
        } else {
            currentPlayer = instances[0]
        }
    }
    return {add, changePlayer, getName};
};
const displayControl = (function() {
    
})();

let players = Player();
let player1 = players.add('x');
let player2 = players.add('o');
let gameBoard = GameBoard();
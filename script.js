const gameBoard = (function() {
    const board = ['x', 'o', 'x', 'o', 'x', 'o', 'x', 'o', 'x'];
    let cellNodes = Array.from(document.querySelector('.game-board').children);
    function updateArr(target) {
        
    };
    function render() {
        cellNodes.forEach( cell => {
            cell.textContent = board[cell.dataset.index];
        })
    };
    function initListeners() {
        cellNodes.forEach( cell => {
            cell.addEventListener('click', (e) => {
                console.log(e.target);
            })
        })
    };
    return {initListeners, render};
})();



const player = (function() {
    let t = 'test';
    // player constructor
    function add(name) {
        let instance = Object.create(this);
        instance.name = name;
        return instance;
    }
    function choose() {
        
    }
    return {add};
})();
const displayControl = (function() {
    
})();

let newP = player.add('jeff');
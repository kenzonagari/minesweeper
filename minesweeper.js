$(()=>{

class Minesweeper {
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.canvasArr = [];
        this.mine = 'M';
        this.timer = 0;
        this.setTimer = 0;
        this.firstMove = true;
    }

    createArray(){
        this.canvasArr = [];
        for(let i = 0 ; i < this.height ; i++){
            this.canvasArr.push([]);
            for(let j = 0 ; j < this.width ; j++){
              this.canvasArr[i].push(0);
          }
        }
        console.log(this.canvasArr);
    }

    drawBoard(){
        $('#board-container').empty();
        for(let i = 0 ; i < this.height ; i++){
            const $divRow = $('<div>').attr('id',`row-${i}`).addClass('row');;
            for(let j = 0 ; j < this.width ; j++){
                const $divCell = $('<div>').attr('id',`cell-${i}-${j}`).addClass('cell');
                $divRow.append($divCell);
            }
            $('#board-container').append($divRow);
        }
    }

    setMine(amount){
        for(let i = 0 ; i < amount ; i++){
            let randomX = Math.floor(Math.random() * this.height);
            let randomY = Math.floor(Math.random() * this.width);
            while(this.canvasArr[randomX][randomY] === this.mine){
                randomX = Math.floor(Math.random() * this.height);
                randomY = Math.floor(Math.random() * this.width);
            }
            this.canvasArr[randomX][randomY] = this.mine;
            $(`#cell-${randomX}-${randomY}`).text(this.mine).addClass('cell-mine');
        }

        this.showMineAmount();
    }

    showMineAmount(){
        let mineAmount = 0;
        for(let i = 0 ; i < this.height ; i++){
            for(let j = 0 ; j < this.width ; j++){
                if(this.canvasArr[i][j] === this.mine){
                    mineAmount++;
                }
            }
        }
        $('#mine-amount').text(mineAmount);
    }

    setTime(){
        clearInterval(this.setTimer);
        this.timer = 0;
        $('#timer').text(this.timer);
    }
    
    startTime(){
        this.setTimer = setInterval(()=>{
            this.timer++;
            $('#timer').text(this.timer);
        },1000);
    }

    initSquareNumber(){
        for(let i = 0 ; i < this.height ; i++){
            for(let j = 0 ; j < this.width ; j++){
                let mineNum = 0;
                if(this.canvasArr[i][j] !== this.mine){

                    //------------- check upper

                    if((i-1)>=0){
                        if((j-1)>=0){
                            if(this.canvasArr[i-1][j-1] == this.mine){
                                mineNum++;
                            }
                        }
                        if(this.canvasArr[i-1][j] == this.mine){
                            mineNum++;
                        }
                        if(this.canvasArr[i-1][j+1] == this.mine){
                            mineNum++;
                        }
                    }

                    //------------- check middle

                    if((j-1>=0)){
                        if(this.canvasArr[i][j-1] == this.mine){
                            mineNum++;
                        }
                    }
                    if(this.canvasArr[i][j+1] == this.mine){
                        mineNum++;
                    }

                    //------------- check lower

                    if((i+1)<this.height){
                        if((j-1)>=0){
                            if(this.canvasArr[i+1][j-1] == this.mine){
                                mineNum++;
                            }
                        }
                        if(this.canvasArr[i+1][j] == this.mine){
                            mineNum++;
                        }
                        if((j+1)<this.width){
                            if(this.canvasArr[i+1][j+1] == this.mine){
                                mineNum++;
                            }
                        }
                    }

                    //-------------

                    this.canvasArr[i][j] = mineNum;
                    $(`#cell-${i}-${j}`).addClass(`cell-${mineNum} numbered-cell`).text(mineNum);
                }

          }
        }
    }

    closeSquares(){
        $('.cell').addClass('closed');
    }

    openSquare(square){
        square.removeClass('closed');
        //square.addClass('opened');
    }

    revealMines(){
        this.openSquare($('.cell-mine'));
    }

    revealBlanks(cellId){
        const cellNum = cellId.split('-');
        cellNum.shift();
        let i = parseInt(cellNum[0]);
        let j = parseInt(cellNum[1]);
       
        this.openBlank(`#cell-${i-1}-${j-1}`);
        this.openBlank(`#cell-${i-1}-${j}`);
        this.openBlank(`#cell-${i-1}-${j+1}`);

        //-------------
        this.openBlank(`#cell-${i}-${j-1}`);
        this.openBlank(`#cell-${i}-${j+1}`);

        //-------------
        this.openBlank(`#cell-${i+1}-${j-1}`);
        this.openBlank(`#cell-${i+1}-${j}`);
        this.openBlank(`#cell-${i+1}-${j+1}`);
    }

    openBlank(cellId){
        this.openSquare($(cellId));
        if($(cellId).hasClass('cell-0')){
            if($(cellId).hasClass('opened') !== true){
                $(cellId).addClass('opened');
                this.revealBlanks(cellId);
            }
        }
        $(cellId).addClass('opened');
    }

    flagSquare(cellId){
        if($(cellId).hasClass('opened') !== true){
            $(cellId).addClass('flagged');
            $(cellId).text('F');
        }
    }

    unflagSquare(cellId){
        const cellNum = cellId.split('-');
        cellNum.shift();
        let i = parseInt(cellNum[0]);
        let j = parseInt(cellNum[1]);

        $(cellId).removeClass('flagged');
        $(cellId).text(this.canvasArr[i][j]);
    }

    revealWrongFlag(){
        for(let i = 0 ; i < this.height ; i++){
            for(let j = 0 ; j < this.width ; j++){
                if($(`#cell-${i}-${j}`).hasClass('numbered-cell') && $(`#cell-${i}-${j}`).hasClass('flagged')){
                    $(`#cell-${i}-${j}`).addClass('wrong-flag');
                }
            }
        }
    }

    checkWin(){
        let correctSquareTotal = 0;

        for(let i = 0 ; i < this.height ; i++){
            for(let j = 0 ; j < this.width ; j++){
                if($(`#cell-${i}-${j}`).hasClass('opened') || $(`#cell-${i}-${j}`).hasClass('cell-mine')){
                    correctSquareTotal++;
                }
            }
        }

        //console.log(correctSquareTotal);
        if(correctSquareTotal === (this.width * this.height)){
            this.win();
        }
    }

    win(){
        gameOverState = 1;
        $('#message').text('you win!');
        clearInterval(this.setTimer);
    }

    lose(){
        this.revealWrongFlag();
        gameOverState = 1;
        $('#message').text('you lose!');
        clearInterval(this.setTimer);
    }
}

let gameOverState = 0;
let game = new Minesweeper (0,0);

const initBoard = (w, h, mine) => {
    game.width = w;
    game.height = h;
    game.firstMove = true;
    gameOverState = 0;
    game.createArray();
    game.drawBoard();
    game.setMine(mine);
    game.initSquareNumber();
    game.closeSquares();
    game.setTime()
    $('#message').empty();
}

// const doesNotContain = (className) => {
//     return 
// }

$('button').on("click", (event) => {

    if(event.target.id === 'easy'){
        initBoard(9,9,10);
    }
    if(event.target.id === 'medium'){
        initBoard(16,16,40);
    }
    if(event.target.id === 'hard'){
        initBoard(30,16,99);
    }

    $('.cell').mousedown((event) => {
        // console.log(event.target.classList[1]);
        if(gameOverState === 0){

            if(game.firstMove){
                game.startTime();
                game.firstMove = false;
            }

            if(event.which === 1 && event.target.classList.contains('flagged') === false){
                game.openSquare($(`#${event.target.id}`));
                $(`#${event.target.id}`).addClass('opened');
        
                if(event.target.classList.contains(`cell-mine`)){
                    game.revealMines(); 
                    $(`#${event.target.id}`).css('background', 'rgb(235, 182, 182)'); //red bg
                    game.lose();
                } else if(event.target.classList.contains('cell-0')){ //if a blank (0) cell is clicked
                    game.revealBlanks(`#${event.target.id}`);
                }
                
                game.checkWin();

            } else if(event.which === 3){
                if(event.target.classList.contains('opened') === false){
                    if(event.target.classList.contains('flagged') === false){
                        game.flagSquare(`#${event.target.id}`);
                    } else {
                        game.unflagSquare(`#${event.target.id}`);
                    }
                }
            }

        }
    });

    $('.cell').on("contextmenu", function() {
        return false;
    });

});








});

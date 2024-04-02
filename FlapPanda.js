
//background
let board;
let boardWidth = 340;
let boardHeight = 630;
let context;

//panda 
let pandaWidth = 55;
let pandaHeight = 45;
let pandaX = boardWidth/8;
let pandaY = boardHeight/2;
let pandaImg;

let panda = {
    x : pandaX,
    y : pandaY,
    width : pandaWidth,
    height : pandaHeight
}

//bamboo pipes
let pipeArray = []
let pipeWidth = 64;
let pipeHeight = 512; 
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //dagan sa pipes
let velocityY = 0; //lupad sa panda
let gravity = 0.4;

let gameOver = false, startGame = false
let score = 0;
let playBtn = null
let wooshSound = null, hitSound = null, scoreSound = null
window.onload = function() {
     wooshSound = new Howl({
        src: ['wooosh.mp3']
      });
      hitSound = new Howl({
        src: ['hit.mp3']
      });
      scoreSound = new Howl({
        src: ['score.mp3']
      });
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    playBtn = document.querySelector(".playBtn")

    //load images
    pandaImg = new Image();
    pandaImg.src = "./flypanda.png";
    pandaImg.onload = function() {
        context.drawImage(pandaImg, panda.x, panda.y, panda.width, panda.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./BamPipe.png"

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./BamPipe.png"
    document.addEventListener("keydown", movePanda)
    playBtn.addEventListener("click", handlePlayBtn)
    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //
}
const handlePlayBtn = (e) => {
    e.target.style.display  = "none"
    startGame = true
}
function update() {
    requestAnimationFrame(update);
    if (gameOver || !startGame) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //dagan sa panda
    velocityY += gravity;
    panda.y = Math.max(panda.y + velocityY, 0);
    context.drawImage(pandaImg, panda.x, panda.y, panda.width, panda.height)

    if (panda.y > board.height) {
        gameOver = true;
    }

    // dagan sa bamboo pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x  += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && panda.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 kay naa may 2 ka bamboo pipes! so 0.5*2 =1 for each of bamboo pipes
            pipe.passed = true;
            scoreSound.play()
        }


        if (detectCollision(panda, pipe)) {
            gameOver = true;
        }
            
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font="40px Berlin Sans FB";
    context.fillText(score, 110, 47);
    context.fillText("Score:", 5, 45)

    if (gameOver) {
        playBtn.style.display = "block"
        context.fillText("GAME OVER!", 60, 350);
        startGame = false
        hitSound.play()
    }
}

function placePipes(){
    if (gameOver || !startGame) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe)
}

function movePanda(e) {
    if(!startGame) return
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW") {
        wooshSound.play()
        //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            panda.y = pandaY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}



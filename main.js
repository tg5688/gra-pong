const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000; 
canvas.height = 500;

const cw = canvas.width;
const ch = canvas.height;

const ballSize = 20; 
let ballX = cw / 2 - ballSize / 2; 
let ballY = ch / 2 - ballSize / 2;


const paddleHeight = 100;
const paddleWidth = 20;

const playerX = 70; 
const aiX = 910;
let playerY = 200;
let aiY = 200;

const lineWidth = 6;
const lineHeight = 16;

let ballSpeedX = 4; 
let ballSpeedY = -4;

function table() { 
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cw, ch) 

    for (let i = 20; i < ch; i += 30) {
        ctx.fillStyle = "gray"
        ctx.fillRect(cw / 2 - lineWidth / 2, i, lineWidth, lineHeight)
    }
}

function ball() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(ballX, ballY, ballSize, ballSize)

    
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    
    if (ballY <= 0 || ballY + ballSize >= ch) { 
        ballSpeedY = -ballSpeedY;
        // speedUp();
    }

    const middleBall = ballY + ballSize / 2 

    if (ballX <= playerX + paddleWidth && ballX >= playerX && middleBall >= playerY && middleBall <= playerY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        ballX = playerX + paddleWidth;
        speedUp();
    } else if (ballX <= 0) {
        loss()
    }

    if (ballX + ballSize >= aiX && ballX < aiX && middleBall >= aiY && middleBall <= aiY + paddleHeight) {
        ballX = aiX - ballSize;
        ballSpeedX = -ballSpeedX

    } else if (ballX > cw) {
        win()
    }


}

function paddlePlayer() {
    ctx.fillStyle = 'green';
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight)
}

function paddleAi() {
    ctx.fillStyle = 'red';
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight)
}


let topCanvas = canvas.offsetTop; 

function playerPosition(e) {
 
    playerY = e.clientY - topCanvas - paddleHeight / 2;
    // console.log(playerY)
    if (playerY <= 0) playerY = 0;
    if (playerY >= ch - paddleHeight) playerY = ch - paddleHeight;

}

function speedUp() {
    //predkość X
    if (ballSpeedX > 0 && ballSpeedX < 16) 
        ballSpeedX++;
    else if (ballSpeedX < 0 && ballSpeedX > -16) ballSpeedX--;

    //predkość Y
    if (ballSpeedY > 0 && ballSpeedY < 16) 
        ballSpeedY++;
    else if (ballSpeedY < 0 && ballSpeedY > -16) ballSpeedY--; 

}


function aiPosition() { 
    const middlePaddle = aiY + paddleHeight / 2 
    const middleBall = ballY + ballSize / 2 

    if (ballX > 500) { 
        if (middlePaddle - middleBall > 200) { 
            // console.log(">+200");
            aiY -= 20;
        } else if (middlePaddle - middleBall > 50) {
            // console.log("+50 do 200");
            aiY -= 10;
        } else if (middlePaddle - middleBall < -200) {
            // console.log("<-200");
            aiY += 20;
        } else if (middlePaddle - middleBall < -50) {
            // console.log("-50 do -200");
            aiY += 10;
        }

    } else if (ballX <= 500 && ballX > 150) {
        if (middlePaddle - middleBall > 100) {
            aiY -= 3;
        } else if (middlePaddle - middleBall < -100) {
            aiY += 3;
        }
    }
}

//nasłuchiwanie na ruch myszki - porusza paletką
canvas.addEventListener("mousemove", playerPosition);

function game() {
    table() 
    ball()
    paddlePlayer()
    paddleAi()
    aiPosition()
}

function loss() {
    ctx.font = "30pt Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Przegrałeś", cw / 2, ch / 2);
}

function win() {
    ctx.font = "30pt Arial";
    ctx.fillStyle = "green";
    ctx.fillText("Wygrałeś", cw / 2, ch / 2);
}
setInterval(game, 1000 / 60) 

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

//ustawienie szer i wielk canvas dzięki włąsciwością canvas
canvas.width = 1000; //px
canvas.height = 500;

const cw = canvas.width;
const ch = canvas.height;

// deklaracja piłki
const ballSize = 20; //wys i szer 20px
let ballX = cw / 2 - ballSize / 2; //aby była na środku canvas (element w canvas zawsze jest rysowany od lewego górnego wierzchołka)
let ballY = ch / 2 - ballSize / 2;

//deklaracja paletek
const paddleHeight = 100;
const paddleWidth = 20;

const playerX = 70; //od lewej 70px
const aiX = 910;
let playerY = 200;
let aiY = 200;

//deklaracja linii na środku canvas
const lineWidth = 6;
const lineHeight = 16;

//prędkość piłki
let ballSpeedX = 4; //o ile px przesuwamy piłkę
let ballSpeedY = -4;

function table() { //można to co jest w tej funkcji wypisać bez jej używania gdy byśmy nie robili animacji tylko stały jakiś rysunek
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cw, ch) //metoda wykorzystywana do rysowania prostokąta argument 1 i 2 to gdzie ma zacząć rysować na osi x i y (czyli lewy górny wierzchołek naszego canvas) a 3 i 4 gdzie skończyć (teź x i y) (czyli prawy dolny)

    //rysowanie przerywane linni na środku table:
    for (let i = 20; i < ch; i += 30) {
        ctx.fillStyle = "gray"
        ctx.fillRect(cw / 2 - lineWidth / 2, i, lineWidth, lineHeight)
    }
}

function ball() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(ballX, ballY, ballSize, ballSize)

    //prędkość piłki (tak naprawdę w canvas rysowanie na nowo piłki tu o 1px w prawy dół (by było -1 w ballSpeedX to w lewy dół itp))
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    //odbijanie piłki od górnej lub dolnej krawędzi
    if (ballY <= 0 || ballY + ballSize >= ch) { //+rozmiar piłki bo na dolnym boku canvas odbiłaby się piłka dopiero od lewego górnego wierzchołka
        ballSpeedY = -ballSpeedY;
        // speedUp();
    }

    //odbiejanie od lewej krawędzi lub prawej
    // if (ballX <= 0 || ballX + ballSize >= cw) {
    //     ballSpeedX = -ballSpeedX
    // }

    const middleBall = ballY + ballSize / 2 //srodek piłki na osi Y

    if (ballX <= playerX + paddleWidth && ballX >= playerX && middleBall >= playerY && middleBall <= playerY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        ballX = playerX + paddleWidth;
        speedUp();
        // } else if (ballX <= playerX + paddleWidth && ballX >= playerX && ballY + ballSize >= playerY && ballY <= playerY + paddleHeight) {
        //     ballSpeedY = -ballSpeedY;
    } else if (ballX <= 0) {
        loss()
    }

    //odbijanie od komputera
    if (ballX + ballSize >= aiX && ballX < aiX && middleBall >= aiY && middleBall <= aiY + paddleHeight) {
        ballX = aiX - ballSize;
        ballSpeedX = -ballSpeedX
        // } else if (ballX + ballSize >= aiX && ballX + ballSize / 2 <= aiX + paddleWidth && ballY + ballSize >= aiY && ballY <= aiY + paddleHeight) {
        //     ballSpeedY = -ballSpeedY;
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


//ruch myszką
let topCanvas = canvas.offsetTop; //jak daleko od okna przeglądarki od górnej krawędzi jest canvas

function playerPosition(e) {
    // console.log("pozycja myszy to " + (e.clientY - topCanvas));//clientY wskazuje pozycje myszki od górnej krawędzi okna przeglądarki (minus) obszar od górnej krawędzi okna przeglądarki do górnej krawędzi canvas = dzięki temu obliczeniu pozycja myszki będzie liczona od górnej krawędzi canvasu

    playerY = e.clientY - topCanvas - paddleHeight / 2;
    // console.log(playerY)
    if (playerY <= 0) playerY = 0;
    if (playerY >= ch - paddleHeight) playerY = ch - paddleHeight;

    //tylko do testów przypisujemy ruch myszka dla kompa
    // aiY = playerY;
}

//funkcja przyspieszenie piłki gdy odbijemy paletka i gdy odbije sie od gornej i dolnej krawędzi
function speedUp() {
    // console.log(ballSpeedX + ", " + ballSpeedY)
    //predkość X
    if (ballSpeedX > 0 && ballSpeedX < 16) //czyli piłka przemieszcza sie w prawo
        ballSpeedX++;
    else if (ballSpeedX < 0 && ballSpeedX > -16) ballSpeedX--; //piłka przemieszcza się w lewo

    //predkość Y
    if (ballSpeedY > 0 && ballSpeedY < 16) //czyli piłka przemieszcza sie w dół
        ballSpeedY++;
    else if (ballSpeedY < 0 && ballSpeedY > -16) ballSpeedY--; //piłka przemieszcza się w góre

}


//sztuczna inteligencja
function aiPosition() { //wyliczenie pozycji komputera
    //algorytm sztucznej inteligencji komputera będzie się opierał o 1. jak daleko piłka jest na osi x od początku canvas,
    //2.  relacja (odległość na osi Y) rakietki komputera do piłki

    const middlePaddle = aiY + paddleHeight / 2 //zmienna do przechowywania informacji gdzie jest środek paletki na osi Y
    const middleBall = ballY + ballSize / 2 //srodek piłki na osi Y

    if (ballX > 500) { //jeśli piłka jest na połowie komputera
        if (middlePaddle - middleBall > 200) { //jeśli odległość środka paletki minus środka piłki będzie większa niż 200px
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
    table() //najpierw musi być table bo kolejność ma znaczenie inaczej by zakryła piłkę (jakby ball była pierwsza wywołana)
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
//ruch w canvas nadajemy tylko poprzez wielokrotne wywoływanie funkcji np ball - można użyć metody setInterval
setInterval(game, 1000 / 60) //1000-s 60 ms czyli 60 klatek na sekundę tyle ile ma monitor razy na sekunde będzie odwoływał się do funkcji game która ponownie będzie rysowała table ball, i rakietki tak szybko że oko ludzkie tego nie zauważy - tak działa canvas
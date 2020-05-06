const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");
const btnReset = document.getElementById("btn");

// carregando os arquivos de áudio
const colidir = new Audio();
const comer = new Audio();
const esquerda = new Audio();
const cima = new Audio();
const direita = new Audio();
const baixo = new Audio();

colidir.src = "audio/dead.mp3"
comer.src = "audio/eat.mp3"
esquerda.src = "audio/left.mp3"
cima.src = "audio/up.mp3"
direita.src = "audio/right.mp3"
baixo.src = "audio/down.mp3"

// criando as unidades (caixas)
const box = 32;

// criando os load das imagens (chão - ground e comida)
const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";


// criando a snake (cobrinha)
let snake = [];
snake[0] = {
    x : 9 * box, // 9 * 32
    y : 10 * box // 10 * 32
}

// criando a comida Randômica
let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// criando os pontos do jogo
let score = 0;

//criar um botão reset
btnReset.addEventListener("click", function btnReset(){
    location.reload();
})

// controle da snake (cobrinha)
let d;

document.addEventListener("keydown", direction);

// condição : caso a snake estiver indo para direita não teria como ir para esquerda logo apertando a tecla
function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        esquerda.play();
        d = "LEFT";
    }else if( key == 38 && d != "DOWN" ){
        cima.play();
        d = "UP";
    }else if( key == 39 && d != "LEFT" ){
        direita.play();
        d = "RIGHT";
    }else if( key == 40 && d != "UP" ){
        baixo.play();
        d = "DOWN";
    }
}

// função para verificar a colisão da cobra
function collision(head, array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return  true; // caso tenha colisão vai retornar verdadeiro
        }
    }
    return false;// caso não tenha colisão vai retornar falso
}

// desenhar tudo na tela
function draw(){

    ctx.drawImage(ground,0,0);

    for (let i = 0; i < snake.length ; i++){

        ctx.fillStyle = (i == 0)? "green" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }

    ctx.drawImage(foodImg, food.x, food.y ); // chamada para a comida aparecer Randômica

    // posição antiga da cabeça da cobra
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;


    // qual direção
    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;

    //  evento da cobra comer a comida
    if(snakeX == food.x && snakeY == food.y){
        score++;
        comer.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        // não vai remover a cauda
    }else{
        // remover a cauda da cobra
        snake.pop();
    }

    // adicionar uma nova cabeça
    let newHead = {
        x : snakeX,
        y : snakeY
    }

    // game over
    if(snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collision(newHead, snake)){
        clearInterval(game);
        colidir.play();
        // alert("Game Over !"+" "+"Pontos: "+ score);
    }

    
    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "45px Roboto";
    ctx.fillText(score, 2*box, 1.6*box);
}

// função de desenho de chamada a cada 100 ms
let game = setInterval(draw,100);
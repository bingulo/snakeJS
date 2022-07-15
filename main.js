const BG_COLOUR = '#231F20';
const SNAKE_COLOUR = '#63A16F';
const SNAKE_HEAD_COLOUR = '#B4CE59';
const FOOD_COLOUR = '#A16395';

// Canvas principal
const main_canvas = document.getElementById('main_canvas');
const ctx = main_canvas.getContext('2d');

document.getElementById('mode_button').onclick = toggleMode;

const modo_dom = document.getElementById('modo');
var modo = 'tradicional';
modo_dom.innerHTML = modo;

// Tamanho da tela do jogo
main_canvas.width = main_canvas.height = 600;
const FRAMERATE = 10;

// Tamanho das unidade
const SIZE = 20;

// Borda do mapa 
const BORDA = main_canvas.width / SIZE;

let pos, vel, food, snake;

// Variável que controla a direção da cobra 
var dir;

var high_score = 0
var score;
const score_dom = document.getElementById('score_value');
const high_score_dom = document.getElementById('high_score_value');

function toggleMode() {
    if (modo === 'tradicional') { modo = 'angular'; }
    else if (modo === 'angular') { modo = 'tradicional'; }
    modo_dom.innerHTML = modo;
}

function init(){ 
    // Posição inicial da cobra
    pos = {x: 10, y: 10};
    vel = {x: 0, y: 0};

    dir = 2;
    if (score > high_score){
        high_score = score;
        high_score_dom.innerHTML = high_score;
    }
    score = 0;
    // Celulas da cobra 
    snake = [ 
        {x: 8, y: 10},
        {x: 9, y: 10},
        {x: 10, y: 10}
    ]

    randomFood();
}

init();

function randomFood(){
    // Gera posição da comida nova dentro das bordas
    food = {
        x: Math.floor(Math.random() * BORDA), 
        y: Math.floor(Math.random() * BORDA),
    }
    // Checa se a comida gerada não esta na mesma posição da cobra  
    for (let cell of snake) {
        if(cell.x === food.x && food.y === cell.y) { 
            return randomFood();
        }
    }
}

document.addEventListener('keydown', keydown);
function keydown(e){
    if (modo === 'angular') {
        switch(e.keyCode) {
            case 37: { 
                dir--;
                break;
            }
            case 39: {
                dir++;
                break;
            }
        }
        dir += 4;
        dir %= 4;
    }
    else if (modo === 'tradicional') {
        switch(e.keyCode) {
            case 37: { 
                if (dir != 2) { dir=0; }
                break;
            }
            case 38: {
                if (dir != 3) { dir=1; }
                break;
            }
            case 39: {
                if (dir != 0) { dir=2; }
                break;
            }
            case 40: {
                if (dir != 1) { dir=3; }
                break;
            }
        }
    }
    switch(dir) {
        case 0: {
            // Esquerda
            vel = {x: -1, y: 0};
            break;
        }
        case 1: {
            // Cima
            vel = {x: 0, y: -1};
            break;
        }
        case 2: {
            // Direita
            vel = {x: 1, y: 0};
            break;
        }
        case 3: {
            // Baixo
            vel = {x: 0, y: 1}
            break;
        }
    }
}

setInterval(() => {
    requestAnimationFrame(gameLoop); 
}, 1000 /FRAMERATE);

function gameLoop(){
    // Preenche o fundo da arena
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, main_canvas.width, main_canvas.height); 

    score = snake.length - 3;
    score_dom.innerHTML = score;

    // Preenche cada célula da cobra
    ctx.fillStyle = SNAKE_COLOUR;
    for (let cell of snake) {
        ctx.fillRect(cell.x*SIZE, cell.y*SIZE, SIZE, SIZE); 
    }

    ctx.fillStyle = SNAKE_HEAD_COLOUR;
    ctx.fillRect(snake[snake.length - 1].x*SIZE, snake[snake.length - 1].y*SIZE, SIZE, SIZE); 
    
    // Preenche a comida 
    ctx.fillStyle = FOOD_COLOUR;
    ctx.fillRect(food.x*SIZE, food.y*SIZE, SIZE, SIZE);

    pos.x += vel.x; 
    pos.y += vel.y;
    
    // Se tocar nas bordas, reinicia o jogo
    if (pos.x < 0 || pos.x === BORDA || pos.y < 0 || pos.y === BORDA) { 
        init();
    }

    if (food.x === pos.x && food.y === pos.y) {
        snake.push({...pos});
        pos.x += vel.x;
        pos.y += vel.y;
        randomFood();
    }

    if (vel.x || vel.y) {
        for (let cell of snake) {
            // Se a cobra toca nela mesma, reinicia o jogo
            if (cell.x === pos.x && cell.y === pos.y) { 
                return init();
            }
        }
        // Coloca o elemento "pos" no final da lista
        snake.push({...pos}); 
        // Remove o elemento do começo da lista 
        snake.shift(); 
    }
}

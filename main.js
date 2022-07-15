const BG_COLOUR = '#231F20';
const MAP_COLOUR = '#BBBBBB';
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

document.getElementById('mapa_button').onclick = toggleMap;

const mapa_dom = document.getElementById('mapa');
var current_map = 0;
mapa_dom.innerHTML = current_map;
var map = [
    [],

    [ 
        {x: 23, y: 8},
        {x: 23, y: 9},
        {x: 23, y: 10},
        {x: 23, y: 11},
        {x: 23, y: 11},
        {x: 24, y: 8},
        {x: 24, y: 9},
        {x: 24, y: 10},
        {x: 24, y: 11},
        {x: 25, y: 11},
        {x: 10, y: 29},
        {x: 9, y: 29},
        {x: 8, y: 29},
        {x: 8, y: 28},
        {x: 8, y: 27},
        {x: 4, y: 11},
        {x: 4, y: 12},
        {x: 4, y: 13},
        {x: 4, y: 14},
        {x: 5, y: 11},
        {x: 5, y: 12},
        {x: 5, y: 13},
        {x: 5, y: 14},
        {x: 6, y: 11},
        {x: 6, y: 12},
        {x: 6, y: 13},
        {x: 6, y: 14},
        {x: 17, y: 18},
        {x: 18, y: 18},
        {x: 18, y: 19},
        {x: 18, y: 20},
        {x: 19, y: 18},
        {x: 19, y: 19},
        {x: 19, y: 20},
        {x: 15, y: 2},
        {x: 15, y: 3},
        {x: 15, y: 4},
        {x: 16, y: 2},
        {x: 16, y: 3},
        {x: 16, y: 4},
        {x: 16, y: 5},
    ],
    
    [
        {x: 0, y: 7},
        {x: 0, y: 22},
        {x: 0, y: 27},
        {x: 1, y: 10},
        {x: 2, y: 5},
        {x: 2, y: 23},
        {x: 3, y: 8},
        {x: 3, y: 16},
        {x: 3, y: 24},
        {x: 4, y: 6},
        {x: 4, y: 27},
        {x: 5, y: 0},
        {x: 5, y: 3},
        {x: 5, y: 22},
        {x: 5, y: 23},
        {x: 6, y: 26},
        {x: 7, y: 1},
        {x: 7, y: 25},
        {x: 7, y: 26},
        {x: 9, y: 13},
        {x: 9, y: 14},
        {x: 9, y: 21},
        {x: 10, y: 4},
        {x: 12, y: 8},
        {x: 12, y: 25},
        {x: 13, y: 9},
        {x: 13, y: 4},
        {x: 13, y: 14},
        {x: 13, y: 16},
        {x: 15, y: 24},
        {x: 15, y: 3},
        {x: 16, y: 26},
        {x: 17, y: 22},
        {x: 17, y: 17},
        {x: 18, y: 26},
        {x: 18, y: 10},
        {x: 19, y: 21},
        {x: 19, y: 22},
        {x: 21, y: 10},
        {x: 22, y: 5},
        {x: 22, y: 7},
        {x: 23, y: 8},
        {x: 23, y: 16},
        {x: 24, y: 27},
        {x: 24, y: 22},
        {x: 25, y: 3},
        {x: 25, y: 23},
        {x: 27, y: 26},
        {x: 28, y: 9},
        {x: 29, y: 13},
        {x: 29, y: 14},
    ]
];

function toggleMode() {
    if (modo === 'tradicional') { modo = 'angular'; }
    else if (modo === 'angular') { modo = 'tradicional'; }
    modo_dom.innerHTML = modo;
}

function toggleMap() {
    if (current_map === 2)
        current_map = 0;
    else
        current_map++;
    mapa_dom.innerHTML = current_map;
    randomFood();
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
    for (let cell of map[current_map]) {
        if (food.x === cell.x && food.y === cell.y) { 
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

    ctx.fillStyle = MAP_COLOUR;
    for (let cell of map[current_map]) {
        ctx.fillRect(cell.x*SIZE, cell.y*SIZE, SIZE, SIZE); 
    }

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
    
    for (let cell of map[current_map]) {
        if (pos.x === cell.x && pos.y === cell.y) { init(); }
    }

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

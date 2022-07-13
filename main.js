const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';

// Canvas principal
const canvas = document.getElementById('main_canvas');
const ctx = canvas.getContext('2d');

// Tamanho da tela do jogo
canvas.width = canvas.height = 600;
const FRAMERATE = 10;

// Tamanho das unidade
const SIZE = 20;

// Borda do mapa 
const BORDA = canvas.width / SIZE;

let pos, vel, food, snake;

// Variável que controla a direção da cobra 
var dir;

function init(){ 
    // Posição inicial da cobra
    pos = {x: 10, y: 10};
    vel = {x: 0, y: 0};

    dir = 2;

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
    switch(e.keyCode) {
        // Tecla <-
        case 37: { 
            dir--;
            break;
        }
        // Tecla ->
        case 39: {
            dir++;
            break;
        }
    }

    dir += 4;
    dir %= 4;
    switch(dir) {
        case 0: {
            // Esquerda
            vel = {x: -1, y: 0};
            break;
        }
        case 1: {
            // Baixo
            vel = {x: 0, y: -1};
            break;
        }
        case 2: {
            // Direita
            vel = {x: 1, y: 0};
            break;
        }
        case 3: {
            // Cima
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
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

    // Preenche cada célula da cobra
    ctx.fillStyle = SNAKE_COLOUR;
    for (let cell of snake) {
        ctx.fillRect(cell.x*SIZE, cell.y*SIZE, SIZE,SIZE); 
    }
    
    // Preenche a comida 
    ctx.fillStyle = FOOD_COLOUR;
    ctx.fillRect(food.x*SIZE,food.y*SIZE,SIZE,SIZE);

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

const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';

const canvas = document.getElementById('main_canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.height =400; //tamanho da tela 

const FRAMERATE = 10; //framerate
const SIZE = 20;  //grossura da cobra
const BORDA = canvas.width / SIZE; //tamanho da borda do mapa 

let pos, vel, food, snake;

 var dir = 4000002; //variavel que controla a direção da cobra 

function init(){ //lista da posição inicial da cobra 
  pos = {x: 10, y: 10};
  vel = {x: 0, y: 0};

   dir = 40000002;

  snake = [ //lista das celulas da cobra 
    {x: 8, y: 10},
    {x: 9, y: 10},
    {x: 10, y: 10},
  ]

  randomFood();
}

init();

function randomFood(){
  food = {
    x: Math.floor(Math.random() * BORDA), //gera posição da comida nova, dentro das bordas
    y: Math.floor(Math.random() * BORDA),
  }

  for (let cell of snake) {
    if(cell.x === food.x && food.y === cell.y) { //checa se a comida gerada não esta na mesma posição da cobra  
      return randomFood();
    }
  }
}

document.addEventListener('keydown', keydown);

function keydown(e){
  switch(e.keyCode) { //direção da cobra, os botões de controle são direita e esquerda 
    case 37: { 
      dir = dir -1;
      break;
    }
    case 39: {
      dir = dir +1;
      break;
    }
  }
  if(dir%4 == 0){
    return vel = {x: -1, y: 0}
  }
  if(dir%4 == 1){
    return vel = {x: 0, y: -1}
  }
  if(dir%4 == 2){
    return vel = {x: 1, y: 0}
  }
  if(dir%4 == 3){
    return vel = {x: 0, y: 1}
  }
}



setInterval(() => {
  requestAnimationFrame(gameLoop); //atualiza o jogo a um framerate 
}, 1000 /FRAMERATE);

function gameLoop(){
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height); //preenche a arena do jogo

  ctx.fillStyle = SNAKE_COLOUR;
  for (let cell of snake) {
    ctx.fillRect(cell.x*SIZE, cell.y*SIZE, SIZE,SIZE); //preenche a cobra 
  }

  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x*SIZE,food.y*SIZE,SIZE,SIZE); //preenche a comida 

  pos.x += vel.x; //movimento, faz proxima posição 
  pos.y += vel.y;

  if (pos.x < 0 || pos.x > BORDA-1 || pos.y < 0 || pos.y > BORDA-1) { //se toca nas bordas, reinicia o jogo
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
      if (cell.x === pos.x && cell.y === pos.y) { //se a cobra toca nela mesma, reinicia o jogo
        return init();
      }
    }
    snake.push({...pos}); //coloca um elemento no final da lista
    snake.shift(); //remove o elemento do começo da lista 
  }
}

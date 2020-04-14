const canvas = document.getElementById('canvas').getContext('2d');
const width = 500;
const height = 500;
const cell = 25;

let snake = [
  {x: 10, y: 10},
  {x: 9, y: 10}
];
let direction = 'right';
let score = 0;
let speed = 400;
let gameInterval;
let gameIsOver = false;
let firstGame = true;
let pause = false;
let foodX;
let foodY; 

const wasdImg = new Image();
wasdImg.src = 'images/wasd.png';
const spaceImg = new Image();
spaceImg.src = 'images/space.png';
const appleImg = new Image();
appleImg.src = 'images/apple.png';

window.onload = () => {
  drawStartLayout();

  document.addEventListener('keydown', () => {
    if (event.code == 'Space' && firstGame) {
      firstGame = false;
      startGame();
    } else if (event.code == 'Space' && gameIsOver) {
      gameIsOver = false;
      direction = 'right';
      score = 0;
      document.getElementById('score').innerHTML = `Score: ${score}`;
      snake = [
        {x: 10, y: 10},
        {x: 9, y: 10}
      ];
      startGame();
    } else if (event.code == 'Space') {
      if (pause) {
        gameInterval = setInterval(game, speed);
        pause = false;
      } else {
        pauseGame();
        pause = true;
      }
    }
  });
  
  document.addEventListener('keydown', () => {
    if (event.code == 'KeyD' && direction != 'left') {
      direction = 'right';
    } else if (event.code == 'KeyS' && direction != 'top') {
      direction = 'bottom';
    } else if (event.code == 'KeyA' && direction != 'right') {
      direction = 'left';
    } else if (event.code == 'KeyW' && direction != 'bottom') {
      direction = 'top';
    }
  });
};

function game() {
  document.addEventListener('keydown', () => {
    if (event.code == 'KeyD' && direction != 'left') {
      direction = 'right';
    } else if (event.code == 'KeyS' && direction != 'top') {
      direction = 'bottom';
    } else if (event.code == 'KeyA' && direction != 'right') {
      direction = 'left';
    } else if (event.code == 'KeyW' && direction != 'bottom') {
      direction = 'top';
    }
  });

  outOfField();
  ateMyself();

  if (snake[0].x == foodX && snake[0].y == foodY) {
    score++; 
    document.getElementById('score').innerHTML = `Score: ${score}`;
    if (speed > 100 && score % 5 == 0) {
      speed -= 50;
      clearInterval(gameInterval);
      gameInterval = setInterval(game, speed);
    } 
    if (direction == 'right') {
      snake.push({x: snake[snake.length - 1].x - 1, y: snake[snake.length - 1].y});
    } else if (direction == 'bottom') {
      snake.push({x: snake[snake.length - 1].x, y: snake[snake.length - 1].y - 1});
    } else if (direction == 'left') {
      snake.push({x: snake[snake.length - 1].x + 1, y: snake[snake.length - 1].y});
    } else if (direction == 'top') {
      snake.push({x: snake[snake.length - 1].x, y: snake[snake.length - 1].y + 1});
    }
    generateFood();
    drawFood();
  }

  move();

  if (!gameIsOver) {
    canvas.clearRect(0, 0, width, height);
    drawFild();
    drawFood();
    drawSnake();
  }
}

function drawStartLayout() {
  canvas.fillStyle = '#ccc';
  canvas.fillRect(0, 0, width, height);
  canvas.drawImage(wasdImg, 80, 30);
  canvas.fillStyle = '#000';
  canvas.font = "48px serif";
  canvas.fillText('to move', 260, 100);
  canvas.drawImage(spaceImg, 80, 110);
  canvas.fillText('to pause', 260, 180);
  canvas.textAlign = 'center';
  canvas.fillText('press space', width / 2, height / 2 + 50);
  canvas.font = "36px serif";
  canvas.fillText('to start a game', width / 2, height / 2 + 100);
}

function startGame() {
  drawFild(); 
  generateFood();
  drawFood();
  drawSnake();
  gameInterval = setInterval(game, speed);
}

function drawFild() {
  let counter = 0;
  for (let i = 0; i <= width; i += cell) {
    for (let j = 0; j <= height; j += cell) {
      counter++;
      canvas.fillStyle = (counter % 2 == 0) ? '#eee' : '#fff';
      canvas.fillRect(i, j, cell, cell);
    }
  }
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    canvas.fillStyle = (i == 0) ? '#02a657' : '#05fc85';
    canvas.fillRect(snake[i].x * cell, snake[i].y * cell, cell, cell);
  }
}

function generateFood() {
  generate();

  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x == foodX && snake[i].y == foodY) {
      generateFood();
    }
  }

  function generate() {
    foodX = Math.floor(Math.random() * (width / cell - 1) + 1);
    foodY = Math.floor(Math.random() * (height / cell - 1) + 1);
  }
}

function drawFood() {
  canvas.drawImage(appleImg, foodX * cell, foodY * cell);
}


function outOfField() {
  if (snake[0].x < 0 || snake[0].x > width / cell - 1 ||  
    snake[0].y < 0 || snake[0].y > height / cell - 1) {
      gameOver();
  }
}

function ateMyself() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      gameOver();
    }
  }
}

function move(){
  if (direction == 'right') {
    // snake.pop();
    snake.unshift({x: snake[0].x + 1, y: snake[0].y});
  } else if (direction == 'bottom') {
    // snake.pop();
    snake.unshift({x: snake[0].x, y: snake[0].y + 1});
  } else if (direction == 'left') {
    // snake.pop();
    snake.unshift({x: snake[0].x - 1, y: snake[0].y});
  } else if (direction == 'top') {
    // snake.pop();
    snake.unshift({x: snake[0].x, y: snake[0].y - 1});
  }
  snake.pop();
}

function gameOver() {
  gameIsOver = true;
  clearInterval(gameInterval);
  speed = 400;
  canvas.fillStyle = '#ccc';
  canvas.fillRect(0, 0, width, height);
  canvas.font = "48px serif";
  canvas.fillStyle = '#000';
  canvas.fillText('game over', width / 2, height / 2 - 100);
  canvas.font = "36px serif";
  canvas.fillText(`your score: ${score}`, width / 2, height / 2);
  canvas.fillText('press space ', width / 2, height / 2 + 50);
  canvas.fillText('to start a new game', width / 2, height / 2 + 100);
}

function pauseGame() {
  clearInterval(gameInterval);
  canvas.fillStyle = '#ccc';
  canvas.fillRect(0, 0, width, height);
  canvas.font = "48px serif";
  canvas.fillStyle = '#000';
  canvas.fillText('game paused', width / 2, height / 2 - 50);
  canvas.font = "36px serif";
  canvas.fillText('press space', width / 2, height / 2 + 50);
  canvas.fillText('to continue a game', width / 2, height / 2 + 100);
}
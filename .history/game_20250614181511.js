// const canvas = document.getElementById('pongCanvas');
co
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 9;

const PLAYER_X = 18;
const AI_X = canvas.width - PADDLE_WIDTH - 18;

// Game objects
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5 * (Math.random() < 0.5 ? -1 : 1);
let ballSpeedY = 3 * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;

// Mouse control
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within canvas
    playerY = Math.max(Math.min(playerY, canvas.height - PADDLE_HEIGHT), 0);
});

// AI logic
function updateAI() {
    const center = aiY + PADDLE_HEIGHT / 2;
    if (center < ballY - 10) {
        aiY += 4;
    } else if (center > ballY + 10) {
        aiY -= 4;
    }
    // Clamp paddle within canvas
    aiY = Math.max(Math.min(aiY, canvas.height - PADDLE_HEIGHT), 0);
}

// Ball and collision logic
function resetBall(direction = 1) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5 * direction;
    ballSpeedY = 3 * (Math.random() * 2 - 1);
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom collision
    if (ballY - BALL_RADIUS < 0) {
        ballY = BALL_RADIUS;
        ballSpeedY *= -1;
    }
    if (ballY + BALL_RADIUS > canvas.height) {
        ballY = canvas.height - BALL_RADIUS;
        ballSpeedY *= -1;
    }

    // Left paddle collision
    if (
        ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_RADIUS > playerY &&
        ballY - BALL_RADIUS < playerY + PADDLE_HEIGHT &&
        ballSpeedX < 0
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
        ballSpeedX *= -1;
        // Add a bit of deflection based on where the ball hits the paddle
        let hit = (ballY - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballSpeedY += hit * 2;
    }

    // Right paddle collision
    if (
        ballX + BALL_RADIUS > AI_X &&
        ballY + BALL_RADIUS > aiY &&
        ballY - BALL_RADIUS < aiY + PADDLE_HEIGHT &&
        ballSpeedX > 0
    ) {
        ballX = AI_X - BALL_RADIUS;
        ballSpeedX *= -1;
        let hit = (ballY - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballSpeedY += hit * 2;
    }

    // Score logic
    if (ballX - BALL_RADIUS < 0) {
        aiScore += 1;
        resetBall(1);
    }
    if (ballX + BALL_RADIUS > canvas.width) {
        playerScore += 1;
        resetBall(-1);
    }
}

// Drawing functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = '#fff2';
    ctx.lineWidth = 2;
    for (let i = 20; i < canvas.height; i += 32) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, i);
        ctx.lineTo(canvas.width / 2, i + 16);
        ctx.stroke();
    }
}

function drawScore() {
    ctx.font = '32px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(playerScore, canvas.width * 0.25, 48);
    ctx.fillText(aiScore, canvas.width * 0.75, 48);
}

function render() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, '#111');

    // Net
    drawNet();

    // Paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#0ff');
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, '#f0f');

    // Ball
    drawCircle(ballX, ballY, BALL_RADIUS, '#ff0');

    // Scores
    drawScore();
}

// Main loop
function gameLoop() {
    updateAI();
    updateBall();
    render();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
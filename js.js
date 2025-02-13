// Отримуємо елемент canvas та його контекст для малювання
const canvas = document.getElementById('myCanvas');
const c = canvas.getContext('2d');

// Об'єкт літака з початковими координатами, розмірами, швидкістю та кольором
const plane = {
    x: canvas.width / 2, // Початкова позиція по осі X (центр)
    y: canvas.height - 50, // Початкова позиція по осі Y (внизу екрану)
    width: 80, // Ширина літака
    height: 50, // Висота літака
    speed: 5, // Швидкість руху
    color: 'red', // Колір (не використовується, оскільки є зображення)
};

// Отримуємо звук пострілу
const spaceSound = document.getElementById('spaceSound');

// Відстежуємо натискання пробілу для відтворення звуку
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        spaceSound.currentTime = 0; // Скидаємо звук до початку
        spaceSound.play(); // Відтворюємо звук
    }
});

// Завантажуємо зображення літака
const litakImage = new Image();
litakImage.src = "https://www.svgrepo.com/show/221881/spaceship.svg";

// Завантажуємо зображення монетки (інопланетянина)
const CoinImage = new Image();
CoinImage.src = "https://www.svgrepo.com/show/485121/gray-alien.svg";

// Масиви для зберігання патронів та монет
const bullets = [];
const coins = [];

// Змінні для рахунку
let score = 0; // Очки
let missedCoins = 0; // Пропущені монети
const WIN_SCORE = 40; // Очки для перемоги
const LOSE_COUNT = 3; // Кількість пропущених монет для поразки
let gameOver = false; // Флаг завершення гри

// Функція для створення монет у випадкових місцях
function spawnCoin() {
    if (gameOver) return; // Не створюємо монети, якщо гра завершена
    const coin = {
        x: Math.random() * (canvas.width - 40), // Випадкова позиція по X
        y: 0, // Початкова позиція по Y (згори екрану)
        size: 50, // Розмір монети
        speed: 2, // Швидкість падіння
    };
    coins.push(coin); // Додаємо монету у масив
}

// Відстеження натискання клавіш
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Функція руху літака
function movePlane() {
    if (keys['ArrowLeft'] && plane.x > 0) {
        plane.x -= plane.speed; // Рух вліво
    }
    if (keys['ArrowRight'] && plane.x + plane.width < canvas.width) {
        plane.x += plane.speed; // Рух вправо
    }
}

// Функція для створення пострілу
function shoot() {
    if (gameOver) return;
    bullets.push({
        x: plane.x + plane.width / 2 - 5, // Центр літака
        y: plane.y, // Початкова позиція патрона
        width: 5, // Ширина патрона
        height: 10, // Висота патрона
        speed: 7, // Швидкість польоту
        color: 'red', // Колір патрона
    });
}

// Відстежуємо натискання пробілу для стрільби
window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        shoot();
    }
});

// Оновлення позиції патронів
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1); // Видаляємо патрони, які вийшли за межі
        }
    });
}

// Оновлення позиції монет
function updateCoins() {
    coins.forEach((coin, index) => {
        coin.y += coin.speed;
        if (coin.y > canvas.height) {
            coins.splice(index, 1);
            missedCoins++; // Збільшуємо лічильник пропущених монет
            checkGameOver(); // Перевіряємо на поразку
        }
    });
}

// Перевіряємо зіткнення патронів із монетами
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        coins.forEach((coin, cIndex) => {
            if (
                bullet.x < coin.x + coin.size &&
                bullet.x + bullet.width > coin.x &&
                bullet.y < coin.y + coin.size &&
                bullet.y + bullet.height > coin.y
            ) {
                bullets.splice(bIndex, 1);
                coins.splice(cIndex, 1);
                score++; // Збільшуємо рахунок
                checkGameOver(); // Перевіряємо на перемогу
            }
        });
    });
}

// Перевірка на завершення гри
function checkGameOver() {
    if (score >= WIN_SCORE) {
        gameOver = true;
        alert("Гра виграна!");
    } else if (missedCoins >= LOSE_COUNT) {
        gameOver = true;
        alert("Гра програна!");
    }
}

// Відображення рахунку
function drawScore() {
    c.fillStyle = 'black';
    c.font = '20px Cursive';
    c.fillText(`Score: ${score}`, 10, 30);
    c.fillText(`Missed: ${missedCoins}`, 10, 60);
}

// Функція малювання літака
function drawPlane() {
    c.drawImage(litakImage, plane.x, plane.y, plane.width, plane.height);
}

// Функція малювання патронів
function drawBullets() {
    bullets.forEach((bullet) => {
        c.fillStyle = bullet.color;
        c.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Функція малювання монет
function drawCoins() {
    coins.forEach((coin) => {
        c.drawImage(CoinImage, coin.x, coin.y, coin.size, coin.size);
    });
}

// Головний ігровий цикл
function gameLoop() {
    if (gameOver) return;
    c.clearRect(0, 0, canvas.width, canvas.height);
    movePlane();
    updateBullets();
    updateCoins();
    checkCollisions();
    drawPlane();
    drawBullets();
    drawCoins();
    drawScore();
    requestAnimationFrame(gameLoop);
}

// Запуск гри
litakImage.onload = function() { drawPlane(); };
CoinImage.onload = function() { drawCoins(); };
setInterval(spawnCoin, 1000);
gameLoop();

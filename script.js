// Элементы DOM
const likeBtn = document.getElementById('like-btn');
const drawBtn = document.getElementById('draw-btn');
const heartsContainer = document.getElementById('hearts-container');

// Состояния
let isLiked = false;
let isDrawing = false;
let lastDrawTime = 0;
const drawIntervalTime = 20; // Интервал между сердечками

// Функция для кнопки "Нравится"
likeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isLiked = !isLiked;
    
    if (isLiked) {
        likeBtn.classList.add('active');
        likeBtn.innerHTML = '<span class="like-icon">♥</span> Понравилось!';
        
        // Создаем эффект сердечек при нажатии
        createHeartBurst(
            likeBtn.getBoundingClientRect().left + likeBtn.offsetWidth / 2,
            likeBtn.getBoundingClientRect().top + likeBtn.offsetHeight / 2
        );
        
        // Звуковой эффект (опционально)
        playLikeSound();
    } else {
        likeBtn.classList.remove('active');
        likeBtn.innerHTML = '<span class="like-icon">♥</span> Нравится';
    }
    
    // Добавляем эффект нажатия
    likeBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        likeBtn.style.transform = '';
    }, 150);
});

// Функция для кнопки "Рисовать"
drawBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isDrawing = !isDrawing;
    
    if (isDrawing) {
        drawBtn.classList.add('active');
        drawBtn.innerHTML = '<span class="draw-icon">✏️</span> Рисование активно';
        startDrawing();
        
        // Показать подсказку
        showDrawingHint();
    } else {
        drawBtn.classList.remove('active');
        drawBtn.innerHTML = '<span class="draw-icon">✏️</span> Рисовать сердечки';
        stopDrawing();
    }
    
    // Добавляем эффект нажатия
    drawBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        drawBtn.style.transform = '';
    }, 150);
});

// Функции для рисования сердечек
function startDrawing() {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Изменяем курсор при рисовании
    document.body.style.cursor = 'crosshair';
}

function stopDrawing() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('touchmove', handleTouchMove);
    
    // Восстанавливаем курсор
    document.body.style.cursor = '';
}

function handleMouseMove(event) {
    const currentTime = Date.now();
    if (currentTime - lastDrawTime > drawIntervalTime) {
        createHeart(event.clientX, event.clientY);
        lastDrawTime = currentTime;
    }
}

function handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const currentTime = Date.now();
    
    if (currentTime - lastDrawTime > drawIntervalTime) {
        createHeart(touch.clientX, touch.clientY);
        lastDrawTime = currentTime;
    }
}

// Функция создания сердечка
function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    
    // Позиционируем сердечко
    heart.style.left = `${x - 12}px`;
    heart.style.top = `${y - 12}px`;
    
    // Случайный размер
    const size = Math.random() * 20 + 15;
    heart.style.fontSize = `${size}px`;
    
    // Случайный оттенок красного
    const hue = Math.floor(Math.random() * 70) + 255; // оттенки зеленого
    const saturation = Math.floor(Math.random() * 50) + 10;
    const lightness = Math.floor(Math.random() * 30) + 15;
    heart.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Случайное движение при анимации
    const tx = (Math.random() - 0.5) * 80;
    const ty = -Math.random() * 120 - 30;
    heart.style.setProperty('--tx', `${tx}px`);
    heart.style.setProperty('--ty', `${ty}px`);

    heartsContainer.appendChild(heart);
    
    // Удаляем сердечко после анимации
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 3000);
}

// Функция создания взрыва сердечек
function createHeartBurst(x, y) {
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 60;
            const burstX = x + Math.cos(angle) * distance;
            const burstY = y + Math.sin(angle) * distance;
            createHeart(burstX, burstY);
        }, i * 30);
    }
}


// Функция показа подсказки
function showDrawingHint() {
    // Создаем подсказку
    const hint = document.createElement('div');
    hint.innerHTML = 'Двигайте мышкой для рисования сердечек. Нажмите снова для отмены.';
    hint.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 70, 31, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10001;
        font-family: 'Montserrat Alternates', sans-serif;
        font-size: 14px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(hint);
    
    // Удаляем подсказку через 3 секунды
    setTimeout(() => {
        hint.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (hint.parentNode) {
                hint.parentNode.removeChild(hint);
            }
        }, 300);
    }, 3000);
}

// Добавляем стили для анимации подсказки
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);


// Очистка сердечек при повторном клике 
heartsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('heart')) {
        e.target.remove();
    }
});

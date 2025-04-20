'use strict'

// Находим контейнер со слайдами
const slides = document.getElementById('forecast__future-cards');

// Определяем количество слайдов
const slideCount = document.querySelectorAll('.forecast__future-cards-hourly').length;

// Находим кнопки «Назад» и «Вперёд»
const nextButton = document.getElementById('forecast__future-btn-weekly');
const prevButton = document.getElementById('forecast__future-btn-hourly');

let currentIndex = 0; // Переменная для хранения текущего индекса слайда
let autoPlayInterval; // Переменная для хранения интервала автопрокрутки


// @param {number} index 

function goToSlide(index) {
    if (index < 0) {
        index = slideCount - 1; // Если текущий слайд первый, переходим на последний
    } else if (index >= slideCount) {
        index = 0; // Если текущий слайд последний, переходим на первый
    }

    currentIndex = index; // Запоминаем текущий индекс
    slides.style.transform = `translateX(${-index * 100}%)`; // Смещаем контейнер слайдов
    
}

// Добавляем обработчик клика для кнопки «Назад»
prevButton.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    // slides.style.justifyContent = 'start'
});

// Добавляем обработчик клика для кнопки «Вперёд»
nextButton.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    // slides.style.justifyContent = 'end'
});

goToSlide(0);
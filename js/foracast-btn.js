'use strict'

const slides = document.getElementById('forecast__future-cards');

const nextButton = document.getElementById('forecast__future-btn-weekly');
const prevButton = document.getElementById('forecast__future-btn-hourly');

prevButton.addEventListener('click', () => {
    slides.style.transform = `translateX(${0}%)`;
    nextButton.classList.remove('forecast__future-btn--active');
    prevButton.classList.add('forecast__future-btn--active');
});

// Добавляем обработчик клика для кнопки «Вперёд»
nextButton.addEventListener('click', () => {
    slides.style.transform = `translateX(${-100}%)`;
    prevButton.classList.remove('forecast__future-btn--active');
    nextButton.classList.add('forecast__future-btn--active');
});
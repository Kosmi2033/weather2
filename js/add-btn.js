'use strict'

function addCity() {
    const citySect = document.getElementById('citySect')
    if (citySect) {
        citySect.style.left = '48.59vw';
        document.getElementById('favoriteCitySect').style.left = '100%';
    } else {
        console.log('Элемент с id="city" не найден');
    }
}

function backAddCity() {
    const citySect = document.getElementById('citySect')
    const cityFavorite = document.getElementById('favoriteCitySect')
    if (citySect) {
        citySect.style.left = '100%';
        cityFavorite.style.left = '100%';
    } else {
        console.log('Элемент с id="city" не найден');
    }
}

// function addCard() {
//     const cityCard = document.querySelector('.city__card');
//     const error1 = document.getElementById('city__card-error-search');
//     const card1 = cityCard.cloneNode(true); // Создаем копию текущего элемента
//     const cards = document.querySelector('#cityFavoriteCards');

//     // Изменяем изображение в копии
//     card1.querySelector('#imgCard').src = './img/main-page/stars/star-after.png';
//     card1.querySelector('#imgCard').setAttribute('onclick','delCard(this)')

//     cards.appendChild(card1); // Добавляем копию в целевой блок
// }

function delCard(element){
    const card = element.closest('.city__card');
    const cards = document.querySelector('#cityFavoriteCards');

    if (card) {
        cards.removeChild(card);
    } else {
        console.error('Элемент city_card не найден');
    }

}

function favoriteCity() {
    const citySect = document.getElementById('favoriteCitySect')
    if (citySect) {
        citySect.style.left = '48.59vw';
        document.getElementById('citySect').style.left = '100%';
    } else {
        console.log('Элемент с id="city" не найден');
    }
}

// export {
//     addCards
// }
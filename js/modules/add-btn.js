'use strict'

function addCity() {
    const citySect = document.getElementById('citySect')
    if (citySect) {
        citySect.style.left = '48.59vw';
    } else {
        console.log('Элемент с id="city" не найден');
    }
}

function backAddCity() {
    const citySect = document.getElementById('citySect')
    if (citySect) {
        citySect.style.left = '100%';
    } else {
        console.log('Элемент с id="city" не найден');
    }
}

function addCard() {
    const cardEl = document.querySelector('.city__card')
    let cardsEl = document.querySelector('.city__cards')

    cardsEl.innerHTML += cardEl.outerHTML
}

// export {
//     addCards
// }
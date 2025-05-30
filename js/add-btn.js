'use strict'

function addCity() {
    const citySect = document.getElementById('citySect')
    let container = window.getComputedStyle(document.querySelector('.all-container')).width;
    let procent = window.getComputedStyle(document.querySelector('.city__search')).width;

    if (citySect) {
        citySect.style.left = Math.round(parseInt(container.slice(0, container.length - 2)) - parseInt(procent.slice(0, procent.length - 2))) + 'px';
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

function delCard(element) {
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
    let container = window.getComputedStyle(document.querySelector('.all-container')).width;
    let procent = window.getComputedStyle(document.querySelector('.city__search')).width;
    if (citySect) {
        citySect.style.left = Math.round(parseInt(container.slice(0, container.length - 2)) - parseInt(procent.slice(0, procent.length - 2))) + 'px';
        document.getElementById('citySect').style.left = '100%';
    } else {
        console.log('Элемент с id="city" не найден');
    }
}

function forecastUp() {
    const forecast = document.querySelector('.forecast')
    const house = document.querySelector('.main__house')
    const bar = document.querySelector('.main__bar')
    const town = document.querySelector('.main__town')
    const temp = document.querySelector('.main__temp')


    if (forecast.style.top === '0%') {
        forecast.style.top = '70%'
        bar.style.transform = 'translateY(0px)'
        house.style.transform = 'translateY(0px)'
        house.style.opacity = '1'
        temp.style.transform = 'translateY(0px)'
        town.style.transform = 'translateY(0px)'
        
    } else {
        forecast.style.top = '0%'
        bar.style.transform = 'translateY(100px)'
        house.style.transform = 'translateY(-50vh)'
        house.style.opacity = '.1'
        temp.style.transform = 'translateY(-50vh)'
        town.style.transform = 'translateY(-50vh)'
    }

}

// export {
//     addCards
// }

// async function miniCards(cityNameCards) {
//     const miniCardsTemp = document.getElementById('city__card-main-inf')
//     const miniCardsHum = document.getElementById('city__card-main-inf-bottom-humidity')
//     const miniCardsLikes = document.getElementById('city__card-main-inf-bottom-likes')
//     const miniCardsCity = document.getElementById('miniCardsCity')
//     const miniCardsErr = document.getElementById('city__card-error-search')
//     const cityCard = document.querySelector('.city__card')


//     const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityNameCards)}&limit=1&appid=${API_KEY}`;
//     const coordResponse = await fetch(geoUrl);

//     if (!coordResponse.ok) {
//         miniCardsErr.style.display = 'block'
//         miniCardsErr.textContent = `Ошибка при поиске города "${cityNameCards}"`
//         throw new Error(`Ошибка при поиске города "${cityNameCards}"`);
        
//     }

//     const coordsData = await coordResponse.json();
//     console.log(coordsData)

//     if (!coordsData.length || !coordsData[0]) {
//         miniCardsErr.style.display = 'block'
//         miniCardsErr.textContent = `Ошибка при поиске города "${cityNameCards}"`
//         throw new Error("Координаты не найдены");
//     }

//     ({ lat, lon } = coordsData[0]);


//     const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
//     const weatherResponse = await fetch(weatherUrl);
//     if (!weatherResponse.ok) {
//         miniCardsErr.style.display = 'block'
//         miniCardsErr.textContent = `Ошибка при загрузке погоды для указанных координат (${lat},${lon})`
//         throw new Error(`Ошибка при загрузке погоды для указанных координат (${lat},${lon})`);

//     }

//     const weatherData = await weatherResponse.json();
//     console.log(weatherData)

//     cityCard.style.display = 'flex';
//     miniCardsErr.style.display = 'none'

//     hum(miniCardsHum, miniCardsLikes)
//     // likes(miniCardsLikes)
// }

// searchCity()

// function searchCity() {

//     const inputSearch = document.getElementById('searchCityInput')
//     inputSearch.onchange = function (event) {
//         console.log(event.target.value)
//         cityNameCards = event.target.value;
//         miniCards(cityNameCards)
//     };
// }


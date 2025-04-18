'use stric'

const API = '20389b41cdb4f698ad133287046846cf'

// const cityInput = document.getElementById('city');
// const getWeatherButton = document.getElementById('getWeather');
// const weatherResult = document.getElementById('weatherResult');



const city = 'moscow';
let strCity = document.getElementById('city');
let strTemp = document.getElementById('temp');





async function getWeather() {




    let lat =0 , lon= 0 ;

    const geoCoder = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=20389b41cdb4f698ad133287046846cf`;

    const respons = await fetch(geoCoder);

    if (!respons.ok) {
        // weatherResult.textContent = "Такого Города Нема!!!! Придурок "
        console.error('пизда не рабюоате !!!!!!!')
    }

    const dataCoord = await respons.json();

    getLocation();

    function getLocation() {
        // Если геолокация поддерживается браузером
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Геолокация не поддерживается.");
            lat = dataCoord[0].lat;
            lon = dataCoord[0].lon;
        }
    }

    function showPosition(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        // console.log("Широта: " + lat + "<br>Долгота: " + lon);
    }

    // console.log(dataCoord)



    strCity.textContent = await dataCoord[0].local_names.ru
    console.log(lat, lon)


    const forecast = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=20389b41cdb4f698ad133287046846cf`

    const responsForecats = await fetch(forecast);

    const dataForecats = await responsForecats.json()

    console.log(dataForecats)
    strTemp.textContent = Math.round(dataForecats.list[0].main.temp - 273) + ' °C';
}


getWeather();

// getWeatherButton.addEventListener('click', getWeather);













// const city = cityInput.value.trim(); // Получаем введённый город
//   if (!city) {
//       weatherResult.textContent = 'Введите название города! ❌';
//       return;
//   }

// const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=20389b41cdb4f698ad133287046846cf&units=metric`;

//   try {
//       const response = await fetch(url); // Отправляем запрос

//       if (!response.ok) {
//         weatherResult.textContent = "Нет такого города"
//           throw new Error('Город не найден ⚠');
//       }

//       const data = await response.json(); // Получаем ответ в формате JSON
//       const temperature = data.main.temp; // Извлекаем температуру
//       const description = data.weather[0].description; // Описание погоды

//       // Показываем результат
//       console.log(data)
//       weatherResult.textContent = `В городе ${city} сейчас ${temperature} ℃, ${description}.`;
//   } catch (error) {
//       weatherResult.textContent = error.message;
//   }
'use strict';

const API_KEY = '20389b41cdb4f698ad133287046846cf';

const cityEl = document.getElementById('city'); // Элемент для имени города
const tempEl = document.getElementById('temp'); // Элемент для температуры

let currentCity = null; // Хранит последний успешно полученный город


async function getWeather(cityName) {
  try {
    let lat, lon;


    if (cityName === null) {
      try {
        const position = await new Promise((resolve, reject) => {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          } else {
            reject(new Error('Геолокация недоступна'));
          }
        });
        
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      } catch (err) {

        cityName = 'Москва';
      }
    }

    if (typeof cityName === 'string') {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`;
      const coordResponse = await fetch(geoUrl);
      
      if (!coordResponse.ok) {
        throw new Error(`Ошибка при поиске города "${cityName}"`);
      }

      const coordsData = await coordResponse.json();

      if (!coordsData.length || !coordsData[0]) {
        throw new Error("Координаты не найдены");
      }

      ({ lat, lon } = coordsData[0]);
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(`Ошибка при загрузке погоды для указанных координат (${lat},${lon})`);
    }

    const weatherData = await weatherResponse.json();

    currentCity = `${weatherData.name}, ${weatherData.sys.country}`;

    cityEl.textContent = currentCity;
    tempEl.textContent = `${Math.round(weatherData.main.temp)}°C`;

  } catch (err) {
    console.error(err.message);
    alert(err.message); 
  }
}


getWeather(null); 
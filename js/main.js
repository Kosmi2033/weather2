'use strict';

// Константа API ключа OpenWeatherMap
const API_KEY = '20389b41cdb4f698ad133287046846cf';

// Домашние элементы интерфейса
const cityEl = document.getElementById('city');              // Элемент для имени города
const tempEl = document.getElementById('temp');              // Элемент для температуры
let currentCity = null;                                      // Последняя успешно полученная погода

/**
 * Получение погодных данных и обновление интерфейса
 *
 * @param {string|null} cityName Название города или null для использования геолокации
 */
async function getWeather(cityName) {
  try {
    let lat, lon;

    // Проверяем, передано ли имя города или используется геолокация
    if (cityName === null) {
      try {
        const position = await new Promise((resolve, reject) => {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          } else {
            reject(new Error('Геолокация недоступна.'));
          }
        });
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      } catch (err) {
        cityName = 'Москва'; // Используется Москва как резервный вариант
      }
    }

    // Определяем координаты города по его названию
    if (typeof cityName === 'string') {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`;
      const response = await fetch(geoUrl);
      if (!response.ok) {
        throw new Error(`Ошибка поиска города "${cityName}".`);
      }
      const data = await response.json();
      if (!data.length || !data[0]) {
        throw new Error("Город не найден.");
      }
      ({ lat, lon } = data[0]); // Берём первые координаты из результатов
    }

    // Запрашиваем прогнозы погоды по данным координатам
    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Ошибка загрузки погоды.`);
    }
    const weatherData = await weatherResponse.json();
    console.log(weatherData)

    // Обновляем основные элементы интерфейса
    currentCity = `${weatherData.city.name}, ${weatherData.city.country}`;
    cityEl.textContent = currentCity;
    tempEl.textContent = `${Math.round(weatherData.list[0].main.temp - 273)} °C`;

    // Дополним деталями (воздух, УФ, ветер, осадки и т.д.)
    updateAirQuality(lat, lon);
    updateUVIndex(lat, lon);
    updateWind(weatherData);
    updateRainfall(weatherData);
    updateFeelsLike(weatherData);
    updateHumidity(weatherData);
    updateVisibility(weatherData);
    updateForecast(weatherData);

  } catch (err) {
    console.error(err.message);
  }
}

// Функция обновления качества воздуха
async function updateAirQuality(lat, lon) {
  const airUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(airUrl);
  if (!response.ok) {
    throw new Error(`Ошибка получения данных о качестве воздуха.`);
  }
  const data = await response.json();

  const aqi = data.list[0].main.aqi;
  const progressBarValue = Math.round(100 / 5 * aqi);

  const airEl = document.getElementById('forecast__extra-card-subtitle-air');
  const chartPointEl = document.getElementById('forecast__extra-card-subtitle-chart-point-air');

  airEl.textContent = `${aqi}`;

  switch (aqi) {
    case 1:
      airEl.textContent += ' - Good';
      break;
    case 2:
      airEl.textContent += ' - Fair';
      break;
    case 3:
      airEl.textContent += ' - Moderate';
      break;
    case 4:
      airEl.textContent += ' - Poor';
      break;
    case 5:
      airEl.textContent += ' - Very poor';
      break;
  }

  chartPointEl.style.left = `${progressBarValue}%`;
}

// Функция обновления индекса ультрафиолетового излучения
async function updateUVIndex(lat, lon) {
  const uvUrl = `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`;
  const response = await fetch(uvUrl);
  if (!response.ok) {
    throw new Error(`Ошибка получения UV индекса.`);
  }
  const data = await response.json();

  const uvi = data.now.uvi;
  const progressBarValue = Math.round(100 / 11 * uvi);

  const uvEl = document.getElementById('forecast__extra-card-subtitle-uv');
  const chartPointEl = document.getElementById('forecast__extra-card-subtitle-chart-point-uv');

  uvEl.textContent = uvi;
  chartPointEl.style.left = `${progressBarValue}%`;
}

// Функция отображения направления ветра
function updateWind(data) {
  const arrowEl = document.getElementById('forecast__wind-arrow');
  const speedEl = document.getElementById('forecast__wind');

  arrowEl.style.transform = `rotate(${Math.round(data.list[0].wind.deg + 90)}deg)`;
  speedEl.textContent = `${data.list[0].wind.speed} km/h`;
}

// Функция отображения количества осадков
function updateRainfall(data) {
  const rainEl = document.getElementById('forecast__extra-card-subtitle-rain');

  if (!data.list[3].rain) {
    rainEl.textContent = 'No precipitation';
  } else {
    rainEl.textContent = `${data.list[3].rain['3h']} mm over past 3 hours`;
  }
}

// Функция расчёта ощущения температуры («ощущается как»)
function updateFeelsLike(data) {
  const feelsEl = document.getElementById('forecast__extra-card-subtitle-likes');
  const txtEl = document.getElementById('forecast__extra-card-subtitle-likes-txt');

  feelsEl.textContent = Math.round(data.list[0].main.feels_like - 273);

  if (data.list[0].wind.speed > 10) {
    txtEl.textContent = "Due to strong winds";
  } else if (data.list[0].main.humidity > 70) {
    txtEl.textContent = "Due to high humidity";
  } else if (data.list[0].clouds.all > 50) {
    txtEl.textContent = "Due to cloudiness";
  } else {
    txtEl.textContent = "Comparable to actual temperature.";
  }
}

// Функция обновления уровня влажности
function updateHumidity(data) {
  const humidityEl = document.getElementById('forecast__extra-card-subtitle-hum');
  const textEl = document.getElementById('forecast__extra-card-subtitle-hum-txt');

  humidityEl.textContent = `${data.list[0].main.humidity}%`;

  if (data.list[0].main.humidity >= 40 && data.list[0].main.humidity <= 60) {
    textEl.textContent = 'Comfortable level of humidity';
  } else if (data.list[0].main.humidity < 40) {
    textEl.textContent = 'Low humidity';
  } else {
    textEl.textContent = 'High humidity';
  }
}

// Функция отображения видимости
function updateVisibility(data) {
  const visEl = document.getElementById('forecast__extra-card-subtitle-vis');
  visEl.textContent = `${Math.round(data.list[0].visibility / 1000)} km`;
}



// Прогноз погоды на следующие дни 
function updateForecast(data) {
  const futElHum = document.querySelectorAll('#forecast__future-card-humidity');
  const futElTitle = document.querySelectorAll('#forecast__future-card-title');
  const futElTemp = document.querySelectorAll('#forecast__future-card-temp');

  // Индекс первого элемента текущего дня
  const nowHour = parseInt(data.list[0].dt_txt.slice(-8, -6));
  console.log(nowHour)
  const startIndex = 0; // Округляем вверх, чтобы начать с ближайшей временной метки

  // Обновляем блоки будущего прогноза
  let counter = startIndex;

  futElHum.forEach((humidityBlock, idx) => {
    const item = data.list[counter];
    humidityBlock.textContent = `${item.main.humidity}%`;
    counter > 3 ? counter = 0 : counter++; // Следующий индекс списка;
  });

  futElTemp.forEach((tempBlock, idx) => {
    const item = data.list[counter];
    tempBlock.textContent = `${Math.round(item.main.temp - 273)}°C`;
    counter > 3 ? counter = 0 : counter++;
  });

  futElTitle.forEach((titleBlock, idx) => {
    const item = data.list[counter];
    titleBlock.textContent = item.dt_txt.slice(-8, -3); // Показываем время в формате ЧЧ:ММ
    counter > 3 ? counter = 0 : counter++;
  });

  // Недельный прогноз
  const weekTitles = document.querySelectorAll('#forecast__future-card-title-weekly');
  const weekHumidityBlocks = document.querySelectorAll('#forecast__future-card-picture-weekly');
  const weekTemperatureBlocks = document.querySelectorAll('#forecast__future-card-temp-weekly');

  // Смещение индекса для начала нового дня
  const firstNextDayIndex = startIndex + ((24 - nowHour) / 3 | 0); // Переводим часы в шаги по три часа
  let dayCounter = firstNextDayIndex;

  weekTitles.forEach((weekTitle, idx) => {
    const dateItem = data.list[dayCounter];
    weekTitle.textContent = dateItem.dt_txt.slice(5, 10); // Формат ММ-ДД
    dayCounter > 32 ? dayCounter = firstNextDayIndex : dayCounter += 8; // Переход к следующим суткам (8 шагов вперед)
  });

  weekHumidityBlocks.forEach((humidityBlock, idx) => {
    const dateItem = data.list[dayCounter];
    humidityBlock.textContent = `${dateItem.main.humidity}%`;
    dayCounter > 32 ? dayCounter = firstNextDayIndex : dayCounter += 8;
  });

  weekTemperatureBlocks.forEach((tempBlock, idx) => {
    const dateItem = data.list[dayCounter];
    tempBlock.textContent = `${Math.round(dateItem.main.temp - 273)}°C`;
    dayCounter > 32 ? dayCounter = firstNextDayIndex : dayCounter += 8;
  });
}

// Минимальная карта погоды конкретного города
async function miniCards(cityName) {
  const cityCard = document.querySelector('.city__card');
  const errorEl = document.getElementById('city__card-error-search');

  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`;
    const response = await fetch(geoUrl);
    if (!response.ok) {
      throw new Error(`Error finding city "${cityName}".`);
    }
    const data = await response.json();
    if (!data.length || !data[0]) {
      throw new Error("City not found.");
    }

    const { lat, lon } = data[0];

    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Error retrieving weather data.`);
    }
    const weatherData = await weatherResponse.json();

    cityCard.style.display = 'flex';
    errorEl.style.display = 'none';

    document.getElementById('city__card-main-inf').textContent = weatherData.city.name;
    document.getElementById('city__card-main-inf-bottom-humidity').textContent = `H: ${weatherData.list[0].main.humidity}`;
    document.getElementById('city__card-main-inf-bottom-likes').textContent = `L: ${Math.round(weatherData.list[0].main.feels_like - 273)}`;
  } catch (err) {
    errorEl.style.display = 'block';
    errorEl.textContent = err.message;
  }
}

// Функционал поиска города
function searchCity() {
  const inputSearch = document.getElementById('searchCityInput');
  inputSearch.addEventListener('input', async e => {
    await miniCards(e.target.value.trim());
  });
}

// Основной обработчик событий кнопок и инициализации
searchCity(); // Добавляем обработчик поиска города
document.getElementById('bar__location-btn').addEventListener('click', () => getWeather(null)); // Кнопка текущей геопозиции
getWeather(null); // Первоначальная автоматическая загрузка погоды
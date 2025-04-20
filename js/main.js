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
      console.log(coordsData)

      if (!coordsData.length || !coordsData[0]) {
        throw new Error("Координаты не найдены");
      }

      ({ lat, lon } = coordsData[0]);
    }

    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Ошибка при загрузке погоды для указанных координат (${lat},${lon})`);
    }

    const weatherData = await weatherResponse.json();
    console.log(weatherData)

    currentCity = `${weatherData.city.name}, ${weatherData.city.country}`;

    cityEl.textContent = currentCity;
    tempEl.textContent = `${Math.round(weatherData.list[0].main.temp - 273)} °C`;


    // Air quality

    const airUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    const airResponse = await fetch(airUrl)

    if (!airResponse.ok) {
      throw new Error(`Ошибка при загрузке погоды для указанных координат (${lat},${lon})`);
    }

    const airData = await airResponse.json();
    console.log(airData)

    airQua();

    function airQua() {
      const airEl = document.getElementById('forecast__extra-card-subtitle-air');
      const airElChar = document.getElementById('forecast__extra-card-subtitle-chart-point-air')
      const airProgres = Math.round(100 / 5 * airData.list[0].main.aqi)

      airEl.textContent = airData.list[0].main.aqi

      switch (airData.list[0].main.aqi) {
        case 1:
          airEl.textContent += ' - Good'
          airElChar.style.left = `${airProgres}%`
          break
        case 2:
          airEl.textContent += ' - Fair'
          airElChar.style.left = `${airProgres}%`
          break
        case 3:
          airEl.textContent += ' - Moderate'
          airElChar.style.left = `${airProgres}%`
          break
        case 4:
          airEl.textContent += ' - Poor'
          airElChar.style.left = `${airProgres}%`
          break
        case 5:
          airEl.textContent += ' - Very Poor'
          airElChar.style.left = `${airProgres}%`
          break
      }
    }

    // uv index

    const uvUrl = `https://currentuvindex.com/api/v1/uvi?latitude=${lat}&longitude=${lon}`

    const uvRespons = await fetch(uvUrl);
    if (!uvRespons.ok) {
      throw new Error(`Ошибка при загрузке погоды для указанных координат (${lat},${lon})`);
    }

    const uvData = await uvRespons.json();
    console.log(uvData)

    uvIndex()

    function uvIndex() {
      const uvEl = document.getElementById('forecast__extra-card-subtitle-uv');
      const uvElChart = document.querySelector('#forecast__extra-card-subtitle-chart-point-uv');
      const uvProgres = Math.round(100 / 11 * uvData.now.uvi);

      uvEl.textContent = uvData.now.uvi;
      uvElChart.style.left = `${uvProgres}%`
    }

    // wind

    wind()

    function wind() {

      const arrowEl = document.getElementById('forecast__wind-arrow');
      const windEl = document.getElementById('forecast__wind')

      arrowEl.style.transform = `rotate(${Math.round(weatherData.list[0].wind.deg + 90)}deg)`
      windEl.innerHTML = weatherData.list[0].wind.speed + '<br>' + 'km/h'
    }

    // rainfall
    rainfall()
    function rainfall() {
      const rainEl = document.getElementById('forecast__extra-card-subtitle-rain')
      const rainEl24 = document.getElementById('forecast__extra-card-subtitle-rainSub')

      if (!weatherData.list[3].rain) {
        console.log('123')
        rainEl.innerHTML = '0 mm' + '<br>' + 'in last 3 hour'
        rainEl24.innerHTML = '0 mm expend in' + '<br>' + 'next 24h'
      } else {
        rainEl.innerHTML = weatherData.list[3].rain + '<br>' + 'in last 3 hour'
        rainEl24.innerHTML = Math.round(weatherData.list[3].rain + weatherData.list[4].rain + weatherData.list[5].rain + weatherData.list[6].rain + weatherData.list[7].rain) + '<br>' + 'next 12h'
      }
    }

    // feel like

    
    // Forecast - card

    forecast()

    function forecast() {
      const futElHum = document.querySelectorAll('#forecast__future-card-humidity');
      // Обработка времени
      const futElTitle = document.querySelectorAll('#forecast__future-card-title');
      // Обработка температуры
      const futElTemp = document.querySelectorAll('#forecast__future-card-temp');
      // Находим ближайший массив следующего дня
      const weekly = Math.round((36 - weatherData.list[0].dt_txt.slice(-8).slice(0, 2)) / 3)
      const weeklyElTitle = document.querySelectorAll('#forecast__future-card-title-weekly');
      const weeklyElHum = document.querySelectorAll('#forecast__future-card-picture-weekly');
      const weeklyElTemp = document.querySelectorAll('#forecast__future-card-temp-weekly');
      let count = 0;
      let i = 1;

      futElHum.forEach((element) => {
        element.textContent = weatherData.list[element.getAttribute('data-id')].main.humidity + '%';
      });
      futElTemp.forEach((element) => {
        element.textContent = Math.round(weatherData.list[element.getAttribute('data-id')].main.temp - 273) + '°C';
      });
      futElTitle.forEach((element) => {
        element.textContent = weatherData.list[element.getAttribute('data-id')].dt_txt.slice(-8).slice(0, 5);
      });

      weeklyElTitle.forEach((element) => {
        if (i < weeklyElTitle.length) {
          element.textContent = weatherData.list[count].dt_txt.slice(5, 10);
          if (count >= weekly) {
            count += 8
          } else {
            count += weekly
          }
          ++i
        } else {
          element.textContent = weatherData.list[count].dt_txt.slice(5, 10);
          if (count >= weekly) {
            count += 8
          } else {
            count += weekly
          }
          count = 0
          i = 1
        }
      });

      weeklyElHum.forEach((element) => {
        if (i < weeklyElTitle.length) {
          element.textContent = weatherData.list[count].main.humidity + '%';
          if (count >= weekly) {
            count += 8
          } else {
            count += weekly
          }
          ++i
        } else {
          element.textContent = weatherData.list[count].main.humidity + '%';
          if (count >= weekly) {
            count += 8
          } else {
            count += weekly
          }
          count = 0
          i = 1
        }
      });

      weeklyElTemp.forEach((element) => {
        if (i < weeklyElTitle.length) {
          element.textContent = Math.round(weatherData.list[count].main.temp - 273) + '°C';
          if (count >= weekly) {
            count += 8
          } else {
            count += weekly
          }
          ++i
        } else {
          element.textContent = Math.round(weatherData.list[count].main.temp - 273) + '°C';
          if (count >= weekly) {
            count += 8
          } else {
            count += weekly
          }
          count = 0
          i = 0
        }
      });
    }

  } catch (err) {
    // console.error(err.message);
    // alert(err.message);
  }


}


getWeather(null); 
const APIKey = '0dd2ffba4adc8637e4be998473a8021b'; //my actual key
let city;
// const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

var resultTempEl = document.querySelector('#searchTemp');
var searchFormEl = document.querySelector('#search-form');
var currentWeather = document.querySelector('#currentWeather');


var queryString;

var forecastURL; 

// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);


//---------------------------------Get Today's Weather Function-----------------------------------------//


function getTodayWeather(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  var queryString = `http://api.openweathermap.org/data/2.5/weather?q=` + searchInputVal + `&appid=${APIKey}&units=imperial`;


  fetch(queryString)
  .then(response => {
    if (!response.ok) {
      throw new Error('NOT OK');
    }
    return response.json();
  })
  .then(data => {

    console.log(data);

    var cityName = data.name
    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humidity = data.main.humidity;
    var date = dayjs().format('M/D/YYYY');
    var weatherIcon = data.weather[0].icon;
    var lat = data.coord.lat;
    var lon = data.coord.lon;

    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`



    console.log(`----- ${cityName} -----`);
    console.log(`Date: ${date}`);
    console.log(`Icon: ${weatherIcon}`);
    console.log(`Temperature: ${temp}°F`);
    console.log(`Wind Speed: ${wind} MPH`);
    console.log(`Humidity: ${humidity}%`);
    console.log(`lat: ${lat}`);
    console.log(`lon: ${lon}`);
    console.log(`---------------`);
    console.log(forecastURL);
    

    var cityNameEl = document.createElement('h1');
    var weatherIconEl = document.createElement('img');
    var tempEl = document.createElement('h2');
    var windEl = document.createElement('h2');
    var humidityEl = document.createElement('h2');
  

    cityNameEl.textContent = `Current Weather: ${cityName} (${date})`;
    weatherIconEl.src= `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
    tempEl.textContent = `Temp: ${temp} °F`;
    windEl.textContent = `Wind Speed: ${wind} MPH`;
    humidityEl.textContent = `Humidity: ${humidity}%`;

    currentWeather.append(cityNameEl);
    // document.body.appendChild(cityNameEl);
    currentWeather.append(weatherIconEl);
    currentWeather.append(tempEl);
    currentWeather.append(windEl);
    currentWeather.appendChild(humidityEl);



    forecast(lat, lon);
  })
  .catch(error => {
    console.error('ERROR OH NO!', error);
  });

}

//---------------------------------5 Day Forecast Function-----------------------------------------//

function forecast(lat, lon) {
  var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`

  fetch(forecastURL)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); 
  })
  .then(data => {
 
    console.log(data);

    var date = data.list[0].dt_txt;
    console.log(date);

    var dateEl = document.createElement('h2');

    dateEl.textContent = `${date}`;

    document.body.appendChild(dateEl);

      // Create unix timestamps for start and end of 5 day forecast
  var startForecast = dayjs().add(1, 'day').startOf('day').unix();
  var endForecast = dayjs().add(6, 'day').startOf('day').unix();

  console.log(startForecast);
  console.log(endForecast);

  let dailyForecast = [startForecast, endForecast];

  console.log(dailyForecast);

  })
  .catch(error => {

    console.error('There was a problem with the fetch operation:', error);
  });
}


















searchFormEl.addEventListener('submit', getTodayWeather)



























// //-------------------------------------------------------------------//


// fetch(queryString)
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then(data => {
//     console.log('Fetch request successful:', data);
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   });

//-------------------------------------------------------------------//



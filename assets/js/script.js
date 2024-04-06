const APIKey = '0dd2ffba4adc8637e4be998473a8021b'; //my actual key
let city;
// const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

var resultTempEl = document.querySelector('#searchTemp');
var searchFormEl = document.querySelector('#search-form');

var queryString;

var forecastURL; 

// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);


// //-------------------------------------------------------------------//


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
  

    cityNameEl.textContent = `${cityName} (${date})`;
    weatherIconEl.src= `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
    tempEl.textContent = `Temp: ${temp} °F`;
    windEl.textContent = `Wind Speed: ${wind} MPH`;
    humidityEl.textContent = `Humidity: ${humidity}%`;

  
    document.body.appendChild(cityNameEl);
    document.body.appendChild(weatherIconEl);
    document.body.appendChild(tempEl);
    document.body.appendChild(windEl);
    document.body.appendChild(humidityEl);

    forecast(lat, lon);
  })
  .catch(error => {
    console.error('ERROR OH NO!', error);
  });

}

function forecast(lat, lon) {
  var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`

  fetch(forecastURL)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON from the response
  })
  .then(data => {
    // Do something with the parsed data
    console.log(data);

    var population = data.city.population;
    console.log(population);

    var populationEl = document.createElement('h1');
    populationEl.textContent = `Population: ${population} People`;
    document.body.appendChild(populationEl);


  })
  .catch(error => {
    // Handle errors that occur during the fetch operation
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



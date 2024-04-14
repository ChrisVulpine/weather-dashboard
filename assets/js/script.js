const APIKey = '0dd2ffba4adc8637e4be998473a8021b'; //my actual key
let city;
// const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

// var resultTempEl = document.querySelector('#searchTemp');
var searchFormEl = document.querySelector('#search-form');
var currentWeather = document.querySelector('#currentWeather');
var forecastContainer = document.querySelector('#fiveDayForecast');
var historyBtnContainer = document.getElementById('button-container');

var lastSearchedCity = '';

var searchHistory = [];

var queryString;

var forecastURL; 

var day1Card = document.querySelector('#day1Card');
var day2Card = document.querySelector('#day2Card');
var day3Card = document.querySelector('#day3Card');
var day4Card = document.querySelector('#day4Card');
var day5Card = document.querySelector('#day5Card');

// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);




//---------------------------------Get Today's Weather Function-----------------------------------------//

// Load local storage function //

function pullInput() {
  var pastInput = localStorage.getItem('input');
  if (pastInput) {
    searchHistory = JSON.parse(pastInput);
    }

    createHistoryBtns();

};



function createHistoryBtns() {
  var historyBtnContainer = document.getElementById('button-container');
  historyBtnContainer.innerHTML = ''
  for (var i = searchHistory.length - 1; i >= 0; i--) {
  var cityButton = document.createElement('button');
  
  cityButton.setAttribute('data-search', searchHistory[i]);
  cityButton.setAttribute('class', 'btn btn-outline-primary');
  cityButton.textContent = searchHistory[i];; 
  historyBtnContainer.appendChild(cityButton);

}};


function getTodayWeather(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    Swal.fire({
      title: 'You need to input a city!',
      icon: 'warning',
      confirmButtonText: `Thanks! I'll try again.`
    })
    return;
  }
  if ( lastSearchedCity.toLowerCase() === searchInputVal.toLowerCase()) {
    return;
  
  }

  lastSearchedCity = searchInputVal
  var queryString = `http://api.openweathermap.org/data/2.5/weather?q=` + searchInputVal + `&appid=${APIKey}&units=imperial`;



  fetch(queryString)
  .then(response => {
    if (!response.ok) {
      throw new Error('City Not Found!'); 
    }
    return response.json();
  })
  
  .then(data => {

    console.log(data);

    var cityName = data.name
    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humidity = data.main.humidity;
    var date = dayjs().format('dddd M/D/YYYY');
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

    currentWeather.textContent = '';

    var cityNameEl = document.createElement('h2');
    var weatherIconEl = document.createElement('img');
    var tempEl = document.createElement('h3');
    var windEl = document.createElement('h3');
    var humidityEl = document.createElement('h3');
  

    cityNameEl.textContent = `${cityName} (${date})`;
    weatherIconEl.src= `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
    tempEl.textContent = `Temp: ${temp} °F`;
    windEl.textContent = `Wind Speed: ${wind} MPH`;
    humidityEl.textContent = `Humidity: ${humidity}%`;

    currentWeather.append(cityNameEl);
    currentWeather.setAttribute('class', 'whiteborderOn col-9 grid text-center uk-animation-slide-bottom');

    currentWeather.append(weatherIconEl);
    currentWeather.append(tempEl);
    currentWeather.append(windEl);
    currentWeather.appendChild(humidityEl);

    // searchInputVal = '';
    forecast(lat, lon);
    pushInput();
  })
  .catch(error => {
    console.error('ERROR OH NO!', error);
  });



}




// Store to local storage //
function pushInput() {
  var searchInputVal = document.querySelector('#search-input').value.trim();
  if (searchInputVal !== '') {
    var lowerCaseInputVal = searchInputVal.toLowerCase();
    if (!searchHistory.includes (lowerCaseInputVal)) {
        searchHistory.push(lowerCaseInputVal);
        localStorage.setItem('input', JSON.stringify(searchHistory));
        console.log(searchHistory);
      } else {
        console.log("Already Searched that city!");
    
      }
      pullInput();
      createHistoryBtns();
    }
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


    var today = dayjs()

    // Day 1 //
    var day1Date = today.add(1, 'day').format('ddd M/D/YYYY');

    // Day 2 //
    var day2Date = today.add(2, 'day').format('ddd M/D/YYYY');

    // Day 3 //
    var day3Date = today.add(3, 'day').format('ddd M/D/YYYY');

    // Day 4 //
    var day4Date = today.add(4, 'day').format('ddd M/D/YYYY');

    // Day 5 //
    var day5Date = today.add(5, 'day').format('ddd M/D/YYYY');


    // Day 1 //
    var day1Icon = data.list[0].weather[0].icon;
    var day1Temp = data.list[0].main.temp;
    var day1Wind = data.list[0].wind.speed;
    var day1Humid = data.list[0].main.humidity; 

    // Day 2 //
    var day2Icon = data.list[8].weather[0].icon;
    var day2Temp = data.list[8].main.temp;
    var day2Wind = data.list[8].wind.speed;
    var day2Humid = data.list[8].main.humidity; 

    // Day 3 //
    var day3Icon = data.list[16].weather[0].icon;
    var day3Temp = data.list[16].main.temp;
    var day3Wind = data.list[16].wind.speed;
    var day3Humid = data.list[16].main.humidity; 

    // Day 4 //
    var day4Icon = data.list[24].weather[0].icon;
    var day4Temp = data.list[24].main.temp;
    var day4Wind = data.list[24].wind.speed;
    var day4Humid = data.list[24].main.humidity; 

    // Day 5 //
    var day5Icon = data.list[32].weather[0].icon;
    var day5Temp = data.list[32].main.temp;
    var day5Wind = data.list[32].wind.speed;
    var day5Humid = data.list[32].main.humidity;     



    var fiveDayForecastTitle = document.createElement('h1');
    // Day 1 //

    var day1DateEl = document.createElement('h3');
    var day1IconEl = document.createElement('img');
    var day1TempEl = document.createElement('p');
    var day1WindEl = document.createElement('p');
    var day1HumidEl = document.createElement('p');

    // Day 2 //
    var day2DateEl = document.createElement('h3');
    var day2IconEl = document.createElement('img');
    var day2TempEl = document.createElement('p');
    var day2WindEl = document.createElement('p');
    var day2HumidEl = document.createElement('p');

    // Day 3 //
    var day3DateEl = document.createElement('h3');
    var day3IconEl = document.createElement('img');
    var day3TempEl = document.createElement('p');
    var day3WindEl = document.createElement('p');
    var day3HumidEl = document.createElement('p');

    // Day 4 //
    var day4DateEl = document.createElement('h3');
    var day4IconEl = document.createElement('img');
    var day4TempEl = document.createElement('p');
    var day4WindEl = document.createElement('p');
    var day4HumidEl = document.createElement('p');

    // Day 5 //
    var day5DateEl = document.createElement('h3');
    var day5IconEl = document.createElement('img');
    var day5TempEl = document.createElement('p');
    var day5WindEl = document.createElement('p');
    var day5HumidEl = document.createElement('p');    

    // fiveDayForecastTitle.textContent = `Five Day Forecast:`

    // Day 1 //
    day1DateEl.textContent = `${day1Date}`;
    day1IconEl.src= `https://openweathermap.org/img/wn/${day1Icon}@2x.png`;
    day1TempEl.textContent = `Temp: ${day1Temp} °F`;
    day1WindEl.textContent = `Wind Speed: ${day1Wind} MPH`;
    day1HumidEl.textContent = `Humidity: ${day1Humid}%`;

    // Day 2 //
    day2DateEl.textContent = `${day2Date}`;
    day2IconEl.src= `https://openweathermap.org/img/wn/${day2Icon}@2x.png`;
    day2TempEl.textContent = `Temp: ${day2Temp} °F`;
    day2WindEl.textContent = `Wind Speed: ${day2Wind} MPH`;
    day2HumidEl.textContent = `Humidity: ${day2Humid}%`;

    // Day 3 //
    day3DateEl.textContent = `${day3Date}`;
    day3IconEl.src= `https://openweathermap.org/img/wn/${day3Icon}@2x.png`;
    day3TempEl.textContent = `Temp: ${day3Temp} °F`;
    day3WindEl.textContent = `Wind Speed: ${day3Wind} MPH`;
    day3HumidEl.textContent = `Humidity: ${day3Humid}%`;

    // Day 4 //
    day4DateEl.textContent = `${day4Date}`;
    day4IconEl.src= `https://openweathermap.org/img/wn/${day4Icon}@2x.png`;
    day4TempEl.textContent = `Temp: ${day4Temp} °F`;
    day4WindEl.textContent = `Wind Speed: ${day4Wind} MPH`;
    day4HumidEl.textContent = `Humidity: ${day4Humid}%`;

    // Day 5 //
    day5DateEl.textContent = `${day5Date}`;
    day5IconEl.src= `https://openweathermap.org/img/wn/${day5Icon}@2x.png`;
    day5TempEl.textContent = `Temp: ${day5Temp} °F`;
    day5WindEl.textContent = `Wind Speed: ${day5Wind} MPH`;
    day5HumidEl.textContent = `Humidity: ${day5Humid}%`;    

    forecastContainer.textContent = '';
    day1Card.textContent = '';
    day2Card.textContent = '';
    day3Card.textContent = '';
    day4Card.textContent = '';
    day5Card.textContent = '';

    forecastContainer.append(day1Card);
    forecastContainer.append(day2Card);
    forecastContainer.append(day3Card);
    forecastContainer.append(day4Card);
    forecastContainer.append(day5Card);

    // Day 1 //
    day1Card.setAttribute('class', 'fiveDayStyle text-center uk-animation-slide-left');
    day1Card.append(day1DateEl);
    day1Card.append(day1IconEl);
    day1Card.append(day1TempEl);
    day1Card.append(day1WindEl);
    day1Card.append(day1HumidEl);

    // Day 2 //
    day2Card.setAttribute('class', 'fiveDayStyle text-center uk-animation-slide-left');
    day2Card.append(day2DateEl);
    day2Card.append(day2IconEl);
    day2Card.append(day2TempEl);
    day2Card.append(day2WindEl);
    day2Card.append(day2HumidEl);

    // Day 3 //
    day3Card.setAttribute('class', 'fiveDayStyle text-center uk-animation-slide-left');
    day3Card.append(day3DateEl);
    day3Card.append(day3IconEl);
    day3Card.append(day3TempEl);
    day3Card.append(day3WindEl);
    day3Card.append(day3HumidEl);

    // Day 4 //
    day4Card.setAttribute('class', 'fiveDayStyle text-center uk-animation-slide-left');
    day4Card.append(day4DateEl);
    day4Card.append(day4IconEl);
    day4Card.append(day4TempEl);
    day4Card.append(day4WindEl);
    day4Card.append(day4HumidEl);

    // Day 5 //
    day5Card.setAttribute('class', 'fiveDayStyle text-center uk-animation-slide-left');
    day5Card.append(day5DateEl);
    day5Card.append(day5IconEl);
    day5Card.append(day5TempEl);
    day5Card.append(day5WindEl);
    day5Card.append(day5HumidEl); 
    
    

  })
  .catch(error => {

    console.error('There was a problem with the fetch operation:', error);
  });
}



function historyBtnClick(event) {
  console.log('I WORK!');
  var citybtn = event.target;
  var search = citybtn.getAttribute('data-search'); 

  console.log(search);


  displayHistoryBtn(search);
}

function displayHistoryBtn(search) {
  var queryString = `http://api.openweathermap.org/data/2.5/weather?q=` + search + `&appid=${APIKey}&units=imperial`;



  fetch(queryString)
  .then(response => {
    if (!response.ok) {
      throw new Error('City Not Found!'); 
    }
    return response.json();
  })
  
  .then(data => {
    currentWeather.textContent = '';

    console.log(data);

    var cityName = data.name
    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humidity = data.main.humidity;
    var date = dayjs().format('dddd M/D/YYYY');
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

    

var cityNameEl = document.createElement('h2');
var weatherIconEl = document.createElement('img');
var tempEl = document.createElement('h3');
var windEl = document.createElement('h3');
var humidityEl = document.createElement('h3');


cityNameEl.textContent = `${cityName} (${date})`;
weatherIconEl.src= `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
tempEl.textContent = `Temp: ${temp} °F`;
windEl.textContent = `Wind Speed: ${wind} MPH`;
humidityEl.textContent = `Humidity: ${humidity}%`;

currentWeather.append(cityNameEl);
currentWeather.setAttribute('class', 'whiteborderOn col-9 grid text-center uk-animation-slide-bottom');

currentWeather.append(weatherIconEl);
currentWeather.append(tempEl);
currentWeather.append(windEl);
currentWeather.appendChild(humidityEl);


forecast(lat, lon);
pushInput();
})
.catch(error => {
console.error('ERROR OH NO!', error);
});
};













pullInput()
searchFormEl.addEventListener('submit', getTodayWeather);
historyBtnContainer.addEventListener('click', historyBtnClick);


























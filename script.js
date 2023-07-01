// Global variables
var apiKey = "adeec1984a0306b0502aa91c1c7cbb44";
var cityInputEl = document.querySelector("#city");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#five-day-forecast");
var searchHistoryEl = document.querySelector("#search-history");

// Add event listener to the form
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // prevent the form from submitting in the traditional way
    var city = cityInputEl.value.trim();
    if (city) {
        getCityCoordinates(city);
    }
});

// Function to get coordinates for a city
function getCityCoordinates(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;
                    getCityWeather(lat, lon);
                    getCityForecast(lat, lon);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeatherMap");
        });
}

// Function to get current weather data for coordinates
function getCityWeather(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=" + apiKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayCurrentWeather(data, lat, lon);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeatherMap");
        });
}

// Function to display current weather data for coordinates
function displayCurrentWeather(data, lat, lon) {
    currentWeatherEl.innerHTML = "";

    var cityEl = document.createElement("h2");
    cityEl.textContent = "Current Weather (" + new Date().toLocaleDateString() + ")";

    var iconEl = document.createElement("img");
    iconEl.setAttribute(
        "src",
        "https://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png"
    );

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temperature: " + data.current.temp + " °F";

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + data.current.humidity + "%";

    var windEl = document.createElement("p");
    windEl.textContent = "Wind Speed: " + data.current.wind_speed + " MPH";

    currentWeatherEl.appendChild(cityEl);
    currentWeatherEl.appendChild(iconEl);
    currentWeatherEl.appendChild(tempEl);
    currentWeatherEl.appendChild(humidityEl);
    currentWeatherEl.appendChild(windEl);
}

// Function to display 5-day forecast data for coordinates
function displayCityForecast(data) {
    forecastEl.innerHTML = "";

    for (var i = 1; i < 6; i++) {
        var forecast = data.daily[i];

        var forecastCardEl = document.createElement("div");
        forecastCardEl.setAttribute("class", "forecast-card");

        var dateEl = document.createElement("h4");
        dateEl.textContent = new Date(forecast.dt * 1000).toLocaleDateString();

        var iconEl = document.createElement("img");
        iconEl.setAttribute(
            "src",
            "https://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png"
        );

        var tempEl = document.createElement("p");
        tempEl.textContent = "Temperature: " + forecast.temp.day + " °F";

        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + forecast.humidity + "%";

        forecastCardEl.appendChild(dateEl);
        forecastCardEl.appendChild(iconEl);
        forecastCardEl.appendChild(tempEl);
        forecastCardEl.appendChild(humidityEl);

        forecastEl.appendChild(forecastCardEl);
    }
}
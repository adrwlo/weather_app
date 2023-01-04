//WELCOME SITE
const api_key = '7f2a917cf09d4b597fd6911118bc94bb';
let welcomeInputValue = localStorage.getItem('welcomeInputValue');
console.log(welcomeInputValue);
getDayForecast(welcomeInputValue);
getHourForecast(welcomeInputValue);

const SEARCH_INPUT_INACTIVE = document.querySelector('.search_input.inactive');
const SEARCH_BTN_FOR_INPUT = document.querySelector('.search_btn_for_input.inactive');
const SEARCH_BTN = document.querySelector('.search_btn');
const FORECAST_BTN = document.querySelector('.forecast_btn');
const FORECAST_CONTAINER = document.querySelector('.forecast_container');
const PLACE_DATE_CONTAINER = document.querySelector('.place_date_container');
const EXTENDED_WEATHER = document.querySelector('.extended_weather');
const HIDE_FORECAST = document.querySelector('.hide_forecast');
const TEMP_STATS_MOBILE_CONTAINER = document.querySelector('.temp_stats_mobile_container');
const DIFFERENT_STATS_MOBILE_CONTAINER = document.querySelector('.different_stats_mobile_container');
const NOTIFICATION = document.querySelector('.notification_container.inactive');
const CLOSE_NOTIFICATION = document.querySelector('.close_notification');


function displayMenuInput() {
    SEARCH_INPUT_INACTIVE.classList.remove('inactive');
    SEARCH_BTN_FOR_INPUT.classList.remove('inactive');
    SEARCH_BTN.classList.add('inactive')
}

function hideMenuInput() {
    SEARCH_INPUT_INACTIVE.classList.add('inactive');
    SEARCH_BTN_FOR_INPUT.classList.add('inactive');
    SEARCH_BTN.classList.remove('inactive');

    getDayForecast(SEARCH_INPUT_INACTIVE.value);
    getHourForecast(SEARCH_INPUT_INACTIVE.value);

    SEARCH_INPUT_INACTIVE.value = '';
}

function displayForecast() {
    if(window.innerWidth > 720) {
        FORECAST_CONTAINER.classList.remove('inactive');
        PLACE_DATE_CONTAINER.classList.add('inactive');
        EXTENDED_WEATHER.classList.add('inactive');
        FORECAST_BTN.classList.add('inactive');
    }
    else {
        FORECAST_CONTAINER.classList.remove('inactive');
        FORECAST_BTN.classList.add('inactive');
    }
}

function hideForecast() {
    if(window.innerWidth > 720) {
        FORECAST_CONTAINER.classList.add('inactive');
        PLACE_DATE_CONTAINER.classList.remove('inactive');
        EXTENDED_WEATHER.classList.remove('inactive');
        FORECAST_BTN.classList.remove('inactive');   
    }
    else {
        FORECAST_CONTAINER.classList.add('inactive');
        FORECAST_BTN.classList.remove('inactive');
    }
    
}

SEARCH_BTN.addEventListener('click', displayMenuInput);
SEARCH_BTN_FOR_INPUT.addEventListener('click', hideMenuInput)
FORECAST_BTN.addEventListener('click', displayForecast);
FORECAST_CONTAINER.addEventListener('click', hideForecast);
SEARCH_INPUT_INACTIVE.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        event.preventDefault();
        SEARCH_INPUT_INACTIVE.classList.add('inactive');
        SEARCH_BTN_FOR_INPUT.classList.add('inactive');
        SEARCH_BTN.classList.remove('inactive');

        getDayForecast(SEARCH_INPUT_INACTIVE.value);
        getHourForecast(SEARCH_INPUT_INACTIVE.value);

        SEARCH_INPUT_INACTIVE.value = '';
    }
})


//BACKGROUND

function changeBackground(icon_desc) {
    let date = new Date();
    let hour = date.getHours();

    if (hour > 6 && hour < 18) {
        document.body.style.backgroundColor = `url('images/bg_imgs/${icon_desc}.jpg')`
    }
    else {
        document.body.style.backgroundImage = `url('images/bg_imgs/${icon_desc}night.jpg')`;
    }
}

//CLOCK

function currentTime() {
    let date = new Date(); 
    let hh = date.getHours();
    let mm = date.getMinutes();

    hh = (hh < 10) ? "0" + hh : hh;
    mm = (mm < 10) ? "0" + mm : mm;

    let time = hh + ":" + mm;

    document.querySelector('.clock').innerText = time; 
    let t = setTimeout(function(){ currentTime() }, 1000);
}
  
currentTime();

async function getDayForecast(cityName) {
    
        let res =  await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}`)
        if (res.status >= 200 && res.status <= 299) {
            let data = await res.json();
            //CITY WEATHER
            let city_weather = data.name;
        
            let main = data.main;
            let weather = data.weather;

            let wind = data.wind;
            let clouds = data.clouds
        
            let icon_picture = weather[0].icon;
            let icon_desc = weather[0].description; 
            let deegres_celsius = Math.round(main.temp - 273.15);
            let feels_like_temp = Math.round(main.feels_like - 273.15);
            let min_temp = Math.round(main.temp_min - 273.15);
            let max_temp = Math.round(main.temp_max - 273.15);
            let wind_speed = Math.round(wind.speed);
            let humidity = main.humidity;
            let cloud = Math.round(clouds.all);

            displayPlaceDate(city_weather);
            displayBasicWeather(icon_picture, icon_desc, deegres_celsius);
            displayExtendWeather(feels_like_temp, min_temp, max_temp, wind_speed, humidity, cloud);
            changeBackground(icon_desc);

        } else {
            // Handle errors
            NOTIFICATION.classList.remove('inactive');
            setTimeout(() => {
                NOTIFICATION.classList.add('inactive');
                SEARCH_INPUT_INACTIVE.value = '';
            }, 2000);
        } 
}


async function getHourForecast(cityName) {
    let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${api_key}`)
    let data = await res.json();
    console.log(data);
    let text = '';
       
        for(let i = 0; i < 5; i++) {
            let dt_txt = data.list[i].dt_txt;
            let max_temp = Math.round(data.list[i].main.temp_max - 273.15);
            let min_temp = Math.round(data.list[i].main.temp_min - 273.15);
            let icon_desc = data.list[i].weather[0].description;
            let icon_picture = data.list[i].weather[0].icon;

            text += `<div class="forecast_day">
                        <h4>${dt_txt}</h4>
                        <img src="http://openweathermap.org/img/wn/${icon_picture}@4x.png" class="forecast_hour_icon" alt="">
                        <p class="forecast_desc">${icon_desc}</p>
                        <span class="temp_stats_container">
                            <img src="images/extended_icons/max_temp.png" alt="">
                            <p>-6 C / -10 C</p>
                        </span>
                        <span class="rain_container">
                            <img src="images/extended_icons/rain.png" alt="">
                            <p>90%</p>
                        </span>
                    </div>`                
        }
        FORECAST_CONTAINER.innerHTML = text;    
}
    
function displayPlaceDate(city_weather) {
    const PLACE_DATE_CONTAINER = document.querySelector('.place_date_container');

    let date = new Date();
    let day = date.getDate();
    let dayOfWeekNumber = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    let dayOfWeekText = '';

    switch (dayOfWeekNumber) {
        case 0:
            dayOfWeekText = "Sunday";
            break;
        case 1:
            dayOfWeekText = "Monday";
            break;
        case 2:
            dayOfWeekText = "Tuesday";
            break;
        case 3:
            dayOfWeekText = "Wednesday";
            break;
        case 4:
            dayOfWeekText = "Thursday";
            break;         
        case 5:
            dayOfWeekText = "Friday";
            break; 
        case 6:
            dayOfWeekText = "Saturday";
            break;
        default:
            break;
      }

    let text = `<h3 class="place">${city_weather}</h3>
                <p class="date">${dayOfWeekText}, ${day}.${month+1}.${year}</p>`;
    
    PLACE_DATE_CONTAINER.innerHTML = text;
}

function displayBasicWeather(icon_picture, icon_desc, deegres_celsius) {
    const BASIC_WEATHER = document.querySelector('.basic_weather');

    let text = `<div class="basic_weather">
                    <div class="icon_weather">
                        <img src="http://openweathermap.org/img/wn/${icon_picture}@4x.png" alt="" class="icon">
                        <p class="icon_desc">${icon_desc}</p>
                    </div>
                    <div class="deegres_celsius_container">
                        <h1 class="deegres_celsius">${deegres_celsius}°</h1>
                    </div>
                </div>`

    BASIC_WEATHER.innerHTML = text;
}

function displayExtendWeather(feels_like_temp, min_temp, max_temp, wind_speed, humidity, cloud) {
    const EXTENDED_WEATHER = document.querySelector('.extended_weather');

    let text = `<table class="extended_weather_table">
                    <tr>
                        <td> 
                            <img src="images/extended_icons/feels_like_temp.png" alt="">
                            <p class="fells_like_temp">${feels_like_temp}°</p>
                        </td>
                        <td>
                            <img src="images/extended_icons/wind_speed.png" alt="">
                            <p class="wind_speed">${wind_speed} km/h</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src="images/extended_icons/max_temp.png" alt="">
                            <p class="max_temp">${max_temp}°</p>
                        </td>
                    <td>
                            <img src="images/extended_icons/rain.png" alt="">
                            <p class="rain">${humidity}%</p>
                    </td>
                    </tr>
                    <tr>
                        <td>
                            <img src="images/extended_icons/min_temp.png" alt="">
                            <p class="min_temp">${min_temp}°</p>
                        </td>
                        <td>
                            <img src="images/extended_icons/cloud.png" alt="">
                            <p class="cloud">${cloud}%</p>
                        </td>
                    </tr>
                </table>
                
                <div class="temp_stats_mobile_container">
                    <div class="fells_like_mobile_container">
                        <img src="images/extended_icons/feels_like_temp.png" alt="">
                        <p class="fells_like_temp">${feels_like_temp}°</p>
                    </div>
                    <div class="max_temp_mobile_container">
                        <img src="images/extended_icons/max_temp.png" alt="">
                        <p class="max_temp">${max_temp}°</p>
                    </div>
                    <div class="min_temp_mobile_container">
                        <img src="images/extended_icons/min_temp.png" alt="">
                        <p class="min_temp">${min_temp}°</p>
                    </div>
                </div>
                <div class="different_stats_mobile_container">
                    <div class="rain_mobile_container">
                        <img src="images/extended_icons/rain.png" alt="">
                        <p class="rain">${humidity}%</p>
                    </div>
                    <div class="cloud_mobile_container">
                        <img src="images/extended_icons/cloud.png" alt="">
                        <p class="cloud">${cloud}%</p>
                    </div>
                    <div class="wind_speed_mobile_container">
                        <img src="images/extended_icons/wind_speed.png" alt="">
                        <p class="wind_speed">${wind_speed}km/h</p>
                    </div>
                </div>`;

    EXTENDED_WEATHER.innerHTML = text;
}




const SEARCH_WELCOME_INPUT = document.querySelector('.search_welcome_input');
const SEARCH_WELCOME_BTN = document.querySelector('.search_welcome_btn');
const NOTIFICATION = document.querySelector('.notification_container.inactive');
const CLOSE_NOTIFICATION = document.querySelector('.close_notification');

const api_key = '7f2a917cf09d4b597fd6911118bc94bb';
let welcomeInputValue;

function getSearchWelcomeInput() {
    welcomeInputValue = SEARCH_WELCOME_INPUT.value;
    getDayForecast(welcomeInputValue);
}

function clearSearchWelcomeInput() {
    SEARCH_WELCOME_INPUT.value = '';
}

async function getDayForecast(cityName) {
    const res =  await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}`)
    console.log(res.status);
    if (res.status >= 200 && res.status <= 299) {
        const data = await res.json();
        console.log(data);
        localStorage.setItem('welcomeInputValue', welcomeInputValue);
        location.href = "weather_site.html"
    } else {
        // Handle errors
        NOTIFICATION.classList.remove('inactive');
        setTimeout(() => {
            NOTIFICATION.classList.add('inactive');
            clearSearchWelcomeInput();
        }, 2000);
    }  
}

SEARCH_WELCOME_BTN.addEventListener('click', getSearchWelcomeInput);
SEARCH_WELCOME_INPUT.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        event.preventDefault();
        getSearchWelcomeInput();
    }
})
CLOSE_NOTIFICATION.addEventListener('click', () => {
    NOTIFICATION.classList.add('inactive');
})

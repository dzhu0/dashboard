// Define constants for API endpoints
const URL_UNSPLASH_API = "https://apis.scrimba.com/unsplash/photos/random"
const URL_WEATHER_API = "https://apis.scrimba.com/openweathermap/data/2.5/weather"
const URL_QUOTES_API = "https://api.api-ninjas.com/v1/quotes?category=inspirational"

// DOM elements for displaying weather, time, quote, and author
const weather = document.getElementById("weather")
const time = document.getElementById("time")
const quote = document.getElementById("quote")
const author = document.getElementById("author")

// User object with a name property
const user = { name: "Daniel" }

// Reload the page every 30 minutes (1800000 milliseconds)
setTimeout(() => {
    window.location.reload()
}, 1800000)

// Update the time display every second
setInterval(getTimeHtml, 1000)

// Fetch a random nature photo from Unsplash API for the background
fetch(`${URL_UNSPLASH_API}?orientation=landscape&query=nature`)
    .then(res => {
        if (!res.ok) throw Error("Unsplash photo not available!")
        return res.json()
    })
    .then(loadBackground)
    .catch(error => {
        // Handle errors and load a default background if necessary
        console.error(error)
        fetch("./defaultBackground.json")
            .then(res => res.json())
            .then(loadBackground)
    })

// Fetch an inspirational quote from Quotes API
fetch(URL_QUOTES_API, { headers: { "X-Api-Key": "7l3ESX18G2BdeSM/9F1+TQ==NC7YNEQxAkCOA8Ay" } })
    .then(res => {
        if (!res.ok) throw Error("Quote not available!")
        return res.json()
    })
    .then(loadQuote)
    .catch(err => {
        // Handle errors related to fetching quotes
        console.error(err)
    })

// Get the user's current geolocation and fetch weather data based on it
navigator.geolocation.getCurrentPosition(position => {
    fetch(`${URL_WEATHER_API}?units=metric&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
        .then(res => {
            if (!res.ok) throw Error("Weather data not available!")
            return res.json()
        })
        .then(loadWeather)
        .catch(err => {
            // Handle errors related to fetching weather data
            console.error(err)
        })
})

// Function to update the time display
function getTimeHtml() {
    const date = new Date()
    time.innerHTML = `
        <h1>${date.toLocaleTimeString("en-us", { timeStyle: "short" })}</h1>
        <p>${getGreeting(date.getHours())}</p>`
}

// Function to determine the greeting based on the current hour
function getGreeting(hour) {
    let partOfDay = "evening"

    if (hour < 12) partOfDay = "morning"
    else if (hour < 18) partOfDay = "afternoon"

    return `Good ${partOfDay}, ${user.name}.`
}

// Function to load the background image
function loadBackground(data) {
    document.body.style.backgroundImage = `url(${data.urls.full})`
    author.textContent = `By: ${data.user.name}`
}

// Function to load and display weather information
function loadWeather(data) {
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    weather.innerHTML = `
        <div class="weather-top">
            <img src=${iconUrl} class="weather-icon">
            <p class="weather-temp">${Math.round(data.main.temp)}&#8451</p>
        </div>
        <p class="weather-city">${data.name}</p>`
}

// Function to load and display an inspirational quote
function loadQuote(data) {
    quote.textContent = `"${data[0].quote}" - ${data[0].author}`
}

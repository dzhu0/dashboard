const URL_UNSPLASH_API = "https://apis.scrimba.com/unsplash/photos/random"
const URL_WEATHER_API = "https://apis.scrimba.com/openweathermap/data/2.5/weather"
const URL_QUOTES_API = "https://api.goprogram.ai/inspiration"

const author = document.getElementById('author')
const weather = document.getElementById("weather")

const user = { name: "Daniel" }

fetch(`${URL_UNSPLASH_API}?orientation=landscape&query=nature`)
    .then(res => {
        if (!res.ok) throw Error("Unsplash photo not available!")

        return res.json()
    })
    .then(data => {
        document.body.style.backgroundImage = `url(${data.urls.full})`
        author.textContent = `By: ${data.user.name}`
    })
    .catch(err => {
        console.error(err)
        fetch("./defaultBackground.json")
            .then(res => res.json())
            .then(data => {
                document.body.style.backgroundImage = `url(${data.urls.full})`
                author.textContent = `By: ${data.user.name}`
            })
    })

navigator.geolocation.getCurrentPosition(position => {
    fetch(`${URL_WEATHER_API}?units=metric&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
        .then(res => {
            if (!res.ok) throw Error("Weather data not available!")

            return res.json()
        })
        .then(data => {
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            weather.innerHTML = `
                <div class="weather-top">
                    <img src=${iconUrl} class="weather-icon"/>
                    <p class="weather-temp">${Math.round(data.main.temp)}&#8451</p>
                </div>
                <p class="weather-city">${data.name}</p>`
        })
        .catch(err => {
            console.error(err)
            weather.innerHTML = `<p class="weather-city">No data</p>`
        })
})

fetch(URL_QUOTES_API)
    .then(res => {
        if (!res.ok) throw Error("Quote not available!")

        return res.json()
    })
    .then(data => {
        document.getElementById('quote').textContent = `
            "${data.quote}" - ${data.author}`
    })

function getTimeHtml() {
    const date = new Date()
    document.getElementById('time').innerHTML = `
        <h1>${date.toLocaleTimeString("en-us", { timeStyle: "short" })}</h1>
        <p>${getGreeting(date.getHours())}</p>`
}

function getGreeting(hour) {
    let greeting =""

    if (hour < 12) greeting = "Good morning"
    else if (hour < 18) greeting = "Good afternoon"
    else greeting = "Good evening"

    return `${greeting}, ${user.name}.`
}

setInterval(getTimeHtml, 1000)

import Notiflix from "notiflix";
import { Notify } from "notiflix/build/notiflix-notify-aio";
const axios = require('axios/dist/browser/axios.cjs');

const refs = {
    input: document.querySelector(".inputText"),
    inputDays:document.querySelector(".inputDays"),
    form: document.querySelector(".forma"),
    infoColumn:document.querySelector(".info-column"),
    location:document.querySelector(".location"),
    apiKey: "fe26c3caa0df4df69b1150837233005",
}

refs.form.addEventListener("submit", submitHandler);

async function submitHandler(event){
    event.preventDefault();
    refs.infoColumn.html = "";
    let name = refs.input.value.trim();
    let dayCount = +refs.inputDays.value.trim() + 1;
    if (name == ""){
        Notiflix.Notify.failure("Input can't be clear! Type something to find weather.") 
    } else {
        const config = {
            method: 'get',
            url: `https://api.weatherapi.com/v1/current.json?key=${refs.apiKey}&q=${name}`,
        }
        await axios(config)
        .then(response =>{
            console.log(response.data.current);
            const iconLink = "https:" + response.data.current.condition.icon; 
            const markup = `<h2 class="info-header">Weather for today in ${response.data.location.name} - ${response.data.current.condition.text}</h2>
            <table class="info-table"><tr><td>Temperature(C)</td><td>Temperature(F)</td><td>Feels Like(C)</td><td>Feels Like(F)</td><td>Wind Speed(KM/H)</td><td>Precipitation in mm</td><td>Weather Icon</td></tr>
            <tr><td>${response.data.current.temp_c}</td><td>${response.data.current.temp_f}</td><td>${response.data.current.feelslike_c}</td><td>${response.data.current.feelslike_f}</td><td>${response.data.current.wind_kph}</td><td>${response.data.current.precip_mm}</td><td><svg class="icon" width="64" height="64"><use href=${iconLink}/></svg></td></tr>
            </table>
            `
            console.log(response.data.current.condition.icon)
            refs.infoColumn.innerHTML = markup;
        })
        .catch(error => {
            Notiflix.Notify.failure(error.message)
        })
        if (!dayCount){
            Notiflix.Notify.info("If you need forecast weather, please type forecast days")
        }else{
        const configSecond = {
            method: 'get',
            url: `https://api.weatherapi.com/v1/forecast.json?key=${refs.apiKey}&q=${name}&days=${dayCount}`
        };
        await axios(configSecond)
        .then(response=>{
            console.log(dayCount)
            console.log(response.data.forecast.forecastday)
            let forecast = response.data.forecast.forecastday.map(item=>item);
            delete forecast[0];
            let forecastMarkup = `<h2 class="info-header">Forecast weather for ${forecast.length-1} days in ${response.data.location.name} from today:</h2>`
            forecast.forEach(item=>{
                forecastMarkup += `<p class info-date>Date: ${item.date}. Condition: ${item.day.condition.text}</p>
                <p class info-min-temp>Min Temperature(C): ${item.day.mintemp_c}</p>
                <p class info-avg-temp>Average Temperature(C): ${item.day.avgtemp_c}</p>
                <p class info-max-temp>Max Temperature(C): ${item.day.maxtemp_c}</p>
                <p class info-min-temp>Min Temperature(F): ${item.day.mintemp_f}</p>
                <p class info-avg-temp>Average Temperature(F): ${item.day.avgtemp_f}</p>
                <p class info-max-temp>Max Temperature(F): ${item.day.maxtemp_f}</p>
                <p class info-chance-rain>Chance of rain: ${item.day.daily_chance_of_rain}%</p>
                <p class info-max-wind>Max wind speed(KM/H): ${item.day.maxwind_kph}</p>
                `
            })
            refs.infoColumn.innerHTML += forecastMarkup
        })
        .catch(error=>{
            Notiflix.Notify.failure(error.message)
        })
    }
    }
}
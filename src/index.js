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
    let name = refs.input.value.trim();
    let nameDays = refs.inputDays.value.trim();
    if (name == ""){
        Notiflix.Notify.failure("Input can't be clear! Type something to find weather.")
    } else if (nameDays = ""){
        Notiflix.Notify.info("If you need forecast weather, please type forecast days")
    } 
    
    else {
        const config = {
            method: 'get',
            url: `https://api.weatherapi.com/v1/current.json?key=${refs.apiKey}&q=${name}`,
        }
        await axios(config)
        .then(response =>{
            console.log(response.data.current);
            const iconLink = "https:" + response.data.current.condition.icon; 
            const markup = `<p class="info-string">Weather for today in ${response.data.location.name} - ${response.data.current.condition.text}</p>
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
        const configSecond = {
            method: 'get',
            url: `https://api.weatherapi.com/v1/forecast.json?key=${refs.apiKey}&q=${name}&days=${refs.inputDays}`
        };
        await axios(configSecond)
        .then(response=>{
            console.log(response.data)
        })
    }
}
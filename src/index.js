import Notiflix from "notiflix";
import { Notify } from "notiflix/build/notiflix-notify-aio";
const axios = require('axios/dist/browser/axios.cjs');

const refs = {
    input: document.querySelector(".inputText"),
    form: document.querySelector(".forma"),
    infoColumn: document.querySelector(".info-column"),
    apiKey: "fe26c3caa0df4df69b1150837233005",
}

refs.form.addEventListener("submit", submitHandler);

async function submitHandler(event){
    event.preventDefault();
    let name = refs.input.value.trim();
    if (name == ""){
        Notiflix.Notify.failure("Input can't be clear! Type something to find weather.")
    } else {
        const config = {
            method: 'get',
            url: `https://api.weatherapi.com/v1/current.json?key=${refs.apiKey}&q=${name}`,
        }
        await axios(config)
        .then(response =>{
            console.log(response.data.current)
            refs.infoColumn.value += response.data.location;
        })
        .catch(error => {
            Notiflix.Notify.failure(error.message)
        })
    }
}
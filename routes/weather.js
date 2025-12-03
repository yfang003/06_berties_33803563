const express = require("express")
const router = express.Router()
const request = require('request')

router.get('/now', function (req, res, next){
    let apiKey = 'e39193e4d34257c60299ac47629804f9'
    let city = req.query.city || 'london'
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    request(url, function(err, response, body){
        if (err){
            next(err)
        }else{
            // res.send(body)
            var weather = JSON.parse(body)
            if (weather!==undefined && weather.main!==undefined){
                var wmsg = `
                <div style="font-family: Arial; padding: 20px;">
                <h1 style="color: #333;">Weather in ${weather.name}</h1>
                <p style="font-size: 18px;">Temperature: ${weather.main.temp} °C</p>
                <p style="font-size: 18px;">Feels like: ${weather.main.feels_like} °C</p>
                <p style="font-size: 18px;">Humidity: ${weather.main.humidity} %</p>
                <p style="font-size: 18px;">Wind speed: ${weather.wind.speed} m/s</p>
                <p style="font-size: 18px;">Weather: ${weather.weather[0].description}</p>
                `
                res.send (wmsg);
            }
            else {
                res.send ("No data found");
            }
            
        }
    })
})

module.exports = router
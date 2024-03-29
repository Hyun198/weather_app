import { useState } from 'react';
import moment from 'moment';
import './App.css';
import clear_icon from './assets/clear.png';
import cloud_icon from './assets/cloud.png';
import drizzle_icon from './assets/drizzle.png';
import rain_icon from './assets/rain.png';
import snow_icon from './assets/snow.png';

import { useEffect } from 'react';
function App() {

  const [weatherData, setWeatherData] = useState({});
  const [weatherIcon, setWeatherIcon] = useState(clear_icon);
  const [time, setTime] = useState("");

  const [forecastIcon, setForecastIcon] = useState([]);
  const [foreTime, setForeTime] = useState("");
  const [feelsLikeValues, setFeelsLikeValues] = useState([]);


  const request_weather = async () => {
    try {
      let current_url = `https://api.openweathermap.org/data/2.5/weather?q=gimpo-si&units=Metric&appid=2d9656e12a5cfa0fd6b7cbebd84d6e23&lang=kr`;

      let response = await fetch(current_url);
      let weatherData = await response.json();

      const clouds = weatherData.clouds.all
      const humidity = weatherData.main.humidity
      const wind = weatherData.wind.speed
      const rain = weatherData.rain
      const temp = Math.round(weatherData.main.temp)

      const feels_like = Math.round(weatherData.main.feels_like)
      const min_temp = weatherData.main.temp_min
      const max_temp = weatherData.main.temp_max
      const desc = weatherData.weather[0].description
      const main = weatherData.weather[0].main
      const location = weatherData.name

      let timezoneOffset = weatherData.timezone / 60;
      let current_time = moment().utcOffset(timezoneOffset).format('YY/MM/DD');
      setTime(current_time);

      setWeatherData({ temp, clouds, humidity, wind, rain, desc, min_temp, max_temp, feels_like, main, location, current_time });

      switch (weatherData.weather[0].icon) {
        case "01d":
        case "01n":
          setWeatherIcon(clear_icon);
          break;
        case "02d":
        case "02n":
        case "03d":
        case "03n":
        case "04d":
        case "04n":
          setWeatherIcon(cloud_icon);
          break;
        case "09d":
        case "09n":
          setWeatherIcon(drizzle_icon);
          break;
        case "10d":
        case "10n":
          setWeatherIcon(rain_icon);
          break;
        case "13d":
        case "13n":
          setWeatherIcon(snow_icon);
          break;
        default:
          setWeatherIcon(clear_icon);
      }



    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    request_weather();
  }, [])


  const forecast_weather = async () => {
    let forecast_url = `https://api.openweathermap.org/data/2.5/forecast?q=gimpo-si&units=Metric&appid=2d9656e12a5cfa0fd6b7cbebd84d6e23&lang=kr`
    let response = await fetch(forecast_url);
    let forecastDate = await response.json();
    console.log(forecastDate);

    const times = forecastDate.list.map(item => item.dt_txt);
    const sixAmDate = times.filter(item => item.endsWith("06:00:00"));

    let result_feelsLike = forecastDate.list.filter(item => sixAmDate.includes(item.dt_txt)).map(item => item.main.feels_like);

    setFeelsLikeValues(result_feelsLike);

    let sixAmDateValues = sixAmDate.map(item => (item.split(" ")[0].split("-")));
    const formattedDates = [];
    sixAmDateValues.forEach(dateArray => {
      const month = dateArray[1];
      const day = dateArray[2];
      const formattedDate = `${month}/${day}`;
      formattedDates.push(formattedDate);
    });

    setForeTime(formattedDates);


    let result_weatherIcon = forecastDate.list.filter(item => sixAmDate.includes(item.dt_txt)).map(item => item.weather[0].icon);
    console.log(result_weatherIcon);
    let icons = [];
    result_weatherIcon.forEach(i => {
      switch (i) {
        case "01d":
        case "01n":
          icons.push(clear_icon);
          break;
        case "02d":
        case "02n":
        case "03d":
        case "03n":
        case "04d":
        case "04n":
          icons.push(cloud_icon);
          break;
        case "09d":
        case "09n":
          icons.push(drizzle_icon);
          break;
        case "10d":
        case "10n":
          icons.push(rain_icon);
          break;
        case "13d":
        case "13n":
          icons.push(snow_icon);
          break;
        default:
          icons.push(clear_icon);
      }
    });

    setForecastIcon(icons);
  }

  useEffect(() => {
    forecast_weather();
  }, [])

  return (
    <>
      <div className='spinner-container1' id="spinner">
        Loading ! Please wait
        <div className='circle'></div>
      </div>
      <div className='container'>
        <div className="city-name">
          {weatherData.location}
        </div>
        {/* <div className='input'>
          <input type="text" id="input" className='cityInput' placeholder="Enter your City" />
        </div> */}
        <div className='main'>
          <div className='left'>
            <img src={weatherIcon} alt="" />
            <div className='box'>
              <h2>{weatherData.main}</h2>
              <h4>{time}</h4>
            </div>
          </div>
          <div className='center'>
            <h2><span>{weatherData.temp}</span>℃</h2>
          </div>
          <div className='right'>
            <div className='one'>
              <p>최저 기온: {weatherData.min_temp}</p>
              <p>최고 기온: {weatherData.max_temp}</p>
              <p>풍속: {weatherData.wind} km/h</p>
              <p>습도: {weatherData.humidity}%</p>
            </div>
            <span></span>
            <div className='two'>
              <h2>체감온도</h2>
              <h2> {weatherData.feels_like} ℃</h2>
            </div>
          </div>
        </div>
        <div className='forecast'>
          <div className='card'>
            <h4>{foreTime[0]}</h4>
            <img src={forecastIcon[0]} alt="" />
            <p>{Math.round(feelsLikeValues[0])} ℃</p>
          </div>

          <div className='card'>
            <h4>{foreTime[1]}</h4>
            <img src={forecastIcon[1]} alt="" />
            <p>{Math.round(feelsLikeValues[1])} ℃</p>
          </div>

          <div className='card'>
            <h4>{foreTime[2]}</h4>
            <img src={forecastIcon[2]} alt="" />
            <p>{Math.round(feelsLikeValues[2])} ℃</p>
          </div>

          <div className='card'>
            <h4>{foreTime[3]}</h4>
            <img src={forecastIcon[3]} alt="" />
            <p>{Math.round(feelsLikeValues[3])} ℃</p>
          </div>

          <div className='card'>
            <h4>{foreTime[4]}</h4>
            <img src={forecastIcon[4]} alt="" />
            <p>{Math.round(feelsLikeValues[4])} ℃</p>
          </div>


        </div>
      </div>
    </>
  );
}

export default App;

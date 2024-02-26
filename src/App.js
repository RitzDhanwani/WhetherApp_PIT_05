import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = 'd8dc8bb35a3ef4cd3e67120d51657a18'; // Replace with your actual API key

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Sukkur'); // Default city

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  const fetchWeatherData = async () => {
    try {
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (currentWeatherResponse.ok && forecastResponse.ok) {
        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();
        setWeatherData({
          current: currentWeatherData,
          forecast: forecastData.list.slice(0, 2), // Show only 2 forecast days
        });
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      <div className="city-selector">
        <label htmlFor="city">Select City:</label>
        <select
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="Sukkur">Sukkur</option>
          <option value="Karachi">Karachi</option>
          <option value="Lahore">Lahore</option>
          <option value="Mumbai">Mumbai, India</option>
          <option value="Sydney">Sydney, Australia</option>
          <option value="Toronto">Toronto, Canada</option>
          <option value="New York">New York, USA</option>
          {/* Add more cities from different countries */}
        </select>
      </div>
      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.current.name}</h2>
          <p>Temperature: {weatherData.current.main.temp}°C</p>
          <p>Weather: {weatherData.current.weather[0].description}</p>

          <div className="forecast">
            <h1>2-Day Forecast</h1>
            <div className="forecast-list">
              {weatherData.forecast.map((item) => (
                <div key={item.dt} className="forecast-item">
                  <p>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                  <p>Temperature: {item.main.temp}°C</p>
                  <p>Weather: {item.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

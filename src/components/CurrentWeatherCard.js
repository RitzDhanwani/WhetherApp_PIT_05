import React from 'react';

function CurrentWeatherCard({ data }) {
  if (!data) return null;

  const { cityName, temp, feelsLike, humidity, description } = data;

  return (
    <div className="current-weather-card">
      <h2>{cityName}</h2>
      <p>Temperature: {temp != null ? `${temp}°C` : 'N/A'}</p>
      {feelsLike != null && <p>Feels like: {feelsLike}°C</p>}
      {humidity != null && <p>Humidity: {humidity}%</p>}
      <p>Weather: {description}</p>
    </div>
  );
}

export default CurrentWeatherCard;


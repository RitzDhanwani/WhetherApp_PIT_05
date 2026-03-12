import React from 'react';

function ForecastList({ items }) {
  if (!items || !items.length) {
    return null;
  }

  return (
    <div className="forecast">
      <h1>2-Day Forecast</h1>
      <div className="forecast-list">
        {items.map((item) => (
          <div key={item.id} className="forecast-item">
            <p>
              {item.date ? item.date.toLocaleDateString() : 'Unknown date'}
            </p>
            <p>Temperature: {item.temp != null ? `${item.temp}°C` : 'N/A'}</p>
            <p>Weather: {item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastList;


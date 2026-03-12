import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CitySelector from './components/CitySelector';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ForecastList from './components/ForecastList';
import { fetchWeather } from './services/weatherService';

const App = () => {
  const [city, setCity] = useState('Sukkur');
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const loadWeather = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchWeather(city, { signal: controller.signal });
        if (!isMounted) return;
        setWeather(data);
        setLastUpdated(new Date());
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        if (!isMounted) return;
        setError(err.message || 'Something went wrong while loading weather.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadWeather();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [city]);

  const handleRetry = () => {
    setCity((prev) => prev);
  };

  return (
    <div className="weather-app">
      <div className="weather-app-header">
        <div>
          <h1>Weather Dashboard</h1>
          <p className="weather-app-subtitle">Check live conditions and a 2-day outlook</p>
        </div>
        <CitySelector value={city} onChange={setCity} />
      </div>

      {isLoading && <p className="loading-text">Loading weather data...</p>}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button type="button" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {weather && !error && (
        <div className="weather-info">
          <CurrentWeatherCard data={weather.current} />
          <ForecastList items={weather.forecast} />
          {lastUpdated && (
            <p className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;

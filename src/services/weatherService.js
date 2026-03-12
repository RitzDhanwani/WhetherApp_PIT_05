import { getWeatherConfig } from '../config';

const CACHE_TTL_MS = 60 * 1000;

const cache = new Map();

class WeatherError extends Error {
  constructor(type, message, extra = {}) {
    super(message);
    this.name = 'WeatherError';
    this.type = type;
    Object.assign(this, extra);
  }
}

function buildUrl(path, params) {
  const { baseUrl, apiKey } = getWeatherConfig();
  const url = new URL(path, baseUrl);
  const searchParams = new URLSearchParams({
    ...params,
    appid: apiKey,
    units: 'metric',
  });
  url.search = searchParams.toString();
  return url.toString();
}

function normalizeCurrent(current) {
  if (!current) {
    return null;
  }

  const { name, main, weather } = current;
  const primaryWeather = Array.isArray(weather) && weather.length > 0 ? weather[0] : null;

  return {
    cityName: name || '',
    temp: main && typeof main.temp === 'number' ? main.temp : null,
    feelsLike: main && typeof main.feels_like === 'number' ? main.feels_like : null,
    humidity: main && typeof main.humidity === 'number' ? main.humidity : null,
    description: primaryWeather && primaryWeather.description ? primaryWeather.description : 'N/A',
    icon: primaryWeather && primaryWeather.icon ? primaryWeather.icon : null,
  };
}

function normalizeForecast(list, limit = 2) {
  if (!Array.isArray(list)) {
    return [];
  }

  return list.slice(0, limit).map((item) => {
    const { dt, main, weather } = item;
    const primaryWeather = Array.isArray(weather) && weather.length > 0 ? weather[0] : null;

    return {
      id: dt,
      date: dt ? new Date(dt * 1000) : null,
      temp: main && typeof main.temp === 'number' ? main.temp : null,
      description: primaryWeather && primaryWeather.description ? primaryWeather.description : 'N/A',
      icon: primaryWeather && primaryWeather.icon ? primaryWeather.icon : null,
    };
  });
}

function getCached(city) {
  const entry = cache.get(city.toLowerCase());
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
  if (isExpired) {
    cache.delete(city.toLowerCase());
    return null;
  }

  return entry.data;
}

function setCached(city, data) {
  cache.set(city.toLowerCase(), {
    data,
    timestamp: Date.now(),
  });
}

export async function fetchWeather(city, options = {}) {
  if (!city) {
    throw new WeatherError('validation', 'City is required.');
  }

  const cached = getCached(city);
  if (cached) {
    return cached;
  }

  const { signal } = options;

  try {
    const currentUrl = buildUrl('/data/2.5/weather', { q: city });
    const forecastUrl = buildUrl('/data/2.5/forecast', { q: city });

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl, { signal }),
      fetch(forecastUrl, { signal }),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      const status = currentRes.ok ? forecastRes.status : currentRes.status;
      const message =
        currentRes.status === 404 || forecastRes.status === 404
          ? 'City not found. Please try another city.'
          : 'Unable to fetch weather data. Please try again later.';

      throw new WeatherError('http', message, { status });
    }

    const currentJson = await currentRes.json();
    const forecastJson = await forecastRes.json();

    const current = normalizeCurrent(currentJson);
    const forecast = normalizeForecast(forecastJson.list, 2);

    const result = {
      cityName: current.cityName,
      current,
      forecast,
    };

    setCached(city, result);

    return result;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }

    if (!err.type) {
      throw new WeatherError('network', 'Network error while fetching weather data.', {
        originalError: err,
      });
    }

    throw err;
  }
}


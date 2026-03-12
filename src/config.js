const REQUIRED_ENV_VARS = ['REACT_APP_WEATHER_API_KEY'];

// Fallback to the existing key in the project so the app
// can run without any extra configuration from your side.
// Prefer the environment variable if it is defined.
const HARD_CODED_WEATHER_API_KEY = 'd8dc8bb35a3ef4cd3e67120d51657a18';

export function getWeatherConfig() {
  const apiKey =
    process.env.REACT_APP_WEATHER_API_KEY || HARD_CODED_WEATHER_API_KEY;
  const baseUrl =
    process.env.REACT_APP_WEATHER_API_BASE || 'https://api.openweathermap.org';

  if (!apiKey) {
    const message =
      'Missing REACT_APP_WEATHER_API_KEY. Please define it in your .env file.';
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(message);
    }
    throw new Error(message);
  }

  return {
    apiKey,
    baseUrl,
  };
}

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  if (missing.length && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      `Missing environment variables: ${missing.join(
        ', '
      )}. Falling back to the built-in API key so the app can still run.`
    );
  }
}


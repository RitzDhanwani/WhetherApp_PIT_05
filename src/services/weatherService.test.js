import { fetchWeather } from './weatherService';

describe('weatherService.fetchWeather', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test('shapes data into current and forecast objects', async () => {
    const currentResponse = {
      name: 'Sukkur',
      main: {
        temp: 30,
        feels_like: 32,
        humidity: 40,
      },
      weather: [{ description: 'clear sky', icon: '01d' }],
    };

    const forecastResponse = {
      list: [
        {
          dt: 1,
          main: { temp: 31 },
          weather: [{ description: 'sunny', icon: '01d' }],
        },
      ],
    };

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(currentResponse) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(forecastResponse) });

    const result = await fetchWeather('Sukkur');

    expect(result.cityName).toBe('Sukkur');
    expect(result.current.temp).toBe(30);
    expect(result.forecast).toHaveLength(1);
    expect(result.forecast[0].description).toBe('sunny');
  });
});


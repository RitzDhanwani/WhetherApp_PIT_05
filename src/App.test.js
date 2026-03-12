import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

const mockFetchWeather = jest.fn(() =>
  Promise.resolve({
    cityName: 'Sukkur',
    current: {
      cityName: 'Sukkur',
      temp: 30,
      description: 'clear sky',
    },
    forecast: [],
  })
);

jest.mock('./services/weatherService', () => {
  const actual = jest.requireActual('./services/weatherService');
  return {
    __esModule: true,
    ...actual,
    fetchWeather: (...args) => mockFetchWeather(...args),
  };
});

describe('App', () => {
  beforeEach(() => {
    mockFetchWeather.mockClear();
  });

  test('renders city selector and heading', () => {
    render(<App />);
    expect(screen.getByText(/Weather Dashboard/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select City/i)).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/Loading weather data/i)).toBeInTheDocument();
  });

  test('renders an error message when fetch fails', async () => {
    mockFetchWeather.mockRejectedValueOnce(
      Object.assign(new Error('Network error while fetching weather data.'), {
        type: 'network',
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText(/Network error while fetching weather data\./i)
      ).toBeInTheDocument();
    });
  });
});


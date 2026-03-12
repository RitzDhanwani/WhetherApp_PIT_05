import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/weatherService', () => ({
  fetchWeather: jest.fn(() =>
    Promise.resolve({
      cityName: 'Sukkur',
      current: {
        cityName: 'Sukkur',
        temp: 30,
        description: 'clear sky',
      },
      forecast: [],
    })
  ),
}));

describe('App', () => {
  test('renders city selector and heading', async () => {
    render(<App />);
    expect(screen.getByText(/Weather App/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select City/i)).toBeInTheDocument();
  });

  test('shows loading state initially', async () => {
    render(<App />);
    expect(screen.getByText(/Loading weather data/i)).toBeInTheDocument();
  });
});

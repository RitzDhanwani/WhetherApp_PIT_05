import { render, screen, fireEvent } from '@testing-library/react';
import CitySelector from './CitySelector';

describe('CitySelector', () => {
  test('calls onChange when a different city is selected', () => {
    const handleChange = jest.fn();

    render(<CitySelector value="Sukkur" onChange={handleChange} />);

    const select = screen.getByLabelText(/Select City/i);

    fireEvent.change(select, { target: { value: 'Karachi' } });

    expect(handleChange).toHaveBeenCalledWith('Karachi');
  });
});


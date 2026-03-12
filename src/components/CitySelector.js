import React from 'react';

const DEFAULT_CITIES = [
  { value: 'Sukkur', label: 'Sukkur' },
  { value: 'Karachi', label: 'Karachi' },
  { value: 'Lahore', label: 'Lahore' },
  { value: 'Mumbai', label: 'Mumbai, India' },
  { value: 'Sydney', label: 'Sydney, Australia' },
  { value: 'Toronto', label: 'Toronto, Canada' },
  { value: 'New York', label: 'New York, USA' },
];

function CitySelector({ value, onChange, options = DEFAULT_CITIES }) {
  return (
    <div className="city-selector">
      <label htmlFor="city">Select City:</label>
      <select
        id="city"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((city) => (
          <option key={city.value} value={city.value}>
            {city.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CitySelector;


import React from 'react';
import { PHONE_PREFIXES } from '../js/phoneUtils';

const PhoneInput = ({ phonePrefix, phoneNumber, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="flex">
      <select
        name="phonePrefix"
        value={phonePrefix}
        onChange={handleChange}
        className="bg-white px-2 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-r-0 focus:z-10 appearance-none"
        style={{ 
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none'
        }}
      >
        {PHONE_PREFIXES.map((prefix) => (
          <option key={prefix.value} value={prefix.value}>
            {prefix.label}
          </option>
        ))}
      </select>
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Numéro de téléphone"
        value={phoneNumber}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-l-0 focus:z-10"
      />
    </div>
  );
};

export default PhoneInput; 
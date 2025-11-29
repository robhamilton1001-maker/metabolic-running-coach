// src/utils/conversions.js

// Constants
const KM_TO_MILES = 0.621371;

// Convert values
export const toMiles = (km) => km * KM_TO_MILES;
export const toKm = (miles) => miles / KM_TO_MILES;

// Formatting helper
export const formatDistance = (valueInKm, unitPreference) => {
  if (unitPreference === 'imperial') {
    return `${(valueInKm * KM_TO_MILES).toFixed(1)} mi`;
  }
  return `${valueInKm.toFixed(1)} km`;
};

// Pace conversion (min/km <-> min/mile)
export const formatPace = (secondsPerKm, unitPreference) => {
  if (unitPreference === 'imperial') {
    const secondsPerMile = secondsPerKm / KM_TO_MILES;
    const min = Math.floor(secondsPerMile / 60);
    const sec = Math.round(secondsPerMile % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec} /mi`;
  }
  
  const min = Math.floor(secondsPerKm / 60);
  const sec = Math.round(secondsPerKm % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec} /km`;
};
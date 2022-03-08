import { defaultSettings } from '../../hooks/usePosition';

export function getCurrentPosition(cb, options = defaultSettings) {
  if (!navigator || !navigator.geolocation) {
    cb(null);
  }

  const handleResponse = ({ coords, timestamp }) => {
    cb({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      speed: coords.speed,
      heading: coords.heading,
      timestamp
    });
  };

  const handleError = () => {
    cb(null);
  };

  navigator.geolocation.getCurrentPosition(handleResponse, handleError, options);
}

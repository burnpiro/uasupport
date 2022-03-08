import { defaultSettings } from '../../hooks/usePosition';


export const locationMarkerOptions = {
  strokeColor: '#0DACF4',
  strokeOpacity: 0.5,
  strokeWeight: 1,
  fillColor: '#0DACF4',
  fillOpacity: 0.1,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1
};

export const locationInnerMarkerOptions = {
  strokeColor: '#0DACF4',
  strokeOpacity: 0.9,
  strokeWeight: 25,
  fillColor: '#0DACF4',
  fillOpacity: 0.9,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 2
};

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

export function isLocationService() {
  return navigator && navigator.geolocation;
}
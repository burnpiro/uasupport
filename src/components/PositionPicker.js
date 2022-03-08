import React, {useEffect, useState} from 'react';

import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const options = {
  imagePath:
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
};

export default function PositionPicker({
  onPositionChange,
  mapCenter = {
    lat: 50.4118,
    lng: 23.3635
  },
  defaultMarker = null
}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyB5j64Fb5aE5WJOzkdf0OkmlbOcEMu2iCw'
  });
  const { t, i18n } = useTranslation();

  const [map, setMap] = React.useState(null);
  const [marker, setMarker] = React.useState(null);
  const [location, setLocation] = React.useState(
    defaultMarker
      ? {
          lat: defaultMarker[0],
          lng: defaultMarker[1]
        }
      : null
  );
  const [zoom, setZoom] = useState(7);
  const [isDragging, setIsDragging] = React.useState(false);

  useEffect(() => {
    if (defaultMarker != null && Array.isArray(defaultMarker) && defaultMarker.length === 2) {
      if (
        location === null ||
        defaultMarker[0].toFixed(6) !== location.lat.toFixed(6) ||
        defaultMarker[1].toFixed(6) !== location.lng.toFixed(6)
      ) {
        setLocation({
          lat: defaultMarker[0],
          lng: defaultMarker[1]
        });
        setZoom(15);
      }
    }
  }, [defaultMarker]);
  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
    setMarker(null);
  }, []);

  const onLoadMarker = React.useCallback(function callback(newMarker) {
    setMarker(newMarker);
    onPositionChange({
      lat: newMarker.position.lat(),
      lng: newMarker.position.lng()
    });
  }, []);

  const handleSelectMarker = (markerEvent) => {
    onPositionChange({
      lat: markerEvent.latLng.lat(),
      lng: markerEvent.latLng.lng()
    });
    setIsDragging(false);
  };
  const handlePositionChange = () => {
    if (!isDragging && marker != null) {
      onPositionChange({
        lat: marker.position.lat(),
        lng: marker.position.lng()
      });
    }
  };
  const handleDragStart = () => {
    setIsDragging(true);
  };
  const handleMapClick = (clickEvent) => {
    setLocation({
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng()
    });
  };

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location != null ? location : mapCenter}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <>
          {location != null && (
            <Marker
              position={location}
              draggable={true}
              onDragEnd={handleSelectMarker}
              onLoad={onLoadMarker}
              onPositionChanged={handlePositionChange}
              onDragStart={handleDragStart}
              // options={{ id: location.id }}
            />
          )}
        </>
      </GoogleMap>
      <Typography variant={'caption'}>{t('PickLocation')}</Typography>
    </>
  ) : (
    <></>
  );
}

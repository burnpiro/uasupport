import React from 'react';

import { GoogleMap, useJsApiLoader, MarkerClusterer, Marker } from '@react-google-maps/api';
import { fDayTime } from '../../utils/formatTime';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const options = {
  batchSize: 20,
  imagePath:
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
};

function createKey(lat, lng) {
  return lat + lng;
}

function createLabel(location) {
  let label = `👤: ${location.people}, ⌛: ${fDayTime(location.date)}`;

  return label;
}

const center = {
  lat: 50.4118,
  lng: 23.3635
};
export default function TransportMap({ places = [], onSelectMarkers }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyB5j64Fb5aE5WJOzkdf0OkmlbOcEMu2iCw'
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds();
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleSelectCluster = (cluster) => {
    const markers = cluster.markers.map((marker) => ({
      id: marker.id
    }));
    onSelectMarkers(markers);
  };

  const handleSelectMarker = (marker) => {
    onSelectMarkers([
      {
        id: marker.id
      }
    ]);
  };
  const renderClusters = React.useMemo(() => {
    const locations = (places || []).map((place) => ({
      ...place,
      from: {
        lat: Number(place.from[0]),
        lng: Number(place.from[1])
      },
      to: place?.to
        ? {
            lat: Number(place?.to[0]),
            lng: Number(place?.to[1])
          }
        : {}
    }));
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={7}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <>
          <MarkerClusterer options={options} onClick={handleSelectCluster} zoomOnClick={false}>
            {(clusterer) =>
              locations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.from}
                  clusterer={clusterer}
                  label={String(location.people)}
                  title={createLabel(location)}
                  icon={'/static/icons/car-marker.png'}
                  onClick={() => handleSelectMarker(location)}
                  options={{ id: location.id }}
                />
              ))
            }
          </MarkerClusterer>
        </>
      </GoogleMap>
    );
  }, [places]);

  return isLoaded ? <>{renderClusters}</> : <></>;
}

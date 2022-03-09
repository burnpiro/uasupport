import React from 'react';

import { GoogleMap, useJsApiLoader, MarkerClusterer, Marker, Circle } from '@react-google-maps/api';
import { DEFAULT_MAP_SIZE, GM_KEY } from '../../utils/settings';
import {
  getCurrentPosition,
  isLocationService,
  locationInnerMarkerOptions,
  locationMarkerOptions
} from '../../utils/locationService/locationService';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Iconify from '../../components/Iconify';

const containerStyle = {
  width: '100%',
  height: DEFAULT_MAP_SIZE
};

const options = {
  ignoreHidden: true,
  imagePath:
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
};

const center = {
  lat: 51.759,
  lng: 19.956
};

export default function HomesMap({ fullList = [], places = [], onSelectMarkers, checkSum = '' }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GM_KEY
  });

  const [map, setMap] = React.useState(null);
  const [clusterer, setClusterer] = React.useState(null);
  const [repaintNum, setRepaintNum] = React.useState(0);
  const [myLocation, setMyLocation] = React.useState(null);
  const [canUseLocation, setCanUseLocation] = React.useState(false);
  const [mapCenter, setMapCenter] = React.useState(center);
  const [zoom, setZoom] = React.useState(6);

  React.useEffect(() => {
    if (isLocationService()) {
      setCanUseLocation(true);
    }
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds();
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onLoadClustered = React.useCallback(function callback(newClusterer) {
    // const bounds = new window.google.maps.LatLngBounds();
    // map.fitBounds(bounds);
    if (newClusterer != null) {
      setClusterer(newClusterer);
      setRepaintNum(repaintNum + 1);
    }
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

  const handleClusteringEnding = () => {
    if (clusterer != null) {
      clusterer.repaint();
    }
  };

  const handleUserPositionChange = (newPosition) => {
    if (newPosition != null) {
      setMyLocation({
        lat: newPosition.latitude,
        lng: newPosition.longitude,
        radius: newPosition.accuracy
      });
      setMapCenter({
        lat: newPosition.latitude,
        lng: newPosition.longitude
      });
      setZoom(10);
    }
  };

  const handleUseLocation = () => {
    getCurrentPosition(handleUserPositionChange);
  };

  const renderMarkers = React.useMemo(() => {
    return fullList.map((location) => (
      <Marker
        key={location.id}
        position={location}
        clusterer={clusterer}
        label={''}
        icon={'/static/icons/home-marker.png'}
        onClick={() => handleSelectMarker(location)}
        options={{ id: location.id }}
        visible={places.findIndex((el) => el.id === location.id) > -1}
      />
    ));
  }, [places.length, fullList.length, checkSum, repaintNum]);

  return isLoaded ? (
    <Box sx={{ position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <>
          {myLocation && (
            <React.Fragment>
              <Circle
                // required
                center={myLocation}
                // required
                radius={myLocation.radius}
                options={locationMarkerOptions}
              />
              <Circle
                // required
                center={myLocation}
                // required
                radius={1}
                options={locationInnerMarkerOptions}
              />
            </React.Fragment>
          )}
          <MarkerClusterer
            options={options}
            onClick={handleSelectCluster}
            zoomOnClick={false}
            onLoad={onLoadClustered}
          >
            {(clusterer) => {
              handleClusteringEnding();
              return renderMarkers;
            }}
          </MarkerClusterer>
        </>
      </GoogleMap>
      {canUseLocation && (
        <IconButton
          color={'primary'}
          sx={{ position: 'absolute', bottom: 24, left: 12, backgroundColor: 'background.paper' }}
          onClick={handleUseLocation}
        >
          <Iconify icon={'gis:location'} sx={{ fontSize: 28 }} />
        </IconButton>
      )}
    </Box>
  ) : (
    <React.Fragment></React.Fragment>
  );
}

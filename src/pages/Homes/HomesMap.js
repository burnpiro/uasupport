import React from 'react';

import { GoogleMap, useJsApiLoader, MarkerClusterer, Marker } from '@react-google-maps/api';
import {DEFAULT_MAP_SIZE} from "../../utils/settings";

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
    googleMapsApiKey: 'AIzaSyB5j64Fb5aE5WJOzkdf0OkmlbOcEMu2iCw'
  });

  const [map, setMap] = React.useState(null);
  const [clusterer, setClusterer] = React.useState(null);
  const [repaintNum, setRepaintNum] = React.useState(0);

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
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <>
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
  ) : (
    <React.Fragment></React.Fragment>
  );
}

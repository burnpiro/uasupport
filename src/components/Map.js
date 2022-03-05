// import * as React from 'react';
// import { createCustomEqual } from 'fast-equals';
// import { isLatLngLiteral } from '@googlemaps/typescript-guards';

// export const Map = ({ onClick, onIdle, children, style, ...options }) => {
//   // [START maps_react_map_component_add_map_hooks]
//   const ref = React.useRef(null);
//   const [map, setMap] = React.useState();
//
//   React.useEffect(() => {
//     if (ref.current && !map) {
//       setMap(new window.google.maps.Map(ref.current, {}));
//     }
//   }, [ref, map]);
//   // [END maps_react_map_component_add_map_hooks]
//
//   // [START maps_react_map_component_options_hook]
//   // because React does not do deep comparisons, a custom hook is used
//   // see discussion in https://github.com/googlemaps/js-samples/issues/946
//   useDeepCompareEffectForMaps(() => {
//     if (map) {
//       map.setOptions(options);
//     }
//   }, [map, options]);
//   // [END maps_react_map_component_options_hook]
//
//   // [START maps_react_map_component_event_hooks]
//   React.useEffect(() => {
//     if (map) {
//       ['click', 'idle'].forEach((eventName) => google.maps.event.clearListeners(map, eventName));
//
//       if (onClick) {
//         map.addListener('click', onClick);
//       }
//
//       if (onIdle) {
//         map.addListener('idle', () => onIdle(map));
//       }
//     }
//   }, [map, onClick, onIdle]);
//   // [END maps_react_map_component_event_hooks]
//
//   // [START maps_react_map_component_return]
//   return (
//     <React.Fragment>
//       <div ref={ref} style={style} />
//       {React.Children.map(children, (child) => {
//         if (React.isValidElement(child)) {
//           // set the map prop on the child component
//           return React.cloneElement(child, { map });
//         }
//       })}
//     </React.Fragment>
//   );
//   // [END maps_react_map_component_return]
// };
//
// // [START maps_react_map_marker_component]
// export const Marker = (options) => {
//   const [marker, setMarker] = React.useState();
//
//   React.useEffect(() => {
//     if (!marker) {
//       setMarker(new google.maps.Marker());
//     }
//
//     // remove marker from map on unmount
//     return () => {
//       if (marker) {
//         marker.setMap(null);
//       }
//     };
//   }, [marker]);
//
//   React.useEffect(() => {
//     if (marker) {
//       marker.setOptions(options);
//     }
//   }, [marker, options]);
//
//   return null;
// };
// [END maps_react_map_marker_component]

// export const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a, b) => {
//   if (
//     isLatLngLiteral(a) ||
//     a instanceof google.maps.LatLng ||
//     isLatLngLiteral(b) ||
//     b instanceof google.maps.LatLng
//   ) {
//     return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
//   }
//
//   // TODO extend to other types
//
//   // use fast-equals for other objects
//   return deepEqual(a, b);
// });
//
// export function useDeepCompareMemoize(value) {
//   const ref = React.useRef();
//
//   if (!deepCompareEqualsForMaps(value, ref.current)) {
//     ref.current = value;
//   }
//
//   return ref.current;
// }
//
// export function useDeepCompareEffectForMaps(callback, dependencies) {
//   React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
// }

export function hasLocationChanged(orgLoc, newLoc) {
  return orgLoc[0] !== newLoc[0] || orgLoc[1] !== newLoc[1];
}

export function mapElToLocation(el) {
  return {
    id: el.id,
    type: el.aidType,
    lat: Number(el.from[0]),
    lng: Number(el.from[1])
  };
}

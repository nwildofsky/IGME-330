let map;
let geoJson;

export function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3VwZXJmbGFyZSIsImEiOiJja3pscTBrdWIxbXozMnBxaHJuM3Z6amltIn0.re0L-Mhcb62AJkoEchtunw';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-74.5, 40],
        zoom: 1
    });

    map.addControl(new mapboxgl.NavigationControl());

    // 3D Building layer
    // map.on('load', () => {
    //     // Insert the layer beneath any symbol layer.
    //     const layers = map.getStyle().layers;
    //     const labelLayerId = layers.find(
    //         (layer) => layer.type === 'symbol' && layer.layout['text-field']
    //     ).id;

    //     // The 'building' layer in the Mapbox Streets
    //     // vector tileset contains building height data
    //     // from OpenStreetMap.
    //     map.addLayer(
    //         {
    //             'id': 'add-3d-buildings',
    //             'source': 'composite',
    //             'source-layer': 'building',
    //             'filter': ['==', 'extrude', 'true'],
    //             'type': 'fill-extrusion',
    //             'minzoom': 15,
    //             'paint': {
    //                 'fill-extrusion-color': '#aaa',

    //                 // Use an 'interpolate' expression to
    //                 // add a smooth transition effect to
    //                 // the buildings as the user zooms in.
    //                 'fill-extrusion-height': [
    //                     'interpolate',
    //                     ['linear'],
    //                     ['zoom'],
    //                     15,
    //                     0,
    //                     15.05,
    //                     ['get', 'height']
    //                 ],
    //                 'fill-extrusion-base': [
    //                     'interpolate',
    //                     ['linear'],
    //                     ['zoom'],
    //                     15,
    //                     0,
    //                     15.05,
    //                     ['get', 'min_height']
    //                 ],
    //                 'fill-extrusion-opacity': 0.6
    //             }
    //         },
    //         labelLayerId
    //     );
    // });
}

export function addMarker(coordinates, className) {
    let el = document.createElement('div');
    el.className = className;
    el.dataset.selected = 'false';
    el.dataset.alertLevel = 'none';

    new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .addTo(map);

    return el;
}

// export function addMarkersToMap() {
//     // add markers to map
//     for (const feature of geoJson.features) {
//         addMarker(feature.geometry.coordinates, 'marker');
//     }
// }

export function flyTo(center = [0, 0]) {
    map.flyTo({center: center});
}

export function setZoomLevel(value = 0) {
    // https://docs.mapbox.com/help/glossary/zoom-level/
    map.setZoom(value);
}

export function setPitchAndBearing(pitch = 0, bearing = 0) {
    // https://docs.mapbox.com/mapbox-gl-js/example/live-update-feature/
    // https://docs.mapbox.com/mapbox-gl-js/example/set-perspective/
    map.setPitch(pitch);
    map.setBearing(bearing);
}
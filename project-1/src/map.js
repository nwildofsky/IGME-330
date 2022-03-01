import * as utils from "./utils.js";
import * as app from "./app.js";

let map;
let selectedQuake = {
    'type': 'FeatureCollection',
    'features': []
};
let allQuakes;

export function initMap(geoJson) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3VwZXJmbGFyZSIsImEiOiJja3pscTBrdWIxbXozMnBxaHJuM3Z6amltIn0.re0L-Mhcb62AJkoEchtunw';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-74.5, 40],
        zoom: 1
    });

    map.addControl(new mapboxgl.NavigationControl());
    allQuakes = geoJson;

    map.on('load', () => {
        // Add an image to use as a custom marker
        map.loadImage(
            './images/qt_marker_center.png',
            (error, image) => {
                if (error) throw error;
                map.addImage('custom-marker', image);
                map.addSource('quakes', {
                    type: 'geojson',
                    data: geoJson
                });

                map.addLayer({
                    'id': 'quake-circles',
                    'type': 'symbol',
                    'source': 'quakes',
                    'minzoom': 0,
                    'layout': {
                        'icon-image': 'custom-marker',
                        'icon-allow-overlap': true,
                        'icon-size': {
                            property: 'mag',
                            stops: [
                                [0, .1],
                                [10, .5]
                            ]
                        }
                    }
                });
                // map.getSource('quakes').setData(geoJson);
            }
        );
        map.loadImage(
            './images/qt_marker_center_selected.png',
            (error, image) => {
                if (error) throw error;
                map.addImage('selected-marker', image);

                map.on('click', 'quake-circles', (e) => {
                    let idArray = e.features[0].properties.ids.split(',');
                    let quake;
                    let i = 1;
                    while (!quake) {
                        const id = idArray[i];
                        quake = utils.getQuakeInfoFromJson(allQuakes, id);
                        i++;
                    }

                    const coordinates = [quake.geometry.coordinates[0], quake.geometry.coordinates[1]];
                    selectedQuake.features[0] = e.features[0];
                    selectedQuake.features[0].geometry.coordinates = coordinates;
                    selectSymbol(selectedQuake);
                    app.selectQuake(quake);
                });

                map.on('mouseenter', 'quake-circles', (e) => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                map.on('mouseleave', 'quake-circles', (e) => {
                    map.getCanvas().style.cursor = '';
                });
            }
        );
    });
}

export function selectSymbol(selectedQuake) {
    if (map.getLayer('quake-selected')) map.removeLayer('quake-selected');
    if (map.getSource('clicked')) map.removeSource('clicked');

    map.addSource('clicked', {
        type: 'geojson',
        data: selectedQuake
    });
    map.addLayer({
        'id': 'quake-selected',
        'type': 'symbol',
        'source': 'clicked',
        'layout': {
            'icon-image': 'selected-marker',
            'icon-size': {
                property: 'mag',
                stops: [
                    [0, .1],
                    [10, .5]
                ]
            }
        }
    });

    flyTo(selectedQuake.features[0].geometry.coordinates);
}

export function deselectSymbol() {
    if (map.getLayer('quake-selected')) map.removeLayer('quake-selected');
    if (map.getSource('clicked')) map.removeSource('clicked');
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

export function updateSymbols(geoJson) {
    map.getSource('quakes').setData(geoJson);
    allQuakes = geoJson;
}

// export function addMarkersToMap() {
//     // add markers to map
//     for (const feature of geoJson.features) {
//         addMarker(feature.geometry.coordinates, 'marker');
//     }
// }

export function flyTo(center = [0, 0]) {
    map.flyTo({ center: center });
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
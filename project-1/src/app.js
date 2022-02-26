import * as map from "./map.js"
import * as ajax from "./ajax.js"
import * as utils from "./utils.js"

let status;
let count;
let geoJson;
const baseURL = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';

function init() {
    map.initMap();
    ajax.getQuakeData(queryPast6Hours(), loadQuakes);
    document.querySelector('#search-btn').onclick = search;
}

init();

function loadQuakes(json) {
    status = json.metadata.status;
    count = json.metadata.count;
    geoJson = json.features;

    for (let earthquake of geoJson) {
        const coordinates = [earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]];
        const type = earthquake.properties.type;
        const marker = map.addMarker(coordinates, type);

        const item = document.createElement('list-item');
        item.magnitude = earthquake.properties.mag.toFixed(2);
        item.location = earthquake.properties.place;
        const dateTime = utils.epochToDate(earthquake.properties.time);
        item.time = dateTime;
        item.depth = earthquake.geometry.coordinates[2].toFixed(2) + 'km';
        item.onclick = () => {
            map.setZoomLevel(7);
            map.flyTo(coordinates);
            document.querySelectorAll(".earthquake").forEach(m => m.dataset.selected = 'false');
            marker.dataset.selected = 'true';
        }

        document.querySelector('#quake-list').appendChild(item);
    }
}

function queryPast6Hours() {
    const today = new Date();
    const dateTime = utils.getDateTimeString(today, 0,0,0,1);
    const url = baseURL + '&starttime=' + dateTime;
    return url;
}

function getSearchParams() {
    const startYear = document.querySelector('#start-year').value;
    const startMonth = document.querySelector('#start-month').value;
    const startDay = document.querySelector('#start-day').value;
    const endYear = document.querySelector('#end-year').value;
    const endMonth = document.querySelector('#end-month').value;
    const endDay = document.querySelector('#end-day').value;
    const limit = document.querySelector('#limit').value;

    let searchURL;
    if (startYear == 'Year' || startMonth == 'Month' || startDay == 'Day') {
        if (endYear == 'Year' || endMonth == 'Month' || endDay == 'Day') {

        }
        else {
            searchURL = '&endtime='+endYear+'-'+endMonth+'-'+endDay;
        }
    }
    else {
        if (endYear == 'Year' || endMonth == 'Month' || endDay == 'Day') {
            searchURL = '&starttime='+startYear+'-'+startMonth+'-'+startDay;
        }
        else {
            searchURL = '&starttime='+startYear+'-'+startMonth+'-'+startDay+'&endtime='+endYear+'-'+endMonth+'-'+endDay;
        }
    }

    if (searchURL) {
        searchURL = baseURL + searchURL + '&limit=' + limit;
        ajax.getQuakeData(searchURL, loadQuakes);
    }
}

function search() {
    getSearchParams();
}
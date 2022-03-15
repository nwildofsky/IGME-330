import * as map from "./map.js"
import * as ajax from "./ajax.js"
import * as utils from "./utils.js"
import * as ls from "./local-storage.js"

let status;
let count;
let geoJson;
const baseURL = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
let selectedQuake = {
    'type': 'FeatureCollection',
    'features': []
};
let linkedQuake;
let addedQuake;
let searchCollapsed = false, listCollapsed = false;

function init() {
    const urlQuery = window.location.href.split('?')[1];

    if (JSON.stringify(ls.getLastQuery()) === '{}') {
        ajax.getQuakeData(queryPast6Hours(), initQuakeMap, queryTimedOut, queryFailed);
    }
    else {
        if (urlQuery) {
            if (ls.isInLastQuery(urlQuery)) {
                linkedQuake = utils.getQuakeInfoFromJson(ls.getLastQuery(), urlQuery);
            }
            else {
                addedQuake = ls.getFavoriteByID(urlQuery);
            }
        }
        useLastQuery();
    }
    document.querySelector('#search-btn').onclick = getSearchParams;
    document.querySelector('#collapse-search').onclick = collapseSearch;
    document.querySelector('#collapse-list').onclick = collapseList;
    document.querySelector('#search-options h2').onclick = collapseList;
    document.querySelector('#reset-params').onclick = resetSearchParams;
    if (window.innerWidth > 850) {
        expandList();
    }
    else {
        const searchPrompt = document.querySelector('#search-prompt');
        searchPrompt.classList.add('list');
        searchPrompt.style.visibility = 'visible';
        searchPrompt.onclick = expandList;
        listCollapsed = true;
    }
}

init();

function initQuakeMap(json) {
    map.initMap(json);
    loadQuakes(json);
    document.querySelector('#result-text').innerHTML = 'Showing Quakes from the last 6 hours';
    ls.addLastQuery(json);
}

function refreshQuakeMap(json) {
    loadQuakes(json);
    map.updateSymbols(json);
    document.querySelector('#search-btn').classList.remove('is-loading');
    document.querySelector('#result-text').innerHTML = `Showing ${count} Quakes from search results`;
    if (window.innerWidth < 440) {
        collapseList();
    }
    ls.clearLastQuery();
    ls.addLastQuery(json);
}

function useLastQuery() {
    const json = ls.getLastQuery();
    if (addedQuake) {
        json.features.push(linkedQuake);
        json.metadata.count++;
    }
    map.initMap(json);
    loadQuakes(json);
    document.querySelector('#result-text').innerHTML = `Showing ${count} Quakes from search results`;

    const today = new Date();
    const yesterday = utils.getDateTimeString(today, 0, 0, 1).split('T')[0];
    const currentDay = utils.getDateTimeString(today).split('T')[0];
    document.querySelector('#start-time').value = yesterday;
    document.querySelector('#start-time').max = currentDay;
    document.querySelector('#end-time').value = currentDay;
    document.querySelector('#end-time').max = currentDay;
    const searchParams = ls.getSearchParams();
    setSearchParams(searchParams);
    if (linkedQuake) {
        map.setZoomLevel(13);
        map.flyTo([linkedQuake.geometry.coordinates[0], linkedQuake.geometry.coordinates[1]]);
        window.history.pushState({}, '', './app.html');
    }
    else if (addedQuake) {
        map.setZoomLevel(13);
        map.flyTo([addedQuake.geometry.coordinates[0], addedQuake.geometry.coordinates[1]]);
        ls.clearLastQuery();
        ls.addLastQuery(json);
        window.history.pushState({}, '', './app.html');
    }
}

function setSearchParams(searchParams) {
    if (searchParams.length > 0) {
        document.querySelector('#start-time').value = searchParams[0];
        document.querySelector('#end-time').value = searchParams[1];
        document.querySelector('#min-mag').value = searchParams[2];
        document.querySelector('#max-mag').value = searchParams[3];
        document.querySelector('#min-depth').value = searchParams[4];
        document.querySelector('#max-depth').value = searchParams[5];
        document.querySelector('#focus-location').value = searchParams[6];
        focusOn(searchParams[6]);
        document.querySelector('#sort-order').value = searchParams[7];
        document.querySelector('#query-limit').value = searchParams[8];
    }
}

function resetSearchParams() {
    ls.clearSearchParams();
    const today = new Date();
    const yesterday = utils.getDateTimeString(today, 0, 0, 1).split('T')[0];
    const currentDay = utils.getDateTimeString(today).split('T')[0];
    const defaultParams = [
        yesterday,
        currentDay,
        '0',
        '10',
        '-100',
        '1000',
        'Choose a Location',
        'Newest First',
        '50'
    ]
    setSearchParams(defaultParams);
}

function queryTimedOut() {
    document.querySelector('#search-btn').classList.remove('is-loading');
    document.querySelector('#result-text').innerHTML = `Search timed out. Try limiting query more`;
    document.querySelector('#result-text').classList.remove('has-text-grey');
    document.querySelector('#result-text').classList.add('has-text-danger');
}

function queryFailed() {
    document.querySelector('#search-btn').classList.remove('is-loading');
    document.querySelector('#result-text').innerHTML = `Search query failed`;
    document.querySelector('#result-text').classList.remove('has-text-grey');
    document.querySelector('#result-text').classList.add('has-text-danger');
}

function loadQuakes(json) {
    status = json.metadata.status;
    count = json.metadata.count;
    geoJson = json;

    const quakeList = document.querySelector('#quake-list');
    quakeList.innerHTML = '';
    for (let earthquake of json.features) {
        const item = document.createElement('list-item');
        quakeList.appendChild(item);
        item.magnitude = earthquake.properties.mag.toFixed(1);
        item.location = earthquake.properties.place;
        const dateTime = utils.epochToDate(earthquake.properties.time);
        item.time = dateTime;
        item.depth = earthquake.geometry.coordinates[2].toFixed(1) + 'km';
        item.id = earthquake.id;
        item.onclick = () => {
            selectedQuake.features[0] = earthquake;
            map.selectSymbol(selectedQuake);
            selectQuake(earthquake);
            item.div.classList.add('selected-item');
            if (window.innerWidth < 440) {
                collapseList();
            }
        }
    }
}

export function selectQuake(earthquake) {
    document.querySelector('#selected-quake').innerHTML = '';
    const listedQuakes = document.querySelectorAll('list-item');
    listedQuakes.forEach(q => q.div.classList.remove('selected-item'));

    listedQuakes.forEach(q => {
        if (q.id == earthquake.id) {
            q.div.classList.add('selected-item');
        }
    })

    const popup = document.createElement('map-quake-card');
    document.querySelector('#selected-quake').appendChild(popup);
    popup.place = earthquake.properties.place;
    popup.type = earthquake.properties.type;
    popup.magnitude = earthquake.properties.mag.toFixed(1);
    popup.location = utils.getCardinalCoords(earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]);
    const dateTime = utils.epochToDate(earthquake.properties.time);
    popup.time = dateTime;
    popup.depth = earthquake.geometry.coordinates[2].toFixed(1) + 'km';
    popup.closeButton.onclick = () => deselectQuake();
    if (!ls.isFavorited(earthquake.id)) {
        popup.favoriteButton.onclick = () => favoriteQuake(earthquake, popup.favoriteButton);
    }
    else {
        popup.favoriteButton.innerHTML = 'Unsave';
        popup.favoriteButton.onclick = () => unfavoriteQuake(earthquake, popup.favoriteButton);
    }
    if (listCollapsed) {
        popup.div.classList.add('collapsed');
    }
}

function deselectQuake() {
    const listedQuakes = document.querySelectorAll('list-item');
    listedQuakes.forEach(q => q.div.classList.remove('selected-item'));
    document.querySelector('#selected-quake').innerHTML = '';
    map.deselectSymbol();
}

function favoriteQuake(earthquake, favoriteButton) {
    ls.addFavorite(earthquake);
    favoriteButton.innerHTML = 'Unsave';
    favoriteButton.onclick = null;
    favoriteButton.onclick = () => unfavoriteQuake(earthquake, favoriteButton);
}

function unfavoriteQuake(earthquake, favoriteButton) {
    ls.removeFavorite(earthquake.id);
    favoriteButton.innerHTML = 'Save';
    favoriteButton.onclick = null;
    favoriteButton.onclick = () => favoriteQuake(earthquake, favoriteButton);
}

function queryPast6Hours() {
    const today = new Date();
    const dateTime = utils.getDateTimeString(today, 0, 0, 0, 1);
    const url = baseURL + '&starttime=' + dateTime;
    const yesterday = utils.getDateTimeString(today, 0, 0, 1).split('T')[0];
    const currentDay = utils.getDateTimeString(today).split('T')[0];
    document.querySelector('#start-time').value = yesterday;
    document.querySelector('#start-time').max = currentDay;
    document.querySelector('#end-time').value = currentDay;
    document.querySelector('#end-time').max = currentDay;
    return url;
}

function getSearchParams() {
    const startDate = document.querySelector('#start-time').value;
    const endDate = document.querySelector('#end-time').value;
    const minMag = document.querySelector('#min-mag').value;
    const maxMag = document.querySelector('#max-mag').value;
    const minDepth = document.querySelector('#min-depth').value;
    const maxDepth = document.querySelector('#max-depth').value;
    const focusLoc = document.querySelector('#focus-location').value;
    const sort = document.querySelector('#sort-order').value;
    const limit = document.querySelector('#query-limit').value;

    let url = baseURL;
    if (startDate != '') {
        url += `&starttime=${startDate}`;
    }
    if (endDate != '') {
        url += `&endtime=${endDate}`;
    }

    url += `&minmagnitude=${minMag}`;
    url += `&maxmagnitude=${maxMag}`;
    url += `&mindepth=${minDepth}`;
    url += `&maxdepth=${maxDepth}`;
    url += `&orderby=${utils.getSortQueryCode(sort)}`;
    url += `&limit=${limit}`;

    url += focusOn(focusLoc);

    document.querySelector('#search-btn').classList.add('is-loading');
    document.querySelector('#result-text').innerHTML = '...';
    document.querySelector('#result-text').classList.remove('has-text-danger');
    document.querySelector('#result-text').classList.add('has-text-grey');

    deselectQuake();
    ajax.getQuakeData(url, refreshQuakeMap, queryTimedOut, queryFailed);
    ls.clearSearchParams();
    [startDate, endDate, minMag, maxMag, minDepth, maxDepth, focusLoc, sort, limit]
        .forEach(input => {
            ls.addSearchParams(input);
        })
}

function focusOn(location) {
    let url = '';

    switch (location) {
        case 'Japan':
            url += '&minlongitude=115';
            url += '&maxlongitude=165';
            url += '&minlatitude=25';
            url += '&maxlatitude=50';
            map.setZoomLevel(4);
            map.flyTo([138, 38])
            break;
        // case 'Nepal':
        //     url += '&minlongitude=72';
        //     url += '&maxlongitude=100';
        //     url += '&minlatitude=20';
        //     url += '&maxlatitude=35';
        //     map.flyTo([84, 28])
        //     break;
        case 'India':
            url += '&minlongitude=55';
            url += '&maxlongitude=108';
            url += '&minlatitude=5';
            url += '&maxlatitude=36';
            map.setZoomLevel(4);
            map.flyTo([79, 23])
            break;
        case 'Ecuador':
            url += '&minlongitude=-101';
            url += '&maxlongitude=-49';
            url += '&minlatitude=-16';
            url += '&maxlatitude=15';
            map.setZoomLevel(4);
            map.flyTo([-78, -1.5])
            break;
        case 'Indonesia':
            url += '&minlongitude=82';
            url += '&maxlongitude=188';
            url += '&minlatitude=-28';
            url += '&maxlatitude=33';
            map.setZoomLevel(3);
            map.flyTo([125, 3.5])
            break;
        case 'Central America':
            url += '&minlongitude=-113';
            url += '&maxlongitude=-60';
            url += '&minlatitude=-1';
            url += '&maxlatitude=29';
            map.setZoomLevel(4);
            map.flyTo([-88, 15])
            break;
        case 'Turkey':
            url += '&minlongitude=12';
            url += '&maxlongitude=65';
            url += '&minlatitude=25';
            url += '&maxlatitude=50';
            map.setZoomLevel(4);
            map.flyTo([34, 39])
            break;
        case 'Puerto Rico':
            url += '&minlongitude=-72';
            url += '&maxlongitude=-59';
            url += '&minlatitude=14';
            url += '&maxlatitude=22';
            map.setZoomLevel(5);
            map.flyTo([-67, 18])
            break;
        case 'United States':
            url += '&minlongitude=-147';
            url += '&maxlongitude=-41';
            url += '&minlatitude=12';
            url += '&maxlatitude=60';
            map.setZoomLevel(3);
            map.flyTo([-98, 39])
            break;
        case 'Alaska':
            url += '&minlongitude=160';
            url += '&maxlongitude=260';
            url += '&minlatitude=47';
            url += '&maxlatitude=75';
            map.setZoomLevel(3);
            map.flyTo([-154, 65])
            break;
        case 'World':
            map.setZoomLevel(1);
            map.flyTo([0, 0])
            break;
        default:
    }

    return url;
}

function collapseSearch() {
    const search = document.querySelector('#search-options');
    const list = document.querySelector('#quake-list');
    const expand = document.querySelector('#search-prompt');

    expand.style.visibility = 'visible';
    search.classList.add('collapsed');
    list.classList.add('full');
    searchCollapsed = true;

    expand.onclick = expandSearch;
}

function expandSearch() {
    const search = document.querySelector('#search-options');
    const list = document.querySelector('#quake-list');
    const expand = document.querySelector('#search-prompt');

    expand.style.visibility = 'hidden';
    search.classList.remove('collapsed');
    list.classList.remove('full');
    searchCollapsed = false;
}

function collapseList() {
    const searchList = document.querySelector('#search-list');
    const expand = document.querySelector('#search-prompt');
    const selected = document.querySelector('#selected-quake map-quake-card');
    const width = window.innerWidth;
    const h2 = document.querySelector('#search-options h2');
    if (width > 440 && h2 == this) {
        return;
    }

    expand.style.visibility = 'visible';
    searchList.classList.add('collapsed');
    if (selected) {
        selected.div.classList.add('collapsed');
    }
    expand.classList.add('list');

    map.fullscreenMap();
    listCollapsed = true;
    expand.onclick = expandList;
}

function expandList() {
    const searchList = document.querySelector('#search-list');
    const expand = document.querySelector('#search-prompt');
    const selected = document.querySelector('#selected-quake map-quake-card');

    if (!searchCollapsed) {
        expand.style.visibility = 'hidden';
    }
    else {
        expand.onclick = expandSearch;
    }
    expand.classList.remove('list');
    searchList.classList.remove('collapsed');
    if (selected) {
        selected.div.classList.remove('collapsed');
    }

    map.reduceMap();
    listCollapsed = false;
}
import * as utils from "./utils.js"
import * as ls from "./local-storage.js"

function init() {
    if (ls.getFavorites().length > 0) {
        loadFavorites();
    }
    else {
        document.querySelector('#favorite-list').innerHTML = '';
        const favEmpty = document.createElement('p');
        document.querySelector('#favorite-list').appendChild(favEmpty);
        favEmpty.innerHTML = 'No saved quakes found. To save a quake go to the app page, select a quake and click save';

    }
    document.querySelector('#fav-clear').onclick = () => clearFavorites();
    document.querySelector('#ls-clear').onclick = () => clearLocalStorage();
}

init();

function loadFavorites() {
    const favorites = ls.getFavorites();
    document.querySelector('#favorite-list').innerHTML = '';
    for (let fav of favorites) {
        if (fav) {
            const card = document.createElement('fav-quake-card');
            document.querySelector('#favorite-list').appendChild(card);
            card.place = fav.properties.place;
            card.type = fav.properties.type;
            card.magnitude = fav.properties.mag.toFixed(1);
            card.location = utils.getCardinalCoords(fav.geometry.coordinates[0], fav.geometry.coordinates[1]);
            const dateTime = utils.epochToDate(fav.properties.time);
            card.time = dateTime;
            card.depth = fav.geometry.coordinates[2].toFixed(1) + 'km';
            card.link = fav.properties.url;
            card.favoriteButton.onclick = () => unfavoriteQuake(fav, card);
            card.mapLink.onclick = () => viewOnMap(fav);
        }
    }
}

function unfavoriteQuake (earthquake, card) {
    ls.removeFavorite(earthquake.id);
    card.remove();
    init();
}

function clearFavorites() {
    ls.clearFavorites();
    init();
}

function clearLocalStorage() {
    ls.clearLocalStorage();
    init();
}

function viewOnMap(earthquake) {
    window.location.href = './app.html?' + earthquake.id;
}
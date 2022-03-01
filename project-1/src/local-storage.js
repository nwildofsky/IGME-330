const defaultData = {
    "appTitle": "Quake Tracker",
    "favorites": [],
    "lastQuery": {},
    "searchParams": []
},
    storeName = "nsw7227-p1-settings";

const readLocalStorage = () => {
    let allValues = null;

    try {
        allValues = JSON.parse(localStorage.getItem(storeName)) || defaultData;
    } catch (err) {
        console.log(`Problem with JSON.parse() and ${storeName} !`);
        throw err;
    }

    return allValues;
};

const writeLocalStorage = (allValues) => {
    localStorage.setItem(storeName, JSON.stringify(allValues));
};

export const clearLocalStorage = () => writeLocalStorage(defaultData);

// export const setAppTitle = (str) => {
//     const allValues = readLocalStorage();

//     allValues.appTitle = str;
//     writeLocalStorage(allValues);
// };

// export const getAppTitle = () => readLocalStorage().appTitle;

export const addFavorite = (str) => {
    const allValues = readLocalStorage();

    allValues.favorites.push(str);
    writeLocalStorage(allValues);
};

export const getFavorites = () => readLocalStorage().favorites;

export const clearFavorites = () => {
    const allValues = readLocalStorage();

    allValues.favorites = [];
    writeLocalStorage(allValues);
};

export const isFavorited = (quakeID, removeItem = false) => {
    const allFavorites = getFavorites();

    const found = allFavorites.find(quake => quake.id == quakeID);
    if (found && !removeItem) {
        return true;
    }
    else if (!removeItem) {
        return false;
    }
    else if (found && removeItem) {
        const index = allFavorites.indexOf(found);
        allFavorites.splice(index, 1);

        const allValues = readLocalStorage();
        allValues.favorites = allFavorites;
        writeLocalStorage(allValues);
    }
}

export const removeFavorite = (quakeID) => {
    isFavorited(quakeID, true);
}

export const addLastQuery = (queryData) => {
    const allValues = readLocalStorage();

    allValues.lastQuery = queryData;
    writeLocalStorage(allValues);
}

export const getLastQuery = () => readLocalStorage().lastQuery;

export const clearLastQuery = () => {
    const allValues = readLocalStorage();

    allValues.lastQuery = {};
    writeLocalStorage(allValues);
}

export const addSearchParams = (str) => {
    const allValues = readLocalStorage();

    allValues.searchParams.push(str);
    writeLocalStorage(allValues);
}

export const getSearchParams = () => readLocalStorage().searchParams;

export const clearSearchParams = () => {
    const allValues = readLocalStorage();

    allValues.searchParams = [];
    writeLocalStorage(allValues);
}
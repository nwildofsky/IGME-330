// https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers
export function getDateTimeString(date, minusYears=0, minusMonths=0, minusDays=0, minusHours=0) {
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    const timeZoneOffset = date.getTimezoneOffset();
    minusHours += (timeZoneOffset / 60);

    if (minusYears && year >= minusYears) {
        year -= minusYears;
    }
    if (minusMonths) {
        if (month <= minusMonths) {
            month -= minusMonths;
            year--;
            month = 12 + month;
        }
        else {
            month -= minusMonths;
        }
    }
    if (minusDays) {
        if (day <= minusDays) {
            day -= minusDays;
            month--;
            if (month == '02') {
                day = 28 + day;
            }
            else {
                day = 30 + day;
            }
        }
        else {
            day -= minusDays;
        }
    }
    if (minusHours) {
        if (hour <= minusHours) {
            hour -= minusHours;
            day--;
            hour = 24 + hour;
        }
        else if ((hour - minusHours) > 24) {
            hour = (hour - minusHours) - 24;
            day++;
        }
        else {
            hour -= minusHours;
        }
    }

    let dateArray = [year, month, day, hour, minute, second];
    dateArray = dateArray.map(num => {
        return num.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
    })
    const string = dateArray[0]+'-'+dateArray[1]+'-'+dateArray[2]+'T'+dateArray[3]+':'+dateArray[4]+':'+dateArray[5];
    return string;
}

export function epochToDate(epochValue) {
    const date = new Date(epochValue);
    let dateString = getDateTimeString(date);
    dateString = dateString.replace('T', ' ');
    return dateString;
}

export function getQuakeInfoFromJson(geoJson, quakeID) {
    for (let quake of geoJson.features) {
        if (quake.id == quakeID) {
            return quake;
        }
    }
}

export function getSortQueryCode(sortby) {
    switch(sortby) {
        case 'Newest First':
            return 'time';
            break;
        case 'Oldest First':
            return 'time-asc';
            break;
        case 'Largest Magnitude First':
            return 'magnitude';
            break;
        case 'Smallest Magnitude First':
            return 'magnitude-asc';
            break;
        default:
            return 'time';
    }
}

export function getCardinalCoords(latitude, longitude) {
    let lat = latitude.toFixed(4);
    let lng = longitude.toFixed(4);

    if (lng > 0) {
        lng = Math.abs(lng) + '&degN';
    }
    else {
        lng = Math.abs(lng) + '&degS';
    }

    if ((lat >= 0 && lat < 181) || lat < -180) {
        lat = Math.abs(lat) + '&degE';
    }
    else {
        lat = Math.abs(lat) + '&degW';
    }

    return `${lng} ${lat}`;
}

// https://italonascimento.github.io/applying-a-timeout-to-your-promises/
// Utility function to stop long promises from running in the background
// for multiple seconds.
export function promiseTimeout(msLimit, promise) {
    // Create a promise that rejects in <ms> miliseconds
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + msLimit + 'ms.');
        }, msLimit);
    })

    // Returns a race between our timeout and the passed in promise
    // If fetching for earthquakes wins race, the api was fast enough
    // If timeout wins the api took too long and should be stopped
    return Promise.race([
        promise,
        timeout
    ]);
}
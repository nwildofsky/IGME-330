import { promiseTimeout } from "./utils.js";
// https://earthquake.usgs.gov/fdsnws/event/1/[METHOD[?PARAMETERS]]

export async function getQuakeData(url, onDataLoaded, onFetchTimedOut, onFetchFailed) {
    // try {
    //     let response = await fetch(url);

    //     if (!response.ok) {
    //         onFetchFailed();
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     let json = await response.json();
    //     console.log(json);
    //     onDataLoaded(json);
    // }
    // catch (e) {
    //     console.log(`In catch with e = ${e}`);
    //     onFetchFailed();
    // }

    let response = promiseTimeout(10000, fetch(url));

    response
    .then(data => {
        if (data.ok) {
            return data.json();
        }

        return data.text().then(text => {
            throw text;
        });
    })
    .then(json => {
        console.log(json);
        onDataLoaded(json);
    })
    .catch(error => {
        console.log(`Ajax promise failed with error = ${error}`);
        if (error == 'Timed out in 10000ms.') {
            onFetchTimedOut();
        }
        else {
            onFetchFailed();
        }
    })
}
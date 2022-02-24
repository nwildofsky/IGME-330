// https://earthquake.usgs.gov/fdsnws/event/1/[METHOD[?PARAMETERS]]

export async function getQuakeData(url, onDataLoaded) {
    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let json = await response.json();
        console.log(json);
        onDataLoaded(json);
    }
    catch (e) {
        console.log(`In catch with e = ${e}`);
    }
}
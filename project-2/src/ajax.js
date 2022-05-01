// Function that loads an external json file into a json object for the
// callback function, onDataLoaded to use
export async function fetchJSON(url, onDataLoaded) {
    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let json = await response.json();
        console.log(json);
        onDataLoaded(json);
    }
    // If the json object can't be loaded, don't crash the program
    // Log out any errors to the console
    catch (e) {
        console.log(`In catch with e = ${e}`);
    }
}
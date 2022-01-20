function loadTextXHR(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = callback; 
    xhr.onerror = e => console.log(`In onerror - HTTP Status code = ${e.target.status}`);
    xhr.open("GET", url);
    xhr.send();
}

function taffyCallback (e) {
    document.querySelector("#output-1").innerHTML = e.target.responseText;
}

function vikingCallback (e) {
    document.querySelector("#output-2").innerHTML = e.target.responseText;
}

export {loadTextXHR, taffyCallback, vikingCallback};
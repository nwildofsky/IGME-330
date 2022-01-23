import {loadTextXHR, taffyCallback, vikingCallback} from "./utils.js"

document.querySelector("#button-1").onclick = () => loadTextXHR("./data/taffy-facts.txt", taffyCallback);
document.querySelector("#button-2").onclick = () => loadTextXHR("./data/viking-facts.txt", vikingCallback);
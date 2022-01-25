import { loadTextXHR } from "./utils.js";

const appDataURL = "data/app-data.json";
let output,textarea;

const toggleBackground = e => e.target.style.background = e.target.style.background === "black" ? "white" : "black";

const createBlackoutText = () => {
  console.log("createBlackoutText() called");
  // #5 - clear out #output, that's where the blackout text will go
  output.textContent = "";

  // #6 - grab the value of the <textarea> and store it in a variable named `string`
  let string = textarea.textContent;

  // #7 - turn `string` into an array of words and loop through it 
  // Here we want to turn each word into a clickable <span>
  // When a <span> is clicked on, its background color will toggle between black and white
  // Add each <span> to #output
  // Test it!
  string = string.trim().split(" ");
  output.innerHTML = string.map(s => `<span>${s}</span>`).join("");
  const words = document.querySelectorAll("span");
  for (let s of words) {
    s.onclick = toggleBackground;
  }
  /* for (let s of words) {

  } */
}	

const setupUI = json => {
  // #1 -  Hook up the `output` and `textarea` variables (already declared up top) to the appropriate elements
  textarea = document.querySelector("textarea");
  output = document.querySelector("#output");

  // #2 - populate the rest of the UI with loaded text
  // here we use a *descendant selector* to get a ref to the <h1> in the <header> 
  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
  document.querySelector("header h1").textContent = json.title;
  document.querySelector("header h2").textContent = json.subtitle;
  document.querySelector("#instructions-1").textContent = json["instructions-1"];
  document.querySelector("#instructions-2").textContent = json["instructions-2"];
  textarea.textContent = json["default-text"];
  
  // - the h2 in the header should show the .subtitle text
  // - the instructions-1 <div>
  // - the instructions-2 <div>
  // - the <textarea> should be populated with the default-text

  // #3 - Hook up the button onclick to the createBlackoutText() function
  document.querySelector("#btn-create").onclick = createBlackoutText;
  
  // #4 - call createBlackoutText()
  createBlackoutText();
};

const appDataLoaded = e => {
  let json
  try{
    json = JSON.parse(e.target.responseText);
  }catch{
    document.querySelector("header h1").innerHTML = "BAD JSON!";
		return;
  }
  // #0 - AFTER the data has loaded, set up the UI
  setupUI(json);
};

loadTextXHR(appDataURL,appDataLoaded);
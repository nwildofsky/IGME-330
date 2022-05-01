// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax

export const makeColor = (red, green, blue, alpha = 1) => {
  return `rgba(${red},${green},${blue},${alpha})`;
};

export const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Get a random int that is different than the current int value
// Loop until a different number is found
// Only use with large enough random ranges
export const getRandomDifferent = (min, max, current) => {
  let rand = Math.floor(Math.random() * (max - min) + min);
  while(rand == current) {
    rand = Math.floor(Math.random() * (max - min) + min)
  }
  return rand;
}

export const getRandomColor = () => {
  const floor = 35; // so that colors are not too bright or too dark 
  const getByte = () => getRandom(floor, 255 - floor);
  return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

export const getLinearGradient = (ctx, startX, startY, endX, endY, colorStops) => {
  let lg = ctx.createLinearGradient(startX, startY, endX, endY);
  for (let stop of colorStops) {
    lg.addColorStop(stop.percent, stop.color);
  }
  return lg;
};


export const goFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullscreen) {
    element.mozRequestFullscreen();
  } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
  // .. and do nothing if the method is not supported
};

// Discretely add an image element to the DOM so it can be used in javascript
export const preloadImage = (url) => {
  const img = document.createElement('img');
  img.src = url;
  document.querySelector('main').appendChild(img);
  img.style.display = 'none';
  return img;
}

// Give a value a hard minimum and maximum cutoff
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// Linear interpolate from a start point to an endpoint with a given percentage
export const lerp = (min, max, percent) => min + (max - min) * percent;
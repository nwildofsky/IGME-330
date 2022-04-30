import * as main from "./main.js";
import * as utils from './utils.js';

// Web components
import './app-navbar.js';
import './app-footer.js';
import './app-controls.js';

window.onload = () => {
	console.log("window.onload called");
	// Preload images
	const images = {
		bg: utils.preloadImage('./images/background.png'),
		donut: utils.preloadImage('./images/donut.png'),
		roof: utils.preloadImage('./images/donut_cutoff.png'),
		lamp: utils.preloadImage('./images/lamp_off.png'),
		cl1: [
			utils.preloadImage('./images/city-lights1-blue.png'),
			utils.preloadImage('./images/city-lights1-yellow.png'),
			utils.preloadImage('./images/city-lights1-purple.png'),
			utils.preloadImage('./images/city-lights1-red.png'),
			utils.preloadImage('./images/city-lights1-green.png')
		],
		cl2: [
			utils.preloadImage('./images/city-lights2-blue.png'),
			utils.preloadImage('./images/city-lights2-yellow.png'),
			utils.preloadImage('./images/city-lights2-purple.png'),
			utils.preloadImage('./images/city-lights2-red.png'),
			utils.preloadImage('./images/city-lights2-green.png')
		],
		cl3: [
			utils.preloadImage('./images/city-lights3-blue.png'),
			utils.preloadImage('./images/city-lights3-yellow.png'),
			utils.preloadImage('./images/city-lights3-purple.png'),
			utils.preloadImage('./images/city-lights3-red.png'),
			utils.preloadImage('./images/city-lights3-green.png')
		]
	}

	// Start app
	main.loadDefaults(images);
}
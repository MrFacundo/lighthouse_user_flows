const config = {
	headless: false,
	device: "iPhone 7",	// Puppeteer devices: https://pptr.dev/api/puppeteer.knowndevices
	testUrl: "https://foot11.com/",
	searchButtonSelector: "div.top-menu__search-button-wrapper > button",
	searchInputSelector: "input.top-menu__search-form-field",
	loadMoreSelector: "button.btn-load-more",
};

export default config;

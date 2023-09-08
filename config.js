const config = {
	headless: false,
	device: "iPhone 5",	// Puppeteer devices: https://pptr.dev/api/puppeteer.knowndevices
	testUrl: "https://foot11.com/news/mercato-nouvelle-depense-xxl-en-vue-pour-chelsea-toney-342715",
	searchButtonSelector: "div.top-menu__search-button-wrapper > button",
	searchInputSelector: "input.top-menu__search-form-field",
	loadMoreSelector: "#content_block_5>div.post-content>ul>li>a",
};

export default config;

import puppeteer from "puppeteer";
import { startFlow } from "lighthouse";
import { KnownDevices } from "puppeteer";
import {
	waitForAndClick,
	waitForAndType,
	generateAndOpenReport,
} from "./helpers.js";
import config from "./config.js";

async function captureReport() {
	const browser = await puppeteer.launch({
		headless: config.headless,
		// executablePath: "/usr/bin/google-chrome",
	});
	const page = await browser.newPage();
	const timeout = 5000;

	// page.setDefaultTimeout(timeout);
	page.emulate(KnownDevices[config.device]);

	const flow = await startFlow(page, {
		name: "INP measurement",
		flags: {
			screenEmulation: { disabled: true },
			onlyCategories: ["performance"],
		},
	});

	// Define selector variables
	const searchButtonSelector = [config.searchButtonSelector];
	const searchInputSelector = [config.searchInputSelector];
	const loadMoreSelector = [config.loadMoreSelector];

	await flow.startNavigation({ name: "Cold navigation" });
	const targetPage = page;
	const promises = [];
	promises.push(targetPage.waitForNavigation());
	await targetPage.goto(config.testUrl);
	await Promise.all(promises);
	await flow.endNavigation();

	/* Timestamp 1 - Focus and search */
	await flow.startTimespan({ name: "Search" });
	await waitForAndClick(searchButtonSelector, page, timeout);
	await waitForAndType(searchInputSelector, page, "foo", timeout);
	// Adding a delay to allow interactions to finish
	await new Promise((r) => setTimeout(r, 1000));
	await flow.endTimespan();

	/* Timespan 2 - Click on element */
	await flow.startTimespan({ name: "Click on element" });
	await waitForAndClick(loadMoreSelector, page, timeout);
	await new Promise((r) => setTimeout(r, 1000));
	// Open a new tab so INP is registered
	const blankPage = await browser.newPage();
	await blankPage.bringToFront();
	await page.bringToFront();
	await flow.endTimespan();

	await generateAndOpenReport(flow);

	await browser.close();
}

captureReport();

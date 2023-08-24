import puppeteer from "puppeteer";
import { startFlow } from "lighthouse";
import { writeFileSync } from "fs";
import open from "open";
import { KnownDevices } from "puppeteer";
import { waitForAndClick, waitForAndType } from "./helpers.js";

async function captureReport() {
	const iPhone = KnownDevices["iPhone 6"];
	const testUrl = "https://foot11.com/";
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	const timeout = 5000;
	
	page.setDefaultTimeout(timeout);
	page.emulate(iPhone);

	const flow = await startFlow(page, {
		name: "INP measurement",
		flags: {
			screenEmulation: { disabled: true },
			onlyCategories: ["performance"],
		},
	});

	// Define selector variables
	const searchButtonSelector = [
		"div.top-menu__search-button-wrapper > button",
	];
	const inputSelector = ["input.top-menu__search-form-field"];
	const contentSpanSelector = ["#content span"];

	await flow.startNavigation({ name: "Cold navigation" });
	{
		const targetPage = page;
		const promises = [];
		promises.push(targetPage.waitForNavigation());
		await targetPage.goto(testUrl);
		await Promise.all(promises);
	}
	await flow.endNavigation();

	await flow.startTimespan({ name: "Search" });

	/* Timestamp 1 - Focus and search */
	await waitForAndClick(searchButtonSelector, page, timeout);
	await waitForAndType(inputSelector, page, "foo", timeout);

	// Adding a delay to allow interactions to finish
	await new Promise((r) => setTimeout(r, 1000));

	// Open a new tab so INP is registered
	const blankPage = await browser.newPage();
	await page.bringToFront();

	await flow.endTimespan();

	/* Timespan 2 - Click on load more button */
	await flow.startTimespan({ name: "Click on load more" });

	// Click on load more
	await waitForAndClick(contentSpanSelector, page, timeout);

	// Adding a delay to allow interactions to finish
	await new Promise((r) => setTimeout(r, 1000));

	// Open a new tab so INP is registered
	await blankPage.bringToFront();
	await page.bringToFront();

	await flow.endTimespan();

	writeFileSync("flow.report.html", await flow.generateReport());
	writeFileSync(
		"flow-result.json",
		JSON.stringify(await flow.createFlowResult(), null, 2)
	);
	open("flow.report.html", { wait: false });

	await browser.close();
}

captureReport();

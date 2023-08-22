import { writeFileSync } from "fs";
import puppeteer from "puppeteer";
import { startFlow } from "lighthouse";

// const browser = await puppeteer.launch();
// const page = await browser.newPage();
// const flow = await startFlow(page);

// // Navigate with a URL
// await flow.navigate("https://example.com");

// // Interaction-initiated navigation via a callback function
// await flow.navigate(async () => {
// 	await page.click("a");
// });

// // Navigate with startNavigation/endNavigation
// await flow.startNavigation();
// await page.click("a");
// await flow.endNavigation();

// await browser.close();
// writeFileSync("report.html", await flow.generateReport());

import fs from 'fs';
import open from 'open';
// import lighthouse from 'lighthouse';
// import * as chromeLauncher from 'chrome-launcher';

// const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
// const options = {logLevel: 'info', output: 'html', onlyCategories: ['performance'], port: chrome.port};
// const runnerResult = await lighthouse('https://example.com', options);

// // `.report` is the HTML report as a string
// const reportHtml = runnerResult.report;
// fs.writeFileSync('lhreport.html', reportHtml);

// // `.lhr` is the Lighthouse Result as a JS object
// console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
// console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

// await chrome.kill();

async function captureReport() {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	// Get a session handle to be able to send protocol commands to the page.
	const session = await page.target().createCDPSession();

	const testUrl = "https://pie-charmed-treatment.glitch.me/";
	const flow = await startFlow(page, {
		name: "CLS during navigation and on scroll",
	});

	// Regular Lighthouse navigation.
	await flow.navigate(testUrl, { stepName: "Navigate only" });

	// Navigate and scroll timespan.
	await flow.startTimespan({ stepName: "Navigate and scroll" });
	await page.goto(testUrl, { waitUntil: "networkidle0" });
	// We need the ability to scroll like a user. There's not a direct puppeteer function for this, but we can use the DevTools Protocol and issue a Input.synthesizeScrollGesture event, which has convenient parameters like repetitions and delay to somewhat simulate a more natural scrolling gesture.
	// https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-synthesizeScrollGesture
	await session.send("Input.synthesizeScrollGesture", {
		x: 100,
		y: 0,
		yDistance: -2500,
		speed: 1000,
		repeatCount: 2,
		repeatDelayMs: 250,
	});
	await flow.endTimespan();

	await browser.close();

	const report = await flow.generateReport();
	fs.writeFileSync("flow.report.html", report);
	open("flow.report.html", { wait: false });
}

captureReport();

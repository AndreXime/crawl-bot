import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export default async function Config() {
	puppeteer.use(StealthPlugin());
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox'],
	});
	const page = await browser.newPage();
	await page.setUserAgent(
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
	);
	return { page, browser };
}

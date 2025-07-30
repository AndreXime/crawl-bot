import { chromium as playwrightChromium } from 'playwright-core';
// @ts-ignore
import chromiumBinary from '@sparticuz/chromium';

export default async function Config() {
    const browser = await playwrightChromium.launch({
        headless: true,
        executablePath: await chromiumBinary.executablePath(),
        args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
        userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();

    return { page, browser };
}

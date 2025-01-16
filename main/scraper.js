const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { salvarArquivo, gerarNome } = require('./save_file');

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

async function config() {
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

async function Crawller(link, gravar, maxDepth) {
	const { page, browser } = await config();

	const visitedUrls = new Set(); // Para não revisitar uma url
	const urlsToVisit = [{ url: link, depth: 0 }]; // Fila de urls para visitar
	const nomeArquivo = gerarNome(gravar); // Gera o arquivo e nome com base na data

	try {
		while (urlsToVisit.length > 0) {
			const { url, depth } = urlsToVisit.shift();

			if (visitedUrls.has(url) || depth > maxDepth) {
				continue;
			}

			console.log(`Visitando: ${url} - Nível: ${depth}`);
			visitedUrls.add(url);

			try {
				await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

				await delay(Math.random() * 2000); // Delay entre 0 a 2 segundos

				const pageData = await page.evaluate(() => {
					const title = document.title;
					return { title };
				});

				// Se achar titulo faz console.log
				pageData.title && console.log(`Título: ${pageData.title}\n`);

				// Extrair todos os links da página atual
				const extractedLinks = await page.evaluate(() => {
					const elements = document.querySelectorAll('a');
					const isMediaLink = (url) => url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.mp4');

					return Array.from(elements)
						.map((el) => el.href)
						.filter((href) => href && (href.startsWith('https') || isMediaLink(href)) && !href.includes('#'));
				});

				// Armazenar links extraídos e salvar
				if (gravar == 'S') {
					salvarArquivo(url, nomeArquivo);
				}

				// Adicionar novos links à lista de visitas, incrementando a profundidade
				extractedLinks.forEach((link) => {
					if (!visitedUrls.has(link)) {
						urlsToVisit.push({ url: link, depth: depth + 1 });
					}
				});
			} catch (error) {
				console.log(`└──> Error: ${error.message}`);
			}
		}
	} catch (error) {
		console.log('\nAconteceu um erro:\n', error.message, '\n');
	} finally {
		await browser.close();
		console.log('Crawler concluído.');
	}
}

module.exports = { Crawller };

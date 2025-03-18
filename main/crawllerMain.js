import Config from './crawllerConfig.js';
import ExtractData from './extractData.js';
import printData from './printData.js';
import salvarArquivo from './saveData.js';

export default async function Crawller(link, gravar, maxDepth, target) {
	const { page, browser } = await Config();

	const visitedUrls = new Set(); // Para não revisitar uma url
	const urlsToVisit = [{ url: link, depth: 0 }]; // Fila de urls para visitar

	try {
		while (urlsToVisit.length > 0) {
			const atual = urlsToVisit.shift();
			if (!atual || visitedUrls.has(atual.url) || atual.depth > maxDepth) continue;
			const { url, depth } = atual;

			console.info(`\nVisitando: ${url} - Nível: ${depth}`);
			visitedUrls.add(url);

			try {
				await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

				// Delay entre 0 a 4 segundos
				await (async () => new Promise((resolve) => setTimeout(resolve, Math.random() * 4000)))();

				// Analise da pagina atual
				const pageData = await ExtractData(page, target);

				// Mostra no terminal os dados encontrados
				const readableData = printData(pageData);

				// Salva os dados extraídos
				if (gravar) salvarArquivo(readableData);

				// Extrair todos os links da página atual
				const extractedLinks = await page.evaluate(() => {
					const elements = document.querySelectorAll('a');
					const isMediaLink = (url) => url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.mp4');

					return Array.from(elements)
						.map((el) => el.href)
						.filter((href) => href && href.startsWith('https') && !isMediaLink(href) && !href.includes('#'));
				});

				// Adicionar novos links à lista de visitas, aumentando a profundidade
				extractedLinks.forEach((link) => {
					if (!visitedUrls.has(link)) {
						urlsToVisit.push({ url: link, depth: depth + 1 });
					}
				});
			} catch (error) {
				console.error(`└──> Error: ${error.message}`);
			}
		}
	} catch (error) {
		console.error('\nAconteceu um erro:\n', error.message, '\n');
	} finally {
		await browser.close();
		console.info('Crawler concluído.\n');
	}
}

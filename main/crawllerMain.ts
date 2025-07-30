import Config from './crawllerConfig.js';
import ExtractData from './extractData.js';
import printData from './printData.js';
import salvarArquivo from './saveData.js';

export default async function Crawller(link: string, gravar: string, maxDepth: number, target: string) {
    const { page, browser } = await Config();

    const visitedUrls = new Set<string>(); // Para não revisitar uma url
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

                // Delay entre 1 a 3 segundos
                await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));
                // Analise da pagina atual
                const { data, extractedLinks } = await ExtractData(page, target);

                // Mostra no terminal os dados encontrados e retorna para salvar
                const readableData = printData(data);

                // Salva os dados extraídos
                if (gravar) salvarArquivo(readableData);

                // Adicionar novos links à lista de visitas, aumentando a profundidade
                extractedLinks.forEach((link) => {
                    if (!visitedUrls.has(link)) {
                        urlsToVisit.push({ url: link, depth: depth + 1 });
                    }
                });
            } catch (error) {
                console.error(`└──> Error: ${error}`);
            }
        }
    } catch (error) {
        console.error('\nAconteceu um erro:\n', error.message, '\n');
    } finally {
        await browser.close();
        console.info('Crawler concluído.\n');
    }
}

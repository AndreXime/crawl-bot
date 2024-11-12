const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { salvarArquivo, gerarNome } = require("./save_file");


async function config() {
  puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-web-security",
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
  );
  return {page, browser};
}

async function scrapper(link, gravar, maxDepth) {
  const { page, browser } = await config();

  const visitedUrls = new Set();
  const urlsToVisit = [{ url: link, depth: 0 }];
  const allExtractedLinks = [];
  const nomeArquivo = gerarNome(gravar);
  
  try {
    while (urlsToVisit.length > 0) {
      const { url, depth } = urlsToVisit.shift();

      if (visitedUrls.has(url) || depth > maxDepth) {
        continue;
      }

      console.log(`Visitando: ${url} - Nível: ${depth}`);
      visitedUrls.add(url);

      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

        // Extrair todos os links da página atual
        const extractedLinks = await page.evaluate(() => {
          const elements = document.querySelectorAll("a");
          return Array.from(elements)
            .map((el) => el.href)
            .filter((href) => href.startsWith("http"));
        });

        // Armazenar links extraídos e salvar
        allExtractedLinks.push(...extractedLinks);
        if (gravar == "S") {
          salvarArquivo(allExtractedLinks,nomeArquivo);
        }

        // Adicionar novos links à lista de visitas, incrementando a profundidade
        extractedLinks.forEach((link) => {
          if (!visitedUrls.has(link)) {
            urlsToVisit.push({ url: link, depth: depth + 1 });
          }
        });
      } catch (error) {
        console.log(`Erro ao acessar ${url}: ${error.message}`);
      }
    }
  } catch (error) {
    console.log("\nAconteceu um erro:\n", error.message, "\n");
  } finally {
    await browser.close();
    console.log("Crawler concluído.");
  }
}

module.exports = { scrapper };

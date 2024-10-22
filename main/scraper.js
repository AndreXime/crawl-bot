const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const {salvar} = require('./save_file');

async function scrapper(link,element, option, gravar) {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox'] 
    });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36');
  
  try {
    await page.goto(link, { waitUntil: 'networkidle2' }); 
    await page.waitForSelector(element, { timeout: 10000 });
    
    const dataExctrated = await page.evaluate((element, option) => {
    const elements = document.querySelectorAll(element);  
    return Array.from(elements).map(el => {
      switch (option) {
        case 'text':
          return el.innerText;
        case 'src':
          return el.src;
        case 'href':
          return el.href;
        default:
          return el.outerHTML;
      }
    });
    }, element, option);
    
    salvar(dataExctrated,gravar);
    
  } catch (error) {
    console.log("\nAconteceu um erro:\n",error.message,"\n");
    const htmlContent = await page.content();
    console.log("Conteudo da pagina:\n" + htmlContent);   
  } finally {
    await browser.close();
  }
}

module.exports = { scrapper };
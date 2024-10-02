const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapper(link,element, option, gravar) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  try {
    await page.goto(link, { waitUntil: 'networkidle2' });
    await page.waitForSelector(element, { timeout: 6000 });
  
    const textoCompleto = await page.evaluate((element, option) => {
      const el = document.querySelector(element);
      if (!el) {
        return null;
      }
      return option === "InnerText" ? el.innerText : el.innerHTML;
    }, element, option);
  
    if (gravar == "N"){
      console.log("\n",textoCompleto);
    }else{
      fs.writeFile('Scrap_Resultado.txt', textoCompleto, (err) => {
        if (err) {
          console.error('Erro ao gravar o arquivo:', err);
        } else {
          console.log('Texto gravado em Scrap_Resultado.txt com sucesso!');
        }
      });
    }
  
    
  } catch (error) {
    console.log("\nAconteceu um erro:\n",error.message,"\n");
  } finally{
    await browser.close();
  }

}

module.exports = { scrapper };
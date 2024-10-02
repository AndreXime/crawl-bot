const puppeteer = require('puppeteer');
const readline = require('readline');
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
      if (el) {
        return option === "InnerText" ? el.innerText : el.innerHTML; // Retorna o texto ou HTML baseado na opção
      }
      return 'Elemento não encontrado';
    }, element, option);
  
    if (gravar == "N"){
      console.log(textoCompleto);
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
    console.log("\nProvalvemente esse site tem alguma proteção contra scrap\n")
  } finally{
    await browser.close();
  }

}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function pergunta(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer); // Resolve a Promise com a resposta do usuário
    });
  });
}

async function main() {
  const link = await pergunta('URL do site: \n--> ');
  const element = await pergunta('Elemento do site, exemplo: body, .title\n--> ');
  const gravar = await pergunta('Gravar em arquivo isso vai sobrescrever o arquivo anterior? (S/N) \n--> ');
  const option = await pergunta("Opções: InnerText - Retorna somente o texto\n        InnerHtml - Retorna todo html do elemento\n--> ")

  if (!link || !element || (gravar !== "S" && gravar !== "N" ) ||(option !== "InnerText" && option !== "InnerHtml")) {
    console.log('Inputs invalidos');
    rl.close();
    process.exit(1);
  }

  // Chama a função com os inputs fornecidos
  await scrapper(link, element, option, gravar);
  rl.close();
}

main();
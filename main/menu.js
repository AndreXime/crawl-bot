const readline = require('readline');
const {scrapper} = require('./scraper')

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
  const element = await pergunta('Elemento do site, exemplo: body, #id, .title\n--> ');
  const gravar = await pergunta('Gravar em arquivo? Isso vai sobrescrever o arquivo anterior (S/N) \n--> ');
  const option = await pergunta(
  "Opções: Padrao -> retorna html\n"+
  "\t[text] -> Retorna somente os textos\n"+
  "\t[href] -> Retorna somente os links deve ser usado no elemento <a>\n"+
  "\t[src] -> Retorna somente os src deve ser usado no elemento <img> ou <script>\n"+
  "--> ");

  if (!link || !element || (gravar !== "S" && gravar !== "N" )) {
    console.log('Inputs invalidos');
    rl.close();
    process.exit(1);
  }

  // Chama a função com os inputs fornecidos
  await scrapper(link, element, option, gravar);
  rl.close();
}

main();
const prompts = require('prompts');
const { scrapper } = require('./scraper');

async function main() {
  const response = await prompts([
    {
      type: "text",
      name: "link",
      message: "URL do site:",
    },
    {
      type: "number",
      name: "depth",
      message: "Profundidade maxima:",
    },
    {
      type: "select",
      name: "gravar",
      message: "Gravar em arquivo? Isso vai sobrescrever o arquivo anterior",
      choices: [
        { title: "Sim", value: "S" },
        { title: "Não", value: "N" },
      ],
    },
  ]);

  const { link, gravar, depth } = response;

  // Valida os inputs
  if (!link || (gravar !== 'S' && gravar !== 'N')) {
    console.log('Inputs inválidos');
    process.exit(1);
  }

  // Chama a função com os inputs fornecidos
  await scrapper(link, gravar, Number(depth));
}

main().catch(err => {
  console.error('Erro ao executar o scrapper:', err);
});

const prompts = require('prompts');
const { scrapper } = require('./scraper');

async function main() {
  const response = await prompts([
    {
      type: 'text',
      name: 'link',
      message: 'URL do site:'
    },
    {
      type: 'select',
      name: 'option',
      message: 'Tipo do retorno:',
      choices: [
        { title: 'HTML', value: 'HTML' },
        { title: 'Texto', value: 'text' },
        { title: 'Links - Deve ser usado no <a>', value: 'href' },
        { title: 'Src - Deve ser usado no <img> ou <script>', value: 'src' }
      ]
    },
    {
      type: 'text',
      name: 'element',
      message: 'Elemento do site, exemplo: body, #id, .title:'
    },
    {
      type: 'select',
      name: 'gravar',
      message: 'Gravar em arquivo? Isso vai sobrescrever o arquivo anterior',
      choices: [
        { title: 'Sim', value: 'S' },
        { title: 'Não', value: 'N' }
      ]
    },
  ]);

  const { link, element, gravar, option } = response;

  // Valida os inputs
  if (!link || !element || (gravar !== 'S' && gravar !== 'N')) {
    console.log('Inputs inválidos');
    process.exit(1);
  }

  // Chama a função com os inputs fornecidos
  await scrapper(link, element, option, gravar);
}

main().catch(err => {
  console.error('Erro ao executar o scrapper:', err);
});

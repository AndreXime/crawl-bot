import prompts from 'prompts';
import Crawller from './crawllerMain.js';

async function main() {
	const response = await prompts([
		{
			type: 'text',
			name: 'link',
			message: 'URL do site:',
		},
		{
			type: 'number',
			name: 'depth',
			message: 'Profundidade maxima:',
		},
		{
			type: 'select',
			name: 'target',
			message: 'Buscar algo especifico?',
			choices: [
				{ title: 'Somente pecorrer', value: 'default' },
				{ title: 'URL de imagem', value: 'imagem' },
				{ title: 'Texto', value: 'texto' },
				{ title: 'Metadata', value: 'metadata' },
				{ title: 'Custom', value: 'custom' },
			],
		},
		{
			type: (prev) => (prev === 'custom' ? 'text' : null),
			name: 'target',
			message: 'Digite um seletor CSS para buscar',
		},
		{
			type: 'select',
			name: 'gravar',
			message: 'Gravar em arquivo?',
			choices: [
				{ title: 'Não', value: false },
				{ title: 'Sim', value: true },
			],
		},
	]);

	const { link, gravar, depth, target } = response;

	// Valida os inputs
	if (!link || !Number(depth) || !target) {
		console.log('Inputs inválidos');
		process.exit(0);
	}

	// Chama a função com os inputs fornecidos
	await Crawller(link, gravar, Number(depth), target);
}

main().catch((err) => {
	console.error('Erro ao executar o scrapper:', err);
});

export default async function ExtractData(page, target) {
	return await page.evaluate(async (target) => {
		let data = { Titulo: document.title };

		if (target.includes('texto')) {
			const tags = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'div'];
			data.Texto = [];

			tags.forEach((tag) => {
				document.querySelectorAll(tag).forEach((elemento) => {
					if (elemento.textContent?.trim() !== '') {
						data.Texto.push({
							tag: tag,
							text: elemento.textContent?.trim(),
						});
					}
				});
			});
		}

		if (target.includes('imagem')) {
			data.Imagens = Array.from(document.querySelectorAll('img')).map((img) => ({
				src: img.src,
				alt: img.alt || 'Sem descrição',
			}));
		}

		if (target.includes('metadata')) {
			data.Metadata = Array.from(document.querySelectorAll('meta'))
				.map((meta) => {
					const name = meta.getAttribute('name') || meta.getAttribute('property');
					const content = meta.getAttribute('content') || '';
					return name ? { name, content } : null;
				})
				.filter((value) => !!value);
		}

		return data;
	}, target);
}

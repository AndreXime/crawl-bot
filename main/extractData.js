// @ts-check

/**
 * Extrai dados e links de uma página usando o contexto do navegador.
 * Esse arquivo não pode ser ts pois é executado no navegador
 *
 * @async
 * @function ExtractData
 * @param {import("playwright-core").Page} page - Instância da página Playwright.
 * @param {string} target - Tipo de conteúdo a extrair: 'default', 'texto', 'imagem', 'metadata' ou qualquer seletor CSS.
 * @returns {Promise<{ data: import("./type.d.ts").DataType, extractedLinks: string[] }>} Objeto com os dados extraídos e a lista de URLs encontradas.
 */
export default async function ExtractData(page, target) {
    return await page.evaluate(async (target) => {
        const isMediaLink = (url) => url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.mp4');
        const extractedLinks = Array.from(document.querySelectorAll('a'))
            .map((el) => el.href)
            .filter((href) => href && href.startsWith('https') && !isMediaLink(href) && !href.includes('#'));

        let data = { Titulo: document.title };

        switch (target) {
            case 'default':
                break;

            case 'texto': {
                const tags = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'div'];

                data.Texto = tags.flatMap((tag) =>
                    Array.from(document.querySelectorAll(tag))
                        .map((el) => el.textContent?.trim())
                        .filter((text) => text !== undefined && text !== '')
                        .map((text) => ({ tag, text: text }))
                );

                break;
            }

            case 'imagem': {
                data.Imagens = Array.from(document.querySelectorAll('img')).map((img) => ({
                    src: img.src,
                    alt: img.alt || 'Sem descrição',
                }));
                break;
            }

            case 'metadata': {
                data.Metadata = Array.from(document.querySelectorAll('meta'))
                    .map((meta) => {
                        const name = meta.getAttribute('name') || meta.getAttribute('property');
                        const content = meta.getAttribute('content') || '';
                        return name ? { name, content } : null;
                    })
                    .filter((value) => !!value);
                break;
            }

            default: {
                data.Custom = Array.from(document.querySelectorAll(target))
                    .map((elemento) => elemento.textContent?.trim())
                    .filter((text) => text != undefined)
                    .map((text) => ({ text }));
                break;
            }
        }

        return { data, extractedLinks };
    }, target);
}

import { appendFile } from 'fs';

let nomeArquivo = '';

export default function salvarArquivo(dataExctrated: string) {
    if (nomeArquivo == '') {
        nomeArquivo = String(
            new Date()
                .toLocaleString('pt-BR', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                })
                .replace(/[\/: ]/g, '-')
                .replace(',-', '_')
        );
    }
    appendFile(nomeArquivo + '.txt', `${dataExctrated}\n`, (err) => {
        if (err) console.log('Ocorreu um erro ao salvar');
    });
}

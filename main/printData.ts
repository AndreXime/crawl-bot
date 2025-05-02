import { DataType } from './type';

function formartarStrings(str: unknown) {
	if (typeof str !== 'string') return '';
	return str
		.split('\n') // Divide a string de suas linhas
		.map((line) => line.trim())
		.filter((line) => line.trim() !== '') // Filtra linhas que não são vazias
		.join('\n');
}

export default function printData(data: DataType) {
	let output = '';
	for (const key of Object.keys(data) as Array<keyof DataType>) {
		const value = data[key];
		output += `${key}:\n`;

		if (Array.isArray(value)) {
			value.forEach((item, index) => {
				output += `  [${index}]:\n`;
				for (const [subKey, subValue] of Object.entries(item)) {
					output += `    ${subKey}: ${formartarStrings(subValue)}\n`;
				}
			});
			continue;
		}

		if (typeof value === 'object' && value !== null) {
			for (const [subKey, subValue] of Object.entries(value)) {
				output += `  ${subKey}: ${formartarStrings(subValue)}\n`;
			}
			continue;
		}

		output += `  ${formartarStrings(value)}\n`;
	}

	console.info(output);
	return output;
}

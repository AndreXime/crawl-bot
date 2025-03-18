function formartarStrings(str) {
	return str
		.split('\n') // Divide a string de suas linhas
		.map((line) => line.trim())
		.filter((line) => line.trim() !== '') // Filtra linhas que não são vazias
		.join('\n');
}

export default function printData(data) {
	let output = '';

	for (const [key, value] of Object.entries(data)) {
		output += `${key}:\n`;

		if (Array.isArray(value)) {
			value.forEach((item, index) => {
				output += `  [${index}]:\n`;
				for (const [subKey, subValue] of Object.entries(item)) {
					output += `    ${subKey}: ${formartarStrings(subValue)}\n`;
				}
			});
		} else if (typeof value === 'object' && value !== null) {
			for (const [subKey, subValue] of Object.entries(value)) {
				output += `  ${subKey}: ${formartarStrings(subValue)}\n`;
			}
		} else {
			output += `  ${formartarStrings(value)}\n`;
		}
	}

	console.info(output);
	return output;
}

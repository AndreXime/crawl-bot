const fs = require('fs');

function gerarNome(arg) {
  if (arg != "S") {
    return 0;
  }
  const data = new Date();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0"); // Mês começa do zero
  const dia = String(data.getDate()).padStart(2, "0");
  fs.writeFile(`${ano}-${mes}-${dia}` + ".txt", " ", () => { });
  
  return `${ano}-${mes}-${dia}`;
}


function salvarArquivo(dataExctrated,nome){
    fs.appendFile(nome + ".txt", dataExctrated.join("\n"), () => { }); 
}

module.exports = { salvarArquivo, gerarNome };
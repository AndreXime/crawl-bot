const fs = require('fs');

function gerarNome(arg) {
  if (arg != "S") {
    return 0;
  }
  const data = new Date();
  const mes = String(data.getMonth() + 1).padStart(2, "0"); // Mês começa do zero
  const dia = String(data.getDate()).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  const segundo = String(data.getSeconds()).padStart(2, "0");
  const nome = `${mes}-${dia}-${hora}-${minuto}-${segundo}`
  fs.writeFile( nome + ".txt" , " " , () => {} );
  
  return nome;
}


function salvarArquivo(dataExctrated,nome){
    fs.appendFile(nome + ".txt", `${dataExctrated}+\n`, () => {}); 
}

module.exports = { salvarArquivo, gerarNome };
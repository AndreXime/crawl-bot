const fs = require('fs');

function salvar(dataExctrated,gravar){
  const resultadoFinal = dataExctrated.join('')
    if (gravar == "N"){
      console.log("\n", resultadoFinal);
    }else{
      fs.writeFile('Scrap_Resultado.txt', resultadoFinal, (err) => {
        if (err) {
          console.error('Erro ao gravar o arquivo:', err);
        } else {
          console.log('Texto gravado em Scrap_Resultado.txt com sucesso!');
        }
      });
    }      
}

module.exports = { salvar };
const fs = require('fs');

function salvar(dataExctrated,gravar){
    if (gravar == "N"){
        console.log("\n",dataExctrated);
    }else{
        fs.writeFile('Scrap_Resultado.txt', dataExctrated, (err) => {
          if (err) {
            console.error('Erro ao gravar o arquivo:', err);
          } else {
            console.log('Texto gravado em Scrap_Resultado.txt com sucesso!');
          }
        });
    }      
}

module.exports = { salvar };
const fs = require('fs')
const jsonQ = require('jsonq')

function parseNumber(strg) {
  var strg = strg || "";
  var decimal = '.';
  strg = strg.replace(/[^0-9$.,]/g, '');
  if(strg.indexOf(',') > strg.indexOf('.')) decimal = ',';
  if((strg.match(new RegExp("\\" + decimal,"g")) || []).length > 1) decimal="";
  if (decimal != "" && (strg.length - strg.indexOf(decimal) - 1 == 3) && strg.indexOf("0" + decimal)!==0) decimal = "";
  strg = strg.replace(new RegExp("[^0-9$" + decimal + "]","g"), "");
  strg = strg.replace(',', '.');
  return parseFloat(strg);
}   

module.exports.USDto = (currency) => {
  return new Promise((resolve, reject) => {
    fs.readFile('./json/exchange_rate.json', (err, data) => {

      if (!err) {
        let rate = JSON.parse(data)
        rate = jsonQ(rate).find(currency).value()
        resolve(rate)
        
      }
    })
  })
}

module.exports.MoneyTo = (dinheiro, current_key_value, key_to_ref) => {

  console.log(`antes dinheiro: ${dinheiro}`)

  dinheiro = parseNumber(dinheiro.toString())
  
  console.log(`depois dinheiro: ${dinheiro}`)

  //R$ 16,97 / 8.79]
  var results = dinheiro / current_key_value

  if (results >= 1) {

    console.log(`valor é maior que 1 : ${results}`)
    return results

  } else {

    console.log(`valor é menor que 1 : ${results}`)
    //Key to Ref * results (Exemplo: 33 * 0.5 = 16,5 refined)
    return key_to_ref * results

  }

}

module.exports.ValueTo = (type, quantidade, to_money, rate) => {
  if (type == 'key') {
    var results = to_money * quantidade * rate.slice(0, 3)
    console.log(results)
    return results.toFixed(2)
  }
  
  if (type == 'refined') {
    var results = to_money * quantidade * rate.slice(0, 3)
    console.log(results)
    return results.toFixed(2)
  }
}
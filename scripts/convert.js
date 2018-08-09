const fs = require('fs')
const jsonQ = require('jsonq')

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
  
  dinheiro = dinheiro.toString().slice(3).replace(',', '.')
  
  // [R$ 16,97 / 8.79]
  var results = dinheiro / parseFloat(current_key_value)

  if (results >= 1) {

    return `${results.toFixed(2)} keys`

  } else {

    //Key to Ref * results (Exemplo: 33 refined * 0.5 = 16,5 refined)
    var results = key_to_ref * results
    return `${results.toFixed(2)} refined`

  }

}

//type = tipo de moeda (key, refined)
//quantidade = quantidade de refinados ou key (4.33 refined)
//to_money = preço a ser multiplicado. 2.50 ou 0.055 refinados
//rate = converter o preço de dolar para reais

module.exports.ValueTo = (type, quantidade, to_money, rate) => {
  if (type == 'key') {
    var results = to_money * quantidade * rate.slice(0, 3)
    return results.toFixed(2)
  }
  
  if (type == 'refined') {
    var results = to_money * quantidade * rate.slice(0, 3)
    return results.toFixed(2)
  }
}
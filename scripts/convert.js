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

  dinheiro = parseFloat(dinheiro)

  var results = dinheiro / current_key_value

  if (results >= 1) {

    console.log('valor é maior que 1')
    return results

  } else {

    console.log('valor é menor que 1')
    //Key to Ref * results (Exemplo: 33 * 0.5 = 16,5 refined)
    return key_to_ref * results

  }

}

module.exports.ValueTo = (type, quantidade, to_money, rate) => {
  if (type == 'key') {
    var results = to_money * quantidade * rate
    console.log(results)
    return results
  }
  
  if (type == 'refined') {
    var results = to_money * quantidade * rate
    console.log(results)
    return results
  }
}
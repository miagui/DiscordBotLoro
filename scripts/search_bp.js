const fs = require('fs')
const jsonQ = require('jsonq')

//item_type (default ou refined) default busca itens com endereço, e o refined busca somente refined
module.exports.findBpPrice = (key, item_type) => {

    return new Promise((resolve, reject) => {

        fs.readFile('./json/bp_price.json', (err, data) => {
            if (!err) {

                if (item_type == 'default') {
                    console.log(key)
                    data = JSON.parse(data)
                    data = jsonQ(data).find(key).find('value').value()
                    resolve(data)
                } else {
                    console.log(key)
                    data = JSON.parse(data)
                    data = jsonQ(data).find(key).value()
                    resolve(data)
                }
            }
        })
    })
}
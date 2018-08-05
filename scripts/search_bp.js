const fs = require('fs')
const jsonQ = require('jsonq')

module.exports.findKeyPrice = (key) => {
    return new Promise((resolve, reject) => {
        fs.readFile('./json/bp_price.json', (err, data) => {
            if (!err) {

                data = JSON.parse(data)
                data = jsonQ(data).find(key).find('value').value()[0]
                return data
                
            }
        })
    })
}
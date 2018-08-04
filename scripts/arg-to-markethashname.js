const fs = require('fs');
const jsonQ = require("jsonq");
const fuzzysort = require('fuzzysort');

const execute = (arg, key) => {
    return new Promise((resolve, reject) => {
        fs.readFile('./json/market_hash_name.json', (err, data) => {
            
            if (err) reject(err)
            data = JSON.parse(data)
            let results = fuzzysort.go(arg, data, {key: 'market_hash_name'})

            results = jsonQ(results).find(key);
            //Retorna o valor da key item_name
            resolve(results.value()[0]);
        })
    })
}

module.exports.execute = execute;
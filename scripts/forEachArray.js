const fs = require('fs');
const jsonQ = require("jsonq");
var _ = require('lodash');
var _ = require('lodash/core');

module.exports.execute = () => {

    fs.readFile('./json/bitskins_all_items_price.json', (err, data) => {

        data = JSON.parse(data)
    let result = _.map(data.prices, function(currentObject) {
        return _.pick(currentObject, "market_hash_name", "icon_url", "price", "quality_color");
    });

    console.log(result)

        fs.writeFile('./json/market_hash_name.json', JSON.stringify(result), (err) => {
            if (err) throw console.log(err)

        })
    })
}
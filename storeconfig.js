const fs = require('fs');
const jsonQ = require("jsonq");

// Load the full build.
var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require('lodash/fp');
////-----------------------------------------------------------------------------------------------------------------///

var Store;

// Read the file and send to the callback (handleFile). The parameters that send to callback are (err) and (data)
fs.readFile('./preços.json', handleFile);

// Write the callback function. The parameters for handleFile are (err) and (data).
function handleFile(err, data) { //The (data) parameter displays what contains in a .json
    if (err) throw err;
    var prices = JSON.parse(data);
    var Store = prices.applist.apps;
    // You can now play with your datas
};

var Store = prices.applist.apps;
var appID = Store.map(x => x.appid);
var StoreJSON = jsonQ(Store);
//console.log(handleFile())
//GameName = StoreJSON.find('name');
//console.log(GameName.value());


console.log(Store);
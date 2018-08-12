const fs = require('fs');
const request = require('request');
const cron = require('cron');

const Scrapena = require('./scripts/Scrapena.js')
const InventoryInfo = require('./scripts/inventory_info.js')

var applist = new cron.CronJob({
    cronTime: '00 30 14 * * 0-6',
    onTick: function () {
        console.log('[STEAM/APPLIST] Buscando AppList/v2...');
        request('http://api.steampowered.com/ISteamApps/GetAppList/v2', function (error, response, body) {

            if (error) throw console.log('error:', error); // Print the error if one occurred
            fs.writeFile('./json/preços.json', body, (err) => {
                if (err) throw err;
                console.log('[STEAM/APPLIST] preços.json atualizado.');

            });
        })
    },
    start: false,
    timeZone: 'America/Sao_Paulo'
});

var exchange_rate = new cron.CronJob ({
    cronTime: '00 30 14 * * 0-6',
    onTick: function () {
        request(`https://openexchangerates.org/api/latest.json?app_id=${process.env.exchangeratetoken}`, (error, response, body) => {
            if (!error) {
                fs.writeFile('./json/exchange_rate.json', body, (err) => {
                    if (err) throw console.log(err)
                    console.log('Atualizado ExchangeRates')
                })
            }
        })
    }, 
    start: false,
    timeZone: 'America/Sao_Paulo'
})

var bptf_price = new cron.CronJob({
    cronTime: '*/20 * * * *',
    onTick: function () {
        console.log('[BACKPACK.TF/API] Buscando backpack.tf...');
        request(`https://backpack.tf/api/IGetPrices/v4?key=${process.env.bptoken}`, function (error, response, body) {

            if (error) throw console.log('error:', error); // Print the error if one occurred
            fs.writeFile('./json/bp_price.json', body, (err) => {
                if (err) throw err;
                console.log('[BACKPACK.TF/API] bp_price.json atualizado.');

            });
        })
    },
    start: true,
    timeZone: 'America/Sao_Paulo'
});

var inventoryUpdate = new cron.CronJob({
    cronTime: '*/30 */0 * * * *',
    onTick: function () {
        InventoryInfo.update('76561198090776668')
        InventoryInfo.update('76561198116806370')
    },
    start: false,
    timeZone: 'America/Sao_Paulo'
});

var Notifier = new cron.CronJob({
    cronTime: '*/1 * * * *',
    onTick: function () {

        console.log('Verificando se há notificaçoes...');
        Scrapena.InventoryCheck('5707', 'Fornalha de Dinheiro Robotico', '76561198090776668', 'Scrapena Cykes');
        Scrapena.InventoryCheck('5706', 'KB-808', '76561198090776668', 'Scrapena Cykes');
        Scrapena.InventoryCheck('5705', 'Processador de provocações', '76561198090776668', 'Scrapena Cykes');
        //
        Scrapena.InventoryCheck('5707', 'Fornalha de Dinheiro Robotico', '76561198116806370', 'ScrapNet');
        Scrapena.InventoryCheck('5706', 'KB-808', '76561198116806370', 'ScrapNet');
        Scrapena.InventoryCheck('5705', 'Processador de provocações', '76561198116806370', 'ScrapNet');
    },
    start: false,
    timeZone: 'America/Sao_Paulo'
});

module.exports.applist = applist;
module.exports.exchange_rate = exchange_rate;
module.exports.bptf_price = bptf_price;
module.exports.Notifier = Notifier
module.exports.inventoryUpdate = inventoryUpdate
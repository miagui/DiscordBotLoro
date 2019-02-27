const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const request = require('request');
const cron = require('cron');

const scrapTfBot = require('./scripts/scrptf_bot_inventory.js')
const getPlayerItems = require('./scripts/get_player_items.js')

client.login(process.env.token);

var appList = new cron.CronJob({
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

var exchangeRate = new cron.CronJob ({
    cronTime: '00 30 14 * * 0-6',
    onTick: function () {
        request(`https://openexchangerates.org/api/latest.json?app_id=${process.env.exchangeratetoken}`, (error, response, body) => {
            if (!error) {
                fs.writeFile('./json/exchange_rate.json', body, (err) => {
                    if (err) throw console.log(err)
                    console.log('Atualizado exchange_rate.json')
                })
            }
        })
    }, 
    start: false,
    timeZone: 'America/Sao_Paulo'
})

var bpTfPrice = new cron.CronJob({
    cronTime: '*/50 * * * *',
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
        getPlayerItems.update('76561198090776668')
        getPlayerItems.update('76561198116806370')
    },
    start: false,
    timeZone: 'America/Sao_Paulo'
});

var itemInvNotifier = new cron.CronJob({
    cronTime: '*/1 * * * *',
    onTick: function () {

        console.log('Verificando se há notificaçoes do Bot...');
        scrapTfBot.inventoryCheck('5707', 'Fornalha de Dinheiro Robotico', '76561198090776668', 'Scrapena Cykes');
        scrapTfBot.inventoryCheck('5706', 'KB-808', '76561198090776668', 'Scrapena Cykes');
        scrapTfBot.inventoryCheck('5705', 'Processador de provocações', '76561198090776668', 'Scrapena Cykes');
        //
        scrapTfBot.inventoryCheck('5707', 'Fornalha de Dinheiro Robotico', '76561198116806370', 'ScrapNet');
        scrapTfBot.inventoryCheck('5706', 'KB-808', '76561198116806370', 'ScrapNet');
        scrapTfBot.inventoryCheck('5705', 'Processador de provocações', '76561198116806370', 'ScrapNet');
    },
    start: false,
    timeZone: 'America/Sao_Paulo'
});

var discordStatus = new cron.CronJob({
    //Crontime ocorrerá toda hora, no minuto zero.
    cronTime: '0 */1 * * *',
    onTick: function () {

        fs.readFile('./json/discord_status.json', handleFile)
        function handleFile(err, data) {

            if (err) throw err;
            data = JSON.parse(data);

            //Pega todas as chaves do JSON. Exemplo: [WATCHING, LISTENING, PLAYING]
            var keyStatus = Object.keys(data)

            //Randomiza entre as chaves do JSON para escolher um unico. Exemplo: WATCHING
            var randKeyStatus = keyStatus[Math.floor(Math.random() * keyStatus.length)]

            //Busca o Array que foi anteriormente selecionado aleatoriamente.
            var arrStatus = data[randKeyStatus]

            //Randomiza o Array em busca de um valor aleatorio. Exemplo: "PewDiePie"
            var randArrStatus = arrStatus[Math.floor(Math.random() * arrStatus.length)]

            console.log(`Bot is ${randKeyStatus} ${randArrStatus}`)

            client.user.setActivity(randArrStatus, {
            type: randKeyStatus
          });

        }
    },
    start: false,
    timeZone: 'America/Sao_Paulo'
});

module.exports.appList = appList;
module.exports.exchangeRate = exchangeRate;
module.exports.bpTfPrice = bpTfPrice;
module.exports.itemInvNotifier = itemInvNotifier
module.exports.inventoryUpdate = inventoryUpdate
module.exports.discordStatus = discordStatus
const fs = require('fs');
const request = require('request');
const cron = require('cron');

var updateFile = new cron.CronJob({
    cronTime: '00 16 13 * * 0-6',
    onTick: function () {
        console.log('Buscando AppList/v2...');
        request('http://api.steampowered.com/ISteamApps/GetAppList/v2', function (error, response, body) {
            if (error) throw console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            //console.log('body:', body); // Print the HTML for the Google homepage.
            fs.writeFile('preços.json', body, (err) => {
                if (err) throw err;
                console.log('Arquivo "preços.json" atualizado!');
            });
        })
    },
    start: false,
    timeZone: 'America/Sao_Paulo'
});

module.exports.updateFile = updateFile;
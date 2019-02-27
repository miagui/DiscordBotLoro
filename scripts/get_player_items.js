const fs = require('fs');
const request = require('request');

const update = (playerid) => {

        request(`http://api.steampowered.com/IEconItems_440/GetPlayerItems/v0001/?key=81860484ED97C7402215D215AE1C1589&SteamID=${playerid}&format=json`, function (error, response, body) {
            if (error) throw console.log('error:', error); // Print the error if one occurred
            if (response.statusCode == 200) {
                console.log(`Updated BOT Info [ID=${playerid}]`);
                fs.writeFile(`./steam-user/player_${playerid}.json`, body, (err) => {
                    if (err) throw err;
                })
            } else console.log(`Update Failed [ID=${playerid}]`);
        })
}

module.exports.update = update;
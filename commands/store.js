const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const _ = require('lodash');
const jsonQ = require("jsonq");
const request = require('request');

module.exports.run = (client, message, args, prefix) => {

    // Read the file and send to the callback
    fs.readFile('./preços.json', handleFile);

    // Write the callback function
    function handleFile(err, data) {

        if (err) throw err;
        prices = JSON.parse(data);
        // You can now play with your datas

        let Store = prices.applist.apps;
        let gameArg = args.join(" "); //argumento usado no comando i.e (!store 'argumento')
        var argFilter = _.filter(Store, v => v.name.trim().toLowerCase().indexOf(`${gameArg}`) != -1); // filter para procurar pelo argumento
        var searchAppid = jsonQ(argFilter),

            //to find all the name

            id = searchAppid.find('appid'); //procura pelo array appid
        AppID = id.value()
        //busca a informação do jogo apartir do AppID fornecido antes.
        request(`http://store.steampowered.com/api/appdetails?appids=${AppID[0]}&cc=br`, function (error, response, body) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log(`Link: http://store.steampowered.com/api/appdetails?appids=${AppID[0]}&cc=br&filters=price_overview`)

            var gameInfo = jsonQ(body);
            initialPrice = gameInfo.find('initial').value();
            finalPrice = gameInfo.find('final').value();
            discountPercent = gameInfo.find('discount_percent').value();
            releaseDate = gameInfo.find('date').value()

            const numberDot = (price) => {

                if (price.toString().length == 3) {
                    return price.toString().slice(0, 1) + ',' + price.toString().slice(2, 3)

                } else if (price.toString().length == 4) {

                    return price.toString().slice(0, 2) + ',' + price.toString().slice(2, 4)

                } else {

                }
            }
            //maneira util de verificar se foi encontrado algum preço. Se
            if (initialPrice.length >= 1) {

                message.channel.send(`Preço inicial: R$${numberDot(initialPrice)}              
Preço em promoção: R$${numberDot(finalPrice)} (${discountPercent}% desconto)
Data de lançamento: ${releaseDate.toString()}
https://store.steampowered.com/app/${AppID[0]}`);

            //se não houver preço, mas haver um AppID, então o jogo é free to play.
            } else if (initialPrice.length == 0 && AppID[0]) {

                message.channel.send(`Free-to-Play
Data de lançamento: ${JSON.stringify(releaseDate.toString())}                                                                    
https://store.steampowered.com/app/${AppID[0]}`)

            } else {

                message.channel.send(`Jogo não encontrado.`)
                
            }
        });
    }
}

module.exports.help = {
    name: 'store' //nome do comando
}
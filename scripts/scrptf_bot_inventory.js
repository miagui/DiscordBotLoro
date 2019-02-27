const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs')
const jsonQ = require("jsonq");
const fuzzysort = require('fuzzysort')

const getObjects = require('./getObjects.js')

client.login(process.env.token);

//inventoryCheck e.g: (ID do item, Nome do item como saída, ID64, Nome do player como saída): 
//                     '5707', 'Fornalha de Dinheiro Robotico', '76561198090776668', 'Scrapena Cykes'

const inventoryCheck = (defindex, name, id64, player) => {
    fs.readFile(`./steam-user/player_${id64}.json`, handleFile);

    function handleFile(err, data) {

        if (err) throw console.log(err);
        inventoryItems = JSON.parse(data);

        var results = getObjects.execute(inventoryItems, "defindex", defIndex)
        results = Object.keys(results).length

        var inventory = {
            nome: name,
            quantidade: results
        }
        //Verifica se existe o .json na pasta steam-user
        if (!fs.existsSync(`./steam-user/cache_${defIndex}_${id64}.json`)) {

            //Se o arquivo não existe, crie um arquivo com este ID.
            fs.writeFileSync(`./steam-user/cache_${defIndex}_${id64}.json`, JSON.stringify(inventory))

        } else {

            fs.readFile(`./steam-user/cache_${defIndex}_${id64}.json`, handleFile);

            function handleFile(err, data) {

                if (err) throw console.log(err);
                var cache = JSON.parse(data);

                //Se a qtde de itens da variavel cache é não é igual ao de inventory, então notifique e atualize o cache.
                if (inventory['quantidade'] != cache['quantidade']) {
                    if (inventory['quantidade'] != 0) {
                    client.users.get('263628661415084032').send(`[https://scrap.tf/partswap] => O __${player}__ está com **${inventory['quantidade']}** ${inventory['nome']} em seu inventario.`);
                    }
                    fs.writeFile(`./steam-user/cache_${defIndex}_${id64}.json`, JSON.stringify(inventory), (err) => {
                        if (err) throw console.log(err)

                    })

                } else {

                    return

                }
            }
        }
    }
}

module.exports.inventoryCheck = inventoryCheck;
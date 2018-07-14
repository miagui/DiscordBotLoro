const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const _ = require('lodash');
const jsonQ = require("jsonq");
const request = require('request');
const fuzzysort = require('fuzzysort')

module.exports.run = (client, message, args, prefix) => {

  // Read the file and send to the callback
  fs.readFile('./json/tf2_items.json', handleFile);

  // Write the callback function
  function handleFile(err, data) {

    if (err) throw err;
    i = JSON.parse(data);
    // You can now play with your datas

    var items = i.result.items;
    var itemArg = args.join(" ");
    if (!itemArg) return message.channel.send('Envie um item válido ou mude as palavras.\n`!bp <nomedoitem>`');
    //var itemFilter = _.filter(items, v => v.name.trim().toLowerCase().indexOf(`${itemArg}`) != -1);
    const results = fuzzysort.go(itemArg, items, {key:'item_name'})

    var searchFilter = jsonQ(results),

      nameResult = searchFilter.find('item_name'); //procura pelo array name
    itemThumb = searchFilter.find('image_url').value()[0]
    useby = searchFilter.find('used_by_classes').value()[0]
    if (!useby) {
      var usedBy = ['All-Classes']
    } else {
      var usedBy = useby
    }
    var niv = nameResult.value()[0];

    if (typeof niv == 'undefined') {

     return message.channel.send('Item não encontrado. Tente enviar mais informações.');

    } else if (niv.startsWith('The ')) {

      var nameInv = niv.slice(4)

    } else {

      var nameInv = niv

    }

    console.log(nameInv)

    //busca a informação do jogo apartir do AppID fornecido antes.
    fs.readFile('./json/bp_price.json', handleBP);

    function handleBP(err, data2) {
      if (err) throw console.log(err)
      b = JSON.parse(data2);

      let bSearch = jsonQ(b)

      let craft = bSearch.find(nameInv).find('prices').find('6').find('Craftable').find('value').value();
      let uncraft = bSearch.find(nameInv).find('prices').find('6').find('Non-Craftable').find('value').value();

      let cr = bSearch.find(nameInv).find('prices').find('6').find('Craftable').find('currency').value();
      let uncr = bSearch.find(nameInv).find('prices').find('6').find('Non-Craftable').find('currency').value();

      let genuine = bSearch.find(nameInv).find('prices').find('1').find('value').value();
      let gen_ = bSearch.find(nameInv).find('prices').find('1').find('currency').value();

      let vintage = bSearch.find(nameInv).find('prices').find('3').find('value').value();
      let vint_ = bSearch.find(nameInv).find('prices').find('3').find('currency').value();

      let strange = bSearch.find(nameInv).find('prices').find('11').find('value').value();
      let str_ = bSearch.find(nameInv).find('prices').find('11').find('currency').value();

      let collector = bSearch.find(nameInv).find('prices').find('14').find('value').value();
      let col_ = bSearch.find(nameInv).find('prices').find('14').find('currency').value();

      const currency = (value) => {
        if (value.toString() == 'metal') {
          return 'refined';
        } else {
          return value
        }
      }

      const checkIf = (str, cur, quality) => {
        let c = currency(cur)
        if(!str.toString() && !cur.toString()) return
        if(str.length == 2 && cur.length == 2) return embed.addField(quality, `Craftable: __${str[0]} ${c[0]}__\nNon-Craftable: __${str[1]} ${c[1]}__`, true)
        if(str.length == 1 && cur.length == 1) return embed.addField(quality, `Craftable: __${str} ${c}__`, true)
      }

      const uniqueExists = (crft, nonCrft) => {

        if(crft.length && nonCrft.length) return embed.addField('Unique', `Craftable: __${craft} ${currency(cr)}__\nNon-Craftable: __${uncraft} ${currency(uncr)}__`)
        if(crft.length && !nonCrft.length) return embed.addField('Unique', `Craftable: __${craft} ${currency(cr)}__`)
        if(!crft.length && nonCrft.length) return embed.addField('Unique', `Uncraftable: __${uncraft} ${currency(uncr)}__`)
        if(!crft.length && !nonCrft.length) return
      }

      const embed = new Discord.RichEmbed()

  .setColor(0x4A90E2)
  .setTitle(`**${nameInv}**`)
  .setDescription(`Used by: **${usedBy.join(", ")}**`)
  .setURL(`https://backpack.tf/classifieds?item=${encodeURIComponent(nameInv)}`)
  .setFooter("backpack.tf")
  .setThumbnail(itemThumb)
  uniqueExists(craft, uncraft)
  checkIf(strange , str_, "Strange")
  checkIf(vintage, vint_, 'Vintage')
  checkIf(genuine, gen_, "Genuine")
  checkIf(collector, col_, "Collector")

  message.channel.send({embed});
    }
  }
}

module.exports.help = {
  name: 'bp'
}
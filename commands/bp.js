const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const jsonQ = require("jsonq");
const request = require('request');
const fuzzysort = require('fuzzysort')

const USDto = require('../scripts/convert.js')

module.exports.run = (client, message, args, prefix) => {

  // Read the file and send to the callback
  fs.readFile('./json/tf2_items.json', handleFile);

  // Write the callback function
  function handleFile(err, data) {

    if (err) throw err;
    data = JSON.parse(data);
    // You can now play with your datas
      data = data.result.items;
      var itemArg = args.join(" ");
      if (!itemArg) return message.channel.send('Envie um item válido ou mude as palavras.\n`!bp <nomedoitem>`');
      var results = fuzzysort.go(itemArg, data, {
        key: 'item_name'
      })
      results = jsonQ(results)

      async function return_promise() {

      var rate = USDto.convert('BRL')
      var item_name = results.find('item_name').value()[0]; //procura pelo array name
      var image_url = results.find('image_url').value()[0]
      var used_by = results.find('used_by_classes').value()[0]

      if (!used_by) {
        var usedBy = ['All-Classes']
      } else {
        var usedBy = used_by
      }

      if (typeof niv == 'undefined') {

        return message.channel.send('Item não encontrado. Tente enviar mais informações.');

      } else if (item_name.startsWith('The ')) {

        item_name = item_name.slice(4)

      } else {

        item_name = item_name

      }

      //busca a informação do jogo apartir do AppID fornecido antes.
      fs.readFile('./json/bp_price.json', handleBP);

      function handleBP(err, data2) {

        if (err) throw console.log(err)
        data2 = JSON.parse(data2);

        let bSearch = jsonQ(data2)

        let usd_refined = bSearch.find('raw_usd_value')

        let craft = bSearch.find(item_name).find('prices').find('6').find('Craftable').find('value').value();
        let uncraft = bSearch.find(item_name).find('prices').find('6').find('Non-Craftable').find('value').value();

        let cr = bSearch.find(item_name).find('prices').find('6').find('Craftable').find('currency').value();
        let uncr = bSearch.find(item_name).find('prices').find('6').find('Non-Craftable').find('currency').value();

        let genuine = bSearch.find(item_name).find('prices').find('1').find('value').value();
        let gen_ = bSearch.find(item_name).find('prices').find('1').find('currency').value();

        let vintage = bSearch.find(item_name).find('prices').find('3').find('value').value();
        let vint_ = bSearch.find(item_name).find('prices').find('3').find('currency').value();

        let strange = bSearch.find(item_name).find('prices').find('11').find('value').value();
        let str_ = bSearch.find(item_name).find('prices').find('11').find('currency').value();

        let collector = bSearch.find(item_name).find('prices').find('14').find('value').value();
        let col_ = bSearch.find(item_name).find('prices').find('14').find('currency').value();

        //value é o valor de tantas keys ou metais. Por exemplo: 1.66 Refined
        const currency = (key_metal, value) => {
          if (value.toString() == 'metal') {
            return `refined (R$ ${usd_refined * value * rate.toString().slice(0, 3)})`;
          } else {
            return `keys (R$ ${2.50 * value * rate.toString().slice(0, 3)})`
        }
      }

        const checkIf = (valor, moeda, quality) => {
          let c = currency(moeda, valor)

          if (!valor.toString() && !moeda.toString()) return

          if (valor.length == 2 && moeda.length == 2) return embed.addField(quality, `Craftable: __${valor[0]} ${c[0]}__\nNon-Craftable: __${valor[1]} ${c[1]}__`, true)

          if (valor.length == 1 && moeda.length == 1) return embed.addField(quality, `Craftable: __${valor} ${c}__`, true)
        }

        const uniqueExists = (crft, nonCrft) => {

          if (crft.length && nonCrft.length) return embed.addField('Unique', `Craftable: __${craft} ${currency(cr)}__\nNon-Craftable: __${uncraft} ${currency(uncr)}__`)
          if (crft.length && !nonCrft.length) return embed.addField('Unique', `Craftable: __${craft} ${currency(cr)}__`)
          if (!crft.length && nonCrft.length) return embed.addField('Unique', `Uncraftable: __${uncraft} ${currency(uncr)}__`)
          if (!crft.length && !nonCrft.length) return
        }

        const embed = new Discord.RichEmbed()

          .setColor(0x4A90E2)
          .setTitle(`**${item_name}**`)
          .setDescription(`Used by: **${usedBy.join(", ")}**`)
          .setURL(`https://backpack.tf/classifieds?item=${encodeURIComponent(item_name)}`)
          .setFooter("backpack.tf")
          .setThumbnail(image_url)
        uniqueExists(craft, uncraft)
        checkIf(strange, str_, "Strange")
        checkIf(vintage, vint_, 'Vintage')
        checkIf(genuine, gen_, "Genuine")
        checkIf(collector, col_, "Collector")

        message.channel.send({
          embed
        });
      }
    }
  }
}

module.exports.help = {
  name: 'bp'
}
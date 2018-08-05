const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const jsonQ = require("jsonq");
const request = require('request');

const arg_to_hashname = require('../scripts/arg-to-markethashname.js')
const convert = require('../scripts/convert.js')
const bp = require('./bp.js')

module.exports.run = (client, message, args, prefix) => {

  let itemArg = args.join(' ')
  if (!itemArg) return message.channel.send('Envie um item válido ou mude as palavras.\n`!market <nomedoitem>`');

  async function return_promise() {

    var market_hash_name = await arg_to_hashname.execute(itemArg, 'market_hash_name')
    var thumbnail = await arg_to_hashname.execute(itemArg, 'icon_url')
    var bitskins_sellPrice = await arg_to_hashname.execute(itemArg, 'price')
    var quality_color = await arg_to_hashname.execute(itemArg, 'quality_color')
    var rate = await convert.USDto('BRL')

    if (!market_hash_name) return message.channel.send('Item não encontrado. Tente ser mais legível.')

    request(`https://steamcommunity.com/market/priceoverview/?appid=440&currency=7&market_hash_name=${encodeURIComponent(market_hash_name)}`, function (error, response, body) {
      if (error) throw console.log('error:', error);

      body = jsonQ(body)

      var sellPrice = body.find('lowest_price').value()
      var lastsoldPrice = body.find('median_price').value()
      var sold24hrs = body.find('volume').value()
      var converted_price = bitskins_sellPrice * rate.toString().slice(0, 3)
      var sell_tfcurrency = convert.MoneyTo(sellPrice, 2.50 * rate, bp.key_price)
      var last_tfcurrency = convert.MoneyTo(lastsoldPrice, 2.50 * rate, bp.key_price)

      const embed = new Discord.RichEmbed()

        .setColor(`0x${quality_color}`)
        .setTitle(`**${market_hash_name}**`)
        .setDescription(`ANÚNCIOS`)
        .setURL(`https://steamcommunity.com/market/listings/440/${encodeURIComponent(market_hash_name)}`)
        .setFooter("Steam & BitSkins")
        .setThumbnail(thumbnail)
        .addField('[BITSKINS]', `R$ ${converted_price}`, false)
        .addField('[STEAM]', `Preço mais barato: ${sellPrice} (${sell_tfcurrency})\nÚltimo vendido por: ${lastsoldPrice} (${last_tfcurrency})\n**${sold24hrs}** vendido(s) mas últimas **24 horas**.`, false)

      message.channel.send({
        embed
      });

    })
  }

  return_promise()

}

module.exports.help = {

  name: 'market' //nome do comando

}
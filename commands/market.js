const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const jsonQ = require("jsonq");
const request = require('request');

const convert = require('../scripts/convert.js')

const argToHashname = require('../scripts/arg_to_markethashname.js')
const searchBp = require('../scripts/search_bp.js')

module.exports.run = (client, message, args, prefix) => {

  let itemArg = args.join(' ')
  if (!itemArg) return message.channel.send('Envie um item válido ou mude as palavras.\n`!market <nomedoitem>`');

  async function return_promise() {

    var rate = await convert.usdTo('BRL')

    var market_hash_name = await argToHashname.execute(itemArg, 'market_hash_name')
    var thumbnail = await argToHashname.execute(itemArg, 'icon_url')
    var quality_color = await argToHashname.execute(itemArg, 'quality_color')

    //key2ref = preço da chave em refinados
    //usd_refined = preço do refinado em dólar
    var keyToRefPrice = await searchBp.findBpPrice('Mann Co. Supply Crate Key', 'default')
    var usdRefined = await searchBp.findBpPrice('raw_usd_value', 'refined')

    if (!market_hash_name) return message.channel.send('Item não encontrado. Tente ser mais legível.')

    request(`https://steamcommunity.com/market/priceoverview/?appid=440&currency=7&market_hash_name=${encodeURIComponent(market_hash_name)}`, function (error, response, body) {
      if (error) throw console.log('error:', error);

      body = jsonQ(body)

      var sellPrice = body.find('lowest_price').value()
      var lastSoldPrice = body.find('median_price').value()
      var lastSold24hrs = body.find('volume').value()

      //converte o dinheiro para o valor da moeda do TF2 (refinado ou keys)
      //função (preço R$, preço da key [0.055 usd * 33 ref * R$4.10], preço da key em refinados).
      var sellMoneyToTf = convert.moneyTo(sellPrice, usdRefined * keyToRefPrice  * rate.toString(), keyToRefPrice)
      var lastSoldMoneyToTf = convert.moneyTo(lastSoldPrice, usdRefined * keyToRefPrice  * rate.toString(), keyToRefPrice)

      const embed = new Discord.RichEmbed()

        .setColor(`0x${quality_color}`)
        .setTitle(`**${market_hash_name}**`)
        .setDescription(`ANÚNCIOS`)
        .setURL(`https://steamcommunity.com/market/listings/440/${encodeURIComponent(market_hash_name)}`)
        .setFooter("Steam")
        .setThumbnail(thumbnail)
        .addField('[STEAM]', `Preço mais barato: ${sellPrice} (${sellMoneyToTf})\nÚltimo vendido por: ${lastSoldPrice} (${lastSoldMoneyToTf})\n**${lastSold24hrs}** vendido(s) mas últimas **24 horas**.`, false)

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
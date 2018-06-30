const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

module.exports.run = (client, message, args, prefix) => {

  if (cmd === 'bolsonabo') {
    message.channel.send('Tem que se fude e acabo pora!');
  }

}

module.exports.help = {
    name: 'comando' //nome do comando
}
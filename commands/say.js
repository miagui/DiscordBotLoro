const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

module.exports.run = (client, message, args, prefix) => {
    let text = args.join(" ");
    message.delete();
    message.channel.send(text);
}

module.exports.help = {
    name: "say"
}
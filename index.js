const Discord = require('discord.js');
const DiscordRSS = require('discord.rss')
const fs = require('fs');
const drss = new DiscordRSS.Client({
  database: {
    uri: process.env.MONGODB_URI
  }
}) // File-based sources instead of Mongo

const client = new Discord.Client();
const _ = require('lodash');
const jsonQ = require("jsonq");
const request = require('request');
const cron = require('cron');

const update = require('./update.js')
const config = require("./config.json");

const forEachArray = require('./scripts/forEachArray.js')

client.commands = new Discord.Collection()

drss.login(process.env.token)
client.login(process.env.token);

//Atualiza os preços do bp.tf e jogos steam de tempo em tempo (update.js)
update.appList.start()
update.exchangeRate.start()
update.bpTfPrice.start()
update.discordStatus.start()

//Leitor para comandos 
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

//Discord: Status
client.on('ready', () => {
  client.user.setUsername('Loro Piripaque');
  client.user.setActivity('Minecraft', {
    type: "PLAYING"
  });

  console.log(`Logged in as ${client.user.tag}!`);

});

client.on("message", (message) => {
  if (message.author.bot) return; // se a mensagem for do bot, então retorne
  if (message.channel.type === "dm") {
    if (message.content === 'start') {
      message.author.send('ok, iniciado')

      update.inventoryUpdate.start()
      update.itemInvNotifier.start()

    } else if (message.content === 'stop') {
      message.author.send('ok, parado')

      update.inventoryUpdate.stop()
      update.itemInvNotifier.stop()
      
    }
  } // se o comando for no privado, então retorne.
  if (message.content.indexOf(config.prefix) !== 0) return; //se não houver o prefix, então retorne.

  let prefix = config.prefix;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  // The list of if/else is replaced with those simple 2 lines:

  try {
    let commandFile = require(`./commands/${cmd}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    console.error(err);
  }
});
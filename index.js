const Discord = require('discord.js');
const DiscordRSS = require('discord.rss')
const drss = new DiscordRSS.Client({
  database: {
    uri: process.env.MONGODB_URI
  }
}) // File-based sources instead of Mongo

const client = new Discord.Client();
const fs = require('fs');
const _ = require('lodash');
const jsonQ = require("jsonq");
const request = require('request');
const cron = require('cron');

//const backpack = new backpacktf('5b10123444325a3c1913b77d', 440)

const update = require('./update.js')
const config = require("./config.json");

client.commands = new Discord.Collection()
drss.login(process.env.token)
client.login(process.env.token)

//Atualiza diariamente o .json com a applist.
update.updateFile.start()
update.updateBPrice.start()

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
  client.user.setUsername('BOT Loro');
  client.user.setActivity('Bicando a tua mãe', {
    type: "PLAYING"
  });

  console.log(`Logged in as ${client.user.tag}!`);

});

client.on("message", (message) => {
  if (message.author.bot) return; // se a mensagem for do bot, então retorne
  if (message.channel.type === "dm") return; // se o comando for no privado, então retorne.
  if (message.content.indexOf(config.prefix) !== 0) return; //se não houver o prefix, então retorne.

  let prefix = config.prefix;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  //Exemplo: !say Hello
  //cmd seria a base do comando, um exemplo é o "!say"
  //args seria o argumento do programa, um exemplo é o "Hello"*/

  // The list of if/else is replaced with those simple 2 lines:

  try {
    let commandFile = require(`./commands/${cmd}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    console.error(err);
  }


  /*  if (cmd === "asl") {
      let [age, sex, location] = args;
      return message.reply(`Olá ${message.author.username}, eu vejo que você tem ${age} anos ${sex} de ${location}. Vamos voar? :)`);*/
});
//client.login(process.env.token)

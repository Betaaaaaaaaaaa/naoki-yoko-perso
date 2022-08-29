const Discord = require("discord.js")
const db = require('quick.db')
const owner = new db.table("Owner")
const config = require("../config")
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

module.exports = {
  name: 'playing',
  usage: 'playing <statut>',
  description: `Permet de changer le statut du bot.`,
  async execute(client, message, args) {

    if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

      if (!message.guild) return;

      if (args.length) {
        let str_content = args.join(" ")
        client.user.setPresence({
          activities: [{
            name: `${str_content}`,
            type: "PLAYING",
            url: "https://www.twitch.tv/funnylpb"
          }],
          status: "online"
        })
        message.channel.send(`Je joue maintenant à __${str_content}__`)
          .catch(e => { return message.channel.send(`Une erreur a été rencontré.`); });
      }
    }
  }
}
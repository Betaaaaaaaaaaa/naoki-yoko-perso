const Discord = require("discord.js")
const db = require('quick.db')

const config = require("../config")

module.exports = {
    name: 'reboot',
    usage: 'reboot',
    description: `Permet de redémarrer le bot.`,
    async execute(client, message, args) {

        if (config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            message.channel.send("<a:loading:957097853694664746> Reboot en cours ...").then(async message => {
                message.edit("<a:loading:957097853694664746> Reboot en cours ...")
                client.destroy();
                await client.login(config.app.token);
                await message.edit("<a:loading:957097853694664746> Reboot en cours ...")
                message.edit("<:valid:972648521255768095> Reboot terminé")

            })
        }
    }
}
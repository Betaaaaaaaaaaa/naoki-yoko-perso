const Discord = require("discord.js")
const db = require('quick.db')
const owner = new db.table("Owner")
const config = require("../config")
const cl = new db.table("Color")
const ms = require('ms')


module.exports = {
    name: 'unbanall',
    usage: 'unbanall',
    description: `Permet d'unban toutes les personnes du serveur.`,
    async execute(client, message, args) {

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let color = cl.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.app.color

            message.channel.send({ content: `<a:loading:957097853694664746> Unban all en cours merci de patienter` }).then(async msg => {
                message.guild.bans.fetch().then(bans => {
                    if (bans.size == 0) { msg.edit({ content: "Aucun utilistateur banni" }) };
                    bans.forEach(ban => {
                        message.guild.members.unban(ban.user.id);
                        msg.edit({ content: `<:valid:972648521255768095> Unban all effectué avec succès` })
                    })
                })
            })
        }
    }
}







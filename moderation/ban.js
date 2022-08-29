const Discord = require("discord.js")
const db = require('quick.db')
const owner = new db.table("Owner")
const cl = new db.table("Color")
const config = require("../config")
const fs = require('fs')
const moment = require('moment')
const ml = new db.table("modlog")
const p3 = new db.table("Perm3")

module.exports = {
    name: 'ban',
    usage: 'ban <membre>',
    description: `Permet de bannir un membre.`,
    async execute(client, message, args) {

        let color = cl.fetch(`color_${message.guild.id}`)
        if (color == null) color = config.app.color

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

            if (!member) {
                return message.reply("Merci de mentionner l'utilisateur que vous souhaitez bannir du serveur !")
            }

            if (member.id === message.author.id) {
                return message.reply("Tu ne peux pas te bannir !")
            }

            let reason = args.slice(1).join(" ") || `Aucune raison`

            message.reply({ content: `${member} à été banni du serveur` }).catch(err => err)
            member.send({ content: `Tu as été banni par ${message.author} pour la raison suivante: \n\n ${reason}` })
            member.ban({ reason: `${reason}` })

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> a \`banni\` ${member} du serveur\nRaison : ${reason}`)
                .setTimestamp()
                .setFooter({ text: `📚` })
            client.channels.cache.get(ml.get(`${message.guild.id}.modlog`)).send({ embeds: [embed] }).catch(console.error)
        }

        else if (message.member.roles.cache.has(p3.get(`perm3_${message.guild.id}`)) === true) {

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

            if (!member) {
                return message.reply("Merci de mentionner l'utilisateur que vous souhaitez bannir du serveur !")
            }

            if (member.id === message.author.id) {
                return message.reply("Tu ne peux pas te bannir !")
            }

            if (member.roles.highest.position >= message.member.roles.highest.position || message.author.id !== message.guild.owner.id) {
                return message.reply(`Vous ne pouvez pas ban un membre au dessus de vous`)
            }

            let reason = args.slice(1).join(" ") || `Aucune raison`

            message.reply({ content: `${member} à été banni du serveur` }).catch(err => err)
            member.send({ content: `Tu as été banni par ${message.author} pour la raison suivante: \n\n ${reason}` })
            member.ban({ reason: `${reason}` })

            const embed = new Discord.MessageEmbed()
                .setColor(color)
                .setDescription(`<@${message.author.id}> a \`banni\` ${member} du serveur\nRaison : ${reason}`)
                .setTimestamp()
                .setFooter({ text: `📚` })
            client.channels.cache.get(ml.get(`${message.guild.id}.modlog`)).send({ embeds: [embed] }).catch(console.error)

        }
    }
}
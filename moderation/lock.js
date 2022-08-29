const Discord = require("discord.js")
const db = require('quick.db')
const owner = new db.table("Owner")
const alerte = new db.table("AlertePerm")
const cl = new db.table("Color")
const ml = new db.table("modlog")
const config = require("../config")
const fs = require('fs')
const moment = require('moment')
const p3 = new db.table("Perm3")

module.exports = {
    name: 'lock',
    usage: 'lock',
    description: `Permet de lock un salon`,
    async execute(client, message, args, color) {

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let color = cl.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.app.color


            if (args[0] === "all") {
                message.guild.channels.cache.forEach((channel, id) => {
                    channel.permissionOverwrites.edit(message.guild.id, {
                        SEND_MESSAGES: false,
                    })
                }, `Tous les salons fermés par ${message.author.tag}`);

                message.channel.send(`${message.guild.channels.cache.size} salons fermés`);

                const channellogs = alerte.get(`${message.guild.id}.alerteperm`)

                const embed = new Discord.MessageEmbed()
                    .setDescription(`:lock: | ${message.author.tag} vient de fermé tous les salons du serveur \n Executeur : <@${message.author.id}>`)
                    .setTimestamp()
                    .setColor(color)
                    .setFooter({ text: `📚` })
                client.channels.cache.get(channellogs).send({ embeds: [embed] }).catch(console.error)
                return
            }
        }
        if (owner.get(`owners.${message.author.id}`) || message.member.roles.cache.has(p3.fetch(`perm3_${message.guild.id}`)) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel

            try {
                message.guild.roles.cache.forEach(role => {
                    channel.permissionOverwrites.edit(message.guild.id, {
                        SEND_MESSAGES: false,
                    });
                }, `Salon fermé par ${message.author.tag}`);
            } catch (e) {
                console.log(e);
            }
            message.channel.send(`Les membres ne peuvent plus parler dans <#${channel.id}>`);
        }



        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`<@${message.author.id}> a \`vérouiller\` le salon <#${message.channel.id}>`)
            .setTimestamp()
            .setFooter({ text: `📚` })
        client.channels.cache.get(ml.get(`${message.guild.id}.modlog`)).send({ embeds: [embed] }).catch(console.error)

    }
}
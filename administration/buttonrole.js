const Discord = require("discord.js")
const db = require('quick.db')
const owner = new db.table("Owner")
const cl = new db.table("Color")
const config = require("../config")

module.exports = {
    name: 'buttonrole',
    usage: 'buttonrole',
    description: `Permet de faire un buttonrole.`,
    async execute(client, message, args) {

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let color = cl.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.app.color

            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
            const msg = args.slice(1).join(" ")

            if (!role) return message.reply(`Veuillez mentionner un rôle.`)
            if (!msg) return message.reply(`Veuillez préciser la description.`)
            if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MENTION_EVERYONE") || role.permissions.has("MANAGE_ROLES")) {
                return message.reply("Le Menu n'a pas pu etre créer car le role séléctionné contient des permissions **Dangereuses**")
            }

            const embed = new Discord.MessageEmbed()
                .setTitle(`Prends ton role`)
                .setDescription(`${msg}\n__Role :__ ${role}`)
                .setColor(color)


            const rolemenu = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('roles')
                        .setLabel(role.name)
                        .setStyle('SUCCESS')
                )

            let msgembed = await message.channel.send({ content: ' ', embeds: [embed], components: [rolemenu] })

            const collector = message.channel.createMessageComponentCollector({
                componentType: "BUTTON",
            })
            collector.on("collect", async (c) => {
                const value = c.customId

                if (value === "roles") {
                    if (!c.member.roles.cache.has(role.id)) {
                        c.reply({ content: `${c.user}, je vous ai donné le rôle \`${role.name}\``, ephemeral: true })
                        c.member.roles.add(role).catch(err => console.log(err))
                    }
                    else {
                        c.reply({ content: `${c.user}, je vous ai enlevé le rôle \`${role.name}\``, ephemeral: true })
                        c.member.roles.remove(role).catch(err => console.log(err))
                    }
                }
            })
        }
    }
}
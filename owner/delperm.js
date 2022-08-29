const Discord = require("discord.js")
const db = require("quick.db")
const owner = new db.table("Owner")
const cl = new db.table("Color")
const p1 = new db.table("Perm1")
const p2 = new db.table("Perm2")
const p3 = new db.table("Perm3")
const pgs = new db.table("PermGs")
const pgp = new db.table("PermGp")
const pga = new db.table("PermGa")
const config = require("../config")
const footer = config.app.footer

module.exports = {
    name: 'del',
    usage: 'del <perm1/2/3/gs/gp/ga> @role',
    category: "owner",
    description: `Permet de gérer les permissions des roles du serveur.`,
    async execute(client, message, args) {

        if (owner.get(`owners.${message.author.id}`) || config.app.owners.includes(message.author.id) || config.app.funny.includes(message.author.id) === true) {

            let color = cl.fetch(`color_${message.guild.id}`)
            if (color == null) color = config.app.color

            if (args[0] === "perm1") {

                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

                if (!role) return message.channel.send({ content: "Veuillez indiquer le role que vous souhaitez supprimé de la **perm 1**" })

                p1.set(`perm1_${message.guild.id}`, "Non Configuré")

                const embed1 = new Discord.MessageEmbed()
                    .setDescription(`Le role ${role} n'as plus accès aux les commandes de la **perm 1**`)
                    .setColor(color)

                return message.channel.send({ embeds: [embed1] })
            }

            if (args[0] === "perm2") {

                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

                if (!role) return message.channel.send({ content: "Veuillez indiquer le role que vous souhaitez supprimé de la **perm 2**" })

                p2.set(`perm2_${message.guild.id}`, "Non Configuré")

                const embed1 = new Discord.MessageEmbed()
                    .setDescription(`Le role ${role} n'as plus accès aux les commandes de la **perm 2**`)
                    .setColor(color)

                return message.channel.send({ embeds: [embed1] })
            }

            if (args[0] === "perm3") {

                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

                if (!role) return message.channel.send({ content: "Veuillez indiquer le role que vous souhaitez supprimé de la **perm 3**" })

                p3.set(`perm3_${message.guild.id}`, "Non Configuré")

                const embed1 = new Discord.MessageEmbed()
                    .setDescription(`Le role ${role} n'as plus accès aux les commandes de la **perm 3**`)
                    .setColor(color)

                return message.channel.send({ embeds: [embed1] })
            }

            if (args[0] === "permgs") {

                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

                if (!role) return message.channel.send({ content: "Veuillez indiquer le role que vous souhaitez supprimé de la perm **Gestion Staff**" })

                pgs.set(`permgs_${message.guild.id}`, "Non Configuré")

                const embed1 = new Discord.MessageEmbed()
                    .setDescription(`Le role ${role} n'as plus accès aux les commandes de la perm **Gestion Staff**`)
                    .setColor(color)

                return message.channel.send({ embeds: [embed1] })
            }

            if (args[0] === "permgp") {

                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

                if (!role) return message.channel.send({ content: "Veuillez indiquer le role que vous souhaitez supprimé de la perm **Gestion Permissions**" })

                pgp.set(`permgp_${message.guild.id}`, "Non Configuré")

                const embed1 = new Discord.MessageEmbed()
                    .setDescription(`Le role ${role} n'as plus accès aux les commandes de la perm **Gestion Permissions**`)
                    .setColor(color)

                return message.channel.send({ embeds: [embed1] })
            }
            if (args[0] === "permga") {

                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

                if (!role) return message.channel.send({ content: "Veuillez indiquer le role que vous souhaitez supprimé de la perm **Giveaway**" })

                pga.set(`permga_${message.guild.id}`, "Non Configuré")

                const embed1 = new Discord.MessageEmbed()
                    .setDescription(`Le role ${role} n'as plus accès aux les commandes de la perm **Giveaway**`)
                    .setColor(color)

                return message.channel.send({ embeds: [embed1] })
            }
        }
    }
}
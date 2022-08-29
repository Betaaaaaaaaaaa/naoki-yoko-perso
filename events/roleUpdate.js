const Discord = require('discord.js')
const db = require("quick.db")
const owner = new db.table("Owner")
const rlog = new db.table("raidlog")
const punish = new db.table("Punition")
const wl = new db.table("Whitelist")
const aru = new db.table("antiroleupdate")
const ad = new db.table("Antidown")
const alerte = new db.table("AlertePerm")
const cl = new db.table("Color")
const config = require('../config')

module.exports = {
    name: 'roleUpdate',
    once: false,

    async execute(client, oldRole, newRole) {

        let roleping = db.get(`role_${oldRole.guild.id}`)
        if (roleping === null) roleping = "@everyone"

        let color = cl.fetch(`color_${oldRole.guild.id}`)
        if (color == null) color = config.app.color

        if (ad.fetch(`config.${oldRole.guild.id}.antidown`) === true) {

            if (oldRole.rawPosition !== newRole.rawPosition) {
                const roles = oldRole.guild.roles.cache.filter(role => role.permissions.any('MANAGE_ROLES', "ADMINISTRATOR"))
                roles.forEach(role => role.setPermissions(role.permissions.remove(["MANAGE_ROLES", "ADMINISTRATOR"])))

                const embed = new Discord.MessageEmbed()
                    .setTitle('Potentiel Down Détécté')
                    .setDescription(`Le role ${newRole.name} a été déplacé de la position ${oldRole.rawPosition} à ${newRole.rawPosition}\nJ'ai désactiver les permissions __administrateur__ et __role__`)
                    .setColor(color)

                client.channels.cache.get(alerte.get(`${oldRole.guild.id}.alerteperm`)).send({ embeds: [embed] }).catch(console.error)
            }
        }


        const audit = (await oldRole.guild.fetchAuditLogs("ROLE_UPDATE")).entries.first()

        let isOn = await aru.fetch(`config.${oldRole.guild.id}.antiroleupdate`)

        if (isOn == true) {

            if (audit?.executor?.id == oldRole?.guild?.ownerId) return

            if (owner.get(`owners.${audit.executor.id}`) || wl.get(`${oldRole.guild.id}.${audit.executor.id}.wl`) || config.app.owners === audit.executor.id === true || client.user.id === audit.executor.id === true) return
            
            if (audit.action == 'ROLE_UPDATE') {

                newRole.edit({
                    name: oldRole?.name,
                    color: oldRole?.color,
                    position: oldRole?.position,
                    permissions: oldRole?.permissions,
                    hoist: oldRole?.hoist,
                    mentionable: oldRole?.mentionable
                })

                if (punish.get(`sanction_${oldRole.guild.id}`) === "ban") {
                    oldRole.guild.members.ban(audit.executor.id, { reason: `Antirole Update` })

                } else if (punish.get(`sanction_${oldRole.guild.id}`) === "derank") {

                    oldRole.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                        if (role.name !== '@everyone') {
                            oldRole.guild.members.resolve(audit.executor).roles.remove(role).catch(err => { throw err })
                        }
                    })

                } else if (punish.get(`sanction_${oldRole.guild.id}`) === "kick") {

                    oldRole.guild.members.kick(audit.executor.id, { reason: `Antirole Update` })
                }
                const embed = new Discord.MessageEmbed()
                    .setDescription(`<@${audit.executor.id}> a tenté de \`modifié un role\`, il a été sanctionné`)
                    .setTimestamp()
                client.channels.cache.get(rlog.fetch(`${oldRole.guild.id}.raidlog`)).send({ embeds: [embed] }).catch(console.error)
            }
        }
    }
}
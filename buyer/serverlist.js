
const Discord = require("discord.js");
const interaction = {}
const { MessageEmbed } = require("discord.js")
const db = require('quick.db')
const { MessageActionRow, MessageButton } = require('discord-buttons');
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}
const ms = require('ms')

module.exports = {
    name: 'server',
    aliases: [],
    run: async (client, message, args) => {
        let prefix = db.get(` ${process.env.owner}.prefix`)
        if (prefix === null) prefix = process.env.prefix;
        let color = process.env.color

        
            if (args[0] === "list") {
                if (process.env.owner.includes(message.author.id)) {

                    let p0 = 0;
                    let p1 = 15;
                    let page = 1;

                    let embed = new Discord.MessageEmbed()

                    embed.setTitle(`Liste des serveurs`)
                        .setColor(color)
                        .setDescription(client.guilds.cache
                            .sort((a, b) => b.memberCount - a.memberCount)
                            .map(r => r)
                            .map((r, i) => `${i + 1} - ${r.name} [${r.memberCount}] (${r.id}) ${r.owner}`)
                            .slice(0, 15)
                        )
                        .setFooter(`${page}/${Math.ceil(client.guilds.cache.size.toLocaleString() / 15) || 1}・${client.user.username}`)
                    if (client.guilds.cache.size.toLocaleString() < 15) {
                        await message.channel.send({ embed: embed });

                    }
                    if (client.guilds.cache.size.toLocaleString() > 15) {

                        const fowardButton = new MessageButton()
                            .setLabel("▶")
                            .setStyle("blurple")
                            // .setEmoji(rightEmoji)
                            .setID('next');

                        const backButton = new MessageButton()
                            .setLabel("◀")
                            .setStyle("blurple")
                            //.setEmoji(leftEmoji)
                            .setID('back');

                        const interactiveButtons = new MessageActionRow()
                            .addComponent(backButton)
                            .addComponent(fowardButton);

                        const msg = await message.channel.send({ components: [interactiveButtons], embed: embed });
                        interaction.message = msg;
                        interaction.embeds = embed;
                        interaction.currentPage = 0;
                        interaction.duration = "";
                        interaction.interactor = message.author;
                        interaction.buttonStartTime = Date.now();
                        interaction.components = interactiveButtons;

                    }


                    client.on('clickButton', async (button) => {
                        if (interaction.interactor !== button.clicker.user || Date.now - interaction.buttonStartTime >= interaction.duration || button.message.id !== interaction.message.id) return;
                        if (button.id == 'back') {

                            page = page - 1


                            if (page === 0) {
                                page = page + 1

                                return button.reply.defer(false);

                            }
                            p0 = p0 - 15;
                            p1 = p1 - 15;
                            if (p0 < 0) {

                                return button.reply.defer(false);

                            }
                            if (p0 === undefined || p1 === undefined) {

                                return button.reply.defer(false);
                            }

                            const tt = new Discord.MessageEmbed()
                            tt.setTitle(`Liste des serveurs`)
                            tt.setDescription(client.guilds.cache
                                .sort((a, b) => b.memberCount - a.memberCount)
                                .map(r => r)
                                .map((r, i) => `${i + 1} - ${r.name} [${r.memberCount}] (${r.id}) ${r.owner}`)
                                .slice(p0, p1)
                            )
                            tt.setFooter(`${page}/${Math.ceil(client.guilds.cache.size.toLocaleString() / 15)}・${client.user.username}`)
                            tt.setColor(color)
                            interaction.message.edit({ components: [interaction.components], embed: tt });
                            button.reply.defer(true);
                        }

                        if (button.id == "next") {


                            if (page === Math.ceil(client.guilds.cache.size.toLocaleString() / 15)) {

                                return button.reply.defer(false);

                            }

                            p0 = p0 + 15;
                            p1 = p1 + 15;
                            if (p1 > client.guilds.cache.size.toLocaleString() + 15) {
                                return button.reply.defer(false);
                            }
                            if (p0 === undefined || p1 === undefined) {
                                return button.reply.defer(false);

                            }

                            page++;

                            const tt = new Discord.MessageEmbed()
                            tt.setTitle(`Liste des serveurs`)
                            tt.setDescription(client.guilds.cache
                                .sort((a, b) => b.memberCount - a.memberCount)
                                .map(r => r)
                                .map((r, i) => `${i + 1} - ${r.name} [${r.memberCount}] (${r.id}) ${r.owner}`)
                                .slice(p0, p1)
                            )
                            tt.setFooter(`${page}/${Math.ceil(client.guilds.cache.size.toLocaleString() / 15)}・${client.user.username}`)
                            tt.setColor(color)
                            interaction.message.edit({ components: [interaction.components], embed: tt });
                            button.reply.defer(true);
                        }
                    })
                }
            }
    }
}
const Discord = require("discord.js")
const db = require("quick.db")
const owner = new db.table("Owner")
const cl = new db.table("Color")
const config = require("../config")
const { QueryType } = require('discord-player');

module.exports = {
    name: 'stop',
    usage: 'stop',
    category: "owner",
    description: `Music`,
    async execute(client, message, args) {

        const queue = player.getQueue(message.guild.id);

        if (!queue || !queue.playing) return message.reply(`Aucun son en cours de lecture ${message.author} ❌`);

        queue.destroy();

        message.reply(`La musique s'est arrêtée <a:yes:957097686186729562>`);

    }
}
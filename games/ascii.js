const figlet = require('figlet');
const Discord = require("discord.js")
const db = require('quick.db')
const owner = new db.table("Owner")
const p = new db.table("Prefix")
const config = require("../config")
const footer = config.app.footer

module.exports = {
    name: 'ascii',
    usage: 'ascii',
    description: `jeux`,
    async execute(client, message, args) {

        let pf = p.fetch(`prefix_${message.guild.id}`)
        if (pf == null) pf = config.app.px

        if(!args[0]) return message.channel.send('<a:noo:957097967553220628> **Veuillez fournir du texte**');

        msg = args.join(" ");

        message.delete()
        
        figlet.text(msg, function (err, data){
            if(err){
                console.log(`Quelque chose s'est mal passé`);
                console.dir(err);
            }
            if(data.length > 2000) return message.channel.send('<a:noo:957097967553220628>**Veuillez fournir un texte de moins de 2 000 caractères**')

            message.channel.send('```' + data + '```')
        })
    }
}
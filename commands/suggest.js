const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        if (msg.channel.id != client.config.suggestionschannel) return msg.delete()
        msg.delete().then(async msg => {
            const suggestion = args.slice(0).join(' ');
            if (!suggestion) return msg.channel.send(':x: You need to suggest something!').then(smsg => {
                setTimeout(function() {
                    smsg.delete();
                }, 5000);
            });
            const nData = await client.db.table('nData').get('suggestions').run();
            const num2insert = nData.number+1;
            const id = nData.number;
            client.db.table('nData').get('suggestions').update({ number: num2insert }).run();
            msg.channel.send(`:white_check_mark: **|** Thanks for the suggestion! Your suggestion has been forwarded to a representative, it will be looked at shortly.\nYour **ID**: ${id}`).then(cmsg => {
                setTimeout(function() {
                    cmsg.delete();
                }, 5000);
            });
            const embed = new Discord.RichEmbed()
            .setTitle(`A new suggestion was made by ${msg.author.username}.`)
            .setDescription(`**ID**: ${id}\n\n**Suggestion**: ${suggestion}`)
            .setFooter(`Run the command !accept suggestion ${id} to accept this or !deny suggestion ${id} to deny it.`)
            .setColor('#b882d4');
            client.channels.get(client.config.notifysuggestionschannel).send(embed).then(nmsg => {
                client.db.table('suggestions').insert({ sid: id, suggestion: suggestion, status: 'PENDING', author: { name: msg.author.username, id: msg.author.id }, notifymsg: { id: nmsg.id, channelid: nmsg.channel.id } }).run();
            });
        });
    },
    meta: {
        aliases: ['suggest'],
        description: 'Suggest something for Minehut!',
        permlvl: 0,
        usage: ''
    }
}
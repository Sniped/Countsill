const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        if (msg.channel.id != client.config.suggestionschannel) return msg.delete()
        const suggestion = args.slice(0).join(' ');
        if (!suggestion) return msg.channel.send(':x: You need to suggest something!');
        // i have no idea on how to count up so i decided to use this method
        const nData = await client.db.table('nData').get('suggestions').run();
        const num2insert = nData.number+1;
        const id = nData.number;
        client.db.table('nData').get('suggestions').update({ number: num2insert }).run();
        msg.channel.send(`:white_check_mark: **|** Thanks for the suggestion! Your suggestion has been forwarded to a represnetative, it will be looked at shortly.\nYour **ID**: ${id}`);
        const embed = new Discord.RichEmbed()
        .setTitle(`A new suggestion was made by ${msg.author.username}.`)
        .setDescription(`**ID**: ${id}\n\n**Suggestion**: ${suggestion}`)
        .setFooter(`Run the command !accept ${id} to accept this or !deny ${id} to deny it.`)
        .setColor('#b882d4');
        client.channels.get(client.config.notifysuggestionschannel).send(embed).then(nmsg => {
            client.db.table('suggestions').insert({ sid: id, suggestion: suggestion, status: 'PENDING', author: { name: msg.author.username, id: msg.author.id }, notifymsg: { id: nmsg.id, channelid: nmsg.channel.id } }).run();
        });
    },
    meta: {
        aliases: ['suggest'],
        description: 'Suggest something for Minehut!',
        permlvl: 0,
        usage: ''
    }
}
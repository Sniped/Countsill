const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        if (!args[1]) return msg.channel.send(':x: You must supply an ID!');
        if (Number(args[1]) == NaN) return msg.channel.send(':x: The ID must be a number!');
        const id = parseInt(args[1], 10);
        const data = await client.db.table('suggestions').get(id).run();
        if (!data) return msg.channel.send(':x: Invalid ID!');
        const reason = args.slice(2).join(' ');
        if (!reason) return msg.channel.send(':x: You must supply a reason.');
        if (data.status == 'PENDING') {
            const embed = new Discord.RichEmbed()
            .setTitle('Your suggestion was accepted by a council member. Thank you for the suggestion!')
            .setDescription(`**ID**: ${data.sid}\n\n**Suggestion**: ${data.suggestion}\n\n**Reason**: ${reason}`)
            .setColor('#9ad68f');
            const author = client.users.get(data.author.id);
            author.send(embed);
            client.db.table('suggestions').get(id).update({ status: 'ACCEPTED', reason: reason, member: { id: msg.author.id, name: msg.author.username } }).run();
            const notificationchannel = client.channels.find(channel => channel.id === client.config.notifysuggestionschannel);
            notificationchannel.fetchMessage(data.notifymsg.id).then(nmsg => {
                const notificationembed = new Discord.RichEmbed()
                .setTitle(`A suggestion made by ${author.username} was accepted by ${msg.author.username}`)
                .setDescription(`**ID**: ${data.sid}\n\n**Suggestion**: ${data.suggestion}\n\n**Reason**: ${reason}`)
                .setColor('#9ad68f');
                nmsg.edit(notificationembed);
            });
            msg.channel.send(`:white_check_mark: Successfully accepted suggestion ${args[1]}`);
        } else return msg.channel.send(':x: The suggestion has already been dealt with by another member of the commitee!');
    },
    meta: {
        aliases: ['accept'],
        description: 'Accept a specific suggestion',
        permlvl: 2,
        usage: ''        
    }
}
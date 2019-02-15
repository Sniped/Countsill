const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: Invalid arguments! Valid arguments are: `suggestion`, and `comment`.');
        if (args[0] == 'suggestion') {
            if (!args[1]) return msg.channel.send(':x: You must supply an ID!');
            if (Number(args[1]) == NaN) return msg.channel.send(':x: The ID must be a number!');
            const id = parseInt(args[1], 10);
            const data = await client.db.table('suggestions').get(id).run();
            if (!data) return msg.channel.send(':x: Invalid ID!');
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(':x: You must supply a reason.');
            if (data.status == 'PENDING') {
                const embed = new Discord.RichEmbed()
                .setTitle('Your suggestion was denied by a council member.')
                .setDescription(`**ID**: ${data.sid}\n\n**Reason**: ${reason}`)
                .setColor('#c56868');
                const author = client.users.get(data.author.id);
                author.send(embed);
                client.db.table('suggestions').get(id).update({ status: 'DENIED', reason: reason }).run();
                const notificationchannel = client.channels.find(channel => channel.id === client.config.notifysuggestionschannel);
                notificationchannel.fetchMessage(data.notifymsg.id).then(nmsg => {
                    const notificationembed = new Discord.RichEmbed()
                    .setTitle(`A suggestion made by ${author.username} was accepted by ${msg.author.username}`)
                    .setDescription(`**ID**: ${data.sid}\n\n**Suggestion**: ${data.suggestion}\n\n**Reason**: ${reason}`)
                    .setColor('#c56868');
                    nmsg.edit(notificationembed);
                });
                msg.channel.send(`:white_check_mark: Successfully denied suggestion ${args[1]}`);
            } else return msg.channel.send(':x: The suggestion has already been dealt with by another member of the commitee!');
        } else if (args[0] == 'comment') {
            if (!args[1]) return msg.channel.send(':x: You must supply an ID!');
            if (Number(args[1]) == NaN) return msg.channel.send(':x: The ID must be a number!');
            const id = parseInt(args[1], 10);
            const data = await client.db.table('comments').get(id).run();
            if (!data) return msg.channel.send(':x: Invalid ID!');
            const reason = args.slice(2).join(' ');
            if (!reason) return msg.channel.send(':x: You must supply a reason.');
            if (data.status == 'PENDING') {
                const embed = new Discord.RichEmbed()
                .setTitle('Your comment was denied by a council member.')
                .setDescription(`**ID**: ${data.cid}\n\n**Reason**: ${reason}`)
                .setColor('#c56868');
                const author = client.users.get(data.author.id);
                author.send(embed);
                client.db.table('comments').get(id).update({ status: 'DENIED', reason: reason }).run();
                const notificationschannel = client.channels.find(channel => channel.id === client.config.notifycommentschannel);
                notificationschannel.fetchMessage(data.notifymsg.id).then(nmsg => {
                    const notificationembed = new Discord.RichEmbed()
                    .setTitle(`A comment made by ${author.username} was denied by ${msg.author.username}`)
                    .setDescription(`**ID**: ${data.cid}\n\n**Comment**: ${data.comment}\n\n**Reason**: ${reason}`)
                    .setColor('#c56868');
                    nmsg.edit(notificationembed);
                });
                msg.channel.send(`:white_check_mark: Successfully denied comment ${args[1]}`);    
            } else return msg.channel.send(':x: The comment has already been dealt with by another member of the commitee!');
        }
    },
    meta: {
        aliases: ['deny'],
        description: 'Deny a specific suggestion',
        permlvl: 3,
        usage: ''        
    }
}
const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        if (!args[0]) return msg.channel.send(':x: Invalid argument! Valid arguments are `suggestion` and `comment`.');
        if (args[0] == 'suggestion') {
            if (!args[1]) return msg.channel.send(':x: You must supply an ID.');
            if (Number(args[1]) == NaN) return msg.channel.send(':x: The ID must be a number.');
            const id = parseInt(args[1], 10);
            const data = await client.db.table('suggestions').get(id).run();
            if (!data) return msg.channel.send(':x: Invalid ID!');
            const author = client.users.find(user => user.id === data.author.id);
            if (data.status == 'PENDING') {
                const pembed = new Discord.RichEmbed()
                .setTitle(`Showing data for suggestion ${data.sid}`)
                .setDescription(`**Author**: ${data.author.name}\n\n**Status**: ${data.status}\n\n**Suggestion**: ${data.suggestion}`)
                .setThumbnail(author.avatarURL)
                .setColor('#83c5ca');
                msg.channel.send(pembed);
            } else if (data.status == 'ACCEPTED') {
                const aembed = new Discord.RichEmbed()
                .setTitle(`Showing data for suggestion ${data.sid}`)
                .setDescription(`**Author**: ${data.author.name}\n\n**Accepter**: ${data.member.name}\n\n**Status**: ${data.status}\n\n**Suggestion**: ${data.suggestion}`)
                .setThumbnail(author.avatarURL)
                .setColor('#9ad68f');
                msg.channel.send(aembed);
            } else if (data.status == 'DENIED') {
                const dembed = new Discord.RichEmbed()
                .setTitle(`Showing data for suggestion ${data.sid}`)
                .setDescription(`**Author**: ${data.author.name}\n\n**Denier**: ${data.member.name}\n\n**Status**: ${data.status}\n\n**Suggestion**: ${data.suggestion}`)
                .setThumbnail(author.avatarURL)
                .setColor('#c56868');
                msg.channel.send(dembed);
            }
        } else if (args[0] == 'comment') {
            if (!args[1]) return msg.channel.send(':x: You must supply an ID.');
            if (Number(args[1]) == NaN) return msg.channel.send(':x: The ID must be a number.');
            const id = parseInt(args[1], 10);
            const data = await client.db.table('comments').get(id).run();
            const author = client.users.find(user => user.id === data.author.id);
            if (!data) return msg.channel.send(':x: Invalid ID!');
            if (data.status == 'PENDING') {
                const pembed = new Discord.RichEmbed()
                .setTitle(`Showing data for suggestion ${data.cid}`)
                .setDescription(`**Author**: ${data.author.name}\n\n**Status**: ${data.status}\n\n**Comment**: ${data.comment}`)
                .setThumbnail(author.avatarURL)
                .setColor('#83c5ca');
                msg.channel.send(pembed);
            } else if (data.status == 'ACCEPTED') {
                const aembed = new Discord.RichEmbed()
                .setTitle(`Showing data for suggestion ${data.cid}`)
                .setDescription(`**Author**: ${data.author.name}\n\n**Accepter**: ${data.member.name}\n\n**Status**: ${data.status}\n\n**Comment**: ${data.comment}`)
                .setThumbnail(author.avatarURL)
                .setColor('#9ad68f');
                msg.channel.send(aembed);
            } else if (data.status == 'DENIED') {
                const dembed = new Discord.RichEmbed()
                .setTitle(`Showing data for suggestion ${data.cid}`)
                .setDescription(`**Author**: ${data.author.name}\n\n**Denier**: ${data.member.name}\n\n**Status**: ${data.status}\n\n**Comment**: ${data.comment}`)
                .setThumbnail(author.avatarURL)
                .setColor('#c56868');
                msg.channel.send(dembed);
            }
        } else return msg.channel.send(':x: Invalid argument! Valid arguments are `suggestion` and `comment`.');
    },
    meta: {
        aliases: ['lookup'],
        description: 'Lookup a suggestion or comment',
        permlvl: 3,
        usage: ''         
    }
}
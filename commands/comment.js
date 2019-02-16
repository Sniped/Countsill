const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        if (msg.channel.id != client.config.commentschannel) return msg.delete()
        msg.delete().then(async msg => {
            const comment = args.slice(0).join(' ');
            if (!comment) return msg.channel.send(':x: You need to comment something!').then(cmsg => {
                setTimeout(function() {
                    cmsg.delete();
                }, 5000);
            });
            const numData = await client.db.table('nData').get('comments').run();
            const cid = numData.number
            const num2insert = numData.number+1
            client.db.table('nData').get('comments').update({ number: num2insert }).run();
            const embed = new Discord.RichEmbed()
            .setTitle(`A new comment was made by ${msg.author.username}`)
            .setDescription(`**ID**: ${cid}\n\n**Comment**: ${comment}`)
            .setFooter(`Run the command !accept comment ${cid} to accept this or !deny comment ${cid} to deny it.`)
            .setColor('#83c5ca');
            client.channels.get(client.config.notifycommentschannel).send(embed).then(nmsg => {
                client.db.table('comments').insert({ cid: cid, comment: comment, status: 'PENDING', author: { name: msg.author.username, id: msg.author.id }, notifymsg: { id: nmsg.id, channelid: nmsg.channel.id } }).run();
            });
            msg.channel.send(`:white_check_mark: **|** Thanks for the comment! Your comment has been forwarded to a represnetative, it will be looked at shortly.\nYour **ID**: ${cid}`).then(smsg => {
                setTimeout(function() {
                    smsg.delete();
                }, 5000);
            });
        });
    },
    meta: {
        aliases: ['comment'],
        description: 'Comment something for a suggestion!',
        permlvl: 0,
        usage: ''        
    }
}
const Discord = require('discord.js');
module.exports = {
    run: async (client, msg, args) => {
        const mRole = args.slice(0).join(' ');
        if (mRole) {
            const gRole = msg.guild.roles.find(role => role.name === mRole);
            if (gRole) {
                const roleinfo = new Discord.RichEmbed()
                .setTitle(`Information on ${gRole.name}`)
                .setDescription(`**Role Name**: ${gRole.name}\n\n**Role ID**: ${gRole.id}`);
                msg.channel.send(roleinfo);
            } else return msg.channel.send(':x: I couldn\'t find that role!');
        } else return msg.channel.send(':x: You didn\'t specify a role.');
    },
    meta: {
        aliases: ['role'],
        description: 'Gets a specific role, goes by the guild the bot is currently in!',
        permlvl: 5,
        usage: ''
    }
}
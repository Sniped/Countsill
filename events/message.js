const fs = require('fs');
module.exports = {
    run: async (client, msg) => {
        if (msg.author.bot) return;

        else if (msg.content.startsWith(client.config.prefix)) {
            const args = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            try {
                fs.readdir('commands', (err, files) => {
                    if (err) return console.error(err);
                    files.forEach(async file => {
                        const meta = require('../commands/' + file).meta;
                        const perms = client.elevation(msg);
                        if (meta.aliases.includes(command)) {
                            if (meta.permlvl > perms) return;
                            return require('../commands/' + file).run(client, msg, args, perms);
                        }
                    });
                });
            } catch (err) {
                console.log(err);
            }
        } else if (msg.channel.id == client.config.suggestionschannel && !msg.content.startsWith(client.config.prefix + 'suggest')) {
            msg.delete();
        } else if (msg.channel.id == client.config.commentschannel && !msg.content.startsWith(client.config.prefix + 'comment')) {
            msg.delete();
        } else if (!msg.guild) return msg.channel.send('hi');
    }
}
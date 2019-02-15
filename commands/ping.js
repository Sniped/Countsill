module.exports = {
    run: async (client, msg, args) => {
        const m = await msg.channel.send('Ping?');
        m.edit(`Pong! **Roundtrip**: ${m.createdTimestamp}ms | **One-way**: ${~~client.ping}ms`);
    },
    meta: {
        aliases: ['ping'],
        description: 'Pings the bot',
        permlvl: 0,
        usage: ''
    }
}
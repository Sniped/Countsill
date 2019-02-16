module.exports = {
    run: async (client, member) => {
        client.channels.get(client.config.joinchannel).send(`:small_blue_diamond: **${member.user.username}** has connected to **CountSill**.`);
    }
}
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
client.config = require('./config.json');

client.login(client.config.token);
client.db = require('rethinkdbdash')({ db: 'countsill', password: client.config.rethinkpass });
exports.client = client;

fs.readdir('./events', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const eventFunction = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});

client.elevation = msg => {
    let permlvl = 0;
    let mod_role = msg.guild.roles.find(role => role.id === client.config.modrole);
    if (mod_role && msg.member.roles.has(mod_role.id)) permlvl = 2;
    let rep_role = msg.guild.roles.find(role => role.id === client.config.reprole);
    if (rep_role && msg.member.roles.has(rep_role.id)) permlvl = 3;
    let admin_role = msg.guild.roles.find(role => role.id === client.config.adminrole);
    if (admin_role && msg.member.roles.has(admin_role.id)) permlvl = 4;
    let founder_role = msg.guild.roles.find(role => role.id === client.config.founderrole);
    if (founder_role && msg.member.roles.has(founder_role.id)) permlvl = 4;
    if (msg.author.id === client.config.ownerid) permlvl = 5;
    return permlvl; 
}
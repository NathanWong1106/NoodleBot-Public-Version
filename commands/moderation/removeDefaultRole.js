const mongoose = require('mongoose');
const Guild = require('../../models/guild-model');
const User = require('../../models/user-model');

module.exports = {
    name: 'removedefaultrole',

    execute(message, args, client){
        const roleID = message.mentions.roles.first().id;

        Guild.findOne({guildID: message.guild.id}).then(guildDB => {
            let filteredArr = guildDB.guildDefaultRoles.filter(role => role.roleID !== roleID)

            guildDB.guildDefaultRoles = [...filteredArr];

            guildDB.save(err => {
                if (err){
                    console.log(err);
                } else {
                    message.reply(`${message.mentions.roles.first().name} is no longer a default role`);
                }
            })
        })
    }
}
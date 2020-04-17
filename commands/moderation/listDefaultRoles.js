const mongoose = require('mongoose');
const Guild = require('../../models/guild-model');
const User = require('../../models/user-model');

module.exports = {
    name: 'defaultroles',

    execute(message, args, client){
        Guild.findOne({guildID: message.guild.id}).then(guildDB => {
            if(guildDB.guildDefaultRoles.length !== 0){

                let defaultRoleNames = [];

                guildDB.guildDefaultRoles.forEach(role => {
                    defaultRoleNames.push(role.roleName);
                })
                
                const embed = {
                    author:{
                        name: message.guild.name
                    },
                    color:'#f5db47',
                    fields:[{
                        name:'Default Roles',
                        value: defaultRoleNames
                    }]
                }
                message.channel.send({embed: embed});
            } else {
                message.channel.send("There are currently no default roles. Use !addDefaultRole [role] to add one!");
            }

        })

    }
}
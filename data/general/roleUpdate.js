const mongoose = require('mongoose');
const Guild = require('../../models/guild-model');
const User = require('../../models/user-model');

module.exports = {
    name: 'RoleUpdate',

    execute(role){

        let roles = [];

        role.guild.roles.cache.forEach(role => {
            roles.push({
                roleID: role.id,
                roleName: role.name
            })
        })

        Guild.findOne({guildID: role.guild.id}).then(guild => {
            //if the role still exists, then keep it in allowed channels
            let filteredRoles = roles.filter(guildRole => {
                let returnable = false;
                guild.guildDefaultRoles.forEach(role => {
                    if (role.roleID === guildRole.roleID){
                        returnable = true;
                    }
                })
                return returnable;
            });


            guild.guildRoles = [...roles];
            guild.guildDefaultRoles = [...filteredRoles];

            guild.save(err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Role Updated');
                }
            })
        })
    }
}
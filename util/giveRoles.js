const Guild = require('../models/guild-model');

module.exports = {
    execute(member, guild){
        Guild.findOne({guildID: guild.id})
        .then(guildDB => {
            guildDB.guildDefaultRoles.forEach(role => {
                let roleToAdd = guild.roles.cache.find(guildRole => guildRole.id === role.roleID);
                member.roles.add(roleToAdd);
            })

            console.log('added default roles');
        })
        .catch(err => {
            if(err){
                console.log(err);
            }
        })
    }
}
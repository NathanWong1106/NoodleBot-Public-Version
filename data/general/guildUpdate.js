const mongoose = require('mongoose');
const User = require('../../models/user-model')
const Guild = require('../../models/guild-model')

module.exports = {
    name: 'GuildUpdate',

    execute(guild){
        
        Guild.findOne({guildID: guild.id}).then(guildDB => {
            guildDB.guildOwnerID = guild.ownerID;
            guildDB.guildName = guild.name;

            guildDB.save(err => {
                if(err){
                    console.log(err);
                } else {
                    console.log('Guild Updated Successfully');
                }
            })
        })
    }
}
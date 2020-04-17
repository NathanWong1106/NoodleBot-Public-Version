const mongoose = require('mongoose');
const Guild = require('../../models/guild-model');
const User = require('../../models/user-model');

module.exports = {
    name: 'GuildCreate',

    execute(guild) {
        //array of role objects
        let guildRoles = [];

        //array of channel objects
        let guildChannels = [];

        //fetch all roles in the server (can be shortened but if you try it might just break lol)
        guild.roles.fetch().then(obj =>{
            obj.cache.forEach(role => {
                guildRoles.push({
                    roleID: role.id,
                    roleName: role.name
                })
            })
        
        //fetch all the channels in the server
        guild.channels.cache.forEach(channel => {
            guildChannels.push({
                channelID: channel.id,
                channelName: channel.name,
                channelType: channel.type
            })
        })
            
            //promise --create the new guild object and save it to mongoDB
            const GuildCreate = new Guild({
                guildID: guild.id,
                guildOwnerID: guild.ownerID,
                guildName: guild.name,
                guildRoles: [...guildRoles], //spread operator ES6
                guildDefaultRoles: [],
                guildChannels: [...guildChannels],
                guildAllowedChannels: [],
                customCommands: [],
            });

            GuildCreate.save().then(newGuild => {
                console.log(newGuild);
            });
            
        })

        //create a guild object 
        guildObj = {
            guildID: guild.id,
            guildName: guild.name
        }
        
        //update the user's information (joined guilds)
        User.findOneAndUpdate({userID: guild.ownerID},
            {$push:{joinedGuilds: guildObj}}, (err, success) => {
                if (err){
                    console.log(err);
                } else {
                    console.log('successfully updated')
                }
            }
        )
    }
}
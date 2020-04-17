const mongoose = require('mongoose');
const Guild = require('../../models/guild-model');
const User = require('../../models/user-model');

module.exports = {
    name: 'ChannelUpdate',

    execute(channel){
        console.log('channelDeleted');

        let channels = [];

        channel.guild.channels.cache.forEach(channel => {
            channels.push({
                channelID: channel.id,
                channelName: channel.name,
                channelType: channel.type
            });
        });

        Guild.findOne({guildID: channel.guild.id}).then(guild => {
            //if the channel still exists, then keep it in allowed channels
            let filteredChannels = channels.filter(guildChannel => {
                let returnable = false;

                guild.guildAllowedChannels.forEach(channel => {
                    if (guildChannel.channelID === channel.channelID){
                        returnable = true;
                    }
                })

                return returnable;
            })
            
            guild.guildChannels = [...channels];
            guild.guildAllowedChannels = [...filteredChannels];

            guild.save(err => {
                if (err){
                    console.log(err)
                } else {
                    console.log('successfully updated');
                }
                
            })

        })

    }

}
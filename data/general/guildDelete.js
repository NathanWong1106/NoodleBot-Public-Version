const mongoose = require('mongoose');
const User = require('../../models/user-model');
const Guild = require('../../models/guild-model');

module.exports = {
    name : 'GuildDelete',

    execute(guild) {
        //remove the guild from 'joinedGuilds' in the user
        User.findOneAndUpdate({userID: guild.ownerID},
            {$pull:{joinedGuilds: {guildID: guild.id}}}, (err, success) => {
                if (err){
                    console.log(err);
                } else {
                    console.log('successfully removed')
                }
            }
        )

        //remove the guild file in the mongoDB database
        Guild.findOneAndRemove({guildID: guild.id})
        .then(console.log('guild removed'))
        .catch(err => console.log(err));
    }
}
const User = require('../../models/user-model');
const Guild = require('../../models/guild-model');
const guildCreate = require('./guildCreate');
const guildStartUpdate = require('./guildStartUpdate');
const channelStartUpdate = require('./channelStartUpdate');
const roleStartUpdate = require('./roleStartUpdate');

module.exports = {
    name: 'startUp',

    async execute(guild) {
        Guild.findOne({guildID: guild.id})
        .then(guildDB => {
            guildStartUpdate.execute(guild,guildDB);
            channelStartUpdate.execute(guild,guildDB);
            roleStartUpdate.execute(guild, guildDB);
            guildDB.save( err => {
                if(err){
                    console.log(err);
                } else {
                    return;
                }
            })
        })
        .catch(err => {
            guildCreate.execute(guild);
        })
    }
}
const mongoose = require('mongoose');
const Guild = require('../../models/guild-model');
const User = require('../../models/user-model');

//This is a variant of channeUpdate -- run on startup to update all information about the guildDB
module.exports = {
	execute(guild, guildDB) {
		let channels = [];

		guild.channels.cache.forEach((channel) => {
			channels.push({
				channelID: channel.id,
				channelName: channel.name,
				channelType: channel.type
			});
		});
		//if the channel still exists, then keep it in allowed channels
		let filteredChannels = channels.filter((guildChannel) => {
			let returnable = false;

			guildDB.guildAllowedChannels.forEach((channel) => {
				if (guildChannel.channelID === channel.channelID) {
					returnable = true;
				}
			});

			return returnable;
		});

		guildDB.guildChannels = [ ...channels ];
		guildDB.guildAllowedChannels = [ ...filteredChannels ];
	}
};

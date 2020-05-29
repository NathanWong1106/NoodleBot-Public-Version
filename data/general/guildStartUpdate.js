const mongoose = require('mongoose');
const User = require('../../models/user-model');
const Guild = require('../../models/guild-model');

module.exports = {
	execute(guild, guildDB) {
		guildDB.guildOwnerID = guild.ownerID;
		guildDB.guildName = guild.name;
	}
};

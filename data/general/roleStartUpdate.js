const mongoose = require('mongoose');
const Guild = require('../../models/guild-model');
const User = require('../../models/user-model');

module.exports = {
	execute(guild, guildDB) {
		let roles = [];

		guild.roles.cache.forEach((role) => {
			roles.push({
				roleID: role.id,
				roleName: role.name
			});
		});

		//if the role still exists, then keep it in allowed channels
		let filteredRoles = roles.filter((guildRole) => {
			let returnable = false;
			guildDB.guildDefaultRoles.forEach((role) => {
				if (role.roleID === guildRole.roleID) {
					returnable = true;
				}
			});
			return returnable;
		});

		guildDB.guildRoles = [ ...roles ];
		guildDB.guildDefaultRoles = [ ...filteredRoles ];
	}
};

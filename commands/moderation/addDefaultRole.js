const mongoose = require('mongoose');
const Guild = require('../../models/guild-model');
const User = require('../../models/user-model');

module.exports = {
	name: 'adddefaultrole',
	type: 'moderation',

	execute(message, args, client) {
		if (!message.member.hasPermission('MANAGE_ROLES')) {
			message.reply('you do not have permission to edit roles');
		} else {
			const role = message.mentions.roles.first();

			const roleObj = {
				roleID: role.id,
				roleName: role.name
			};

			Guild.findOne({ guildID: message.guild.id }).then((guildDB) => {
				if (this.alreadyDefault(guildDB, roleObj)) {
					message.reply('that is already a default role');
				} else {
					guildDB.guildDefaultRoles.push(roleObj);
					guildDB.save((err) => {
						if (err) {
							console.log(err);
						} else {
							message.reply(`${roleObj.roleName} is now a default role`);
						}
					});
				}
			});
		}
	},

	alreadyDefault(guildDB, roleObj) {
		let def = false;

		guildDB.guildDefaultRoles.forEach((role) => {
			if (role.roleID === roleObj.roleID) {
				def = true;
			}
		});

		return def;
	}
};

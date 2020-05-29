const Guild = require('../../models/guild-model');

module.exports = {
	name: 'bind',
	type: 'moderation',

	execute(message, args, client) {
		//check for permissions
		if (!message.member.hasPermission('MANAGE_CHANNELS')) {
			message.reply('you do not have permission to manage channels!');
			return;
		}

		//find the guild DB
		Guild.findOne({ guildID: message.guild.id })
			.then((guildDB) => {
				//check if the channel has been binded already
				let bound = false;

				guildDB.guildAllowedChannels.forEach((channel) => {
					if (channel.channelID === message.channel.id) {
						bound = true;
						return;
					}
				});

				//Update the binded channels DB
				if (!bound) {
					guildDB.guildAllowedChannels.push({
						channelID: message.channel.id,
						channelName: message.channel.name,
						channelType: message.channel.type
					});
					guildDB
						.save()
						.then((guildDB) => {
							//Update the memory from the DB
							guildChannels = boundChannels.get(message.guild.id);
							guildChannels.binded = guildDB.guildAllowedChannels;
							message.channel.send('Binded to `' + message.channel.name + '`!');
						})
						.catch((err) =>
							message.channel.send('Sorry, `' + message.channel.name + '` could not be bound!')
						);
				} else {
					message.channel.send('I am already bound to this channel!');
				}
			})
			.catch((err) => {
				if (err) {
					message.channel.send('Sorry, `' + message.channel.name + '` could not be bound!');
				}
			});
	}
};

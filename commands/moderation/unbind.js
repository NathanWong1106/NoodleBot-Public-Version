const Guild = require('../../models/guild-model');

module.exports = {
	name: 'unbind',
	type: 'moderation',

	execute(message, args, client) {
		//Check for permissions
		if (!message.member.hasPermission('MANAGE_CHANNELS')) {
			message.reply('you do not have permission to manage channels!');
			return;
		}

		//Find the guild DB
		Guild.findOne({ guildID: message.guild.id })
			.then((guildDB) => {
				//Check if the channel is actually bound
				let bound = false;

				guildDB.guildAllowedChannels.forEach((channel) => {
					if (channel.channelID === message.channel.id) {
						bound = true;
						return;
					}
				});

				//Unbind the channel
				if (bound) {
					guildDB.guildAllowedChannels = guildDB.guildAllowedChannels.filter(
						(channel) => channel.channelID !== message.channel.id
					);

					guildDB
						.save()
						.then((guildDB) => {
							//update the data in the memory from the DB
							guildChannels = boundChannels.get(message.guild.id);
							guildChannels.binded = guildDB.guildAllowedChannels;
							message.channel.send('Unbound from `' + message.channel.name + '`!');
						})
						.catch((err) => {
							if (err) {
								console.log(err);
								message.channel.send('Sorry, `' + message.channel.name + '` could not be unbound!');
							}
						});
				} else {
					message.channel.send('I am not bound to this channel!');
				}
			})
			.catch((err) => {
				if (err) {
					message.channel.send('Sorry, `' + message.channel.name + '` could not be unbound!');
				}
			});
	}
};

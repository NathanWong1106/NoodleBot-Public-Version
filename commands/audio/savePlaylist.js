const Guild = require('../../models/guild-model');

module.exports = {
	name: 'saveplaylist',
	type: 'audio',

	execute(message, args, client) {
		serverQueue = queue.get(message.guild.id);
		const originalAuthorID = message.author.id;
		//filter all messages not from the original author
		const filter = (message) => message.author.id === originalAuthorID;

		//if the bot is not in a voice channel
		if (!serverQueue) {
			message.channel.send(
				"No songs are playing at the moment. Add some more songs with 'play' and then save the playlist!"
			);
			return;

			//if there are no songs in the queue
		} else if (serverQueue.songs.length === 0) {
			message.channel.send(
				"No songs are playing at the moment. Add some more songs with 'play' and then save the playlist!"
			);
		} else {
			//playlist object
			let playlist = {
				name: '',
				creatorID: message.author.id,
				songs: [ ...serverQueue.songs ]
			};
			message.channel.send('Enter the name of your playlist:');
			this.collectName(message, playlist, filter);
		}
	},

	//collects the name of the playlist and checks for valid conditions
	collectName(message, playlist, filter) {
		//message collector
		message.channel
			.awaitMessages(filter, { max: 1, time: 30000, errors: [ 'time' ] })
			.then((collected) => {
				//find the DB of the guild
				Guild.findOne({ guildID: message.guild.id }).then((guildDB) => {
					var saveable = true;

					//check if the name has already been taken
					guildDB.playlists.forEach((element) => {
						if (element.name === collected.first().content.toLowerCase()) {
							message.channel.send(
								'Saving failed. You already have a playlist with the name: ' +
									collected.first().content.toLowerCase()
							);
							saveable = false;
							return;
						}
					});

					//if the name is not taken, save the playlist and send an embed message back to the user
					if (saveable) {
						playlist.name = collected.first().content.toLowerCase();
						guildDB.playlists.push(playlist);
						guildDB.save();

						const embed = {
							title: 'Playlist Saved!',
							color: '#f5db47',
							fields: [
								{
									name: 'Name:',
									value: playlist.name,
									inline: true
								},
								{
									name: 'Length:',
									value: playlist.songs.length,
									inline: true
								},
								{
									name: 'Creator:',
									value: message.guild.members.cache.get(playlist.creatorID).user.username,
									inline: true
								}
							]
						};

						message.channel.send({ embed: embed });
					}
				});
			})
			.catch((err) => {
				message.channel.send('Playlist save time expired');
			});
	}
};

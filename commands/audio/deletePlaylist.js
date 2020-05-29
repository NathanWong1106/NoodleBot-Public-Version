const Guild = require('../../models/guild-model');

module.exports = {
	name: 'deleteplaylist',
	type: 'audio',

	execute(message, args, client) {
		const pName = message.content.slice(this.name.length + 2).toLowerCase(); //+2 accounts for PREFIX and WHITESPACE
		const originalAuthorID = message.author.id;
		//only read messages sent by the original author
		const filter = (message) => message.author.id === originalAuthorID;

		//check for a valid command and args
		if (!pName) {
			message.channel.send("Use 'deletePlaylist [playlist name]' to delete your playlists");
			return;
		}

		//Find the guild DB
		Guild.findOne({ guildID: message.guild.id }).then((guildDB) => {
			//find the playlist in the DB by name and assign as a constant
			const playlist = guildDB.playlists.find((element) => element.name === pName);

			//check for valid commands
			if (!playlist) {
				message.channel.send('There is no playlist with the name: ' + pName);
				return;
			}

			if (playlist.creatorID !== message.author.id) {
				message.channel.send("You can't delete a playlist that you don't own!");
				return;
			}

			//build embed info of chosen playlist and send
			const embed = {
				title: 'Playlist:',
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
			message.channel.send('Would you like to delete this playlist? y/n');

			//await confirmation of deletion from the user
			message.channel
				.awaitMessages(filter, { max: 1, time: 30000, errors: [ 'time' ] })
				.then((collected) => {
					const answer = collected.first().content.toLowerCase();
					if (answer === 'y' || answer === 'yes') {
						//filter the playlists (exclude deleted playlist)
						const newPlaylist = guildDB.playlists.filter((element) => element.name !== pName);

						//assign the new playlist to the document and save
						guildDB.playlists = [ ...newPlaylist ];
						guildDB.save().catch((err) => {
							console.log(err);
							message.channel.send('An error occured. Playlist could not be deleted');
						});
						message.channel.send('Playlist deleted');
					} else {
						message.channel.send('Cancelled deletion');
					}
				})
				.catch((err) => {
					console.log(err);
					message.channel.send('Playlist deletion time expired. Cancelled deletion.');
				});
		});
	}
};

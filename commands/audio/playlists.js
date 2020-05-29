const Guild = require('../../models/guild-model');

module.exports = {
	name: 'playlists',
	type: 'audio',

	//IE: Find playlists, build up list, build embed, send embed
	execute(message, args, client) {
		var page = parseInt(args[0]);

		if (args[0]) {
			if (isNaN(args[0])) {
				message.channel.send('Invalid page number');
				return;
			} else if (page <= 0) {
				message.channel.send('Please use a number above 0');
				return;
			}
		} else {
			page = 1;
		}

		Guild.findOne({ guildID: message.guild.id })
			.then((guildDB) => {
				if (guildDB.playlists.length === 0) {
					message.channel.send(
						"This server has no playlists! Use 'savePlaylist' to add a playlist to this server."
					);
				} else {
					let playlistsArr = [];
					let position = 1;
					let index = 0;
					let lastPage = '';

					playlistsArr.push('');

					guildDB.playlists.forEach((element) => {
						//append to the current page with the playlist
						playlistsArr[index] +=
							'`' +
							position +
							')` ' +
							'Name: `' +
							element.name +
							'`| Songs: `' +
							element.songs.length +
							'` | Creator: `' +
							message.guild.members.cache.get(element.creatorID).user.username +
							'`\n\n';

						//playlist to append to the next page if the length is over 100
						const lastPlaylist =
							'`' +
							position +
							')` ' +
							'Name: `' +
							element.name +
							'`| Songs: `' +
							element.songs.length +
							'` | Creator: `' +
							message.guild.members.cache.get(element.creatorID).user.username +
							'`\n\n';

						//make a new page if the characters exceed 1000 on one page of the queue
						if (playlistsArr[index].length > 1000) {
							//revert the current page to the previous version
							playlistsArr[index] = lastPage;

							//append a new array element(page) with the next song
							playlistsArr.push(lastSong);

							//increment the index(page) and set the last page equivalent to the current page
							index++;
							lastPage = lastPlaylist;
						} else {
							//save this iteration and continue
							lastPage = playlistsArr[index];
						}
						//accumulator for song position throughout the queue
						position++;
					});

					if (page > playlistsArr.length) {
						message.channel.send(`There are only ${playlistsArr.length} page(s) in this list!`);
						return;
					}

					//build and send the embed message
					const embed = {
						author: {
							name: `Playlists in ${message.guild.name}`,
							icon_url: client.user.displayAvatarURL()
						},
						color: '#f5db47',
						fields: [
							{
								name: '>>>**Playlists:**<<<',
								value: playlistsArr[page - 1]
							}
						],
						footer: {
							text: `Page: ${page}/${playlistsArr.length}`
						}
					};

					message.channel.send({ embed: embed });
				}
			})
			.catch((err) => {
				console.log(err);
				message.channel.send("Sorry, the database for this guild couldn't be found. :(");
			});
	}
};

const timeStringAudio = require('../../util/timeStringAudio');

module.exports = {
	name: 'np',
	type: 'audio',

	execute(message, args, client) {
		const guildID = message.guild.id;
		const serverQueue = queue.get(guildID);
		const timeVisual = '▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰'; //l=20
		const button = '🔘';

		if (!serverQueue) {
			message.channel.send("I'm not in any voice channels! Use '-join' to let me in!");
		} else {
			if (serverQueue.songs.length === 0) {
				message.channel.send('No songs are playing at the moment!');
			} else {
				const song = serverQueue.songs[0];
				const indexReplace = serverQueue.dispatcher.streamTime / 1000 / song.time * timeVisual.length;
				const timeVisualReplaced =
					timeVisual.substr(0, indexReplace) + button + timeVisual.substr(indexReplace + 1);

				const embed = {
					author: {
						name: 'Now Playing:',
						icon_url: client.user.displayAvatarURL()
					},
					description:
						'`' +
						timeVisualReplaced +
						'`\n' +
						'`' +
						timeStringAudio.convert(Math.floor(serverQueue.dispatcher.streamTime / 1000)) +
						' / ' +
						timeStringAudio.convert(song.time) +
						'`',
					color: '#f5db47',

					title: song.title,
					url: song.url,
					thumbnail: {
						url: song.thumbnail
					},
					fields: [
						{
							name: 'Channel:',
							value: song.channel,
							inline: true
						},
						{
							name: 'Requested By',
							value: song.requestedBy,
							inline: true
						}
					]
				};

				message.channel.send({ embed: embed });
			}
		}
	}
};

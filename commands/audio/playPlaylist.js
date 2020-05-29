const Guild = require('../../models/guild-model');
const commandCheck = require('../../util/validAudioCommand');
const nextSong = require('../../recursive/nextSong');

module.exports = {
	name: 'enqueue',
	type: 'audio',

	execute(message, args, client) {
		const pName = message.content.slice(this.name.length + 2).toLowerCase(); //+2 accounts for PREFIX and WHITESPACE
		serverQueue = queue.get(message.guild.id);

		//check for a valid command
		if (!serverQueue) {
			message.channel.send("Im not in a voice channel. Use 'join' to let me in!");
			return;
		} else if (!commandCheck.isValid(message)) {
			return;
		} else if (!pName) {
			message.channel.send("Use 'enqueue [playlist name]' to add a playlist to the queue!");
			return;
		}

		//Get the guild DB
		Guild.findOne({ guildID: message.guild.id })
			.then((guildDB) => {
				//find the playlist by name in the server's DB and save it as a constant
				const playlist = guildDB.playlists.find((element) => element.name === pName);

				//if the playlist exists
				if (playlist) {
					//concat the two arrays together
					serverQueue.songs = [ ...serverQueue.songs, ...playlist.songs ];

					//if the queue is not playing, make it start
					if (!serverQueue.playing) {
						nextSong.execute(message.guild);
					}

					message.channel.send(`${pName} was added to the queue!`);
				} else {
					message.channel.send(`No playlists with the name ${pName} were found in this server!`);
				}
			})
			.catch((err) => {
				console.log(err);
				message.channel.send('A problem occurred. The playlist could not be added to the queue');
			});
	}
};
